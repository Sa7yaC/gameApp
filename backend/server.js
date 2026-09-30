import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import { initDatabases } from './config/db.js';
import roomRoutes from './routes/room.routes.js';
import { initSocket } from './sockets/socketHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(bodyParser.json());
app.use(roomRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: '*',
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
