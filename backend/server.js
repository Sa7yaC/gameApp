// server.js
import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import { createServer } from 'node:http';
import { Server } from 'socket.io';
import connectDB from './config/db.js';
import roomRoutes from './routes/room.routes.js';
import { initSocket } from './sockets/socketHandler.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
}));

app.use(bodyParser.json());
app.use(roomRoutes);

const server = createServer(app);
const io = new Server(server, {
    cors: {
        origin: 'http://localhost:5173',
        methods: ['GET', 'POST']
    }
});

// Init DB
(async () => {
    try {
        await connectDB();
        console.log("DB Connected Successfully");
    } catch (err) {
        console.error("DB Connection Error:", err);
    }
})();

// Init Socket
initSocket(io);

server.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
