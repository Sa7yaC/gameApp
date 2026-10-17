import { randomInt } from 'node:crypto';

export const ROOM_CODE_PATTERN = /^[a-z1-9]{6,10}$/i;

function generateRoomId(length = 10) {
    const chars = 'abcdefghijklmnopqrstuvwxyz123456789'
    let result = '';
    for (let i = 0; i < length; i++) {
        result += chars[randomInt(chars.length)];
    }
    return result;
}

export default generateRoomId;