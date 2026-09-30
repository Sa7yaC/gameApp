import React from 'react';
import { Trophy, Crown, Film, CheckCircle2, Eye } from 'lucide-react';

export default function ScoreboardSidebar({ players = [], currentActorId }) {
    // Sort players by score descending
    const sorted = [...players].sort((a, b) => b.score - a.score);

    return (
        <div className="scoreboard-sidebar-container">
            <div className="scoreboard-header">
                <Trophy size={18} className="scoreboard-trophy" />
                <h3>Leaderboard</h3>
            </div>

            <div className="scoreboard-list">
                {sorted.map((player, index) => {
                    const isActor = player.id === currentActorId;
                    return (
                        <div
                            key={player.id}
                            className={`scoreboard-player-row ${isActor ? 'is-actor' : ''} ${player.hasGuessed ? 'has-guessed' : ''}`}
                        >
                            <span className="player-rank">#{index + 1}</span>

                            <div className="player-avatar-mini">
                                {player.username.charAt(0).toUpperCase()}
                            </div>

                            <div className="player-meta-block">
                                <div className="name-tags-line">
                                    <span className="player-display-name">{player.username}</span>
                                    {player.isHost && (
                                        <Crown size={12} className="meta-icon host-icon" title="Host" />
                                    )}
                                    {isActor && (
                                        <Film size={12} className="meta-icon actor-icon" title="Actor" />
                                    )}
                                </div>
                                <span className="player-status-sub">
                                    {isActor && '🎬 Clue Giver'}
                                    {!isActor && player.hasGuessed && '✅ Guessed!'}
                                    {!isActor && !player.hasGuessed && !player.isSpectator && 'Thinking...'}
                                    {player.isSpectator && 'Spectating'}
                                </span>
                            </div>

                            <div className="player-points-chip">
                                <span className="pts-number">{player.score}</span>
                                <span className="pts-label">pts</span>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
