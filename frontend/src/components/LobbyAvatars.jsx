import React from 'react';

export function PlayerAvatar({ name = '', size = 42, className = '' }) {
    const cleanName = (name || '').toLowerCase();

    // Custom hand-crafted cute cartoon avatars matching the game theme
    if (cleanName.includes('sa7ya') || cleanName.includes('host') || cleanName === 'cinema host') {
        // Sa7yaaa: Dark messy hair, friendly smile, yellow hoodie
        return (
            <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
                <circle cx="50" cy="50" r="48" fill="#FEF08A" />
                {/* Hoodie body */}
                <path d="M22 95 C22 72 35 68 50 68 C65 68 78 72 78 95 Z" fill="#FACC15" />
                <path d="M35 72 L50 84 L65 72 Z" fill="#EAB308" />
                {/* Neck & Face */}
                <rect x="44" y="60" width="12" height="14" rx="4" fill="#FDBA74" />
                <ellipse cx="50" cy="46" rx="22" ry="24" fill="#FED7AA" />
                {/* Hair */}
                <path d="M26 40 C26 22 36 16 50 16 C64 16 74 22 74 40 C70 32 62 26 50 26 C38 26 30 32 26 40 Z" fill="#1E293B" />
                <path d="M26 38 C28 30 36 24 44 26 C44 24 50 22 56 25 C62 24 70 30 74 38 C70 35 64 33 50 33 C36 33 30 35 26 38 Z" fill="#0F172A" />
                {/* Eyes */}
                <ellipse cx="42" cy="45" rx="3" ry="4" fill="#0F172A" />
                <ellipse cx="58" cy="45" rx="3" ry="4" fill="#0F172A" />
                <circle cx="43" cy="44" r="1" fill="#FFFFFF" />
                <circle cx="59" cy="44" r="1" fill="#FFFFFF" />
                {/* Smile */}
                <path d="M44 54 Q50 60 56 54" stroke="#C2410C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
        );
    }

    if (cleanName.includes('rahul')) {
        // Rahul07: Swept dark hair, blue polo shirt, bright smile
        return (
            <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
                <circle cx="50" cy="50" r="48" fill="#BFDBFE" />
                {/* Shirt */}
                <path d="M22 95 C22 72 35 68 50 68 C65 68 78 72 78 95 Z" fill="#3B82F6" />
                <path d="M42 68 L50 80 L58 68 Z" fill="#1D4ED8" />
                {/* Neck & Face */}
                <rect x="44" y="60" width="12" height="14" rx="4" fill="#FDBA74" />
                <ellipse cx="50" cy="46" rx="22" ry="24" fill="#FFEDD5" />
                {/* Hair */}
                <path d="M26 38 C26 22 36 15 52 15 C66 15 75 22 74 36 C68 28 60 22 48 22 C36 22 28 30 26 38 Z" fill="#18181B" />
                <path d="M30 26 C36 18 48 18 64 22 C56 22 46 24 38 28 Z" fill="#27272A" />
                {/* Eyes */}
                <ellipse cx="42" cy="45" rx="3" ry="4" fill="#18181B" />
                <ellipse cx="58" cy="45" rx="3" ry="4" fill="#18181B" />
                <circle cx="43" cy="44" r="1" fill="#FFFFFF" />
                <circle cx="59" cy="44" r="1" fill="#FFFFFF" />
                {/* Smile */}
                <path d="M43 55 Q50 61 57 55" stroke="#C2410C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
        );
    }

    if (cleanName.includes('aman')) {
        // Aman: Dark hair with beard, green shirt
        return (
            <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
                <circle cx="50" cy="50" r="48" fill="#BBF7D0" />
                {/* Shirt */}
                <path d="M22 95 C22 72 35 68 50 68 C65 68 78 72 78 95 Z" fill="#10B981" />
                {/* Neck & Face */}
                <rect x="44" y="60" width="12" height="14" rx="4" fill="#FDBA74" />
                <ellipse cx="50" cy="46" rx="22" ry="24" fill="#FED7AA" />
                {/* Beard */}
                <path d="M36 48 C36 64 42 68 50 68 C58 68 64 64 64 48 C60 52 56 55 50 55 C44 55 40 52 36 48 Z" fill="#18181B" />
                {/* Hair */}
                <path d="M26 36 C26 22 36 16 50 16 C64 16 74 22 74 36 C68 30 60 25 50 25 C40 25 32 30 26 36 Z" fill="#0F172A" />
                {/* Eyes */}
                <ellipse cx="42" cy="44" rx="3" ry="3.5" fill="#0F172A" />
                <ellipse cx="58" cy="44" rx="3" ry="3.5" fill="#0F172A" />
                {/* Smile */}
                <path d="M45 56 Q50 60 55 56" stroke="#FEF08A" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
        );
    }

    if (cleanName.includes('rohit')) {
        // Rohit: Smiling boy, neat hair, teal shirt
        return (
            <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
                <circle cx="50" cy="50" r="48" fill="#A5F3FC" />
                {/* Shirt */}
                <path d="M22 95 C22 72 35 68 50 68 C65 68 78 72 78 95 Z" fill="#06B6D4" />
                {/* Neck & Face */}
                <rect x="44" y="60" width="12" height="14" rx="4" fill="#FDBA74" />
                <ellipse cx="50" cy="46" rx="22" ry="24" fill="#FED7AA" />
                {/* Hair */}
                <path d="M26 38 C26 22 38 16 50 16 C62 16 74 22 74 38 C70 30 60 24 50 24 C40 24 30 30 26 38 Z" fill="#1E293B" />
                {/* Eyes */}
                <ellipse cx="42" cy="45" rx="3" ry="4" fill="#0F172A" />
                <ellipse cx="58" cy="45" rx="3" ry="4" fill="#0F172A" />
                <circle cx="43" cy="44" r="1" fill="#FFFFFF" />
                <circle cx="59" cy="44" r="1" fill="#FFFFFF" />
                {/* Smile */}
                <path d="M44 55 Q50 61 56 55" stroke="#C2410C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            </svg>
        );
    }

    // Default colorful cartoon avatar based on char code
    const colors = [
        { bg: '#FED7AA', shirt: '#F97316' },
        { bg: '#DDD6FE', shirt: '#8B5CF6' },
        { bg: '#FBCFE8', shirt: '#EC4899' },
        { bg: '#BAE6FD', shirt: '#0EA5E9' }
    ];
    const charCode = (name.charCodeAt(0) || 65) % colors.length;
    const theme = colors[charCode];

    return (
        <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
            <circle cx="50" cy="50" r="48" fill={theme.bg} />
            <path d="M22 95 C22 72 35 68 50 68 C65 68 78 72 78 95 Z" fill={theme.shirt} />
            <rect x="44" y="60" width="12" height="14" rx="4" fill="#FDBA74" />
            <ellipse cx="50" cy="46" rx="22" ry="24" fill="#FED7AA" />
            <path d="M26 38 C26 22 38 16 50 16 C62 16 74 22 74 38 C70 30 60 24 50 24 C40 24 30 30 26 38 Z" fill="#1E293B" />
            <ellipse cx="42" cy="45" rx="3" ry="4" fill="#0F172A" />
            <ellipse cx="58" cy="45" rx="3" ry="4" fill="#0F172A" />
            <circle cx="43" cy="44" r="1" fill="#FFFFFF" />
            <circle cx="59" cy="44" r="1" fill="#FFFFFF" />
            <path d="M44 55 Q50 61 56 55" stroke="#C2410C" strokeWidth="2.5" fill="none" strokeLinecap="round" />
        </svg>
    );
}
