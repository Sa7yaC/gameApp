import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle2, Sparkles, AlertCircle } from 'lucide-react';
import { PlayerAvatar } from './LobbyAvatars';
import GameIcon from './GameIcon';

export default function ChatSection({
    messages = [],
    onSendMessage,
    isActor,
    hasGuessed,
    isSpectator,
    phase
}) {
    const [inputValue, setInputValue] = useState('');
    const chatFeedRef = useRef(null);

    // Only scroll the internal chat container, NEVER the window!
    useEffect(() => {
        if (chatFeedRef.current) {
            chatFeedRef.current.scrollTop = chatFeedRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const trimmed = inputValue.trim();
        if (!trimmed) return;

        onSendMessage(trimmed);
        setInputValue('');
    };

    let placeholderText = 'Type your guess...';
    let isInputDisabled = false;

    if (isActor && phase === 'PLAYING') {
        placeholderText = 'You are the Actor! Give clues with emojis.';
        isInputDisabled = true;
    } else if (hasGuessed && phase === 'PLAYING') {
        placeholderText = 'You got it right! Chat with friends...';
        isInputDisabled = false;
    } else if (isSpectator && phase === 'PLAYING') {
        placeholderText = 'Spectating — type to chat...';
        isInputDisabled = false;
    }

    return (
        <div className="gs-panel gs-chat-panel">
            <div className="gs-panel-header">
                <h3 className="gs-panel-title">Guesses</h3>
            </div>

            {/* Messages feed: scrolls only inside this element */}
            <div className="gs-chat-feed" ref={chatFeedRef}>
                {messages
                    .filter((msg) => !msg.isSystem) // no join/leave/round broadcasts
                    .map((msg, index) => {
                            if (msg.isActorWarning) {
                                return (
                                    <div key={msg.id || index} className="gs-chat-warning">
                                        <AlertCircle size={13} />
                                        <span>{msg.text}</span>
                                    </div>
                                );
                            }

                            if (msg.isCelebration) {
                                return (
                                    <div key={msg.id || index} className="gs-chat-celebration">
                                        <Sparkles size={14} />
                                        <span>{msg.text}</span>
                                    </div>
                                );
                            }

                        if (msg.isCorrectGuess) {
                            return (
                                <div key={msg.id || index} className="gs-chat-correct">
                                    <GameIcon name="ready" size={19} alt="Correct" fallback={<CheckCircle2 size={17} className="gs-correct-icon" />} />
                                    <div>
                                        <div className="gs-chat-correct-name">{msg.user}</div>
                                        <div className="gs-chat-correct-text">Guessed the movie right! 🎉</div>
                                    </div>
                                </div>
                            );
                        }

                        return (
                            <div key={msg.id || index} className="gs-chat-msg">
                                <PlayerAvatar name={msg.user} size={34} className="gs-chat-avatar" />
                                <div className="gs-chat-bubble">
                                    <div className="gs-chat-meta">
                                        <span className="gs-chat-name">{msg.user}</span>
                                    </div>
                                    <p className="gs-chat-text">{msg.text}</p>
                                </div>
                            </div>
                        );
                    })}
            </div>

            {/* Input Form */}
            <form className="gs-chat-input-row" onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholderText}
                    disabled={isInputDisabled}
                    className={`gs-chat-input${hasGuessed && phase === 'PLAYING' ? ' success' : ''}`}
                    maxLength={120}
                    autoComplete="off"
                />
                <button
                    type="submit"
                    disabled={isInputDisabled || !inputValue.trim()}
                    className="gs-chat-send"
                    aria-label="Send guess"
                >
                    <Send size={17} />
                </button>
            </form>
        </div>
    );
}
