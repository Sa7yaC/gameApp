import React, { useState, useEffect, useContext, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/SocketContext';
import LobbyView from '../components/LobbyView';
import ClueBoard from '../components/ClueBoard';
import EmojiKeyboard from '../components/EmojiKeyboard';
import ChatSection from '../components/ChatSection';
import ScoreboardSidebar from '../components/ScoreboardSidebar';
import MoviePickerModal from '../components/MoviePickerModal';
import PodiumModal from '../components/PodiumModal';
import sounds from '../utils/soundEffects';
import { generateNordpassUsername } from '../utils/nordpassUsername';
import { Volume2, VolumeX, LogOut, Clock, Dices } from 'lucide-react';
import { PlayerAvatar } from '../components/LobbyAvatars';
import GameIcon from '../components/GameIcon';
import '../styles/GameRoom.css';

export default function GameRoom() {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const socket = useContext(SocketContext);

    // Username & Join State
    const [username, setUsername] = useState(sessionStorage.getItem('charades_user') || localStorage.getItem('cine_username') || 'Sa7yaaa');
    const [hasJoinedSocket, setHasJoinedSocket] = useState(false);
    const [promptUser, setPromptUser] = useState(false);
    const [isMuted, setIsMuted] = useState(sounds.isMuted);
    const isBrowserReload = useRef(
        window.performance?.getEntriesByType('navigation')[0]?.type === 'reload'
    );

    // Game Room State
    const [hostId, setHostId] = useState('');
    const [settings, setSettings] = useState({
        difficulty: 'easy',
        languages: ['Indian'],
        totalRounds: 3,
        guessingTime: 90
    });
    const [gameState, setGameState] = useState('LOBBY'); // LOBBY | CHOOSING_MOVIE | PLAYING | TURN_REVEAL | GAME_OVER
    const [currentRound, setCurrentRound] = useState(1);
    const [totalRounds, setTotalRounds] = useState(3);
    const [timeLeft, setTimeLeft] = useState(0);
    const [players, setPlayers] = useState([]);
    const [chatMessages, setChatMessages] = useState([]);

    // Turn Specific State
    const [currentActorId, setCurrentActorId] = useState(null);
    const [actorName, setActorName] = useState('');
    const [movieChoices, setMovieChoices] = useState([]);
    const [movieDetails, setMovieDetails] = useState(null); // Full movie info if user is actor
    const [maskedTitle, setMaskedTitle] = useState('');
    const [movieLanguage, setMovieLanguage] = useState('');
    const [movieHints, setMovieHints] = useState('');
    const [movieYear, setMovieYear] = useState(0);
    const [movieWordCount, setMovieWordCount] = useState(0);
    const [clues, setClues] = useState([]);
    const [turnRevealInfo, setTurnRevealInfo] = useState(null);

    // End Game State
    const [podiumData, setPodiumData] = useState({ podium: [], allPlayers: [] });

    const currentPlayerData = players.find(p => p.id === socket.id) ||
        (username ? players.find(p => p.username?.toLowerCase() === username?.toLowerCase()) : null);
    const isHost = Boolean(
        currentPlayerData?.isHost ||
        (socket.id && hostId && socket.id === hostId) ||
        (players.length <= 1)
    );
    const isActor = Boolean(
        (socket.id && socket.id === currentActorId) ||
        (currentPlayerData && currentPlayerData.isActor)
    );
    const hasGuessed = currentPlayerData?.hasGuessed || false;
    const isSpectator = currentPlayerData?.isSpectator || false;
    const currentActor = players.find((player) => player.id === currentActorId);

    useEffect(() => {
        if (!isBrowserReload.current) return;

        socket.disconnect();
        navigate('/', { replace: true });
    }, [navigate, socket]);

    // Connect and setup socket listeners with auto-rejoin on connect/reconnect
    useEffect(() => {
        if (!username || isBrowserReload.current) return;

        const handleJoin = () => {
            socket.emit('joinRoom', { roomId, username });
        };

        if (socket.connected) {
            handleJoin();
        } else {
            socket.connect();
        }

        socket.on('connect', handleJoin);

        return () => {
            socket.off('connect', handleJoin);
        };
    }, [roomId, username]);

    useEffect(() => {
        // Init room state when joining
        socket.on('initRoomState', (data) => {
            setHostId(data.hostId);
            setSettings(data.settings || {});
            setGameState(data.gameState);
            setCurrentRound(data.currentRound || 1);
            setTotalRounds(data.totalRounds || 3);
            setTimeLeft(data.timeLeft || 0);
            setCurrentActorId(data.currentActorId);
            setActorName(data.actorName || '');
            setMaskedTitle(data.maskedTitle || '');
            setMovieDetails(data.movieDetails || null);
            setMovieLanguage(data.language || '');
            setMovieYear(data.year || 0);
            setMovieWordCount(data.wordCount || 0);
            setMovieHints(data.hints || '');
            setClues(data.clues || []);
            setPlayers(data.players || []);
            setChatMessages(data.chatHistory || []);
        });

        socket.on('settingsUpdated', (newSettings) => {
            setSettings(newSettings);
        });

        socket.on('playersUpdated', (updatedPlayers) => {
            setPlayers(updatedPlayers);
        });

        socket.on('hostChanged', ({ hostId: newHostId }) => {
            setHostId(newHostId);
        });

        socket.on('chatHistoryCleared', () => {
            setChatMessages([]);
        });

        const handleRoomClosed = () => {
            socket.disconnect();
            navigate('/');
        };
        socket.on('gameAbandoned', handleRoomClosed);
        socket.on('roomClosed', handleRoomClosed);
        socket.on('roomError', handleRoomClosed);

        // Turn selecting phase
        socket.on('turnSelecting', (data) => {
            setGameState('CHOOSING_MOVIE');
            setCurrentActorId(data.currentActorId);
            setActorName(data.actorName);
            setCurrentRound(data.currentRound);
            setTotalRounds(data.totalRounds);
            setTimeLeft(data.timeLeft);
            setPlayers(data.players);
            setClues([]);
            setMaskedTitle('');
            setMovieDetails(null);
            setTurnRevealInfo(null);
            sounds.playTurnStart();
        });

        // Movie options received by actor
        socket.on('movieChoices', (data) => {
            setMovieChoices(data.choices || []);
            setTimeLeft(data.timeLeft || 15);
        });

        // Actor gets the chosen movie
        socket.on('actorSecretMovie', (data) => {
            setMovieDetails(data.movie);
            setTimeLeft(data.timeLeft);
        });

        // Guessing phase started
        socket.on('guessingStarted', (data) => {
            setGameState('PLAYING');
            setCurrentActorId(data.currentActorId);
            setActorName(data.actorName);
            setMaskedTitle(data.maskedTitle);
            setMovieLanguage(data.language);
            setMovieHints(data.hints);
            setMovieYear(data.year || 0);
            setMovieWordCount(data.wordCount || 0);
            setTimeLeft(data.timeLeft);
            setPlayers(data.players);
            sounds.playTurnStart();
        });

        // Timer countdown tick
        socket.on('timerTick', ({ timeLeft: curTime }) => {
            setTimeLeft(curTime);
            if (curTime <= 10 && curTime > 0) {
                sounds.playTick();
            }
        });

        // Emoji clue dropped
        socket.on('clueDropped', (data) => {
            setClues(data.clues || []);
            sounds.playClue();
        });

        // Clue validation error
        socket.on('clueError', (data) => {
            console.warn('Clue rejected by server:', data.message);
        });

        // Chat message
        socket.on('chatMessage', (msg) => {
            setChatMessages((prev) => [...prev, msg]);
            if (msg.isCorrectGuess) {
                sounds.playCorrect();
            }
        });

        // Turn ended & movie revealed
        socket.on('turnEnded', (data) => {
            setGameState('TURN_REVEAL');
            setTurnRevealInfo(data);
            setPlayers(data.players);
        });

        // Game over
        socket.on('gameOver', (data) => {
            setGameState('GAME_OVER');
            setPodiumData({
                podium: data.podium || [],
                allPlayers: data.allPlayers || []
            });
        });

        // Game reset to lobby
        socket.on('gameStateChanged', (data) => {
            setGameState(data.gameState);
            setPlayers(data.players);
            setCurrentRound(data.currentRound);
            setChatMessages([]);
            setClues([]);
            setMovieDetails(null);
            setMaskedTitle('');
            setTurnRevealInfo(null);
        });

        return () => {
            socket.off('initRoomState');
            socket.off('settingsUpdated');
            socket.off('playersUpdated');
            socket.off('hostChanged');
            socket.off('chatHistoryCleared');
            socket.off('gameAbandoned');
            socket.off('roomClosed');
            socket.off('roomError');
            socket.off('turnSelecting');
            socket.off('movieChoices');
            socket.off('actorSecretMovie');
            socket.off('guessingStarted');
            socket.off('timerTick');
            socket.off('clueDropped');
            socket.off('clueError');
            socket.off('chatMessage');
            socket.off('turnEnded');
            socket.off('gameOver');
            socket.off('gameStateChanged');
        };
    }, [socket, navigate]);

    // Handle Direct Link Joiners Prompt
    const handleUsernameSubmit = (e) => {
        e?.preventDefault();
        let trimmed = username.trim();
        if (!trimmed) {
            trimmed = generateNordpassUsername();
            setUsername(trimmed);
        }
        sessionStorage.setItem('charades_user', trimmed);
        setPromptUser(false);
        socket.emit('joinRoom', { roomId, username: trimmed });
        setHasJoinedSocket(true);
    };

    const handleRollPromptUsername = () => {
        const newName = generateNordpassUsername();
        setUsername(newName);
        sounds.playTick();
    };

    // Actions
    const handleUpdateSettings = (newSettings) => {
        socket.emit('updateSettings', { settings: newSettings });
    };

    const handleStartGame = () => {
        socket.emit('startGame', { roomId });
        sounds.playTurnStart();
    };

    const handleToggleReady = () => {
        socket.emit('toggleReady');
    };

    const handleSelectMovie = (movieTitle) => {
        socket.emit('selectMovie', { movieTitle });
    };

    const handleDropClue = (emojiClue) => {
        socket.emit('dropClue', { emojiClue });
    };

    const handleSendMessage = (message) => {
        socket.emit('chatMessage', { message });
    };

    const handlePlayAgain = () => {
        socket.emit('playAgain');
    };

    const handleLeaveRoom = () => {
        socket.disconnect();
        navigate('/');
    };

    const toggleMute = () => {
        const muted = sounds.toggleMute();
        setIsMuted(muted);
    };

    // Turn position among active guessers (e.g. "Turn 2 / 4")
    const activeGuessers = players.filter((p) => !p.isSpectator);
    const turnIndexInRound = activeGuessers.findIndex((p) => p.id === currentActorId);
    const turnNumber = turnIndexInRound >= 0 ? turnIndexInRound + 1 : 0;
    const turnTotal = activeGuessers.length;

    // Timer as mm:ss + progress percentage
    const timerMinutes = String(Math.floor(timeLeft / 60)).padStart(2, '0');
    const timerSeconds = String(Math.max(0, timeLeft % 60)).padStart(2, '0');
    const timerPct = Math.max(3, Math.min(100, (timeLeft / (settings?.guessingTime || 90)) * 100));

    // Modal if joined via invite link without username
    if (promptUser) {
        return (
            <div className="landing-page-container">
                <div className="landing-action-card prompt-card">
                    <h2>Join Room {roomId}</h2>
                    <p>Enter your nickname (or roll a random one) to enter:</p>
                    <form onSubmit={handleUsernameSubmit} className="join-form">
                        <div className="username-field-wrapper">
                            <span className="user-icon-prefix">👤</span>
                            <input
                                type="text"
                                maxLength={24}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="e.g. CinemaMaster"
                                className="styled-input username-input"
                                autoFocus
                            />
                            <button
                                type="button"
                                onClick={handleRollPromptUsername}
                                className="roll-dice-btn"
                                title="Generate NordPass username"
                            >
                                <Dices size={18} />
                            </button>
                        </div>
                        <button type="submit" className="primary-action-btn join-room-btn">
                            Enter Lobby
                        </button>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className={`gameroom-container ${gameState === 'LOBBY' ? 'is-lobby' : ''}`}>
            {/* Top Navigation Bar: Only during active gameplay */}
            {gameState !== 'LOBBY' && (
                <header className="gs-topbar">
                    <div className="gs-topbar-brand" onClick={() => navigate('/')} title="Return to Home">
                        <img src="/emojicharades-logo.png" alt="EmojiCharades" className="gs-topbar-logo" draggable={false} />
                    </div>

                    <div className="gs-topbar-chips">
                        <div className="gs-chip">
                            <GameIcon name="round-flag" size={20} alt="" />
                            <span>Round {currentRound} / {totalRounds}</span>
                        </div>

                        {turnTotal > 0 && (
                            <div className="gs-chip">
                                <GameIcon name="turn-players" size={20} alt="" />
                                <span>Turn {turnNumber > 0 ? turnNumber : 1} / {turnTotal}</span>
                            </div>
                        )}

                        {actorName && (
                            <div className="gs-turn-chip">
                                <PlayerAvatar
                                    name={actorName}
                                    avatarIndex={currentActor?.avatarIndex}
                                    size={26}
                                    className="gs-turn-avatar"
                                />
                                <span>{actorName}'s Turn</span>
                            </div>
                        )}
                    </div>

                    <div className="gs-topbar-side">
                        {gameState === 'PLAYING' && (
                            <div className={`gs-timer${timeLeft <= 10 ? ' urgent' : ''}`}>
                                <Clock size={20} className="gs-timer-icon" />
                                <span className="gs-timer-time">{timerMinutes}:{timerSeconds}</span>
                                <span className="gs-timer-track">
                                    <span className="gs-timer-fill" style={{ width: `${timerPct}%` }} />
                                </span>
                            </div>
                        )}

                        <button
                            onClick={toggleMute}
                            className="gs-icon-btn"
                            title={isMuted ? 'Unmute audio' : 'Mute audio'}
                        >
                            {isMuted ? <VolumeX size={17} /> : <Volume2 size={17} />}
                        </button>

                        <button
                            onClick={handleLeaveRoom}
                            className="gs-leave-btn"
                            title="Leave Room"
                        >
                            <GameIcon name="leave" size={17} alt="Leave room" fallback={<LogOut size={15} />} />
                            <span>Leave Room</span>
                        </button>
                    </div>
                </header>
            )}

            {/* Main Stage Content */}
            <main className={`gameroom-main-stage ${gameState === 'LOBBY' ? 'lobby-mode-stage' : ''}`}>
                {/* LOBBY VIEW */}
                {gameState === 'LOBBY' && (
                    <LobbyView
                        roomId={roomId}
                        players={players}
                        isHost={isHost}
                        settings={settings}
                        onUpdateSettings={handleUpdateSettings}
                        onStartGame={handleStartGame}
                        onToggleReady={handleToggleReady}
                        onLeaveRoom={handleLeaveRoom}
                        currentUser={username || localStorage.getItem('cine_username') || 'Sa7yaaa'}
                    />
                )}

                {/* GAME ACTIVE VIEWS (CHOOSING_MOVIE / PLAYING / TURN_REVEAL) */}
                {gameState !== 'LOBBY' && gameState !== 'GAME_OVER' && (
                    <div className="gs-layout">
                        {/* Left: Players scoreboard */}
                        <aside className="gs-pane gs-pane-left">
                            <ScoreboardSidebar
                                players={players}
                                currentActorId={currentActorId}
                            />
                        </aside>

                        {/* Center: Stage / Clue Board / Emoji Keyboard */}
                        <section className="gs-pane gs-pane-center">
                            {/* Actor Picking Screen for other players */}
                            {gameState === 'CHOOSING_MOVIE' && !isActor && (
                                <div className="gs-wait-stage">
                                    <div className="gs-wait-reel">🎬</div>
                                    <h2>{actorName} is choosing a movie...</h2>
                                    <p>Get ready to guess! Turn starts in <strong>{timeLeft}s</strong></p>
                                </div>
                            )}

                            {/* Clue Board (movie reveal appears inside the clue area) */}
                            {(gameState === 'PLAYING' || gameState === 'TURN_REVEAL') && (
                                <ClueBoard
                                    actorName={actorName}
                                    isActor={isActor}
                                    movieDetails={movieDetails}
                                    maskedTitle={maskedTitle}
                                    language={movieLanguage}
                                    hints={movieHints}
                                    year={movieYear}
                                    wordCount={movieWordCount}
                                    clues={clues}
                                    phase={gameState}
                                    revealMovie={turnRevealInfo?.movie || ''}
                                />
                            )}

                            {/* Emoji Keyboard Toolbar (Only visible to active Actor during PLAYING phase) */}
                            {gameState === 'PLAYING' && isActor && (
                                <div className="actor-controls-section">
                                    <EmojiKeyboard
                                        onDropClue={handleDropClue}
                                        disabled={timeLeft <= 0}
                                    />
                                </div>
                            )}
                        </section>

                        {/* Right: Live Chat & Guesses */}
                        <aside className="gs-pane gs-pane-right">
                            <ChatSection
                                messages={chatMessages}
                                onSendMessage={handleSendMessage}
                                isActor={isActor}
                                hasGuessed={hasGuessed}
                                isSpectator={isSpectator}
                                phase={gameState}
                            />
                        </aside>
                    </div>
                )}

                {/* MODALS */}
                {/* 1. Actor Movie Picker Modal */}
                {gameState === 'CHOOSING_MOVIE' && isActor && (
                    <MoviePickerModal
                        choices={movieChoices}
                        timeLeft={timeLeft}
                        onSelectMovie={handleSelectMovie}
                    />
                )}

                {/* 2. Podium / Game Over Modal */}
                {gameState === 'GAME_OVER' && (
                    <PodiumModal
                        podium={podiumData.podium}
                        allPlayers={podiumData.allPlayers}
                        isHost={isHost}
                        onPlayAgain={handlePlayAgain}
                        onExitGame={handleLeaveRoom}
                    />
                )}
            </main>
        </div>
    );
}
