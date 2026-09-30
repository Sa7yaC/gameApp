import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, Award, Medal, Crown, RotateCcw, Home, Sparkles } from 'lucide-react';
import sounds from '../utils/soundEffects';

export default function PodiumModal({
    podium = [],
    allPlayers = [],
    isHost,
    onPlayAgain,
    onReturnHome
}) {
    useEffect(() => {
        sounds.playWin();

        // Fire festive confetti bursts
        const duration = 3000;
        const end = Date.now() + duration;

        const frame = () => {
            confetti({
                particleCount: 3,
                angle: 60,
                spread: 55,
                origin: { x: 0 }
            });
            confetti({
                particleCount: 3,
                angle: 120,
                spread: 55,
                origin: { x: 1 }
            });

            if (Date.now() < end) {
                requestAnimationFrame(frame);
            }
        };
        frame();
    }, []);

    const firstPlace = podium[0];
    const secondPlace = podium[1];
    const thirdPlace = podium[2];

    return (
        <div className="podium-modal-overlay">
            <div className="podium-modal-card">
                <div className="podium-header">
                    <div className="podium-tag">
                        <Sparkles size={18} />
                        <span>MATCH FINISHED</span>
                    </div>
                    <h2>Game Champions! 🏆</h2>
                    <p className="podium-subtitle">
                        Spectacular guessing! Here are the winners of this match.
                    </p>
                </div>

                {/* 3D-styled Podium Stand */}
                <div className="podium-stand-row">
                    {/* 2nd Place */}
                    <div className="podium-column second-place">
                        {secondPlace ? (
                            <>
                                <div className="podium-avatar-bubble silver-ring">
                                    <Medal size={24} className="medal-silver" />
                                </div>
                                <span className="podium-player-name">{secondPlace.username}</span>
                                <span className="podium-score">{secondPlace.score} pts</span>
                                <div className="podium-pedestal silver-pedestal">
                                    <span className="rank-number">2</span>
                                </div>
                            </>
                        ) : (
                            <div className="podium-pedestal silver-pedestal empty">
                                <span className="rank-number">2</span>
                            </div>
                        )}
                    </div>

                    {/* 1st Place */}
                    <div className="podium-column first-place">
                        {firstPlace ? (
                            <>
                                <Crown size={32} className="crown-gold float-bounce" />
                                <div className="podium-avatar-bubble gold-ring">
                                    <Trophy size={28} className="trophy-gold" />
                                </div>
                                <span className="podium-player-name highlight-winner">{firstPlace.username}</span>
                                <span className="podium-score winner-score">{firstPlace.score} pts</span>
                                <div className="podium-pedestal gold-pedestal">
                                    <span className="rank-number">1</span>
                                </div>
                            </>
                        ) : (
                            <div className="podium-pedestal gold-pedestal empty">
                                <span className="rank-number">1</span>
                            </div>
                        )}
                    </div>

                    {/* 3rd Place */}
                    <div className="podium-column third-place">
                        {thirdPlace ? (
                            <>
                                <div className="podium-avatar-bubble bronze-ring">
                                    <Award size={24} className="medal-bronze" />
                                </div>
                                <span className="podium-player-name">{thirdPlace.username}</span>
                                <span className="podium-score">{thirdPlace.score} pts</span>
                                <div className="podium-pedestal bronze-pedestal">
                                    <span className="rank-number">3</span>
                                </div>
                            </>
                        ) : (
                            <div className="podium-pedestal bronze-pedestal empty">
                                <span className="rank-number">3</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Remaining Players Leaderboard */}
                {allPlayers.length > 3 && (
                    <div className="podium-leaderboard-sublist">
                        <h4>Full Match Rankings</h4>
                        <div className="sublist-scroll">
                            {allPlayers.slice(3).map((player, idx) => (
                                <div key={player.id || idx} className="sublist-row">
                                    <span className="sublist-rank">#{idx + 4}</span>
                                    <span className="sublist-name">{player.username}</span>
                                    <span className="sublist-pts">{player.score} pts</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Footer Controls */}
                <div className="podium-actions-footer">
                    {isHost ? (
                        <button onClick={onPlayAgain} className="podium-btn play-again-btn">
                            <RotateCcw size={18} />
                            <span>Play Again (New Match)</span>
                        </button>
                    ) : (
                        <div className="waiting-host-box">
                            <span>Waiting for host to restart match...</span>
                        </div>
                    )}

                    <button onClick={onReturnHome} className="podium-btn home-btn">
                        <Home size={18} />
                        <span>Leave to Lobby</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
