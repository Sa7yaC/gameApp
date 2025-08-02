// controllers/room.controller.js
import generateRoomId from '../utils/generateRoom.js';
import gameApp from '../models/room.model.js';

export const createRoom = async (req, res) => {
    const { userId } = req.body;
    const roomId = generateRoomId();

    try {
        await gameApp.create({ roomName: roomId });
        console.log(`Room ${roomId} created by user ${userId}`);
        res.status(200).json({ success: true, roomId });
    } catch (err) {
        console.error('Error creating room:', err);
        res.status(500).json({ success: false, error: 'Internal Server Error' });
    }
};

export const joinRoom = async (req, res) => {
    const { roomId } = req.body;
    const room = await gameApp.findOne({ roomName: roomId });

    if (!room) {
        return res.status(404).json({ success: false, message: "Room not found" });
    }

    res.status(200).json({ success: true, roomId });
};
