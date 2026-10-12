import React from 'react';

function hashName(name) {
    let hash = 0;
    const clean = (name || 'player').toLowerCase();
    for (let i = 0; i < clean.length; i++) {
        hash = (hash * 31 + clean.charCodeAt(i)) % 1000003;
    }
    return hash;
}

export function PlayerAvatar({ name = '', size = 42, className = '', avatarIndex }) {
    const fallbackIndex = hashName(name) % 15;
    const index = Number.isInteger(avatarIndex) && avatarIndex >= 0 && avatarIndex < 15
        ? avatarIndex
        : fallbackIndex;

    return (
        <img
            src={`/avatars/avatar-${String(index + 1).padStart(2, '0')}.png`}
            width={size}
            height={size}
            className={className}
            role="img"
            aria-label={`${name} avatar`}
            draggable={false}
        />
    );
}

export default PlayerAvatar;
