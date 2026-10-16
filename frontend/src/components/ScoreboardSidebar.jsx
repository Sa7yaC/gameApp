import React, { useEffect, useRef } from 'react';
import { Crown, CheckCircle2, Eye } from 'lucide-react';
import { PlayerAvatar } from './LobbyAvatars';
import GameIcon from './GameIcon';

const MAX_PLAYERS = 8;

export default function ScoreboardSidebar({ players = [], currentActorId }) {
    // Sort players by score descending
    const sorted = [...players].sort((a, b) => b.score - a.score);
    const activePlayerRef = useRef(null);

    useEffect(() => {
        if (players.length > 4 && window.matchMedia('(max-width: 700px)').matches) {
            activePlayerRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest',
                inline: 'center'
            });
        }
    }, [currentActorId, players.length]);

    return (
        <div className="gs-panel gs-players-panel">
            <div className="gs-panel-header">
                <h3 className="gs-panel-title">
                    Players <span className="gs-panel-count">({players.length}/{MAX_PLAYERS})</span>
                </h3>
            </div>

            <div
                className={`gs-players-scroll${players.length > 4 ? ' has-overflow' : ''}`}
                role="list"
                aria-label="Players and scores"
                tabIndex={0}
                onKeyDown={(event) => {
                    if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                        event.preventDefault();
                        event.currentTarget.scrollBy({
                            left: event.key === 'ArrowRight' ? 120 : -120,
                            behavior: 'smooth'
                        });
                    }
                }}
            >
                {sorted.map((player, index) => {
                    const isActor = player.id === currentActorId;
                    return (
                        <div
                            key={player.id}
                            ref={isActor ? activePlayerRef : null}
                            className={`gs-player-row${isActor ? ' is-turn' : ''}${player.hasGuessed ? ' has-guessed' : ''}`}
                            role="listitem"
                            aria-current={isActor ? 'true' : undefined}
                        >
                            <PlayerAvatar
                                name={player.username}
                                avatarIndex={player.avatarIndex}
                                size={40}
                                className="gs-player-avatar"
                            />

                            <div className="gs-player-meta">
                                <div className="gs-player-name-line">
                                    <span className="gs-player-name">{player.username}</span>
                                    {player.isHost && (
                                        <span className="gs-host-badge" title="Host" aria-label="Host">
                                            <GameIcon name="host-crown" size={14} alt="Host" fallback={<Crown size={13} className="gs-host-crown" />} />
                                        </span>
                                    )}
                                </div>
                                {isActor ? (
                                    <span className="gs-turn-tag">
                                        <GameIcon name="current-turn" size={13} alt="Current turn" fallback={<span className="gs-turn-dot" />} />
                                        Current Turn
                                    </span>
                                ) : player.isSpectator ? (
                                    <span className="gs-player-status"><Eye size={12} /> Spectating</span>
                                ) : player.hasGuessed ? (
                                    <span className="gs-player-status guessed">
                                        <GameIcon name="ready" size={13} alt="Guessed" fallback={<CheckCircle2 size={12} />} /> Guessed!
                                    </span>
                                ) : (
                                    <span className="gs-player-status muted">
                                        {`#${index + 1}`}
                                    </span>
                                )}
                            </div>

                            <span className={`gs-player-score${isActor ? ' hot' : ''}`}>
                                {player.score ?? 0}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
