// NordPass-Style Random Username Generator

const ADJECTIVES = [
    'Cosmic', 'Neon', 'Shadow', 'Velvet', 'Cyber', 'Silver', 'Golden', 'Astral',
    'Blaze', 'Mystic', 'Frost', 'Pixel', 'Solar', 'Echo', 'Thunder', 'Turbo',
    'Lucky', 'Zenith', 'Starlight', 'Quantum', 'Vortex', 'Crimson', 'Phantom',
    'Apex', 'Nova', 'Retro', 'Alpha', 'Brave', 'Epic', 'Hyper', 'Swift', 'Silent',
    'Iron', 'Radiant', 'Vivid', 'Electric', 'Dynamic', 'Infinite', 'Galactic', 'Fierce'
];

const NOUNS = [
    'Falcon', 'Runner', 'Tiger', 'Voyager', 'Wolf', 'Knight', 'Drifter', 'Fox',
    'Owl', 'Dragon', 'Ninja', 'Hawk', 'Viper', 'Otter', 'Raven', 'Wizard',
    'Beast', 'Specter', 'Phoenix', 'Samurai', 'Ranger', 'Panda', 'Cobra', 'Nomad',
    'Titan', 'Seeker', 'Cinephile', 'Clapper', 'Director', 'Star', 'Hunter', 'Captain'
];

/**
 * Generate a catchy, modern NordPass-style username
 * e.g., "CosmicFalcon42", "NeonDrifter", "ShadowKnight77"
 */
export function generateNordpassUsername() {
    const adj = ADJECTIVES[Math.floor(Math.random() * ADJECTIVES.length)];
    const noun = NOUNS[Math.floor(Math.random() * NOUNS.length)];
    const includeNumber = Math.random() > 0.4;
    const num = includeNumber ? Math.floor(Math.random() * 90 + 10) : '';
    return `${adj}${noun}${num}`;
}

export default generateNordpassUsername;
