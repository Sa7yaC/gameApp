import test from 'node:test';
import assert from 'node:assert/strict';
import { normalizeEmojiClue } from './emojiClue.js';

test('accepts pictographs, joined emoji, flags, and keycaps', () => {
    assert.equal(normalizeEmojiClue('😀 👨‍👩‍👧‍👦'), '😀 👨‍👩‍👧‍👦');
    assert.equal(normalizeEmojiClue('🇮🇳'), '🇮🇳');
    assert.equal(normalizeEmojiClue('1️⃣'), '1️⃣');
});

test('rejects text, plain numbers, empty clues, and clues over the limit', () => {
    assert.equal(normalizeEmojiClue('😀 movie'), null);
    assert.equal(normalizeEmojiClue('123'), null);
    assert.equal(normalizeEmojiClue('   '), null);
    assert.equal(normalizeEmojiClue(Array(25).fill('😀').join(' ')), null);
});
