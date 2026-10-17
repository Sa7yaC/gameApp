import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import { rateLimit } from 'express-rate-limit';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { initDatabases } from './config/db.js';
import roomRoutes from './routes/room.routes.js';
import emojiRoutes from './routes/emoji.routes.js';
import { initSocket } from './sockets/socketHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;
const allowedOrigins = new Set([
    'https://emojicharades.fun',
    ...(process.env.CORS_ALLOWED_ORIGINS || '')
        .split(',')
        .map((origin) => origin.trim())
        .filter(Boolean),
    ...(process.env.NODE_ENV === 'production' ? [] : ['http://localhost:5173'])
]);
const corsOrigin = (origin, callback) => {
    callback(null, !origin || allowedOrigins.has(origin));
};
const apiRateLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 120,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    skip: (req) => req.path === '/health' || req.path.startsWith('/socket.io')
});
const roomMutationRateLimit = rateLimit({
    windowMs: 60 * 1000,
    limit: 12,
    standardHeaders: 'draft-8',
    legacyHeaders: false,
    message: { success: false, message: 'Too many room requests. Please try again shortly.' }
});

app.set('trust proxy', 1);
app.use(helmet());
app.use(apiRateLimit);
app.use(cors({
    origin: corsOrigin,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(express.json({ limit: '16kb' }));
app.use(['/createRoom', '/joinRoom'], roomMutationRateLimit);
app.use(roomRoutes);
app.use('/emojis', emojiRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const server = createServer(app);
const io = new Server(server, {
    maxHttpBufferSize: 16 * 1024,
    cors: {
        origin: corsOrigin,
        methods: ['GET', 'POST']
    }
});

// Init Databases (PostgreSQL & Redis)
(async () => {
    try {
        await initDatabases();
    } catch (err) {
        console.error('Database Initialization Error:', err);
    }
})();

// Init Socket.io game state handler
initSocket(io);

server.listen(port, () => {
    console.log(`🚀 Emoji Movie Game Backend running at http://localhost:${port}`);
});
