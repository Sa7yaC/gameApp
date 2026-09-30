import express from 'express';
import { createRoom, joinRoom, getRoom } from '../controllers/room.controller.js';

const router = express.Router();

router.post('/createRoom', createRoom);
router.post('/joinRoom', joinRoom);
router.get('/room/:roomId', getRoom);

export default router;
