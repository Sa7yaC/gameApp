import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { Search, Send, Trash2, AlertTriangle, X, ChevronLeft, ChevronRight } from 'lucide-react';
import GameIcon from './GameIcon';
import sounds from '../utils/soundEffects';
import { FALLBACK_EMOJI_CATEGORIES } from '../utils/emojiData';
import BACKEND_URL from '../config/backend';

const EMOJI_LS_KEY = 'charades_emoji_data_v3';
const PAGE_SIZE = 120;   // emojis rendered per chunk (keeps DOM light while scrolling)
const SEARCH_CAP = 72;

/* Module-level cache: fetched once per session, persisted in localStorage */
let emojiDataCache = null;

export default function EmojiKeyboard({ onDropClue, disabled }) {
    // Selected emojis are stored in an array for clean manipulation
    const [selectedEmojis, setSelectedEmojis] = useState([]);
    const [warningMsg, setWarningMsg] = useState('');
    const [categories, setCategories] = useState(emojiDataCache?.categories || FALLBACK_EMOJI_CATEGORIES);
    const [activeCatId, setActiveCatId] = useState('people');
    const [search, setSearch] = useState('');
    const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
    const gridRef = useRef(null);
    const sentinelRef = useRef(null);
    const tablistRef = useRef(null);
    const [tabArrows, setTabArrows] = useState({ left: false, right: false });

    /* ---------- dataset: localStorage → backend (Redis) → curated fallback ---------- */
    useEffect(() => {
        let alive = true;
        let attempts = 0;
        let retryTimer = null;

        const isFullSet = (cats) => Array.isArray(cats) && cats.length >= 8;

        const apply = (cats) => {
            emojiDataCache = { version: 'v3', categories: cats };
            try { localStorage.setItem(EMOJI_LS_KEY, JSON.stringify(emojiDataCache)); } catch { /* quota */ }
            if (alive) setCategories(cats);
        };

        // Already have the full set in memory?
        if (isFullSet(emojiDataCache?.categories)) {
            setCategories(emojiDataCache.categories);
            return;
        }

        // localStorage (instant, survives reloads)
        try {
            const ls = localStorage.getItem(EMOJI_LS_KEY);
            if (ls) {
                const parsed = JSON.parse(ls);
                if (isFullSet(parsed?.categories)) {
                    emojiDataCache = parsed;
                    setCategories(parsed.categories);
                    return;
                }
            }
        } catch { /* corrupted cache — refetch */ }

        // Backend fetch with retries (self-heals if the server starts after this page)
        const attempt = () => {
            if (!alive) return;
            attempts += 1;
            axios.get(`${BACKEND_URL}/emojis`, { timeout: 5000 })
                .then((res) => {
                    const cats = res.data?.categories;
                    if (alive && isFullSet(cats)) apply(cats);
                })
                .catch(() => {
                    if (alive && attempts < 5) {
                        retryTimer = setTimeout(attempt, 2000 * attempts);
                    }
                });
        };
        attempt();

        return () => {
            alive = false;
            if (retryTimer) clearTimeout(retryTimer);
        };
    }, []);

    // Clear warning after 3.5s
    useEffect(() => {
        if (!warningMsg) return;
        const timer = setTimeout(() => setWarningMsg(''), 3500);
        return () => clearTimeout(timer);
    }, [warningMsg]);

    // Reset chunked rendering whenever the category or search changes
    useEffect(() => {
        setVisibleCount(PAGE_SIZE);
        if (gridRef.current) gridRef.current.scrollTop = 0;
    }, [activeCatId, search]);

    /* ---------- category tablist carousel arrows ---------- */
    const updateTabArrows = () => {
        const el = tablistRef.current;
        if (!el) {
            setTabArrows({ left: false, right: false });
            return;
        }
        const scrollable = el.scrollWidth > el.clientWidth + 4;
        setTabArrows({
            left: scrollable && el.scrollLeft > 4,
            right: scrollable && el.scrollLeft < el.scrollWidth - el.clientWidth - 4
        });
    };

    useEffect(() => {
        updateTabArrows();
        const el = tablistRef.current;
        if (!el) return;
        el.addEventListener('scroll', updateTabArrows, { passive: true });
        const ro = new ResizeObserver(updateTabArrows);
        ro.observe(el);
        return () => {
            el.removeEventListener('scroll', updateTabArrows);
            ro.disconnect();
        };
    }, [categories, activeCatId]);

    const scrollTabs = (dir) => {
        const el = tablistRef.current;
        if (!el) return;
        el.scrollBy({ left: dir * Math.max(160, el.clientWidth * 0.6), behavior: 'smooth' });
        sounds.playTick?.();
    };

    /* ---------- handlers (unchanged game logic) ---------- */
    const handleAddEmoji = (emoji) => {
        if (disabled) return;
        setSelectedEmojis((prev) => {
            if (prev.length >= 24) {
                setWarningMsg('⚠️ Maximum 24 emojis per clue!');
                return prev;
            }
            setWarningMsg('');
            return [...prev, emoji];
        });
        sounds.playTick?.();
    };

    const handleRemoveAt = (idx) => {
        if (disabled) return;
        setSelectedEmojis((prev) => prev.filter((_, i) => i !== idx));
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

    /* ---------- visible emojis: search (all categories) or active category chunk ---------- */
    const query = search.trim().toLowerCase();
    let visibleEmojis;
    if (query) {
        visibleEmojis = categories
            .flatMap((cat) => cat.emojis.filter((item) => item.n.includes(query)))
            .slice(0, SEARCH_CAP);
    } else {
        const cat = categories.find((c) => c.id === activeCatId) || categories[0];
        visibleEmojis = (cat?.emojis || []).slice(0, visibleCount);
    }
    const totalInScope = query
        ? Math.min(SEARCH_CAP, categories.reduce((acc, c) => acc + c.emojis.filter((i) => i.n.includes(query)).length, 0))
        : (categories.find((c) => c.id === activeCatId)?.emojis.length || 0);
    const hasMore = visibleEmojis.length < totalInScope;

    // Lazy-load more emojis as the grid scrolls near its end
    useEffect(() => {
        if (!hasMore) return;
        const sentinel = sentinelRef.current;
        const grid = gridRef.current;
        if (!sentinel || !grid) return;

        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting) {
                    setVisibleCount((c) => c + PAGE_SIZE);
                }
            },
            { root: grid, rootMargin: '120px' }
        );
        observer.observe(sentinel);
        return () => observer.disconnect();
    }, [hasMore, visibleEmojis.length]);

    return (
        <div className="gs-emoji-keyboard">
            {/* Category tabs carousel + pinned search on the right */}
            <div className="gs-emoji-header">
                <button
                    type="button"
                    className={`gs-carousel-btn${tabArrows.left ? '' : ' is-hidden'}`}
                    onClick={() => scrollTabs(-1)}
                    aria-label="Scroll categories left"
                >
                    <ChevronLeft size={15} strokeWidth={3} />
                </button>

                <div className="gs-emoji-tablist" ref={tablistRef}>
                    {categories.map((cat) => (
                        <button
                            key={cat.id}
                            type="button"
                            className={`gs-emoji-tab${!query && cat.id === activeCatId ? ' active' : ''}`}
                            onClick={() => { setActiveCatId(cat.id); setSearch(''); }}
                            title={cat.label}
                        >
                            <GameIcon
                                name={cat.icon}
                                size={18}
                                alt=""
                                fallback={<span className="gs-emoji-tab-emoji">{cat.emoji}</span>}
                            />
                            <span>{cat.label}</span>
                        </button>
                    ))}
                </div>

                <button
                    type="button"
                    className={`gs-carousel-btn${tabArrows.right ? '' : ' is-hidden'}`}
                    onClick={() => scrollTabs(1)}
                    aria-label="Scroll categories right"
                >
                    <ChevronRight size={15} strokeWidth={3} />
                </button>

                <div className="gs-emoji-search">
                    <GameIcon name="cat-search" size={14} alt="" fallback={<Search size={14} />} />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search emojis..."
                        maxLength={30}
                        aria-label="Search emojis"
                    />
                </div>
            </div>

            {/* Fast, chunk-rendered emoji grid */}
            <div className="gs-emoji-grid" ref={gridRef}>
                {visibleEmojis.map((item, idx) => (
                    <button
                        key={`${item.e}-${idx}`}
                        type="button"
                        className="gs-emoji-cell"
                        onClick={() => handleAddEmoji(item.e)}
                        disabled={disabled}
                        title={item.n}
                    >
                        {item.e}
                    </button>
                ))}
                {visibleEmojis.length === 0 && (
                    <span className="gs-emoji-none">No emojis found for “{query}”</span>
                )}
                {hasMore && <div ref={sentinelRef} className="gs-emoji-sentinel" />}
            </div>

            {/* Selected clue strip */}
            <div className="gs-selected-row">
                <span className="gs-selected-label">
                    {selectedEmojis.length > 0 ? `Selected (${selectedEmojis.length})` : 'Selected'}
                </span>

                <div className="gs-selected-tiles">
                    {selectedEmojis.length === 0 ? (
                        <span className="gs-selected-empty">Tap an emoji above to build your clue…</span>
                    ) : (
                        selectedEmojis.map((emoji, idx) => (
                            <button
                                key={`se-${idx}`}
                                type="button"
                                className="gs-selected-tile"
                                onClick={() => handleRemoveAt(idx)}
                                disabled={disabled}
                                title="Remove this emoji"
                            >
                                <span>{emoji}</span>
                                <X className="gs-tile-x" size={11} strokeWidth={3} />
                            </button>
                        ))
                    )}
                </div>

                {selectedEmojis.length > 0 && (
                    <button
                        type="button"
                        className="gs-clear-btn"
                        onClick={handleClear}
                        disabled={disabled}
                        title="Clear all selected emojis"
                    >
                        <Trash2 size={15} />
                    </button>
                )}

                <button
                    type="button"
                    className="gs-send-emoji-btn"
                    onClick={handleSend}
                    disabled={disabled || selectedEmojis.length === 0}
                >
                    <Send size={16} />
                    <span>Send Emoji</span>
                </button>
            </div>

            {/* Warning banner when the clue limit is hit */}
            {warningMsg && (
                <div className="gs-emoji-warning">
                    <AlertTriangle size={15} />
                    <span>{warningMsg}</span>
                </div>
            )}
        </div>
    );
}
