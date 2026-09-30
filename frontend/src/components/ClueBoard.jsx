import React from 'react';
import { Film, Lightbulb, User, Sparkles, Calendar, Type, Globe } from 'lucide-react';

export default function ClueBoard({
    actorName,
    isActor,
    movieDetails,
    maskedTitle,
    language,
    hints,
    year,
    wordCount,
    clues = [],
    phase
}) {
    return (
        <div className="clue-board-container">
            {/* Clapperboard Header */}
            <div className="clue-board-clapper">
                <div className="clapper-stripes">
                    <span className="stripe"></span>
                    <span className="stripe"></span>
                    <span className="stripe"></span>
                    <span className="stripe"></span>
                    <span className="stripe"></span>
                </div>

                <div className="clapper-meta-row">
                    <div className="clapper-actor-info">
                        <User size={16} />
                        <span>Actor: <strong>{actorName || 'Selecting...'}</strong></span>
                        {isActor && <span className="you-actor-badge">YOU</span>}
                    </div>

                    <div className="clapper-meta-badges">
                        {language && <span className="board-badge lang-badge">{language}</span>}
                    </div>
                </div>
            </div>

            {/* Secret / Movie Info Display */}
            <div className="title-display-stage">
                {isActor && movieDetails ? (
                    <div className="secret-title-box">
                        <span className="secret-title-label">YOUR SECRET MOVIE:</span>
                        <h1 className="secret-title-text">{movieDetails.title}</h1>
                        {movieDetails.hints && <span className="secret-title-hint">Hint: {movieDetails.hints}</span>}
                    </div>
                ) : (
                    <div className="movie-info-box">
                        <span className="movie-info-label">GUESS THE MOVIE:</span>
                        <div className="movie-info-pills">
                            {year > 0 && (
                                <div className="movie-info-pill">
                                    <Calendar size={14} />
                                    <span className="info-pill-label">Released</span>
                                    <span className="info-pill-value">{year}</span>
                                </div>
                            )}
                            {wordCount > 0 && (
                                <div className="movie-info-pill">
                                    <Type size={14} />
                                    <span className="info-pill-label">Words</span>
                                    <span className="info-pill-value">{wordCount}</span>
                                </div>
                            )}
                            {language && (
                                <div className="movie-info-pill">
                                    <Globe size={14} />
                                    <span className="info-pill-label">Language</span>
                                    <span className="info-pill-value">{language}</span>
                                </div>
                            )}
                        </div>
                        {hints && (
                            <div className="movie-hints-row">
                                <Lightbulb size={14} />
                                <span>{hints}</span>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Clue Stream Area: shown to guessers, or to actor after dropping clues */}
            {(!isActor || clues.length > 0) && (
                <div className={`clue-stream-area ${isActor ? 'actor-mode' : ''}`}>
                    <div className="clue-stream-header">
                        <div className="clue-stream-title">
                            <Sparkles size={16} className="sparkle-icon" />
                            <span>EMOJI CLUES DROPPED</span>
                        </div>
                        <span className="clue-count-tag">{clues.length} {clues.length === 1 ? 'Clue' : 'Clues'}</span>
                    </div>

                    <div className="clues-display-canvas">
                        {clues.length === 0 ? (
                            <div className="empty-clues-placeholder">
                                <span className="empty-emoji-icon">🎬</span>
                                <p>
                                    Waiting for {actorName || 'the actor'} to drop the first emoji hint...
                                </p>
                            </div>
                        ) : (
                            <div className="clues-bubble-flow">
                                {clues.map((clueItem, idx) => (
                                    <div key={idx} className="clue-bubble-card pop-in">
                                        <span className="clue-step-num">#{idx + 1}</span>
                                        <span className="clue-emojis-content">{clueItem}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
