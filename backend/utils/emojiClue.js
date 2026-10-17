const segmenter = new Intl.Segmenter('en', { granularity: 'grapheme' });
const pictograph = String.raw`(?:\p{Emoji_Presentation}|\p{Extended_Pictographic})`;
const emojiSequence = new RegExp(
    String.raw`^${pictograph}(?:(?:\uFE0F)|(?:[\u{1F3FB}-\u{1F3FF}])|(?:\u200D${pictograph}(?:\uFE0F)?(?:[\u{1F3FB}-\u{1F3FF}])?))*[\u{E0020}-\u{E007E}]*\u{E007F}?$`,
    'u'
);
const flagSequence = /^(?:\p{Regional_Indicator}){2}$/u;
const keycapSequence = /^[#*0-9]\uFE0F?\u20E3$/u;

export function normalizeEmojiClue(value, maxEmojis = 24) {
    if (typeof value !== 'string') return null;

    const clue = value.trim().replace(/\s+/gu, ' ');
    if (!clue) return null;

    const emojis = [...segmenter.segment(clue)]
        .map(({ segment }) => segment)
        .filter((segment) => !/^\s+$/u.test(segment));

    if (
        emojis.length === 0 ||
        emojis.length > maxEmojis ||
        emojis.some((emoji) =>
            !emojiSequence.test(emoji) &&
            !flagSequence.test(emoji) &&
            !keycapSequence.test(emoji)
        )
    ) {
        return null;
    }

    return clue;
}
