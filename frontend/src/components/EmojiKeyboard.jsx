import React, { useState, useEffect } from 'react';
import EmojiPicker, { Theme, EmojiStyle } from 'emoji-picker-react';
import { Send, Delete, Trash2, Sparkles, AlertTriangle, ShieldCheck } from 'lucide-react';
import sounds from '../utils/soundEffects';

export default function EmojiKeyboard({ onDropClue, disabled }) {
    // Selected emojis are stored in an array for clean manipulation
    const [selectedEmojis, setSelectedEmojis] = useState([]);
    const [warningMsg, setWarningMsg] = useState('');

    // Clear warning after 3.5s
    useEffect(() => {
        if (!warningMsg) return;
        const timer = setTimeout(() => setWarningMsg(''), 3500);
        return () => clearTimeout(timer);
    }, [warningMsg]);

    const handleAddEmoji = (emoji) => {
        if (disabled) return;
        setSelectedEmojis((prev) => [...prev, emoji]);
        sounds.playTick?.();
        setWarningMsg('');
    };

    const handleBackspace = () => {
        if (disabled || selectedEmojis.length === 0) return;
        setSelectedEmojis((prev) => prev.slice(0, -1));
        sounds.playTick?.();
    };

    const handleClear = () => {
        if (disabled || selectedEmojis.length === 0) return;
        setSelectedEmojis([]);
        sounds.playTick?.();
    };

    const handleSend = (e) => {
        e?.preventDefault();
        if (disabled || selectedEmojis.length === 0) return;

        const clueString = selectedEmojis.join(' ');
        onDropClue(clueString);
        setSelectedEmojis([]);
        setWarningMsg('');
        sounds.playClue?.();
    };

    // Keyboard controls applied ONLY to the clue box (Backspace, Enter, or blocking words/letters)
    // NOTE: This does NOT intercept typing in the emoji search input!
    const handleClueBoxKeyDown = (e) => {
        if (e.key === 'Backspace') {
            e.preventDefault();
            handleBackspace();
        } else if (e.key === 'Enter') {
            e.preventDefault();
            handleSend();
        } else if (e.key.length === 1 && !e.ctrlKey && !e.metaKey && !e.altKey) {
            // Check if key is a letter, digit, or regular text character
            if (/[\p{Letter}\p{Number}\p{Punctuation}\p{Symbol}]/u.test(e.key) && !/\p{Extended_Pictographic}/u.test(e.key)) {
                e.preventDefault();
                setWarningMsg('🚫 Only emojis are allowed! Words and letters are strictly prohibited in clues.');
            }
        }
    };

    // Sanitize any pasted content into the clue box so only emojis remain
    const handlePaste = (e) => {
        e.preventDefault();
        const pastedText = e.clipboardData?.getData('text') || '';
        if (!pastedText) return;

        // Match all emojis in the pasted text
        const emojiMatches = pastedText.match(/(\p{Extended_Pictographic}|\p{Emoji_Presentation}|\u200d|\ufe0f|[\u{1F1E6}-\u{1F1FF}]|[\u{1F3FB}-\u{1F3FF}])/gu);

        if (emojiMatches && emojiMatches.length > 0) {
            const hadText = /[\p{Letter}\p{Number}]/u.test(pastedText);
            setSelectedEmojis((prev) => [...prev, ...emojiMatches]);
            if (hadText) {
                setWarningMsg('⚠️ Text was stripped. Only emoji characters were added.');
            }
        } else {
            setWarningMsg('🚫 Only emojis can be pasted! Words and text are blocked.');
        }
    };

    return (
        <div className="emoji-keyboard-container">
            {/* Header info badge */}
            <div className="emoji-keyboard-header">
                <div className="keyboard-header-title">
                    <Sparkles size={16} className="sparkle-amber" />
                    <span>ACTOR EMOJI BOARD</span>
                </div>
                <div className="emoji-only-pill">
                    <ShieldCheck size={14} />
                    <span>Emojis Only • Words Disabled</span>
                </div>
            </div>

            {/* Clue Composer Display Bar */}
            <div className="clue-composer-bar">
                <div
                    className={`clue-display-box ${selectedEmojis.length === 0 ? 'empty' : ''}`}
                    tabIndex={0}
                    onKeyDown={handleClueBoxKeyDown}
                    onPaste={handlePaste}
                    title="Click emojis below to build your clue"
                >
                    <span className="clue-input-prefix">💡 Clue:</span>

                    {selectedEmojis.length === 0 ? (
                        <span className="clue-placeholder-text">
                            Click emojis from the keyboard below to compose your hint...
                        </span>
                    ) : (
                        <div className="selected-emojis-row">
                            {selectedEmojis.map((emoji, idx) => (
                                <span key={idx} className="draft-emoji-badge pop-in">
                                    {emoji}
                                </span>
                            ))}
                        </div>
                    )}

                    {/* Quick backspace & clear controls */}
                    {selectedEmojis.length > 0 && (
                        <div className="clue-quick-actions">
                            <button
                                type="button"
                                onClick={handleBackspace}
                                className="composer-icon-btn"
                                title="Remove last emoji (Backspace)"
                                disabled={disabled}
                            >
                                <Delete size={18} />
                            </button>
                            <button
                                type="button"
                                onClick={handleClear}
                                className="composer-icon-btn clear-btn"
                                title="Clear all emojis"
                                disabled={disabled}
                            >
                                <Trash2 size={16} />
                            </button>
                        </div>
                    )}
                </div>

                <button
                    type="button"
                    onClick={handleSend}
                    disabled={disabled || selectedEmojis.length === 0}
                    className="drop-clue-btn"
                >
                    <Send size={16} />
                    <span>Drop Clue {selectedEmojis.length > 0 ? `(${selectedEmojis.length})` : ''}</span>
                </button>
            </div>

            {/* Warning Banner if user tries typing text/letters into clue area */}
            {warningMsg && (
                <div className="clue-warning-banner pop-in">
                    <AlertTriangle size={15} />
                    <span>{warningMsg}</span>
                </div>
            )}

            {/* Full Unicode Emoji Keyboard with Search (Search allows free typing to filter emojis) */}
            <div className="full-emoji-picker-wrapper">
                <EmojiPicker
                    onEmojiClick={(emojiData) => handleAddEmoji(emojiData.emoji)}
                    theme={Theme.LIGHT}
                    emojiStyle={EmojiStyle.NATIVE}
                    searchDisabled={false}
                    searchPlaceHolder="Search all emojis (e.g. ship, ghost, ring, fire, animal)..."
                    width="100%"
                    height={270}
                    lazyLoadEmojis={true}
                    skinTonesDisabled={false}
                    previewConfig={{
                        showPreview: false
                    }}
                />
            </div>
        </div>
    );
}
