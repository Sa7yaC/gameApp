import { getMovieChoices, getMainTitleWordCount, matchesMovieTitle, normalizeTitle, maskTitle } from '../utils/moviesData.js';
import { generateNordpassUsername } from '../utils/nordpassUsername.js';
import { redisClient, pgPool } from '../config/db.js';
import { closeRoom, memoryRooms, liveRooms, registerLiveRoom } from '../controllers/room.controller.js';

// Rooms in-memory state: Map<roomId, RoomState>
const rooms = new Map();

/**
 * Helper to get or find room state case-insensitively
 */
function getOrCreateRoom(roomId) {
    if (!roomId) return null;
    const cleanId = roomId.trim();

    // Check exact match
    if (rooms.has(cleanId)) {
        return rooms.get(cleanId);
    }

    // Check case-insensitive match
    for (const [key, room] of rooms.entries()) {
        if (key.toLowerCase() === cleanId.toLowerCase()) {
            return room;
        }
    }

    // Lookup metadata from REST createRoom memoryRooms
    let initHostName = '';
    let initSettings = {
        difficulty: 'easy',
        category: 'Indian',
        languages: ['Indian'],
        totalRounds: 3,
        hintsEnabled: true,
        guessingTime: 90
    };

    if (memoryRooms.has(cleanId)) {
        const meta = memoryRooms.get(cleanId);
        if (meta.hostName) initHostName = meta.hostName;
        if (meta.settings) initSettings = { ...initSettings, ...meta.settings };
    } else {
        for (const [key, meta] of memoryRooms.entries()) {
            if (key.toLowerCase() === cleanId.toLowerCase()) {
                if (meta.hostName) initHostName = meta.hostName;
                if (meta.settings) initSettings = { ...initSettings, ...meta.settings };
                break;
            }
        }
    }

    // Create new room
    const newRoom = {
        roomId: cleanId,
        hostId: null,
        hostName: initHostName,
        settings: initSettings,
        gameState: 'LOBBY',
        currentRound: 1,
        currentActorId: null,
        actorQueue: [],
        actedThisRound: new Set(),
        currentMovie: null,
        movieChoices: [],
        clues: [],
        guessedPlayers: new Set(),
        usedMovieTitles: new Set(),
        timeLeft: 0,
        timerInterval: null,
        players: new Map(),
        chatHistory: []
    };
    rooms.set(cleanId, newRoom);
    return newRoom;
}

function findRoom(roomId) {
    if (!roomId) return null;
    const cleanId = roomId.trim();

    if (rooms.has(cleanId)) return rooms.get(cleanId);

    for (const [key, room] of rooms.entries()) {
        if (key.toLowerCase() === cleanId.toLowerCase()) return room;
    }

    return null;
}

/**
 * Save chat message in memory and Redis
 */
async function recordChatMessage(room, messageObj) {
    room.chatHistory.push(messageObj);
    if (room.chatHistory.length > 60) {
        room.chatHistory.shift();
    }
    try {
        await redisClient.rpush(`room:${room.roomId}:chats`, JSON.stringify(messageObj));
        await redisClient.ltrim(`room:${room.roomId}:chats`, -60, -1);
    } catch (e) {
        // ignore redis error
    }
}

function clearChatHistory(room, io) {
    room.chatHistory = [];
    io.to(room.roomId).emit('chatHistoryCleared');
    redisClient.del(`room:${room.roomId}:chats`).catch((error) => {
        console.warn(`[Chat] Failed to clear Redis history for room ${room.roomId}:`, error.message);
    });
}

function resetGameToLobby(room) {
    clearInterval(room.timerInterval);
    room.timerInterval = null;
    room.gameState = 'LOBBY';
    room.currentRound = 1;
    room.currentActorId = null;
    room.actorQueue = [];
    room.currentMovie = null;
    room.movieChoices = [];
    room.clues = [];
    room.timeLeft = 0;
    room.guessedPlayers.clear();
    room.usedMovieTitles.clear();
    room.actedThisRound.clear();
    room.players.forEach((player) => {
        player.score = 0;
        player.isSpectator = false;
    });
}

/**
 * Get formatted players array
 */
function getPlayersArray(room) {
    return Array.from(room.players.values()).map(p => ({
        id: p.id,
        username: p.username,
        score: p.score,
        avatarIndex: p.avatarIndex,
        isHost: p.id === room.hostId,
        isReady: p.isReady !== undefined ? p.isReady : true,
        hasGuessed: room.guessedPlayers.has(p.id),
        isActor: p.id === room.currentActorId,
        isSpectator: p.isSpectator || false,
        avatarSeed: p.avatarSeed || p.username
    }));
}

export const initSocket = (io) => {
    io.on('connection', (socket) => {
        let currentRoomId = null;

        // Player joins a room
        socket.on('joinRoom', async ({ roomId, username }) => {
            if (!roomId) return;
            const cleanRoomId = roomId.trim();
            const cleanUsername = (username || '').trim() || generateNordpassUsername();
            const metadata = Array.from(memoryRooms.entries())
                .find(([key]) => key.toLowerCase() === cleanRoomId.toLowerCase())?.[1];
            if (metadata?.status === 'closed' && !liveRooms.has(cleanRoomId.toLowerCase())) {
                socket.emit('roomError', { message: "Room doesn't exist. Please check the room code." });
                return;
            }

            const room = getOrCreateRoom(cleanRoomId);
            registerLiveRoom(room);
            currentRoomId = room.roomId; // use canonical roomId

            socket.join(room.roomId);

            // Check if player is reconnecting with same username
            let existingScore = 0;
            let existingPlayerEntry = null;
            let existingAvatarIndex = null;
            let wasHost = false;
            for (const [sId, p] of room.players.entries()) {
                if (p.username.toLowerCase() === cleanUsername.toLowerCase()) {
                    existingScore = p.score;
                    existingPlayerEntry = sId;
                    existingAvatarIndex = p.avatarIndex;
                    if (p.isHost || sId === room.hostId) wasHost = true;
                    break;
                }
            }
            if (existingPlayerEntry) {
                room.players.delete(existingPlayerEntry);
            }

            // Assign Host if no host, first player, previous host, or name matches created room hostName
            const isFirstPlayer = room.players.size === 0;
            const matchesHostName = room.hostName && room.hostName.toLowerCase() === cleanUsername.toLowerCase();
            const shouldBeHost = isFirstPlayer || wasHost || matchesHostName || !room.hostId || (room.hostId === existingPlayerEntry);

            if (matchesHostName || shouldBeHost) {
                room.hostId = socket.id;
                room.hostName = cleanUsername;
                if (matchesHostName) {
                    // Demote any previously assigned temporary host
                    for (const [sId, p] of room.players.entries()) {
                        p.isHost = false;
                    }
                }
            }

            // Determine if player joins mid-game
            const isMidGame = room.gameState !== 'LOBBY' && room.gameState !== 'GAME_OVER';
            const assignedAvatarIndices = new Set(
                Array.from(room.players.values(), (player) => player.avatarIndex)
            );
            const availableAvatarIndices = Array.from({ length: 15 }, (_, index) => index)
                .filter((index) => !assignedAvatarIndices.has(index));
            const avatarIndex = existingAvatarIndex ?? (
                availableAvatarIndices.length > 0
                    ? availableAvatarIndices[Math.floor(Math.random() * availableAvatarIndices.length)]
                    : Math.floor(Math.random() * 15)
            );

            const playerObj = {
                id: socket.id,
                username: cleanUsername,
                score: existingScore,
                avatarIndex,
                isHost: socket.id === room.hostId,
                isReady: true,
                isSpectator: isMidGame,
                avatarSeed: cleanUsername
            };
            room.players.set(socket.id, playerObj);

            // Emit welcome & full current state to joining player
            socket.emit('initRoomState', {
                roomId: room.roomId,
                hostId: room.hostId,
                hostName: room.hostName,
                settings: room.settings,
                gameState: room.gameState,
                currentRound: room.currentRound,
                totalRounds: room.settings.totalRounds,
                timeLeft: room.timeLeft,
                currentActorId: room.currentActorId,
                actorName: room.players.get(room.currentActorId)?.username || '',
                maskedTitle: room.currentMovie ? maskTitle(room.currentMovie.title) : '',
                movieDetails: socket.id === room.currentActorId
                    ? (room.currentMovie
                        ? {
                            ...room.currentMovie,
                            hints: room.settings.hintsEnabled === false ? '' : room.currentMovie.hints,
                            language: room.settings.hintsEnabled === false ? '' : room.currentMovie.language,
                            year: room.settings.hintsEnabled === false ? 0 : room.currentMovie.year,
                            wordCount: room.settings.hintsEnabled === false
                                ? 0
                                : getMainTitleWordCount(room.currentMovie.title)
                        }
                        : null)
                    : null,
                language: room.settings.hintsEnabled === false ? '' : room.currentMovie?.language || '',
                year: room.settings.hintsEnabled === false ? 0 : room.currentMovie?.year || 0,
                wordCount: room.settings.hintsEnabled === false
                    ? 0
                    : getMainTitleWordCount(room.currentMovie?.title),
                hints: room.settings.hintsEnabled === false ? '' : room.currentMovie?.hints || '',
                clues: room.clues,
                players: getPlayersArray(room),
                chatHistory: room.chatHistory,
                isSpectator: playerObj.isSpectator,
                assignedUsername: cleanUsername
            });

            io.to(room.roomId).emit('playersUpdated', getPlayersArray(room));

            console.log(`[Socket] ${cleanUsername} (${socket.id}) joined room "${room.roomId}"`);
        });

        // Host updates lobby settings
        socket.on('updateSettings', ({ settings }) => {
            if (!currentRoomId) return;
            const room = getOrCreateRoom(currentRoomId);
            if (!room || room.hostId !== socket.id || room.gameState !== 'LOBBY') return;
            const requestedGuessingTime = parseInt(
                settings.guessingTime ?? room.settings.guessingTime ?? 90,
                10
            );

            room.settings = {
                ...room.settings,
                ...settings,
                totalRounds: Math.min(Math.max(parseInt(settings.totalRounds || 3, 10), 1), 6),
                guessingTime: Number.isFinite(requestedGuessingTime)
                    ? Math.min(Math.max(requestedGuessingTime, 30), 300)
                    : 90
            };

            io.to(room.roomId).emit('settingsUpdated', room.settings);
            console.log(`[Socket] Room ${room.roomId} settings updated:`, room.settings);
        });

        // Player toggles Ready status
        socket.on('toggleReady', () => {
            if (!currentRoomId) return;
            const room = getOrCreateRoom(currentRoomId);
            if (!room || room.gameState !== 'LOBBY') return;
            const player = room.players.get(socket.id);
            if (player) {
                player.isReady = !player.isReady;
                io.to(room.roomId).emit('playersUpdated', getPlayersArray(room));
                console.log(`[Socket] Player ${player.username} ready state:`, player.isReady);
            }
        });

        // Host starts the game
        socket.on('startGame', (data) => {
            const targetRoomId = data?.roomId || currentRoomId;
            if (!targetRoomId) {
                console.warn(`[Game] startGame ignored: socket ${socket.id} has no currentRoomId`);
                return;
            }
            const room = getOrCreateRoom(targetRoomId);
            if (!room) {
                console.warn(`[Game] startGame ignored: room not found for id ${targetRoomId}`);
                return;
            }
            currentRoomId = room.roomId;
            if (room.gameState !== 'LOBBY') {
                console.warn(`[Game] startGame ignored: room ${room.roomId} gameState is ${room.gameState}, not LOBBY`);
                return;
            }

            let player = room.players.get(socket.id);
            if (!player) {
                for (const p of room.players.values()) {
                    if (p.isHost) {
                        player = p;
                        break;
                    }
                }
            }

            const isHost = socket.id === room.hostId ||
                (player && room.hostName && player.username.toLowerCase() === room.hostName.toLowerCase()) ||
                (room.players.size > 0 && Array.from(room.players.keys())[0] === socket.id) ||
                (room.players.size <= 1);

            if (!isHost) {
                console.warn(`[Game] Non-host ${player?.username || socket.id} tried to start game in ${room.roomId} (room.hostId=${room.hostId})`);
                return;
            }

            // Do not start if there is only 1 player in the lobby
            if (room.players.size < 2) {
                console.warn(`[Game] startGame blocked: room ${room.roomId} has only ${room.players.size} player(s). Need at least 2.`);
                socket.emit('gameError', { message: 'Need at least 2 players in the lobby to start the game!' });
                return;
            }

            // Sync room.hostId
            room.hostId = socket.id;
            if (player) {
                player.isHost = true;
                if (!room.hostName) room.hostName = player.username;
            } else {
                room.players.set(socket.id, {
                    id: socket.id,
                    username: room.hostName || 'Host',
                    score: 0,
                    avatarIndex: Math.floor(Math.random() * 15),
                    isHost: true,
                    isReady: true,
                    isSpectator: false,
                    avatarSeed: room.hostName || 'Host'
                });
            }

            // Reset scores and rounds
            room.players.forEach(p => {
                p.score = 0;
                p.isSpectator = false;
            });
            room.currentRound = 1;
            room.usedMovieTitles.clear();
            room.actedThisRound.clear();

            clearChatHistory(room, io);

            // Queue players for round 1
            const playerIds = Array.from(room.players.keys()).sort(() => Math.random() - 0.5);
            room.actorQueue = playerIds;

            console.log(`[Game] Room ${room.roomId} game started with ${playerIds.length} players by host ${player?.username || socket.id}`);
            startTurn(room);
        });

        // Actor selects one of the 3 movie choices
        socket.on('selectMovie', ({ movieTitle }) => {
            if (!currentRoomId) return;
            const room = getOrCreateRoom(currentRoomId);
            if (!room || room.gameState !== 'CHOOSING_MOVIE' || room.currentActorId !== socket.id) return;

            const chosen = room.movieChoices.find(m => m.title.toLowerCase() === movieTitle.toLowerCase()) || room.movieChoices[0];
            room.currentMovie = chosen;
            room.usedMovieTitles.add(chosen.title.toLowerCase());

            clearInterval(room.timerInterval);
            startGuessingPhase(room);
        });

        // Actor drops an emoji clue
        socket.on('dropClue', ({ emojiClue }) => {
            if (!currentRoomId) return;
            const room = getOrCreateRoom(currentRoomId);
            if (!room || room.gameState !== 'PLAYING' || room.currentActorId !== socket.id) return;
            if (!emojiClue || typeof emojiClue !== 'string' || !emojiClue.trim()) return;

            // Actor cannot enter words or text other than emojis!
            if (/[\p{Letter}\p{Number}]/u.test(emojiClue)) {
                socket.emit('clueError', { message: 'Only emojis are allowed as clues! Words, letters, and numbers are strictly prohibited.' });
                return;
            }

            // Sanitize clue to only valid emojis, ZWJ sequences, skin tone modifiers, and spaces
            const clueText = emojiClue
                .replace(/[^\p{Extended_Pictographic}\p{Emoji_Presentation}\u200d\ufe0f\u{1F1E6}-\u{1F1FF}\u{1F3FB}-\u{1F3FF}\s]/gu, '')
                .replace(/\s+/g, ' ')
                .trim();

            if (!clueText) {
                socket.emit('clueError', { message: 'Please select at least one emoji for your clue.' });
                return;
            }

            room.clues.push(clueText);

            io.to(room.roomId).emit('clueDropped', {
                clue: clueText,
                clues: room.clues
            });

        });


        // Chat & Guessing message handler
        socket.on('chatMessage', ({ message }) => {
            if (!currentRoomId || !message) return;
            const room = getOrCreateRoom(currentRoomId);
            if (!room) return;

            const sender = room.players.get(socket.id);
            if (!sender) return;

            const text = message.trim();
            if (!text) return;

            const isActor = socket.id === room.currentActorId;
            const hasAlreadyGuessed = room.guessedPlayers.has(socket.id);

            // If game is in PLAYING phase and sender is an eligible guesser
            if (room.gameState === 'PLAYING' && !isActor && !hasAlreadyGuessed) {
                if (matchesMovieTitle(text, room.currentMovie?.title)) {
                    // CORRECT GUESS!
                    room.guessedPlayers.add(socket.id);

                    // Dynamic time-decay scoring formula
                    const timeRatio = room.timeLeft / (room.settings.guessingTime || 90);
                    const guesserPoints = Math.max(50, Math.round(timeRatio * 400 + 100));
                    sender.score += guesserPoints;
                    sender.hasGuessed = true;

                    // If this player was a spectator (mid-round joiner), mark them as guessed but keep spectator flag for actor queue

                    // Actor bonus
                    const actor = room.players.get(room.currentActorId);
                    if (actor) {
                        actor.score += 50;
                    }

                    // Mask the guess for all other members: ****
                    const maskedMsg = {
                        id: 'guess_' + Date.now() + '_' + socket.id,
                        user: sender.username,
                        avatarIndex: sender.avatarIndex,
                        text: '****',
                        isCorrectGuess: true,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    recordChatMessage(room, maskedMsg);

                    // Broadcast masked chat message to room
                    io.to(room.roomId).emit('chatMessage', maskedMsg);

                    io.to(room.roomId).emit('playersUpdated', getPlayersArray(room));

                    // If every non-actor player has guessed, end the turn early
                    const allGuessers = Array.from(room.players.values()).filter(
                        p => p.id !== room.currentActorId && !p.isSpectator
                    );
                    const allGuessed = allGuessers.length > 0 && allGuessers.every(p => room.guessedPlayers.has(p.id));

                    if (allGuessed) {
                        clearInterval(room.timerInterval);
                        endTurn(room, 'ALL_GUESSED');
                    }
                    return;
                }
            }

            // If actor types while playing, prevent them from leaking movie title directly
            if (isActor && room.gameState === 'PLAYING') {
                const norm = normalizeTitle(text);
                const targetNorm = normalizeTitle(room.currentMovie?.title);
                if (norm.includes(targetNorm)) {
                    socket.emit('chatMessage', {
                        id: 'err_' + Date.now(),
                        user: 'System',
                        text: '⚠️ You cannot type the secret movie title in chat! Use emoji clues.',
                        isActorWarning: true
                    });
                    return;
                }
            }

            // Normal message
            const normalMsg = {
                id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
                user: sender.username,
                avatarIndex: sender.avatarIndex,
                text: text,
                isSpectator: sender.isSpectator,
                hasGuessed: hasAlreadyGuessed,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            recordChatMessage(room, normalMsg);
            io.to(room.roomId).emit('chatMessage', normalMsg);
        });

        // Host resets game to play again
        socket.on('playAgain', () => {
            if (!currentRoomId) return;
            const room = getOrCreateRoom(currentRoomId);
            if (!room || room.hostId !== socket.id) return;

            resetGameToLobby(room);
            clearChatHistory(room, io);

            io.to(room.roomId).emit('gameStateChanged', {
                gameState: 'LOBBY',
                players: getPlayersArray(room),
                currentRound: 1,
                totalRounds: room.settings.totalRounds
            });
        });

        // Disconnect handler
        socket.on('disconnect', () => {
            if (!currentRoomId) return;
            const room = findRoom(currentRoomId);
            if (!room) return;

            const leavingPlayer = room.players.get(socket.id);
            const username = leavingPlayer ? leavingPlayer.username : 'A player';
            const wasHost = room.hostId === socket.id;
            const gameWasInProgress = room.gameState !== 'LOBBY' && room.gameState !== 'GAME_OVER';
            room.players.delete(socket.id);
            room.actorQueue = room.actorQueue.filter((playerId) => playerId !== socket.id);
            room.guessedPlayers.delete(socket.id);
            room.actedThisRound.delete(socket.id);

            console.log(`[Socket] ${username} left room ${room.roomId}`);

            if (room.players.size === 0) {
                clearInterval(room.timerInterval);
                resetGameToLobby(room);
                clearChatHistory(room, io);

                io.to(room.roomId).emit(gameWasInProgress ? 'gameAbandoned' : 'roomClosed');
                rooms.delete(room.roomId);
                closeRoom(room.roomId);
                return;
            }

            if (wasHost && !gameWasInProgress) {
                clearInterval(room.timerInterval);
                resetGameToLobby(room);
                clearChatHistory(room, io);
                io.to(room.roomId).emit('roomClosed');
                rooms.delete(room.roomId);
                closeRoom(room.roomId);
                return;
            }

            if (wasHost) {
                const nextHost = room.players.values().next().value;
                room.hostId = nextHost.id;
                room.hostName = nextHost.username;
                io.to(room.roomId).emit('hostChanged', {
                    hostId: room.hostId,
                    hostName: room.hostName
                });
            }

            if (gameWasInProgress && room.players.size < 2) {
                resetGameToLobby(room);
                clearChatHistory(room, io);
                io.to(room.roomId).emit('gameStateChanged', {
                    gameState: 'LOBBY',
                    players: getPlayersArray(room),
                    currentRound: 1,
                    totalRounds: room.settings.totalRounds
                });
                return;
            }

            io.to(room.roomId).emit('playersUpdated', getPlayersArray(room));

            if (gameWasInProgress && room.currentActorId === socket.id) {
                if (room.gameState === 'CHOOSING_MOVIE') {
                    clearInterval(room.timerInterval);
                    startTurn(room);
                } else if (room.gameState === 'PLAYING') {
                    endTurn(room, 'ACTOR_LEFT');
                }
                return;
            }

            if (gameWasInProgress && room.gameState === 'PLAYING') {
                const guessers = Array.from(room.players.values())
                    .filter((player) => player.id !== room.currentActorId && !player.isSpectator);
                if (guessers.length > 0 && guessers.every((player) => room.guessedPlayers.has(player.id))) {
                    endTurn(room, 'ALL_GUESSED');
                }
            }
        });
    });

    /**
     * Start a new turn: select next actor and present 3 movie choices
     */
    function startTurn(room) {
        clearInterval(room.timerInterval);

        // Check if round needs to finish or if actorQueue is empty
        if (room.actorQueue.length === 0) {
            if (room.currentRound >= room.settings.totalRounds) {
                // Game Over!
                endGame(room);
                return;
            } else {
                // Advance to next round
                room.currentRound++;
                clearChatHistory(room, io);
                room.actedThisRound.clear();
                // Include any mid-round joiners in next round
                room.players.forEach(p => { p.isSpectator = false; });
                room.actorQueue = Array.from(room.players.keys()).sort(() => Math.random() - 0.5);
            }
        }

        // Pop next actor
        const nextActorId = room.actorQueue.shift();
        room.currentActorId = nextActorId;
        room.actedThisRound.add(nextActorId);
        room.guessedPlayers.clear();
        room.clues = [];

        const actor = room.players.get(nextActorId);
        const actorName = actor ? actor.username : 'Player';

        // Pick 3 movie choices
        const choices = getMovieChoices(room.settings.difficulty, room.settings.languages, room.usedMovieTitles);
        room.movieChoices = choices;
        room.gameState = 'CHOOSING_MOVIE';
        room.timeLeft = 15;

        // Notify room of state change
        io.to(room.roomId).emit('turnSelecting', {
            gameState: 'CHOOSING_MOVIE',
            currentActorId: nextActorId,
            actorName: actorName,
            currentRound: room.currentRound,
            totalRounds: room.settings.totalRounds,
            timeLeft: 15,
            players: getPlayersArray(room)
        });

        // Send the 3 options specifically to actor
        io.to(nextActorId).emit('movieChoices', {
            choices: room.settings.hintsEnabled === false
                ? choices.map(({ title, name }) => ({ title, name }))
                : choices,
            timeLeft: 15
        });

        // 15-second countdown for actor to choose
        room.timerInterval = setInterval(() => {
            room.timeLeft--;
            io.to(room.roomId).emit('timerTick', { timeLeft: room.timeLeft, phase: 'CHOOSING_MOVIE' });

            if (room.timeLeft <= 0) {
                clearInterval(room.timerInterval);
                // Auto-pick first movie if actor didn't select
                const autoChosen = room.movieChoices[0];
                room.currentMovie = autoChosen;
                room.usedMovieTitles.add(autoChosen.title.toLowerCase());
                console.log(`[Turn] Auto-picked "${autoChosen.title}" for actor ${actorName}`);
                startGuessingPhase(room);
            }
        }, 1000);
    }

    /**
     * Start the guessing/clue phase (e.g. 90 seconds)
     */
    function startGuessingPhase(room) {
        clearInterval(room.timerInterval);
        room.gameState = 'PLAYING';
        room.timeLeft = room.settings.guessingTime || 90;
        room.clues = [];

        const actor = room.players.get(room.currentActorId);
        const actorName = actor ? actor.username : 'Actor';

        // Send secret movie to actor
        io.to(room.currentActorId).emit('actorSecretMovie', {
            movie: room.settings.hintsEnabled === false
                ? { ...room.currentMovie, hints: '', language: '', year: 0, wordCount: 0 }
                : room.currentMovie,
            timeLeft: room.timeLeft
        });

        // Send movie info to guessers
        io.to(room.roomId).emit('guessingStarted', {
            gameState: 'PLAYING',
            currentActorId: room.currentActorId,
            actorName: actorName,
            maskedTitle: maskTitle(room.currentMovie.title),
            language: room.settings.hintsEnabled === false ? '' : room.currentMovie.language,
            hints: room.settings.hintsEnabled === false ? '' : room.currentMovie.hints,
            year: room.settings.hintsEnabled === false ? 0 : room.currentMovie.year,
            wordCount: room.settings.hintsEnabled === false
                ? 0
                : getMainTitleWordCount(room.currentMovie.title),
            timeLeft: room.timeLeft,
            totalTime: room.settings.guessingTime || 90,
            players: getPlayersArray(room)
        });

        // Guessing countdown timer
        room.timerInterval = setInterval(() => {
            room.timeLeft--;
            io.to(room.roomId).emit('timerTick', { timeLeft: room.timeLeft, phase: 'PLAYING' });

            if (room.timeLeft <= 0) {
                clearInterval(room.timerInterval);
                endTurn(room, 'TIME_UP');
            }
        }, 1000);
    }

    /**
     * End current turn and reveal movie
     */
    function endTurn(room, reason) {
        clearInterval(room.timerInterval);
        room.gameState = 'TURN_REVEAL';

        const movieTitle = room.currentMovie ? room.currentMovie.title : 'Unknown';
        let revealText = `Time's up! The movie was "${movieTitle}".`;
        if (reason === 'ALL_GUESSED') {
            revealText = `Everyone guessed it right! The movie was "${movieTitle}".`;
        } else if (reason === 'ACTOR_LEFT') {
            revealText = `The actor left. The movie was "${movieTitle}".`;
        }

        const revealMsg = {
            id: 'rev_' + Date.now(),
            user: 'Game Master',
            text: revealText,
            isReveal: true
        };
        recordChatMessage(room, revealMsg);

        io.to(room.roomId).emit('turnEnded', {
            gameState: 'TURN_REVEAL',
            movie: movieTitle,
            hints: room.settings.hintsEnabled === false ? '' : room.currentMovie?.hints,
            reason: reason,
            players: getPlayersArray(room),
            revealDuration: 5
        });

        // Wait 5 seconds to show reveal, then proceed to next turn
        setTimeout(() => {
            if (rooms.has(room.roomId) && room.gameState === 'TURN_REVEAL') {
                startTurn(room);
            }
        }, 5000);
    }

    /**
     * End the game and declare winners
     */
    function endGame(room) {
        clearInterval(room.timerInterval);
        room.gameState = 'GAME_OVER';

        const sortedPlayers = Array.from(room.players.values()).sort((a, b) => b.score - a.score);

        // Update room status in PostgreSQL
        try {
            pgPool.query('UPDATE rooms SET status = $1 WHERE room_id = $2', ['completed', room.roomId]).catch(() => {});
        } catch (e) {
            // ignore
        }

        io.to(room.roomId).emit('gameOver', {
            gameState: 'GAME_OVER',
            podium: sortedPlayers.slice(0, 3),
            allPlayers: sortedPlayers,
            totalRounds: room.settings.totalRounds
        });

        const overNotice = {
            id: 'over_' + Date.now(),
            user: 'Game Master',
            text: `🏆 Game Over! Winner: ${sortedPlayers[0]?.username || 'Nobody'} with ${sortedPlayers[0]?.score || 0} pts!`,
            isCelebration: true
        };
        recordChatMessage(room, overNotice);
        io.to(room.roomId).emit('chatMessage', overNotice);
    }
};