import express from 'express';
import { redisClient } from '../config/db.js';
import { CURATED_EMOJI_CATEGORIES, EMOJI_DATA_VERSION } from '../utils/emojiData.js';

const router = express.Router();

const CACHE_KEY = `emojis:${EMOJI_DATA_VERSION}`;
const CACHE_TTL_SECONDS = 7 * 24 * 60 * 60; // 7 days

/**
 * GET /emojis
 * Curated emoji categories for the clue keyboard.
 * Served from Redis cache when available; falls back to the
 * bundled static dataset (so the game works even without Redis).
 */
router.get('/', async (req, res) => {
    // 1. Try Redis cache first
    try {
        if (redisClient && redisClient.status === 'ready') {
            const cached = await redisClient.get(CACHE_KEY);
            if (cached) {
                const categories = JSON.parse(cached);
                if (Array.isArray(categories) && categories.length > 0) {
                    return res.json({ success: true, source: 'redis', version: EMOJI_DATA_VERSION, categories });
                }
            }
        }
    } catch (err) {
        console.warn('[Emojis] Redis read failed, serving static dataset:', err.message);
    }

    // 2. Serve the static dataset and warm the cache
    const payload = { success: true, source: 'static', version: EMOJI_DATA_VERSION, categories: CURATED_EMOJI_CATEGORIES };

    try {
        if (redisClient && redisClient.status === 'ready') {
            await redisClient.set(CACHE_KEY, JSON.stringify(CURATED_EMOJI_CATEGORIES), 'EX', CACHE_TTL_SECONDS);
        }
    } catch (err) {
        console.warn('[Emojis] Redis cache warming failed:', err.message);
    }

    res.json(payload);
});

export default router;
