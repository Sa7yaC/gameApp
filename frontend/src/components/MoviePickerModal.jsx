import React from 'react';
import { Clock, CheckCircle } from 'lucide-react';

export default function MoviePickerModal({ choices = [], timeLeft = 15, onSelectMovie }) {
    const isUrgent = timeLeft <= 5;

    return (
        <div className="picker-modal-overlay">
            <div className="picker-modal-card">
                <div className="picker-header">
                    <div className={`picker-timer-badge ${isUrgent ? 'urgent' : ''}`}>
                        <Clock size={16} />
                        <span>Auto-picks in <strong>{timeLeft}s</strong></span>
                    </div>
                </div>

                {/* Vertically aligned movie options */}
                <div className="picker-grid vertical-aligned-options">
                    {choices.map((movie, index) => {
                        const title = movie.title || movie.name || '';

                        return (
                            <div
                                key={index}
                                className="picker-movie-card vertical-card"
                                onClick={() => onSelectMovie(title)}
                            >
                                <div className="movie-card-main-info">
                                    <h3 className="movie-choice-title">{title}</h3>
                                </div>

                                <button className="select-movie-btn" type="button">
                                    <span>Select</span>
                                    <CheckCircle size={16} />
                                </button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
