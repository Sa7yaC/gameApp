import React, { useState } from 'react';
import { Users, Settings, ListOrdered, Tags, Lightbulb, Info, Play, Copy, Check, ChevronDown, Minus, Plus, Crown, Share2, Clock } from 'lucide-react';
import { PlayerAvatar } from './LobbyAvatars';
import GameIcon from './GameIcon';
import sounds from '../utils/soundEffects';
import '../styles/LobbyView.css';

const CATEGORIES = ['Indian', 'Hollywood', 'Animated', 'Mixed'];
const MAX_PLAYERS = 8;

export default function LobbyView({
    roomId = 'XQ78',
    players = [],
    isHost = true,
    settings = {},
    onUpdateSettings,
    onStartGame,
    onToggleReady,
    currentUser = 'Sa7yaaa'
}) {
    // UI feedback state
    const [copiedCode, setCopiedCode] = useState(false);
    const [copiedInvite, setCopiedInvite] = useState(false);
    const [categoryOpen, setCategoryOpen] = useState(false);

    // Current lobby settings
    const currentRounds = settings.totalRounds || 3;
    const currentGuessingTime = Math.min(300, Math.max(30, Number(settings.guessingTime) || 90));
    const configuredCategory = settings.category ||
        (Array.isArray(settings.languages) && settings.languages[0]) ||
        'Indian';
    const currentCategory = configuredCategory.toLowerCase() === 'bollywood'
        ? 'Indian'
        : configuredCategory;
    const hintsEnabled = settings.hintsEnabled !== undefined ? settings.hintsEnabled : true;

    // Player roster (falls back to just the current user until room state arrives)
    const activePlayers = React.useMemo(() => {
        if (!players || players.length === 0) {
            return [{
                id: 'player-host',
                username: currentUser || 'Player',
                isHost: true,
                isReady: true
            }];
        }
        return players.map((p, idx) => ({
            ...p,
            isHost: p.isHost !== undefined ? p.isHost : idx === 0,
            isReady: p.isReady !== undefined ? p.isReady : true
        }));
    }, [players, currentUser]);

    const selfLower = (currentUser || '').toLowerCase();

    const displayRoomCode = roomId || 'XQ78';
    const inviteLink = `${window.location.origin}/room/${displayRoomCode}`;

    const handleCopyCode = async () => {
        try {
            await navigator.clipboard.writeText(displayRoomCode);
            setCopiedCode(true);
            sounds.playTick();
            setTimeout(() => setCopiedCode(false), 2200);
        } catch {
            /* clipboard unavailable */
        }
    };

    const handleShareInvite = async () => {
        try {
            if (navigator.share) {
                await navigator.share({
                    title: 'Join EmojiCharades!',
                    text: `Join my EmojiCharades room: ${displayRoomCode}`,
                    url: inviteLink
                });
            } else {
                await navigator.clipboard.writeText(inviteLink);
                setCopiedInvite(true);
                sounds.playTick();
                setTimeout(() => setCopiedInvite(false), 2400);
            }
        } catch {
            /* share cancelled or clipboard unavailable */
        }
    };

    const handleRoundsChange = (delta) => {
        if (!isHost || !onUpdateSettings) return;
        const next = Math.max(1, Math.min(6, currentRounds + delta));
        if (next !== currentRounds) {
            onUpdateSettings({ ...settings, totalRounds: next });
            sounds.playTick();
        }
    };

    const handleGuessingTimeChange = (delta) => {
        if (!isHost || !onUpdateSettings) return;
        const next = Math.max(30, Math.min(300, currentGuessingTime + delta));
        if (next !== currentGuessingTime) {
            onUpdateSettings({ ...settings, guessingTime: next });
            sounds.playTick();
        }
    };

    const formatGuessingTime = (seconds) =>
        `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;

    const handleCategorySelect = (cat) => {
        if (!isHost || !onUpdateSettings) return;
        onUpdateSettings({ ...settings, category: cat, languages: [cat] });
        setCategoryOpen(false);
        sounds.playPop();
    };

    const handleToggleHints = () => {
        if (!isHost || !onUpdateSettings) return;
        onUpdateSettings({ ...settings, hintsEnabled: !hintsEnabled });
        sounds.playTick();
    };

    const handleSelfReady = () => {
        sounds.playPop();
        if (onToggleReady) onToggleReady();
    };

    const canStart = activePlayers.length >= 2;

    const ReadyPill = ({ ready, asButton }) => {
        const icon = ready
            ? <GameIcon name="ready" size={17} alt="" fallback={<span className="lob-ready-check"><Check size={11} strokeWidth={4} /></span>} />
            : <GameIcon name="not-ready" size={17} alt="" fallback={<span className="lob-ready-dot" />} />;
        const content = (
            <>
                {icon}
                <span>{ready ? 'Ready' : 'Not Ready'}</span>
            </>
        );
        return asButton ? (
            <button
                type="button"
                className={`lob-ready-pill${ready ? ' is-ready' : ' is-not-ready'}`}
                onClick={handleSelfReady}
                title="Click to toggle your Ready status"
            >
                {content}
            </button>
        ) : (
            <span className={`lob-ready-pill${ready ? ' is-ready' : ' is-not-ready'}`}>
                {content}
            </span>
        );
    };

    return (
        <div className="lob-page">
            <div className="lob-overlay" />

            <div className="lob-content">
                {/* ================= HEADER ================= */}
                <header className="lob-header">
                    <img
                        src="/emojicharades-logo.png"
                        alt="EmojiCharades"
                        className="lob-logo"
                        draggable={false}
                    />
                    <h1 className="sr-only">Emoji Charades Lobby</h1>

                </header>

                {/* ================= 3 COLUMN GRID ================= */}
                <main className="lob-grid">
                    {/* LEFT — PLAYERS */}
                    <section className="lob-card lob-players-card">
                        <h2 className="lob-card-title">
                            Players <span className="lob-title-count">({activePlayers.length}/{MAX_PLAYERS})</span>
                            {activePlayers.length >= MAX_PLAYERS && (
                                <span className="lob-roomfull-badge">
                                    <GameIcon name="room-full" size={15} alt="Room full" fallback={<Users size={13} />} />
                                    Room Full
                                </span>
                            )}
                        </h2>

                        <div className="lob-roster">
                            {activePlayers.map((player) => {
                                const self = (player.username || '').toLowerCase() === selfLower;
                                return (
                                    <div
                                        key={player.id}
                                        className={`lob-player-row${self ? ' is-self' : ''}`}
                                    >
                                        <PlayerAvatar
                                            name={player.username}
                                            avatarIndex={player.avatarIndex}
                                            size={34}
                                            className="lob-player-avatar"
                                        />
                                        <div className="lob-player-names">
                                            <span className="lob-player-name">{player.username}</span>
                                            {player.isHost && (
                                                <span className="lob-host-badge">
                                                    <GameIcon name="host-crown" size={13} alt="Host" fallback={<Crown size={12} />} />
                                                    <span>Host</span>
                                                </span>
                                            )}
                                        </div>
                                        <ReadyPill ready={player.isReady} asButton={self} />
                                    </div>
                                );
                            })}
                        </div>
                    </section>

                    {/* CENTER — GAME SETTINGS + START */}
                    <section className="lob-settings-col">
                        <div className="lob-card lob-settings-card">
                            <h2 className="lob-card-title has-badge">
                                <span className="lob-title-badge">
                                    <GameIcon name="settings-main" size={36} alt="Settings" fallback={<Settings size={20} />} />
                                </span>
                                Game Settings
                            </h2>

                            {/* Number of Rounds */}
                            <div className="lob-set-row">
                                <div className="lob-set-label">
                                    <span className="lob-set-icon has-art-icon">
                                        <GameIcon name="settings-rounds" size={42} alt="Number of rounds" fallback={<ListOrdered size={18} />} />
                                    </span>
                                    <span className="lob-set-name">Number of Rounds</span>
                                </div>
                                <div className="lob-control">
                                    <div className="lob-step-group">
                                        <button
                                            type="button"
                                            className="lob-step-btn"
                                            onClick={() => handleRoundsChange(-1)}
                                            disabled={!isHost || currentRounds <= 1}
                                            aria-label="Fewer rounds"
                                        >
                                            <GameIcon name="control-minus" size={30} alt="" fallback={<Minus size={16} strokeWidth={3} />} />
                                        </button>
                                        <span className="lob-step-val">{currentRounds}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="lob-step-btn is-plus"
                                        onClick={() => handleRoundsChange(1)}
                                        disabled={!isHost || currentRounds >= 6}
                                        aria-label="More rounds"
                                    >
                                        <GameIcon name="control-plus" size={30} alt="" fallback={<Plus size={16} strokeWidth={3} />} />
                                    </button>
                                </div>
                            </div>

                            {/* Guessing and emoji-clue timer */}
                            <div className="lob-set-row">
                                <div className="lob-set-label">
                                    <span className="lob-set-icon has-art-icon">
                                        <GameIcon name="settings-timer" size={42} alt="Guessing and clue time" fallback={<Clock size={18} />} />
                                    </span>
                                    <span className="lob-set-name">
                                        Guess &amp; Clue Time
                                        <small>Time for guessing and emoji clues (max 5 min)</small>
                                    </span>
                                </div>
                                <div className="lob-control">
                                    <div className="lob-step-group">
                                        <button
                                            type="button"
                                            className="lob-step-btn"
                                            onClick={() => handleGuessingTimeChange(-30)}
                                            disabled={!isHost || currentGuessingTime <= 30}
                                            aria-label="Decrease guess and clue time by 30 seconds"
                                        >
                                            <GameIcon name="control-minus" size={30} alt="" fallback={<Minus size={16} strokeWidth={3} />} />
                                        </button>
                                        <span className="lob-step-val">{formatGuessingTime(currentGuessingTime)}</span>
                                    </div>
                                    <button
                                        type="button"
                                        className="lob-step-btn is-plus"
                                        onClick={() => handleGuessingTimeChange(30)}
                                        disabled={!isHost || currentGuessingTime >= 300}
                                        aria-label="Increase guess and clue time by 30 seconds"
                                    >
                                        <GameIcon name="control-plus" size={30} alt="" fallback={<Plus size={16} strokeWidth={3} />} />
                                    </button>
                                </div>
                            </div>

                            {/* Movie Category */}
                            <div className="lob-set-row">
                                <div className="lob-set-label">
                                    <span className="lob-set-icon has-art-icon">
                                        <GameIcon name="movie-category-setting" size={42} alt="Movie category" fallback={<Tags size={18} />} />
                                    </span>
                                    <span className="lob-set-name">Movie Category</span>
                                </div>
                                <div className="lob-cat-wrap">
                                    <button
                                        type="button"
                                        className="lob-cat-btn"
                                        onClick={() => isHost && setCategoryOpen((open) => !open)}
                                        disabled={!isHost}
                                        title={isHost ? 'Choose a category' : 'Host managed'}
                                    >
                                        <span>{currentCategory}</span>
                                        <GameIcon name="control-dropdown" size={34} alt="" className={`lob-cat-caret${categoryOpen ? ' is-open' : ''}`} fallback={<ChevronDown size={16} />} />
                                    </button>
                                    {categoryOpen && (
                                        <div className="lob-cat-menu">
                                            {CATEGORIES.map((cat) => (
                                                <button
                                                    key={cat}
                                                    type="button"
                                                    className={`lob-cat-item${cat === currentCategory ? ' selected' : ''}`}
                                                    onClick={() => handleCategorySelect(cat)}
                                                >
                                                    <span>{cat}</span>
                                                    {cat === currentCategory && <Check size={14} strokeWidth={3.5} />}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Hints */}
                            <div className="lob-set-row is-hints">
                                <div className="lob-set-label">
                                    <span className="lob-set-icon has-art-icon">
                                        <GameIcon name="settings-hints" size={42} alt="Hints" fallback={<Lightbulb size={17} />} />
                                    </span>
                                    <span className="lob-set-name">
                                        Hints
                                        <small>Show movie info (year, word count, etc.)</small>
                                    </span>
                                </div>
                                <button
                                    type="button"
                                    className={`lob-toggle${hintsEnabled ? ' is-on' : ''}`}
                                    onClick={handleToggleHints}
                                    disabled={!isHost}
                                    aria-pressed={hintsEnabled}
                                    aria-label="Toggle hints"
                                >
                                    <img
                                        src={hintsEnabled ? '/icons/toggle-on.png' : '/icons/toggle-off.png'}
                                        alt={hintsEnabled ? 'On' : 'Off'}
                                        className="lob-toggle-image"
                                        draggable={false}
                                    />
                                </button>
                            </div>

                            {/* How-to info box */}
                            <div className="lob-info-box">
                                <Info size={17} className="lob-info-icon" />
                                <p>
                                    Each player gets one turn to choose a movie and give emoji
                                    clues. Everyone gets a chance before the next round.
                                </p>
                            </div>

                            {/* Start CTA pinned to the card bottom */}
                            <div className="lob-start-area">
                                {isHost ? (
                                    <button
                                        type="button"
                                        className="lob-start-btn"
                                        onClick={() => {
                                            if (!canStart) return;
                                            sounds.playSuccess();
                                            if (onStartGame) onStartGame();
                                        }}
                                        disabled={!canStart}
                                        title={canStart ? 'Start the game' : 'Need at least 2 players to start'}
                                    >
                                        <GameIcon name="start-game" size={22} alt="Start Game" fallback={<Play size={19} fill="currentColor" strokeWidth={0} />} />
                                        <span>Start Game</span>
                                    </button>
                                ) : (
                                    <div className="lob-host-wait">
                                        <span className="lob-dots"><span /><span /><span /></span>
                                        Waiting for host to start the game...
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="lob-min-players">
                            <span className="lob-line" />
                            <Users size={14} />
                            <span className="lob-min-text">Need at least 2 players to start</span>
                            <span className="lob-line" />
                        </div>
                    </section>

                    {/* RIGHT — INVITE FRIENDS */}
                    <section className="lob-card lob-invite-card">
                        <div className="lob-invite-body">
                            <h2 className="lob-invite-title">Invite Friends</h2>
                            <p className="lob-invite-sub">Share this room code with your friends</p>

                            <div className="lob-code-box">
                                <span className="lob-code-big">{displayRoomCode}</span>
                                <button
                                    type="button"
                                    className="lob-code-copy"
                                    onClick={handleCopyCode}
                                    title="Copy room code"
                                    aria-label="Copy room code"
                                >
                                    {copiedCode
                                        ? <Check size={18} strokeWidth={3} />
                                        : <GameIcon name="copy" size={18} alt="Copy room code" fallback={<Copy size={18} />} />}
                                </button>
                            </div>

                            <button type="button" className="lob-invite-btn" onClick={handleShareInvite}>
                                {copiedInvite
                                    ? <Check size={18} strokeWidth={3} />
                                    : <GameIcon name="invite" size={18} alt="Invite friends" fallback={<Share2 size={17} />} />}
                                <span>{copiedInvite ? 'Invite Link Copied!' : 'Invite Friends'}</span>
                            </button>
                        </div>
                    </section>
                </main>
            </div>
        </div>
    );
}
