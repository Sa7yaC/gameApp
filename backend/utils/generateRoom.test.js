import test from 'node:test';
import assert from 'node:assert/strict';
import generateRoomId, { ROOM_CODE_PATTERN } from './generateRoom.js';

test('generates unpredictable-format room codes accepted by the API', () => {
    const roomId = generateRoomId();

    assert.equal(roomId.length, 10);
    assert.equal(ROOM_CODE_PATTERN.test(roomId), true);
});
