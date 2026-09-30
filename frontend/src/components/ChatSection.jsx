import React, { useState, useRef, useEffect } from 'react';
import { Send, CheckCircle2, MessageSquare, AlertCircle, Sparkles } from 'lucide-react';

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

    let placeholderText = "Type your guess or message...";
    let isInputDisabled = false;

    if (isActor && phase === 'PLAYING') {
        placeholderText = "You are the Actor! Give clues using the emoji board.";
        isInputDisabled = true;
    } else if (hasGuessed && phase === 'PLAYING') {
        placeholderText = "You got it right! You can chat here.";
        isInputDisabled = false;
    } else if (isSpectator && phase === 'PLAYING') {
        placeholderText = "Spectating current round. Type to chat...";
        isInputDisabled = false;
    }

    return (
        <div className="chat-section-container">
            <div className="chat-header">
                <div className="chat-header-title">
                    <MessageSquare size={16} />
                    <span>Live Guesses & Chat</span>
                </div>
                <span className="live-pill">LIVE</span>
            </div>

            {/* Messages Feed: scroll only inside this element */}
            <div className="chat-messages-feed" ref={chatFeedRef}>
                {messages.length === 0 ? (
                    <div className="empty-chat-state">
                        <Sparkles size={20} />
                        <p>No guesses yet! Be the first to guess the movie title.</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        if (msg.isCelebration) {
                            return (
                                <div key={msg.id || index} className="chat-bubble celebration-bubble">
                                    <Sparkles size={15} />
                                    <span>{msg.text}</span>
                                </div>
                            );
                        }

                        if (msg.isSystem) {
                            return (
                                <div key={msg.id || index} className="chat-bubble system-bubble">
                                    <AlertCircle size={14} />
                                    <span>{msg.text}</span>
                                </div>
                            );
                        }



                        if (msg.isCorrectGuess) {
                            return (
                                <div key={msg.id || index} className="chat-bubble correct-guess-bubble">
                                    <CheckCircle2 size={15} className="correct-icon" />
                                    <span className="sender-name">{msg.user}:</span>
                                    <span className="masked-guess-text">****</span>
                                    <span className="correct-tag">Guessed Right!</span>
                                </div>
                            );
                        }

                        return (
                            <div key={msg.id || index} className={`chat-bubble standard-bubble ${msg.hasGuessed ? 'guessed-user' : ''}`}>
                                <span className="sender-name">{msg.user}:</span>
                                <span className="message-content">{msg.text}</span>
                                {msg.timestamp && <span className="msg-time">{msg.timestamp}</span>}
                            </div>
                        );
                    })
                )}
            </div>

            {/* Input Form */}
            <form onSubmit={handleSubmit} className="chat-input-bar">
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder={placeholderText}
                    disabled={isInputDisabled}
                    className={`chat-input-field ${hasGuessed ? 'success-mode' : ''}`}
                />
                <button
                    type="submit"
                    disabled={isInputDisabled || !inputValue.trim()}
                    className="chat-send-btn"
                >
                    <Send size={16} />
                </button>
            </form>
        </div>
    );
}
