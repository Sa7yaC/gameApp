const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ||
    (import.meta.env.PROD ? 'https://emojicharades.onrender.com' : 'http://localhost:3001');

export default BACKEND_URL;
