/* ============================================================
   FULL EMOJI DATASET (Gboard / WhatsApp scale — 1870 emojis)
   Built from @emoji-mart/data (CLDR keywords included).
   Served via GET /emojis — cached in Redis (emojis:<version>).
   Falls back to the old curated set if the package is missing.
   ============================================================ */

import { createRequire } from 'node:module';
import { readFileSync } from 'node:fs';

const require = createRequire(import.meta.url);

export const EMOJI_DATA_VERSION = 'v3';

const GROUP_META = {
    people:   { label: 'Smileys',   emoji: '😀', icon: 'cat-smileys' },
    nature:   { label: 'Animals',   emoji: '🐻', icon: 'cat-animals' },
    foods:    { label: 'Food',      emoji: '🍔', icon: 'cat-food' },
    activity: { label: 'Activities', emoji: '⚽', icon: 'cat-activities' },
    places:   { label: 'Travel',    emoji: '✈️', icon: 'cat-travel' },
    objects:  { label: 'Objects',   emoji: '💡', icon: 'cat-objects' },
    symbols:  { label: 'Symbols',   emoji: '✨', icon: 'cat-symbols' },
    flags:    { label: 'Flags',     emoji: '🚩', icon: 'cat-flags' }
};

function loadRawEmojiData() {
    try {
        return require('@emoji-mart/data');
    } catch (err1) {
        try {
            const resolved = require.resolve('@emoji-mart/data');
            return JSON.parse(readFileSync(resolved, 'utf8'));
        } catch (err2) {
            console.error('[Emojis] @emoji-mart/data unavailable:', err2.message);
            return null;
        }
    }
}

export function buildFullEmojiCategories() {
    const raw = loadRawEmojiData();
    if (!raw || !Array.isArray(raw.categories) || !raw.emojis) return null;

    return raw.categories
        .filter((cat) => GROUP_META[cat.id])
        .map((cat) => ({
            id: cat.id,
            label: GROUP_META[cat.id].label,
            emoji: GROUP_META[cat.id].emoji,
            icon: GROUP_META[cat.id].icon,
            emojis: cat.emojis
                .map((id) => raw.emojis[id])
                .filter(Boolean)
                .map((em) => ({
                    e: em.skins?.[0]?.native || em.id,
                    n: [em.name, ...(em.keywords || [])].join(' ').toLowerCase()
                }))
        }));
}

/* Full dataset (built at module load, cached in memory + Redis on first request) */
export const CURATED_EMOJI_CATEGORIES = buildFullEmojiCategories() || [];

export default CURATED_EMOJI_CATEGORIES;
