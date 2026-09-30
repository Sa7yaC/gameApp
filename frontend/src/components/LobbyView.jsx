import React, { useState } from 'react';
import {
    Users,
    Settings,
    MoreVertical,
    Check,
    Copy,
    Crown,
    Share2,
    Send,
    Layers,
    Lightbulb,
    Info,
    Play
} from 'lucide-react';
import { PlayerAvatar } from './LobbyAvatars';
import sounds from '../utils/soundEffects';
import '../styles/LobbyView.css';

const CATEGORIES = ['Bollywood', 'Hollywood', 'Animated', 'Mixed'];

export default function LobbyView({
    roomId = 'XQ78',
    players = [],
    isHost = true,
    settings = {},
    onUpdateSettings,
    onStartGame,
    onLeaveRoom,
    currentUser = 'Sa7yaaa'
}) {
    // Interactive State
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedInvite, setCopiedInvite] = useState(false);

    // Settings state
    const currentRounds = settings.totalRounds || 3;
    const currentCategory = settings.category || 'Bollywood';
    const hintsEnabled = settings.hintsEnabled !== undefined ? settings.hintsEnabled : true;

    // Real players only (no fake members)
    const activePlayers = React.useMemo(() => {
        if (!players || players.length === 0) {
            return [{
                id: 'player-host',
                username: currentUser || 'Player',
                isHost: isHost,
                isReady: true
            }];
        }
        return players.map((p, idx) => ({
            ...p,
            isHost: p.isHost !== undefined ? p.isHost : idx === 0,
            isReady: p.isReady !== undefined ? p.isReady : true
        }));
    }, [players, currentUser, isHost]);

    // Local ready toggles for interactive fun
    const [readyOverrides, setReadyOverrides] = useState({});

    const isPlayerReady = (player) => {
        if (readyOverrides[player.id] !== undefined) {
            return readyOverrides[player.id];
        }
        return player.isReady;
    };

    const handleTogglePlayerReady = (playerId) => {
        setReadyOverrides(prev => ({
            ...prev,
            [playerId]: !prev[playerId]
        }));
        sounds.playPop();
    };

    const displayRoomCode = roomId || 'XQ78';
    const inviteLink = `${window.location.origin}/room/${displayRoomCode}`;

    const handleCopyCode = () => {
        navigator.clipboard.writeText(displayRoomCode);
        setCopiedCode(true);
        sounds.playTick();
        setTimeout(() => setCopiedCode(false), 2200);
    };

    const handleShareInvite = () => {
        if (navigator.share) {
            navigator.share({
                title: 'Join CineEmoji Room!',
                text: `Join my CineEmoji room: ${displayRoomCode}`,
                url: inviteLink
            }).catch(() => {});
        } else {
            navigator.clipboard.writeText(inviteLink);
            setCopiedInvite(true);
            sounds.playTick();
            setTimeout(() => setCopiedInvite(false), 2200);
        }
    };

    const handleRoundsChange = (delta) => {
        const next = Math.max(1, Math.min(6, currentRounds + delta));
        if (onUpdateSettings) {
            onUpdateSettings({ ...settings, totalRounds: next });
        }
        sounds.playTick();
    };

    const handleCategorySelect = (cat) => {
        if (onUpdateSettings) {
            onUpdateSettings({ ...settings, category: cat, languages: [cat] });
        }
        sounds.playPop();
    };

    const handleToggleHints = () => {
        if (onUpdateSettings) {
            onUpdateSettings({ ...settings, hintsEnabled: !hintsEnabled });
        }
        sounds.playTick();
    };

    // Calculate empty slots for 8-player room (compact display)
    const emptySlotsCount = Math.min(3, Math.max(1, 8 - activePlayers.length));

    return (
        <div className="cine-lobby-root">
            {/* Background overlay */}
            <div className="cine-lobby-overlay" />

            {/* Floating Decorative 3D Emojis around edges */}
            <div className="floating-emoji-layer">
                <span className="floating-deco-emoji deco-1">🍿</span>
                <span className="floating-deco-emoji deco-2">🎬</span>
                <span className="floating-deco-emoji deco-3">⭐</span>
                <span className="floating-deco-emoji deco-4">😍</span>
                <span className="floating-deco-emoji deco-5">😎</span>
                <span className="floating-deco-emoji deco-6">🤩</span>
                <span className="floating-deco-emoji deco-7">🎭</span>
                <span className="floating-deco-emoji deco-8">✨</span>
            </div>

            <div className="cine-lobby-wrapper">
                {/* ==========================================================
                    HEADER
                   ========================================================== */}
                <header className="cine-lobby-header">
                    {/* Left: EmojiCharades Logo */}
                    <div className="cine-logo-link" onClick={() => window.location.href = '/'} title="Back to Home">
                        <img
                            src="/emojicharades-logo.png"
                            alt="EmojiCharades"
                            className="cine-lobby-logo-img"
                        />
                    </div>

                    {/* Center/Right: Room Code Pill */}
                    <div className="header-room-code-pill">
                        <span className="header-room-code-label">Room Code:</span>
                        <span className="header-room-code-val">{displayRoomCode}</span>
                        <button
                            type="button"
                            className="header-copy-icon-btn"
                            onClick={handleCopyCode}
                            title="Copy Room Code"
                        >
                            <Copy size={16} />
                        </button>
                        {copiedCode && <span className="copy-feedback-bubble">Copied!</span>}
                    </div>
                </header>

                {/* ==========================================================
                    THREE-COLUMN MAIN GRID
                   ========================================================== */}
                <main className="cine-lobby-grid">
                    {/* ------------------------------------------------------
                        LEFT COLUMN — PLAYERS
                       ------------------------------------------------------ */}
                    <section className="cine-card players-column-card">
                        <div className="cine-card-header">
                            <div className="cine-card-title-group">
                                <div className="cine-icon-circle-badge">
                                    <Users size={20} />
                                </div>
                                <h2 className="cine-card-title">Players ({activePlayers.length}/8)</h2>
                            </div>
                            <div className="status-pill-green">
                                <span className="pulse-dot-green" />
                                <span>Waiting in lobby</span>
                            </div>
                        </div>

                        {/* Active Player Rows */}
                        <div className="players-roster-container">
                            {activePlayers.map((player) => {
                                const ready = isPlayerReady(player);
                                const isSelf = player.username.toLowerCase() === (currentUser || '').toLowerCase();

                                return (
                                    <div
                                        key={player.id}
                                        className={`player-roster-row ${isSelf ? 'current-user-row' : ''}`}
                                    >
                                        <div className="player-roster-left">
                                            <div className="player-avatar-wrap">
                                                <PlayerAvatar name={player.username} size={42} />
                                            </div>
                                            <div className="player-names-wrap">
                                                <span className="player-name-text">{player.username}</span>
                                                {player.isHost && (
                                                    <span className="host-role-badge">
                                                        <Crown size={13} className="host-crown-icon" />
                                                        <span>Host</span>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="player-roster-right">
                                            <button
                                                type="button"
                                                className={`ready-status-badge ${ready ? 'is-ready' : 'is-not-ready'}`}
                                                onClick={() => handleTogglePlayerReady(player.id)}
                                                title="Click to toggle Ready status"
                                            >
                                                <span className={`status-dot-sm ${ready ? 'ready' : 'not-ready'}`} />
                                                <span>{ready ? 'Ready' : 'Not Ready'}</span>
                                            </button>
                                            <button
                                                type="button"
                                                className="player-row-more-btn"
                                                onClick={() => handleTogglePlayerReady(player.id)}
                                                title="Options"
                                            >
                                                <MoreVertical size={16} />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}

                            {/* Empty Waiting Slots (4 slots for 8-player room) */}
                            {Array.from({ length: emptySlotsCount }).map((_, index) => (
                                <div key={`empty-${index}`} className="empty-player-slot">
                                    <span className="empty-slot-plus">+</span>
                                    <span>Waiting for player...</span>
                                </div>
                            ))}
                        </div>

                        {/* Bottom: Invite More Players */}
                        <div className="invite-more-footer">
                            <div className="invite-avatars-preview">
                                {activePlayers.slice(0, 3).map((p) => (
                                    <div key={p.id} className="stacked-avatar">
                                        <PlayerAvatar name={p.username} size={22} />
                                    </div>
                                ))}
                                <span className="stacked-count-pill">+{8 - activePlayers.length} slots</span>
                            </div>

                            <button
                                type="button"
                                className="btn-purple-gradient"
                                onClick={handleShareInvite}
                            >
                                <Share2 size={14} />
                                <span>{copiedInvite ? 'Copied!' : 'Share Invite'}</span>
                            </button>
                        </div>
                    </section>

                    {/* ------------------------------------------------------
                        CENTER COLUMN — GAME SETTINGS & INVITE FRIENDS
                       ------------------------------------------------------ */}
                    <section className="settings-column-group">
                        {/* 1. Game Settings Card */}
                        <div className="cine-card settings-card">
                            <div className="cine-card-header">
                                <div className="cine-card-title-group">
                                    <div className="cine-icon-circle-badge purple-badge">
                                        <Settings size={20} />
                                    </div>
                                    <h2 className="cine-card-title">Game Settings</h2>
                                </div>
                            </div>

                            {/* Section 1: Rounds */}
                            <div className="setting-section-row">
                                <div className="setting-row-header">
                                    <div className="setting-title-with-icon">
                                        <div className="setting-square-icon">
                                            <Layers size={18} />
                                        </div>
                                        <span className="setting-name">Rounds</span>
                                    </div>
                                    <div className="stepper-controls-row">
                                        <button
                                            type="button"
                                            className="stepper-btn"
                                            onClick={() => handleRoundsChange(-1)}
                                            disabled={!isHost || currentRounds <= 1}
                                        >
                                            −
                                        </button>
                                        <span className="stepper-val-display">{currentRounds}</span>
                                        <button
                                            type="button"
                                            className="stepper-btn"
                                            onClick={() => handleRoundsChange(1)}
                                            disabled={!isHost || currentRounds >= 6}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>
                                <p className="setting-description-text">
                                    Each player gets one turn per round.
                                </p>
                            </div>

                            {/* Section 2: Category (clean text cards, no icons above text as requested) */}
                            <div className="setting-section-row">
                                <div className="setting-row-header">
                                    <div className="setting-title-with-icon">
                                        <div className="setting-square-icon">
                                            <Users size={18} />
                                        </div>
                                        <span className="setting-name">Category</span>
                                    </div>
                                    <span className="category-dropdown-label">
                                        {currentCategory} ▾
                                    </span>
                                </div>

                                <div className="category-cards-grid">
                                    {CATEGORIES.map((cat) => {
                                        const isSelected = currentCategory === cat;
                                        return (
                                            <div
                                                key={cat}
                                                className={`category-text-card ${isSelected ? 'selected' : ''}`}
                                                onClick={() => isHost && handleCategorySelect(cat)}
                                            >
                                                <span className="category-card-name">{cat}</span>
                                                {isSelected && (
                                                    <span className="category-check-badge">
                                                        <Check size={12} strokeWidth={3} />
                                                    </span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Section 3: Hints */}
                            <div className="setting-section-row">
                                <div className="setting-row-header">
                                    <div className="setting-title-with-icon">
                                        <div className="setting-square-icon">
                                            <Lightbulb size={18} />
                                        </div>
                                        <span className="setting-name">Hints</span>
                                    </div>
                                    <div className="toggle-switch-wrap">
                                        <div
                                            className={`switch-pill-container ${hintsEnabled ? 'is-active' : ''}`}
                                            onClick={isHost ? handleToggleHints : undefined}
                                            title={isHost ? 'Toggle hints on or off' : 'Host managed'}
                                        >
                                            <div className="switch-thumb-circle" />
                                        </div>
                                    </div>
                                </div>
                                <p className="setting-description-text">
                                    Show word info (year, word count, etc.) to make it more fun.
                                </p>
                            </div>
                        </div>

                        {/* 2. Invite Friends Card (NO QR code as requested) */}
                        <div className="cine-card invite-friends-card">
                            <div className="cine-card-header">
                                <div className="cine-card-title-group">
                                    <div className="cine-icon-circle-badge purple-badge">
                                        <Send size={18} />
                                    </div>
                                    <h2 className="cine-card-title">Invite Friends</h2>
                                </div>
                            </div>

                            <p className="setting-description-text">
                                Share this room code with your friends
                            </p>

                            <div className="invite-code-copy-row">
                                <span className="large-room-code-text">{displayRoomCode}</span>
                                <button
                                    type="button"
                                    className="invite-code-copy-btn"
                                    onClick={handleCopyCode}
                                    title="Copy Room Code"
                                >
                                    <Copy size={22} />
                                </button>
                            </div>

                            <button
                                type="button"
                                className="btn-purple-gradient btn-full-width"
                                onClick={handleShareInvite}
                            >
                                <Share2 size={18} />
                                <span>{copiedInvite ? 'Invite Link Copied!' : 'Invite Friends'}</span>
                            </button>
                        </div>
                    </section>

                    {/* ------------------------------------------------------
                        RIGHT COLUMN — MOVIE ART, HOW TO PLAY, START GAME CTA
                       ------------------------------------------------------ */}
                    <section className="game-info-column">
                        {/* 1. Movie Artwork Poster Card */}
                        <div className="cine-card movie-artwork-card">
                            <img
                                src="/movie-poster.jpg"
                                alt="Good Movies Better Friends - CineEmoji"
                                className="movie-poster-image"
                            />
                        </div>

                        {/* 2. How to Play Card */}
                        <div className="cine-card how-to-play-card">
                            <div className="cine-card-header">
                                <div className="cine-card-title-group">
                                    <div className="cine-icon-circle-badge">
                                        <Info size={20} />
                                    </div>
                                    <h2 className="cine-card-title">How to Play?</h2>
                                </div>
                            </div>

                            <div className="how-to-play-steps-list">
                                <div className="how-step-item">
                                    <span className="step-num-badge">1</span>
                                    <p className="step-text">
                                        Each player gets one turn to choose a movie and give emoji clues.
                                    </p>
                                </div>
                                <div className="how-step-item">
                                    <span className="step-num-badge">2</span>
                                    <p className="step-text">
                                        Everyone guesses the movie in the chat.
                                    </p>
                                </div>
                                <div className="how-step-item">
                                    <span className="step-num-badge">3</span>
                                    <p className="step-text">
                                        You can use hints such as year and word count.
                                    </p>
                                </div>
                                <div className="how-step-item">
                                    <span className="step-num-badge">4</span>
                                    <p className="step-text">
                                        Everyone gets a chance before the next round.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* 3. START GAME CTA BUTTON */}
                        {isHost ? (
                            activePlayers.length < 2 ? (
                                <div className="min-players-cta-wrap">
                                    <button
                                        type="button"
                                        className="start-game-cta-btn disabled-btn"
                                        disabled={true}
                                        title="Need at least 2 players in the lobby to start the game"
                                    >
                                        <Users size={19} className="start-play-icon" />
                                        <span>Need 2+ Players to Start</span>
                                    </button>
                                    <p className="min-players-subtext">Invite friends using the room code above!</p>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    className="start-game-cta-btn"
                                    onClick={() => {
                                        sounds.playSuccess();
                                        if (onStartGame) onStartGame();
                                    }}
                                >
                                    <Play size={20} className="start-play-icon" />
                                    <span>Start Game</span>
                                </button>
                            )
                        ) : (
                            <div className="waiting-host-box">
                                <div className="waiting-dots-bounce">
                                    <span /><span /><span />
                                </div>
                                <span>Waiting for host to start the game...</span>
                            </div>
                        )}
                    </section>
                </main>
            </div>
        </div>
    );
}
