import generateRoomId, { ROOM_CODE_PATTERN } from '../utils/generateRoom.js';
import { generateNordpassUsername } from '../utils/nordpassUsername.js';
import { pgPool, redisClient } from '../config/db.js';

const roomDifficulties = new Set(['easy', 'medium', 'hard']);
const roomLanguages = new Set(['Animated', 'Hollywood', 'Indian', 'Mixed']);

// In-memory fallback if DB is unavailable
export const memoryRooms = new Map();
export const liveRooms = new Map();

export function registerLiveRoom(room) {
    liveRooms.set(room.roomId.toLowerCase(), {
        roomId: room.roomId,
        hostName: room.hostName,
        settings: room.settings,
        status: 'active'
    });

    const existingKey = Array.from(memoryRooms.keys())
        .find((key) => key.toLowerCase() === room.roomId.toLowerCase());
    memoryRooms.set(existingKey || room.roomId, {
        roomId: room.roomId,
        hostName: room.hostName,
        settings: room.settings,
        status: 'active'
    });
}

export async function closeRoom(roomId) {
    liveRooms.delete(roomId.toLowerCase());

    for (const [key, metadata] of memoryRooms.entries()) {
        if (key.toLowerCase() === roomId.toLowerCase()) {
            memoryRooms.set(key, { ...metadata, status: 'closed' });
        }
    }

    if (redisClient) {
        try {
            await redisClient.set(
                `room:${roomId}:meta`,
                JSON.stringify({ roomId, status: 'closed' }),
                'EX',
                86400
            );
        } catch (error) {
            console.warn(`[Room] Failed to mark room ${roomId} closed in Redis:`, error.message);
        }
    }

    try {
        await pgPool.query('UPDATE rooms SET status = $1 WHERE room_id = $2', ['closed', roomId]);
    } catch (error) {
        console.warn(`[Room] Failed to mark room ${roomId} closed in PostgreSQL:`, error.message);
    }
}

export const createRoom = async (req, res) => {
    const { userId, username, settings } = req.body || {};
    const suppliedName = username ?? userId;
    if (
        (suppliedName !== undefined && typeof suppliedName !== 'string') ||
        (typeof suppliedName === 'string' &&
            (suppliedName.length > 22 || /[\u0000-\u001f\u007f]/u.test(suppliedName)))
    ) {
        return res.status(400).json({ success: false, message: 'Username must be at most 22 characters.' });
    }
    if (settings !== undefined && (!settings || typeof settings !== 'object' || Array.isArray(settings))) {
        return res.status(400).json({ success: false, message: 'Room settings are invalid.' });
    }

    const providedName = typeof suppliedName === 'string' ? suppliedName.trim() : '';
    const hostName = providedName || generateNordpassUsername();
    const roomId = generateRoomId();
    const difficulty = settings?.difficulty ?? 'easy';
    const languages = settings?.languages ?? ['Indian'];
    const totalRounds = Number(settings?.totalRounds ?? 3);
    const requestedGuessingTime = Number(settings?.guessingTime ?? 90);

    if (!roomDifficulties.has(difficulty)) {
        return res.status(400).json({ success: false, message: 'Difficulty must be easy, medium, or hard.' });
    }
    if (
        !Array.isArray(languages) ||
        languages.length === 0 ||
        languages.length > roomLanguages.size ||
        languages.some((language) => !roomLanguages.has(language))
    ) {
        return res.status(400).json({ success: false, message: 'Choose one or more supported movie categories.' });
    }
    if (!Number.isInteger(totalRounds) || totalRounds < 1 || totalRounds > 6) {
        return res.status(400).json({ success: false, message: 'Rounds must be a number from 1 to 6.' });
    }
    if (!Number.isInteger(requestedGuessingTime) || requestedGuessingTime < 30 || requestedGuessingTime > 300) {
        return res.status(400).json({ success: false, message: 'Guessing time must be between 30 and 300 seconds.' });
    }

    const roomSettings = {
        difficulty,
        languages,
        totalRounds,
        guessingTime: requestedGuessingTime
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
        if (redisClient) {
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
    const roomId = req.body?.roomId;
    if (typeof roomId !== 'string' || !ROOM_CODE_PATTERN.test(roomId.trim())) {
        return res.status(400).json({ success: false, message: 'Room code must contain 6 to 10 letters or numbers.' });
    }

    const cleanRoomId = roomId.trim();

    try {
        let roomData = null;
        roomData = liveRooms.get(cleanRoomId.toLowerCase()) || null;

        if (!roomData && redisClient) {
            for (const [key, value] of memoryRooms.entries()) {
                if (key.toLowerCase() === cleanRoomId.toLowerCase()) {
                    roomData = value;
                    break;
                }
            }
        }

        // Redis/PostgreSQL are fallbacks for rooms not created in this process.
        if (!roomData) {
            if (redisClient) {
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
                } catch (error) {
                    console.warn(`[Room] Redis lookup failed for room ${cleanRoomId}:`, error.message);
                }
            }
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
            } catch (error) {
                console.warn(`[Room] PostgreSQL lookup failed for room ${cleanRoomId}:`, error.message);
            }
        }

        if (!roomData) {
            return res.status(404).json({ success: false, message: "Room doesn't exist. Please check the room code." });
        }

        if (roomData.status === 'closed') {
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

    if (!cleanRoomId || !ROOM_CODE_PATTERN.test(cleanRoomId)) {
        return res.status(400).json({ success: false, message: 'A valid room ID is required.' });
    }

    // Memory check
    for (const [key, val] of memoryRooms.entries()) {
        if (key === cleanRoomId || key.toLowerCase() === cleanRoomId.toLowerCase()) {
            if (val.status === 'closed') {
                return res.status(404).json({ success: false, message: 'Room not found' });
            }
            return res.json({ success: true, room: val });
        }
    }

    try {
        const pgResult = await pgPool.query(
            'SELECT * FROM rooms WHERE room_id = $1 OR LOWER(room_id) = LOWER($1) LIMIT 1',
            [cleanRoomId]
        );
        if (pgResult.rows.length > 0) {
            if (pgResult.rows[0].status === 'closed') {
                return res.status(404).json({ success: false, message: 'Room not found' });
            }
            return res.json({ success: true, room: pgResult.rows[0] });
        }
    } catch (e) {
        // ignore
    }

    return res.status(404).json({ success: false, message: 'Room not found' });
};
