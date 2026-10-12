import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Crown } from 'lucide-react';
import { PlayerAvatar } from './LobbyAvatars';
import sounds from '../utils/soundEffects';

export default function PodiumModal({
    podium = [],
    allPlayers = [],
    isHost,
    onPlayAgain,
    onExitGame
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

    const rankedPlayers = allPlayers.length > 0 ? allPlayers : podium;
    const winner = podium[0] || rankedPlayers[0];

    return (
        <div className="podium-modal-overlay">
            <div className="podium-modal-card">
                <div className="podium-header">
                    <img
                        src="/icons/podium-game-over.png"
                        alt="Game Over"
                        className="podium-game-over-banner"
                        draggable={false}
                    />
                    <p className="podium-subtitle">What a game!</p>
                </div>

                <section className="podium-results">
                    {winner && (
                        <div className="podium-winner">
                            <div className="podium-winner-avatar">
                                <Crown className="podium-winner-crown float-bounce" size={46} fill="currentColor" />
                                <div className="podium-avatar-bubble">
                                    <PlayerAvatar
                                        name={winner.username}
                                        avatarIndex={winner.avatarIndex}
                                        size={84}
                                    />
                                </div>
                            </div>
                            <h3 className="podium-winner-name">{winner.username}</h3>
                            <div className="podium-winner-score">
                                <strong>{winner.score}</strong>
                                <span>points</span>
                            </div>
                        </div>
                    )}

                    {rankedPlayers.length > 0 && (
                        <div className="podium-rankings" aria-label="Final rankings">
                            {rankedPlayers.map((player, idx) => (
                                <div
                                    key={player.id || `${player.username}-${idx}`}
                                    className={`podium-ranking-row${idx === 0 ? ' is-winner' : ''}`}
                                >
                                    <span className={`podium-rank-number rank-${idx + 1}`}>{idx + 1}</span>
                                    <PlayerAvatar
                                        name={player.username}
                                        avatarIndex={player.avatarIndex}
                                        size={38}
                                        className="podium-ranking-avatar"
                                    />
                                    <span className="podium-ranking-name">{player.username}</span>
                                    {idx === 0 && <Crown size={17} className="podium-ranking-crown" fill="currentColor" />}
                                    <strong className="podium-ranking-score">{player.score}</strong>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                <div className="podium-actions-footer">
                    <button
                        onClick={onPlayAgain}
                        className="podium-btn play-again-btn"
                        disabled={!isHost}
                        title={isHost ? 'Return everyone to the lobby' : 'Only the host can restart the match'}
                    >
                        <img src="/icons/podium-play-again.png" alt="" className="podium-action-icon" draggable={false} />
                        <span>Play Again</span>
                    </button>

                    <button onClick={onExitGame} className="podium-btn exit-game-btn">
                        <img src="/icons/podium-exit-game.png" alt="" className="podium-action-icon" draggable={false} />
                        <span>Exit Game</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
