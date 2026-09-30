import { getMovieChoices, normalizeTitle, maskTitle } from '../utils/moviesData.js';
import { generateNordpassUsername } from '../utils/nordpassUsername.js';
import { redisClient, pgPool } from '../config/db.js';
import { memoryRooms } from '../controllers/room.controller.js';

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
        category: 'Bollywood',
        languages: ['Bollywood'],
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

/**
 * Get formatted players array
 */
function getPlayersArray(room) {
    return Array.from(room.players.values()).map(p => ({
        id: p.id,
        username: p.username,
        score: p.score,
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

            const room = getOrCreateRoom(cleanRoomId);
            currentRoomId = room.roomId; // use canonical roomId

            socket.join(room.roomId);

            // Check if player is reconnecting with same username
            let existingScore = 0;
            let existingPlayerEntry = null;
            let wasHost = false;
            for (const [sId, p] of room.players.entries()) {
                if (p.username.toLowerCase() === cleanUsername.toLowerCase()) {
                    existingScore = p.score;
                    existingPlayerEntry = sId;
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

            const playerObj = {
                id: socket.id,
                username: cleanUsername,
                score: existingScore,
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
                movieDetails: socket.id === room.currentActorId ? room.currentMovie : null,
                language: room.currentMovie?.language || '',
                year: room.currentMovie?.year || 0,
                wordCount: room.currentMovie?.wordCount || 0,
                hints: room.currentMovie?.hints || '',
                clues: room.clues,
                players: getPlayersArray(room),
                chatHistory: room.chatHistory,
                isSpectator: playerObj.isSpectator,
                assignedUsername: cleanUsername
            });

            // Announce join to room
            const joinNotice = {
                id: 'sys_' + Date.now(),
                user: 'System',
                text: `${cleanUsername} joined the game!`,
                isSystem: true,
                timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
            };
            recordChatMessage(room, joinNotice);
            io.to(room.roomId).emit('chatMessage', joinNotice);
            io.to(room.roomId).emit('playersUpdated', getPlayersArray(room));

            console.log(`[Socket] ${cleanUsername} (${socket.id}) joined room "${room.roomId}"`);
        });

        // Host updates lobby settings
        socket.on('updateSettings', ({ settings }) => {
            if (!currentRoomId) return;
            const room = getOrCreateRoom(currentRoomId);
            if (!room || room.hostId !== socket.id || room.gameState !== 'LOBBY') return;

            room.settings = {
                ...room.settings,
                ...settings,
                totalRounds: Math.min(Math.max(parseInt(settings.totalRounds || 3, 10), 1), 6),
                guessingTime: Math.min(Math.max(parseInt(settings.guessingTime || 90, 10), 30), 180)
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
                const normalizedGuess = normalizeTitle(text);
                const normalizedTarget = normalizeTitle(room.currentMovie?.title);

                if (normalizedGuess && normalizedTarget && normalizedGuess === normalizedTarget) {
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
                        text: '****',
                        isCorrectGuess: true,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    recordChatMessage(room, maskedMsg);

                    // Broadcast masked chat message to room
                    io.to(room.roomId).emit('chatMessage', maskedMsg);

                    // Broadcast celebratory announcement
                    const announcement = {
                        id: 'correct_' + Date.now(),
                        user: 'Game Master',
                        text: `🎉 ${sender.username} guessed the movie! (+${guesserPoints} pts)`,
                        isCelebration: true,
                        guesser: sender.username,
                        points: guesserPoints,
                        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                    };
                    recordChatMessage(room, announcement);
                    io.to(room.roomId).emit('chatMessage', announcement);
                    io.to(room.roomId).emit('playersUpdated', getPlayersArray(room));

                    // If every non-actor player has guessed, end the turn early
                    const allGuessers = Array.from(room.players.values()).filter(
                        p => p.id !== room.currentActorId
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
                        isSystem: true
                    });
                    return;
                }
            }

            // Normal message
            const normalMsg = {
                id: 'msg_' + Date.now() + '_' + Math.random().toString(36).substring(2, 6),
                user: sender.username,
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

            clearInterval(room.timerInterval);
            room.gameState = 'LOBBY';
            room.currentRound = 1;
            room.currentActorId = null;
            room.currentMovie = null;
            room.clues = [];
            room.guessedPlayers.clear();
            room.usedMovieTitles.clear();
            room.actedThisRound.clear();
            room.players.forEach(p => {
                p.score = 0;
                p.isSpectator = false;
            });

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
            const room = getOrCreateRoom(currentRoomId);
            if (!room) return;

            const leavingPlayer = room.players.get(socket.id);
            const username = leavingPlayer ? leavingPlayer.username : 'A player';
            room.players.delete(socket.id);

            console.log(`[Socket] ${username} left room ${room.roomId}`);

            // If room is empty, clear timer and delete after delay
            if (room.players.size === 0) {
                clearInterval(room.timerInterval);
                setTimeout(() => {
                    if (room.players.size === 0) rooms.delete(room.roomId);
                }, 600000);
                return;
            }

            // If host left, assign host to first remaining player
            if (room.hostId === socket.id) {
                const nextHost = room.players.values().next().value;
                if (nextHost) {
                    room.hostId = nextHost.id;
                    room.hostName = nextHost.username;
                    io.to(room.roomId).emit('hostChanged', { hostId: nextHost.id, hostName: nextHost.username });
                }
            }

            // If current actor disconnected during turn, immediately end turn cleanly
            if (room.currentActorId === socket.id && (room.gameState === 'CHOOSING_MOVIE' || room.gameState === 'PLAYING')) {
                clearInterval(room.timerInterval);
                const disconnectNotice = {
                    id: 'sys_' + Date.now(),
                    user: 'System',
                    text: `Actor ${username} disconnected. Moving to next turn...`,
                    isSystem: true
                };
                recordChatMessage(room, disconnectNotice);
                io.to(room.roomId).emit('chatMessage', disconnectNotice);
                endTurn(room, 'ACTOR_DISCONNECTED');
            }

            io.to(room.roomId).emit('playersUpdated', getPlayersArray(room));
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
                room.actedThisRound.clear();
                // Include any mid-round joiners in next round
                room.players.forEach(p => { p.isSpectator = false; });
                room.actorQueue = Array.from(room.players.keys()).sort(() => Math.random() - 0.5);

                const roundMsg = {
                    id: 'rnd_' + Date.now(),
                    user: 'System',
                    text: `🔥 Round ${room.currentRound} of ${room.settings.totalRounds} has begun!`,
                    isSystem: true
                };
                recordChatMessage(room, roundMsg);
                io.to(room.roomId).emit('chatMessage', roundMsg);
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
            choices: choices,
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
            movie: room.currentMovie,
            timeLeft: room.timeLeft
        });

        // Send movie info to guessers
        io.to(room.roomId).emit('guessingStarted', {
            gameState: 'PLAYING',
            currentActorId: room.currentActorId,
            actorName: actorName,
            maskedTitle: maskTitle(room.currentMovie.title),
            language: room.currentMovie.language,
            hints: room.currentMovie.hints,
            year: room.currentMovie.year,
            wordCount: room.currentMovie.wordCount || (room.currentMovie.title ? room.currentMovie.title.trim().split(/\s+/).length : 0),
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
            hints: room.currentMovie?.hints,
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