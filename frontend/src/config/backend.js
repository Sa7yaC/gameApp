const BACKEND_URL = import.meta.env.VITE_BACKEND_URL ||
    (import.meta.env.PROD
        ? 'https://emojicharades-lb-1059260862.ap-south-1.elb.amazonaws.com/'
        : 'http://localhost:3001');

export default BACKEND_URL;
