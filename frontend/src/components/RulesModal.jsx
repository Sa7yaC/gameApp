import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import sounds from '../utils/soundEffects';
import '../styles/RulesModal.css';

export default function RulesModal({ isOpen, onClose }) {
    useEffect(() => {
        if (!isOpen) return;

        const handleKeyDown = (e) => {
            if (e.key === 'Escape') {
                sounds.playTick();
                onClose();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            sounds.playTick();
            onClose();
        }
    };

    const handleClose = () => {
        sounds.playTick();
        onClose();
    };

    return (
        <div
            className="rules-modal-overlay"
            onClick={handleBackdropClick}
            role="dialog"
            aria-modal="true"
            aria-labelledby="rules-modal-title"
        >
            <div className="rules-modal-card">
                {/* Header */}
                <div className="rules-header">
                    <div className="rules-header-title-wrap">
                        <img
                            src="/emojicharades-logo.png"
                            alt="Emoji Charades"
                            className="rules-header-brand-logo"
                            draggable={false}
                        />
                        <div className="rules-header-divider" aria-hidden="true" />
                        <h2 id="rules-modal-title" className="rules-title">Game Guide</h2>
                    </div>
                    <button
                        type="button"
                        className="rules-close-btn"
                        onClick={handleClose}
                        title="Close rules"
                        aria-label="Close rules"
                    >
                        <X size={20} strokeWidth={2.5} />
                    </button>
                </div>

                {/* Scrollable Content */}
                <div className="rules-body">
                    {/* How to Play Section */}
                    <section className="rules-section">
                        <h3 className="rules-section-title">
                            <img
                                src="/icons/rules-gamepad.png"
                                alt=""
                                className="rules-section-img-icon rules-gamepad-icon"
                                aria-hidden="true"
                            />
                            <span>How to Play</span>
                        </h3>
                        <ol className="rules-steps-list">
                            <li className="rules-step-item">
                                <img
                                    src="/icons/rules-step-1.png"
                                    alt="1"
                                    className="rules-step-badge-img"
                                    draggable={false}
                                />
                                <div className="rules-step-content">
                                    <strong>Create a Room</strong>
                                    <span className="rules-step-desc">Create a room and share its code with your friends.</span>
                                </div>
                            </li>
                            <li className="rules-step-item">
                                <img
                                    src="/icons/rules-step-2.png"
                                    alt="2"
                                    className="rules-step-badge-img"
                                    draggable={false}
                                />
                                <div className="rules-step-content">
                                    <strong>Join the Fun</strong>
                                    <span className="rules-step-desc">Enter the room code to join your friends.</span>
                                </div>
                            </li>
                            <li className="rules-step-item">
                                <img
                                    src="/icons/rules-step-3.png"
                                    alt="3"
                                    className="rules-step-badge-img"
                                    draggable={false}
                                />
                                <div className="rules-step-content">
                                    <strong>Customize Your Game</strong>
                                    <span className="rules-step-desc">Adjust the room settings to make the game more fun.</span>
                                </div>
                            </li>
                            <li className="rules-step-item">
                                <img
                                    src="/icons/rules-step-4.png"
                                    alt="4"
                                    className="rules-step-badge-img"
                                    draggable={false}
                                />
                                <div className="rules-step-content">
                                    <strong>Give Emoji Clues</strong>
                                    <span className="rules-step-desc">Each player gets a turn to give clues for their selected movie.</span>
                                </div>
                            </li>
                            <li className="rules-step-item">
                                <img
                                    src="/icons/rules-step-5.png"
                                    alt="5"
                                    className="rules-step-badge-img"
                                    draggable={false}
                                />
                                <div className="rules-step-content">
                                    <strong>Guess the Movie</strong>
                                    <span className="rules-step-desc">Guess the movie before the timer runs out!</span>
                                </div>
                            </li>
                        </ol>
                    </section>

                    {/* Important Rules Section */}
                    <section className="rules-section rules-important-section">
                        <h3 className="rules-section-title rules-important-title">
                            <img
                                src="/icons/rules-pin.png"
                                alt=""
                                className="rules-section-img-icon rules-pin-icon"
                                aria-hidden="true"
                            />
                            <span>Important Rules</span>
                        </h3>
                        <div className="rules-rules-card">
                            <ul className="rules-important-list">
                                <li>
                                    <span className="rules-bullet-label">Minimum Players:</span> At least 2 players are required to start a game.
                                </li>
                                <li>
                                    <span className="rules-bullet-label">Leaving the Game:</span> Closing the tab or pressing the browser's Back button will remove you from the room.
                                </li>
                                <li>
                                    <span className="rules-bullet-label">Random Turns:</span> Turn order is randomized each round, so the player who gave the last clue in the previous round may go first in the next one.
                                </li>
                            </ul>
                        </div>
                    </section>

                    {/* Closing Banner */}
                    <div className="rules-footer-banner">
                        <p>That's it! Gather your friends, decode the emojis, and have fun! 🍿</p>
                    </div>
                </div>

                {/* Footer Action */}
                <div className="rules-footer">
                    <button
                        type="button"
                        className="rules-action-btn"
                        onClick={handleClose}
                    >
                        Got it! Let's Play
                    </button>
                </div>
            </div>
        </div>
    );
}
