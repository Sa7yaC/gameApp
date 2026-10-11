import React from 'react';

/* ============================================================
   CUTE MASCOT AVATARS
   Playful blob characters in the style of modern app mascots:
   pastel gradient tile + simple dot-eye face features.
   Deterministically picked from the player's name.
   ============================================================ */

const NAVY = '#2A2350';

function buildUid() {
    try {
        return React.useId().replace(/[^a-zA-Z0-9_-]/g, '');
    } catch {
        return Math.random().toString(36).slice(2, 8);
    }
}

function Eyes({ cx = 50, gap = 8, y = 48, color = NAVY, r = 3.4 }) {
    return (
        <>
            <circle cx={cx - gap} cy={y} r={r} fill={color} />
            <circle cx={cx + gap} cy={y} r={r} fill={color} />
        </>
    );
}

/* Each mascot receives `id` (unique per avatar instance) to build its own gradient ids.
   All draw inside the 0–100 tile with the pastel background circle already painted. */
const MASCOTS = [
    /* 0 — pink bear */
    function Bear({ id }) {
        return (
            <g>
                <defs>
                    <linearGradient id={`b-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#FFB3DC" />
                        <stop offset="1" stopColor="#F97ABA" />
                    </linearGradient>
                </defs>
                <circle cx="30" cy="24" r="12" fill="#FF9CCF" />
                <circle cx="70" cy="24" r="12" fill="#FF9CCF" />
                <rect x="22" y="26" width="56" height="60" rx="27" fill={`url(#b-${id})`} />
                <ellipse cx="50" cy="71" rx="16" ry="10" fill="#FF8CC6" opacity="0.5" />
                <ellipse cx="48" cy="58" rx="9" ry="6" fill="#FFD3EA" />
                <circle cx="48.5" cy="55.5" r="2.6" fill="#D9569A" />
                <path d="M44.5 61.5 Q48.5 65 52.5 61.5" stroke={NAVY} strokeWidth="2.4" fill="none" strokeLinecap="round" />
                <Eyes gap={8} y={48} r={3.5} />
                <ellipse cx="33" cy="57" rx="4" ry="2.6" fill="#FF72B5" opacity="0.65" />
                <ellipse cx="67" cy="57" rx="4" ry="2.6" fill="#FF72B5" opacity="0.65" />
                <ellipse cx="40" cy="35" rx="10" ry="5.5" fill="#fff" opacity="0.35" />
            </g>
        );
    },
    /* 1 — mint duckling */
    function Duck({ id }) {
        return (
            <g>
                <defs>
                    <linearGradient id={`b-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#FFFFFF" />
                        <stop offset="1" stopColor="#FFF3DC" />
                    </linearGradient>
                </defs>
                <g transform="rotate(-8 42 30)"><ellipse cx="42" cy="29" rx="9" ry="4.5" fill="#FFFDF4" /></g>
                <g transform="rotate(8 58 30)"><ellipse cx="58" cy="29" rx="9" ry="4.5" fill="#FFFDF4" /></g>
                <ellipse cx="50" cy="27" rx="9" ry="6" fill="#FFFDF4" />
                <rect x="29" y="31" width="42" height="57" rx="21" fill={`url(#b-${id})`} />
                <circle cx="42" cy="48" r="3.2" fill="#423A2F" />
                <circle cx="58" cy="48" r="3.2" fill="#423A2F" />
                <path d="M42 53 h16 a4.2 4.2 0 0 1 0 8.4 h-16 a4.2 4.2 0 0 1 0 -8.4 Z" fill="#FF9431" />
                <path d="M44 57 h12.6" stroke="#F07012" strokeWidth="1.8" strokeLinecap="round" />
                <ellipse cx="37" cy="60" rx="3.6" ry="2.4" fill="#9BE8D3" opacity="0.9" />
                <ellipse cx="63" cy="60" rx="3.6" ry="2.4" fill="#9BE8D3" opacity="0.9" />
                <ellipse cx="46" cy="38" rx="10" ry="5" fill="#fff" opacity="0.5" />
            </g>
        );
    },
    /* 2 — purple wink blob */
    function Wink({ id }) {
        return (
            <g>
                <defs>
                    <linearGradient id={`b-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#CBBBFF" />
                        <stop offset="1" stopColor="#A98CFF" />
                    </linearGradient>
                </defs>
                <rect x="20" y="30" width="60" height="56" rx="28" fill={`url(#b-${id})`} />
                <circle cx="41" cy="48" r="3.6" fill="#33215A" />
                <path d="M55 44 l9 4.5 l-9 4.5 Z" fill="#33215A" />
                <path d="M41 57 A9.5 9.5 0 0 0 59 57 Z" fill="#33215A" />
                <ellipse cx="50" cy="59.5" rx="4" ry="2.4" fill="#FF85AC" />
                <ellipse cx="30" cy="58" rx="4" ry="2.6" fill="#BFA8FF" opacity="0.9" />
                <ellipse cx="70" cy="58" rx="4" ry="2.6" fill="#BFA8FF" opacity="0.9" />
                <path d="M30 33 Q34 28 40 29" stroke="#FDFF8E" strokeWidth="3" fill="none" strokeLinecap="round" />
                <ellipse cx="45" cy="38" rx="11" ry="5" fill="#fff" opacity="0.35" />
            </g>
        );
    },
    /* 3 — orange cat */
    function Cat({ id }) {
        return (
            <g>
                <defs>
                    <linearGradient id={`b-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#FFBB58" />
                        <stop offset="1" stopColor="#F98D25" />
                    </linearGradient>
                </defs>
                <path d="M30 28 L27 13 Q40 16 43 24 Z" fill="#FF9E3D" />
                <path d="M70 28 L73 13 Q60 16 57 24 Z" fill="#FF9E3D" />
                <path d="M31.5 25 L30.5 19.5 Q36 21 37.5 24.5 Z" fill="#FFE9E0" />
                <path d="M68.5 25 L69.5 19.5 Q64 21 62.5 24.5 Z" fill="#FFE9E0" />
                <rect x="22" y="28" width="56" height="58" rx="24" fill={`url(#b-${id})`} />
                <ellipse cx="50" cy="64" rx="12" ry="8" fill="#FFF6E6" />
                <Eyes gap={10} y={51} color="#3E2E1E" r={3.5} />
                <path d="M48 57.5 L50 60.2 L52 57.5 Z" fill="#E2572B" />
                <path d="M46 63 Q48 65 50 63 Q52 65 54 63" stroke="#3E2E1E" strokeWidth="1.9" fill="none" strokeLinecap="round" />
                <circle cx="30" cy="59" r="1.1" fill="#3E2E1E" opacity="0.7" />
                <circle cx="32.5" cy="63" r="1.1" fill="#3E2E1E" opacity="0.7" />
                <circle cx="70" cy="59" r="1.1" fill="#3E2E1E" opacity="0.7" />
                <circle cx="67.5" cy="63" r="1.1" fill="#3E2E1E" opacity="0.7" />
                <ellipse cx="30" cy="67" rx="4" ry="2.6" fill="#FF8A5B" opacity="0.75" />
                <ellipse cx="70" cy="67" rx="4" ry="2.6" fill="#FF8A5B" opacity="0.75" />
                <ellipse cx="45" cy="36" rx="11" ry="5.5" fill="#fff" opacity="0.4" />
            </g>
        );
    },
    /* 4 — blue droplet */
    function Drop({ id }) {
        return (
            <g>
                <defs>
                    <linearGradient id={`b-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#8CC9FF" />
                        <stop offset="1" stopColor="#5AA4FF" />
                    </linearGradient>
                </defs>
                <path d="M50 16 C63 30 74 42 74 58 A24 25 0 1 1 26 58 C26 42 37 30 50 16 Z" fill={`url(#b-${id})`} />
                <ellipse cx="40" cy="40" rx="9" ry="6" fill="#fff" opacity="0.4" transform="rotate(-30 40 40)" />
                <Eyes gap={8} y={55} color="#23407B" r={3.5} />
                <path d="M44.5 64 Q50 69.5 55.5 64" stroke="#23407B" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                <ellipse cx="31" cy="64" rx="4" ry="2.6" fill="#58A0F5" opacity="0.8" />
                <ellipse cx="69" cy="64" rx="4" ry="2.6" fill="#58A0F5" opacity="0.8" />
            </g>
        );
    },
    /* 5 — flame buddy */
    function Flame({ id }) {
        return (
            <g>
                <defs>
                    <linearGradient id={`b-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#FF8A57" />
                        <stop offset="1" stopColor="#F24C1E" />
                    </linearGradient>
                </defs>
                <path
                    d="M50 12 C57 25 76 29 76 52 C76 69 64 82 50 82 C36 82 24 69 24 52 C24 37 36 32 41 22 C44 28 48 27 50 22 Z"
                    fill={`url(#b-${id})`}
                />
                <path d="M50 34 C56 42 64 46 64 57 A14 16 0 1 1 36 57 C36 46 44 42 50 34 Z" fill="#FF9E6B" opacity="0.45" />
                <ellipse cx="41" cy="50" rx="7.5" ry="9" fill="#FFFFFF" />
                <ellipse cx="61" cy="50" rx="7.5" ry="9" fill="#FFFFFF" />
                <circle cx="42.5" cy="52" r="3.6" fill="#402B22" />
                <circle cx="62.5" cy="52" r="3.6" fill="#402B22" />
                <circle cx="41" cy="49.5" r="1.2" fill="#fff" />
                <circle cx="61" cy="49.5" r="1.2" fill="#fff" />
                <path d="M46 68 Q50 71 54 68" stroke="#AB3512" strokeWidth="2.4" fill="none" strokeLinecap="round" />
                <ellipse cx="30" cy="64" rx="3.6" ry="2.4" fill="#F97645" opacity="0.8" />
                <ellipse cx="70" cy="64" rx="3.6" ry="2.4" fill="#F97645" opacity="0.8" />
            </g>
        );
    },
    /* 6 — lime bolt (plus-eye) */
    function Bolt({ id }) {
        return (
            <g>
                <defs>
                    <linearGradient id={`b-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#EDF9B2" />
                        <stop offset="1" stopColor="#BFE94E" />
                    </linearGradient>
                </defs>
                <circle cx="50" cy="50" r="34" fill={`url(#b-${id})`} />
                <circle cx="37" cy="45" r="5" fill="#2A2A55" />
                <rect x="62.4" y="37" width="5.2" height="17.5" rx="2.6" fill="#2A2A55" />
                <rect x="56" y="43.4" width="18" height="5.2" rx="2.6" fill="#2A2A55" />
                <path d="M36 60 Q50 74 64 60" stroke="#2A2A55" strokeWidth="5.5" fill="none" strokeLinecap="round" />
                <ellipse cx="37" cy="34" rx="10" ry="5" fill="#fff" opacity="0.4" />
            </g>
        );
    },
    /* 7 — teal robo-kid */
    function Robo({ id }) {
        return (
            <g>
                <defs>
                    <linearGradient id={`b-${id}`} x1="0" y1="0" x2="0" y2="1">
                        <stop stopColor="#F6FEFB" />
                        <stop offset="1" stopColor="#C8F2E6" />
                    </linearGradient>
                </defs>
                <line x1="50" y1="19" x2="50" y2="9" stroke="#F2FDF9" strokeWidth="3" strokeLinecap="round" />
                <circle cx="50" cy="7.5" r="4.5" fill="#FFD34E" />
                <circle cx="31" cy="32" r="4.5" fill="#F2FDF9" />
                <circle cx="69" cy="32" r="4.5" fill="#F2FDF9" />
                <path d="M25 79 C25 44 38 27 50 27 C62 27 75 44 75 79 Z" fill={`url(#b-${id})`} />
                <rect x="36" y="48" width="8" height="11" rx="3.5" fill="#2A2A55" />
                <rect x="56" y="48" width="8" height="11" rx="3.5" fill="#2A2A55" />
                <path d="M42 67 Q50 72 58 67" stroke="#2A2A55" strokeWidth="2.6" fill="none" strokeLinecap="round" />
                <ellipse cx="31" cy="70" rx="4" ry="2.6" fill="#7BD8C9" opacity="0.85" />
                <ellipse cx="69" cy="70" rx="4" ry="2.6" fill="#7BD8C9" opacity="0.85" />
                <ellipse cx="45" cy="35" rx="10" ry="4.5" fill="#fff" opacity="0.5" />
            </g>
        );
    }
];

const BG_GRADIENTS = [
    ['#FFE4F1', '#FFAED6'],
    ['#6BF2D2', '#2BC9A6'],
    ['#CDBBFF', '#8F6FFC'],
    ['#FFF2D2', '#FFC64A'],
    ['#D2EBFF', '#5FA9FF'],
    ['#FFDCC5', '#FF8250'],
    ['#E3FA7E', '#A2D830'],
    ['#99EBDE', '#3CC4B3']
];

function hashName(name) {
    let hash = 0;
    const clean = (name || 'player').toLowerCase();
    for (let i = 0; i < clean.length; i++) {
        hash = (hash * 31 + clean.charCodeAt(i)) % 1000003;
    }
    return hash;
}

export function PlayerAvatar({ name = '', size = 42, className = '' }) {
    const uid = buildUid();
    const hash = hashName(name);
    const idx = hash % MASCOTS.length;
    const Mascot = MASCOTS[idx];
    const tileId = `t-${uid}-${idx}`;
    const bodyId = `m-${uid}-${idx}`;
    const [c1, c2] = BG_GRADIENTS[idx];

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 100 100"
            className={className}
            role="img"
            aria-label={`${name} avatar`}
        >
            <defs>
                <linearGradient id={tileId} x1="0" y1="0" x2="0.6" y2="1">
                    <stop stopColor={c1} />
                    <stop offset="1" stopColor={c2} />
                </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill={`url(#${tileId})`} />
            <Mascot id={bodyId} />
        </svg>
    );
}

export default PlayerAvatar;
