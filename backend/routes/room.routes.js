// routes/room.routes.js
import express from 'express';
import { createRoom, joinRoom } from '../controllers/room.controller.js';

const router = express.Router();

router.post('/createRoom', createRoom);
router.post('/joinRoom', joinRoom);

export default router;
