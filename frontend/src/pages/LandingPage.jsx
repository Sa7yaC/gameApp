import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, Copy, RefreshCw } from 'lucide-react';
import GameIcon from '../components/GameIcon';
import sounds from '../utils/soundEffects';
import { generateNordpassUsername } from '../utils/nordpassUsername';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

/* 3D-style icon: two characters + plus badge (Create Room) */
const CreateRoomIcon = () => (
    <svg width="112" height="84" viewBox="0 0 112 84" fill="none" aria-hidden="true">
        <defs>
            <linearGradient id="lpGrBlue" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#93B0FF" />
                <stop offset="1" stopColor="#4C6BEB" />
            </linearGradient>
            <linearGradient id="lpGrOrange" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#FFC06A" />
                <stop offset="1" stopColor="#F58529" />
            </linearGradient>
            <linearGradient id="lpGrGold" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#FFE571" />
                <stop offset="1" stopColor="#FFBE2D" />
            </linearGradient>
        </defs>
        {/* back profile (orange) */}
        <circle cx="77" cy="27" r="13.5" fill="url(#lpGrOrange)" />
        <path d="M50 82 C50 60 60 46 77 46 C94 46 104 60 104 82 Z" fill="url(#lpGrOrange)" />
        <ellipse cx="71.5" cy="21.5" rx="4.4" ry="3" fill="#fff" opacity="0.5" />
        {/* front profile (blue) */}
        <circle cx="37" cy="26" r="16.5" fill="url(#lpGrBlue)" />
        <path d="M5 82 C5 57 16 42 37 42 C58 42 69 57 69 82 Z" fill="url(#lpGrBlue)" />
        <ellipse cx="30.5" cy="19.5" rx="5.6" ry="3.8" fill="#fff" opacity="0.5" />
        {/* plus badge */}
        <circle cx="91" cy="62" r="17.5" fill="url(#lpGrGold)" />
        <rect x="88.9" y="53.5" width="4.2" height="17" rx="2.1" fill="#F28B12" />
        <rect x="82.5" y="59.9" width="17" height="4.2" rx="2.1" fill="#F28B12" />
    </svg>
);

/* 3D-style icon: arrow entering a door (Join Room) */
const JoinRoomIcon = () => (
    <svg width="112" height="84" viewBox="0 0 112 84" fill="none" aria-hidden="true">
        <defs>
            <linearGradient id="lpGrDoor" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#9C8BFF" />
                <stop offset="1" stopColor="#6535E9" />
            </linearGradient>
            <linearGradient id="lpGrDoorFace" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#B3A4FF" />
                <stop offset="1" stopColor="#7C57F5" />
            </linearGradient>
            <linearGradient id="lpGrArrow" x1="0" y1="0" x2="0" y2="1">
                <stop stopColor="#57AEFF" />
                <stop offset="1" stopColor="#2D63F3" />
            </linearGradient>
        </defs>
        {/* door */}
        <rect x="60" y="4" width="48" height="76" rx="14" fill="url(#lpGrDoor)" />
        <rect x="66.5" y="10.5" width="35" height="63" rx="9.5" fill="url(#lpGrDoorFace)" />
        <circle cx="74.5" cy="44" r="3.4" fill="#F2EFFF" />
        {/* arrow bursting in */}
        <rect x="7" y="35" width="30" height="18" rx="6" fill="url(#lpGrArrow)" />
        <path d="M32 18 L62 43 L32 68 Z" fill="url(#lpGrArrow)" stroke="url(#lpGrArrow)" strokeWidth="11" strokeLinejoin="round" />
    </svg>
);

export default function LandingPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const codeInputRef = useRef(null);

    useEffect(() => {
        const saved = sessionStorage.getItem('charades_user');
        if (saved) {
            setUsername(saved);
        } else {
            const defaultUser = generateNordpassUsername();
            setUsername(defaultUser);
            sessionStorage.setItem('charades_user', defaultUser);
        }
    }, []);

    const handleRollNewUsername = () => {
        const newName = generateNordpassUsername();
        setUsername(newName);
        sessionStorage.setItem('charades_user', newName);
        sounds.playTick();
    };

    const handleCreateRoom = async () => {
        let cleanUser = username.trim();
        if (!cleanUser) {
            cleanUser = generateNordpassUsername();
            setUsername(cleanUser);
        }

        setError('');
        setLoading(true);
        sounds.playTick();

        try {
            sessionStorage.setItem('charades_user', cleanUser);
            const res = await axios.post(`${BACKEND_URL}/createRoom`, {
                username: cleanUser,
                settings: {
                    difficulty: 'easy',
                    languages: ['Bollywood'],
                    totalRounds: 3,
                    guessingTime: 90
                }
            });

            if (res.data?.success && res.data?.roomId) {
                navigate(`/room/${res.data.roomId}`);
            } else {
                setError('Failed to create room. Please try again.');
            }
        } catch (err) {
            console.error('Create room error:', err);
            setError(err.response?.data?.message || 'Could not connect to server.');
        } finally {
            setLoading(false);
        }
    };

    const handleJoinRoom = async (e) => {
        if (e && e.preventDefault) e.preventDefault();
        let cleanUser = username.trim();
        if (!cleanUser) {
            cleanUser = generateNordpassUsername();
            setUsername(cleanUser);
        }

        const cleanRoom = roomCode.trim();
        if (!cleanRoom) {
            setError('Please enter a room id!');
            return;
        }

        setError('');
        setLoading(true);
        sounds.playTick();

        try {
            sessionStorage.setItem('charades_user', cleanUser);
            const res = await axios.post(`${BACKEND_URL}/joinRoom`, {
                roomId: cleanRoom
            });

            if (res.data?.success) {
                navigate(`/room/${res.data.roomId || cleanRoom}`);
            } else {
                setError(res.data?.message || 'Room not found.');
            }
        } catch (err) {
            console.error('Join room error:', err);
            setError(err.response?.data?.message || "Room doesn't exist. Please check the code.");
        } finally {
            setLoading(false);
        }
    };

    const handlePasteRoomCode = async () => {
        try {
            const text = await navigator.clipboard.readText();
            if (text && text.trim()) {
                setRoomCode(text.trim());
                sounds.playTick();
            }
        } catch {
            // clipboard access blocked — let the user paste manually
        } finally {
            codeInputRef.current?.focus();
        }
    };

    return (
        <div className="lp-page">
            {error && (
                <div className="lp-toast" role="alert">
                    <span aria-hidden="true">⚠️</span>
                    <span>{error}</span>
                </div>
            )}

            <div className="lp-content">
                {/* brand logo */}
                <div className="lp-logo-wrap">
                    <img
                        src="/emojicharades-logo.png"
                        alt="Emoji Charades"
                        className="lp-logo"
                        draggable={false}
                    />
                    <h1 className="sr-only">Emoji Charades</h1>
                </div>

                {/* tagline */}
                <div className="lp-tagline">
                    {/* <p>Guess the movie.</p>
                    <p className="lp-tagline-accent">But with emojis</p> */}
                </div>

                {/* action cards */}
                <div className="lp-cards">
                    {/* create room */}
                    <div className="lp-card lp-card-create">
                        <div className="lp-card-icon">
                            <GameIcon name="create-room" size={88} alt="Create Room" fallback={<CreateRoomIcon />} />
                        </div>
                        <h2 className="lp-card-title">Create Room</h2>
                        <p className="lp-card-desc">Start a new game and invite your friends.</p>
                        {/* username inside the create room card */}
                        <div className="lp-create-username">
                            {/* <div className="lp-cu-avatar">
                                <GameIcon name="profile" size={24} alt="Your avatar" fallback={<span role="img" aria-label="Your avatar">👦</span>} />
                            </div> */}
                            <div className="lp-cu-meta">
                                <label htmlFor="create-username" className="lp-cu-label">Your username</label>
                                <input
                                    id="create-username"
                                    type="text"
                                    maxLength={22}
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your name"
                                    className="lp-cu-value"
                                    autoComplete="off"
                                    spellCheck={false}
                                />
                            </div>
                            <button
                                type="button"
                                onClick={handleRollNewUsername}
                                className="lp-cu-refresh"
                                title="Roll a new nickname"
                                aria-label="Roll a new nickname"
                            >
                                <GameIcon name="regenerate" size={18} alt="Regenerate nickname" fallback={<RefreshCw size={15} strokeWidth={2.8} />} />
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={handleCreateRoom}
                            disabled={loading}
                            className="lp-btn lp-btn-create"
                        >
                            {loading ? 'Creating…' : <>Create Room <ArrowRight size={19} strokeWidth={3} /></>}
                        </button>
                    </div>

                    {/* join room */}
                    <div className="lp-card lp-card-join">
                        <div className="lp-card-icon">
                            <GameIcon name="join-room" size={88} alt="Join Room" fallback={<JoinRoomIcon />} />
                        </div>
                        <h2 className="lp-card-title">Join Room</h2>
                        <p className="lp-card-desc">Enter a room code and jump into the game.</p>
                        <form onSubmit={handleJoinRoom}>
                            <div className="lp-code-row">
                                <input
                                    ref={codeInputRef}
                                    type="text"
                                    maxLength={10}
                                    value={roomCode}
                                    onChange={(e) => setRoomCode(e.target.value.trim())}
                                    placeholder="Enter room code"
                                    className="lp-code-input"
                                    autoComplete="off"
                                    autoCorrect="off"
                                    spellCheck={false}
                                    aria-label="Room code"
                                />
                                <button
                                    type="button"
                                    onClick={handlePasteRoomCode}
                                    className="lp-paste-btn"
                                    title="Paste room code"
                                    aria-label="Paste room code"
                                >
                                    <GameIcon name="copy" size={16} alt="Paste room code" fallback={<Copy size={16} />} />
                                </button>
                            </div>
                            <button
                                type="submit"
                                disabled={loading || !roomCode.trim()}
                                className="lp-btn lp-btn-join"
                            >
                                {loading ? 'Joining…' : <>Join Room <ArrowRight size={19} strokeWidth={3} /></>}
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
