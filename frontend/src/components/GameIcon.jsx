import React, { useState } from 'react';

/* ============================================================
   GAME ICON LOADER
   3D-rendered icons live in  frontend/public/icons/<name>.png
   Drop the PNGs exported from the icon sheet in there and they
   appear automatically. Until a file exists, the built-in
   vector fallback keeps the UI intact.
   ============================================================ */

export const ICON_NAMES = [
    'create-room',   // people + plus badge
    'join-room',     // arrow into door
    'start-game',    // yellow play button
    'invite',        // share
    'copy',          // copy code
    'regenerate',    // circular refresh
    'ready',         // green check
    'not-ready',     // gray clock
    'current-turn',  // hourglass
    'room-full',     // people + minus
    'host-crown',    // gold crown badge
    'trophy',        // gold winner trophy
    'year',          // calendar
    'category',      // clapperboard
    'settings-rounds',
    'settings-timer',
    'settings-category',
    'settings-hints',
    'settings-main',
    'control-minus',
    'control-plus',
    'control-dropdown',
    'category-indian',
    'category-hollywood',
    'category-animated',
    'category-mixed',
    'movie-category-setting',
    'clue-first-placeholder',
    'hint-year',
    'hint-words',
    'hint-category',
    'round-flag',
    'turn-players',
    'info',           // blue info
    'settings',      // purple gear
    'help',          // question mark
    'home',          // house
    'leave',         // red exit
    'profile',       // person
    'movie',         // clapper + popcorn
    'popcorn', 'film-reel', 'theater-seat', 'ticket',
    'camera', 'glasses', 'director', 'star', 'film-strip', // decorative
    'cat-smileys', 'cat-animals', 'cat-food',        // emoji keyboard tabs
    'cat-activities', 'cat-travel', 'cat-objects',
    'cat-symbols', 'cat-flags', 'cat-search'
];

export default function GameIcon({ name, fallback, alt = '', className = '', size }) {
    const [failed, setFailed] = useState(false);

    // No name provided or PNG missing → built-in vector fallback
    if (failed || !name) {
        if (fallback) return fallback;
        return null;
    }

    return (
        <img
            src={`/icons/${name}.png`}
            alt={alt || name}
            width={size}
            height={size}
            className={`gi ${className}`}
            onError={() => setFailed(true)}
            draggable={false}
        />
    );
}
