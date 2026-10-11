import React from 'react';
import { CalendarDays, Clapperboard, Lightbulb, Lock } from 'lucide-react';
import GameIcon from './GameIcon';

/* Split an emoji string into safe grapheme clusters (ZWJ / skin-tone aware) */
function splitEmojis(clue = '') {
    try {
        const seg = new Intl.Segmenter('en', { granularity: 'grapheme' });
        return [...seg.segment(clue)].map((s) => s.segment).filter((s) => s.trim().length > 0);
    } catch {
        return [...clue].filter((s) => s.trim().length > 0);
    }
}

export default function ClueBoard({
    actorName,
    isActor,
    movieDetails,
    language,
    hints,
    year,
    wordCount,
    clues = [],
    phase,
    revealMovie = ''
}) {
    const playing = phase === 'PLAYING';
    const reveal = phase === 'TURN_REVEAL';

    const latest = clues[clues.length - 1];
    const history = clues.slice(0, -1).reverse();
    const latestEmojis = latest ? splitEmojis(latest) : [];

    const showSecretTitle = isActor && movieDetails && playing;

    return (
        <div className="gs-card gs-stage">
            {showSecretTitle && (
                <>
                    <h1 className="gs-stage-title">Your movie is selected!</h1>
                    <div className="gs-secret-movie" title="Only you can see this">
                        <Lock size={13} className="gs-secret-lock" />
                        <span className="gs-secret-title">{movieDetails.title}</span>
                        {movieDetails.hints && <span className="gs-secret-hint">{movieDetails.hints}</span>}
                    </div>
                </>
            )}

            {!isActor && (
                <h1 className="gs-stage-title">
                    {reveal ? 'The movie was...' : 'The chosen movie is:'}
                </h1>
            )}

            {/* Clue area — the movie name is revealed right here when time runs out */}
            <div className="gs-clue-board">
                {reveal && revealMovie ? (
                    <div className="gs-movie-reveal">
                        <GameIcon name="movie" size={30} alt="Movie" fallback={<Clapperboard size={22} />} />
                        <span>{revealMovie}</span>
                    </div>
                ) : clues.length === 0 ? (
                    <div className="gs-clues-empty">
                        <GameIcon name="movie" size={44} alt="Movie" fallback={<span className="gs-clues-empty-emoji">🎬</span>} />
                        <p>
                            {isActor
                                ? 'Pick emojis below and drop your first clue!'
                                : `Waiting for ${actorName || 'the actor'} to drop the first hint...`}
                        </p>
                    </div>
                ) : (
                    <>
                        <div className="gs-clue-latest" key={clues.length}>
                            {latestEmojis.map((em, idx) => (
                                <span key={`lt-${idx}`} className="gs-clue-tile">{em}</span>
                            ))}
                        </div>
                        {history.length > 0 && (
                            <div className="gs-clue-history">
                                {history.map((entry, idx) => (
                                    <div key={`hs-${idx}`} className="gs-clue-history-row">
                                        <span className="gs-clue-hist-num">#{history.length - idx}</span>
                                        <span className="gs-clue-hist-emos">{entry}</span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Movie hint chips */}
            <div className="gs-hint-chips">
                {year > 0 && (
                    <span className="gs-hint-chip">
                        <GameIcon name="year" size={17} alt="Year" fallback={<CalendarDays size={15} />} />
                        {year}
                    </span>
                )}
                {language && (
                    <span className="gs-hint-chip">
                        <GameIcon name="category" size={17} alt="Category" fallback={<Clapperboard size={15} />} />
                        {language}
                    </span>
                )}
                {hints && (
                    <span className="gs-hint-chip is-tip">
                        <GameIcon name="help" size={17} alt="Hint" fallback={<Lightbulb size={15} />} />
                        {hints}
                    </span>
                )}
            </div>
        </div>
    );
}
