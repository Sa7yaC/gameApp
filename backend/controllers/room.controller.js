import generateRoomId from '../utils/generateRoom.js';
import { generateNordpassUsername } from '../utils/nordpassUsername.js';
import { pgPool, redisClient } from '../config/db.js';

// In-memory fallback if DB is unavailable
export const memoryRooms = new Map();

export const createRoom = async (req, res) => {
    const { userId, username, settings } = req.body;
    const providedName = (username || userId || '').trim();
    const hostName = providedName || generateNordpassUsername();
    const roomId = generateRoomId();

    const roomSettings = {
        difficulty: settings?.difficulty || 'easy',
        languages: settings?.languages || ['Bollywood'],
        totalRounds: settings?.totalRounds || 3,
        guessingTime: settings?.guessingTime || 90
    };

    try {
        // Save in PostgreSQL
        try {
            await pgPool.query(
                `INSERT INTO rooms (room_id, host_id, host_name, settings, status)
                 VALUES ($1, $2, $3, $4, $5)`,
                [roomId, hostName, hostName, JSON.stringify(roomSettings), 'lobby']
            );
        } catch (dbErr) {
            console.warn('PostgreSQL save failed, using memory fallback:', dbErr.message);
        }

        // Save in Redis
        try {
            await redisClient.set(
                `room:${roomId}:meta`,
                JSON.stringify({
                    roomId,
                    hostName,
                    settings: roomSettings,
                    status: 'lobby',
                    createdAt: new Date().toISOString()
                }),
                'EX',
                86400 // 24 hours
            );
        } catch (redisErr) {
            console.warn('Redis save failed:', redisErr.message);
        }

        // Memory fallback backup
        memoryRooms.set(roomId, {
            roomId,
            hostName,
            settings: roomSettings,
            status: 'lobby',
            createdAt: new Date()
        });

        console.log(`[API] Room "${roomId}" created by host "${hostName}"`);
        return res.status(200).json({ success: true, roomId, hostName, settings: roomSettings });
    } catch (err) {
        console.error('Error creating room:', err);
        return res.status(500).json({ success: false, error: 'Failed to create room' });
    }
};

export const joinRoom = async (req, res) => {
    const { roomId } = req.body;
    if (!roomId) {
        return res.status(400).json({ success: false, message: 'Room code is required' });
    }

    const cleanRoomId = roomId.trim();

    try {
        let roomData = null;

        // Check Redis first (exact, lowercase, uppercase)
        try {
            let redisData = await redisClient.get(`room:${cleanRoomId}:meta`);
            if (!redisData) {
                redisData = await redisClient.get(`room:${cleanRoomId.toLowerCase()}:meta`);
            }
            if (!redisData) {
                redisData = await redisClient.get(`room:${cleanRoomId.toUpperCase()}:meta`);
            }
            if (redisData) {
                roomData = JSON.parse(redisData);
            }
        } catch (e) {
            // ignore redis error
        }

        // Check PostgreSQL with case-insensitive fallback
        if (!roomData) {
            try {
                const pgResult = await pgPool.query(
                    'SELECT * FROM rooms WHERE room_id = $1 OR LOWER(room_id) = LOWER($1) LIMIT 1',
                    [cleanRoomId]
                );
                if (pgResult.rows.length > 0) {
                    const row = pgResult.rows[0];
                    roomData = {
                        roomId: row.room_id,
                        hostName: row.host_name,
                        settings: row.settings,
                        status: row.status
                    };
                }
            } catch (e) {
                // ignore pg error
            }
        }

        // Check memory fallback
        if (!roomData) {
            if (memoryRooms.has(cleanRoomId)) {
                roomData = memoryRooms.get(cleanRoomId);
            } else {
                // Check case-insensitively in memory
                for (const [key, val] of memoryRooms.entries()) {
                    if (key.toLowerCase() === cleanRoomId.toLowerCase()) {
                        roomData = val;
                        break;
                    }
                }
            }
        }

        if (!roomData) {
            return res.status(404).json({ success: false, message: "Room doesn't exist. Please check the room code." });
        }

        return res.status(200).json({
            success: true,
            roomId: roomData.roomId,
            settings: roomData.settings,
            status: roomData.status
        });
    } catch (err) {
        console.error('Error joining room:', err);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};

export const getRoom = async (req, res) => {
    const { roomId } = req.params;
    const cleanRoomId = roomId?.trim();

    if (!cleanRoomId) {
        return res.status(400).json({ success: false, message: 'Room ID required' });
    }

    // Memory check
    for (const [key, val] of memoryRooms.entries()) {
        if (key === cleanRoomId || key.toLowerCase() === cleanRoomId.toLowerCase()) {
            return res.json({ success: true, room: val });
        }
    }

    try {
        const pgResult = await pgPool.query(
            'SELECT * FROM rooms WHERE room_id = $1 OR LOWER(room_id) = LOWER($1) LIMIT 1',
            [cleanRoomId]
        );
        if (pgResult.rows.length > 0) {
            return res.json({ success: true, room: pgResult.rows[0] });
        }
    } catch (e) {
        // ignore
    }

    return res.status(404).json({ success: false, message: 'Room not found' });
};
