const configuredBackendUrl = import.meta.env.VITE_BACKEND_URL?.trim();
const backendUrl = configuredBackendUrl ||
    (import.meta.env.PROD
        ? 'https://emojicharades.onrender.com'
        : 'http://localhost:3001');

const BACKEND_URL = (backendUrl.startsWith('//')
    ? `https:${backendUrl}`
    : /^[a-z][a-z\d+.-]*:\/\//i.test(backendUrl)
        ? backendUrl
        : `https://${backendUrl}`
).replace(/\/+$/, '');

export default BACKEND_URL;
