import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Dices } from 'lucide-react';
import sounds from '../utils/soundEffects';
import { generateNordpassUsername } from '../utils/nordpassUsername';

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

export default function LandingPage() {
    const navigate = useNavigate();
    const [username, setUsername] = useState('');
    const [roomCode, setRoomCode] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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

    return (
        <div className="landing-page-container">
            <div className="home-content-wrap">
                {/* 3D Brand Logo */}
                <div className="home-logo-wrap">
                    <img
                        src="/emojicharades-logo.png"
                        alt="EmojiCharades"
                        className="home-logo-img"
                    />
                    <h1 className="sr-only">EmojiCharades</h1>
                </div>

                {/* Wireframe Card */}
                <div className="home-wireframe-card">
                    {error && (
                        <div className="error-alert-banner">
                            <span>⚠️ {error}</span>
                        </div>
                    )}

                    {/* 1. your nickname label + input */}
                    <div className="home-field-group">
                        <label className="home-field-label">your nickname</label>
                        <div className="home-input-wrap">
                            <input
                                type="text"
                                maxLength={24}
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="your nickname"
                                className="home-text-input"
                            />
                            <button
                                type="button"
                                onClick={handleRollNewUsername}
                                className="home-dice-btn"
                                title="Randomize Nickname"
                            >
                                <Dices size={18} />
                            </button>
                        </div>
                    </div>

                    {/* 2. create room (button) */}
                    <button
                        type="button"
                        onClick={handleCreateRoom}
                        disabled={loading}
                        className="home-action-btn home-create-btn"
                    >
                        <span>{loading ? 'creating...' : 'create room'}</span>
                    </button>

                    {/* 3. enter room id (input field) */}
                    <div className="home-field-group">
                        <input
                            type="text"
                            maxLength={16}
                            value={roomCode}
                            onChange={(e) => setRoomCode(e.target.value.trim())}
                            placeholder="enter room id"
                            className="home-text-input"
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') handleJoinRoom(e);
                            }}
                        />
                    </div>

                    {/* 4. join game (button) */}
                    <button
                        type="button"
                        onClick={handleJoinRoom}
                        disabled={loading || !roomCode.trim()}
                        className="home-action-btn home-join-btn"
                    >
                        <span>{loading ? 'joining...' : 'join game'}</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
