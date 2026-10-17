import test from 'node:test';
import assert from 'node:assert/strict';
import { initSocket } from './socketHandler.js';
import { memoryRooms } from '../controllers/room.controller.js';

class FakeSocket {
    constructor(id) {
        this.id = id;
        this.handlers = new Map();
        this.emitted = [];
    }

    on(event, handler) {
        this.handlers.set(event, handler);
    }

    emit(event, payload) {
        this.emitted.push({ event, payload });
    }

    join() {}

    clientEmit(event, payload) {
        return this.handlers.get(event)?.(payload);
    }
}

class FakeIo {
    constructor() {
        this.broadcasts = [];
    }

    on(event, handler) {
        if (event === 'connection') this.connect = handler;
    }

    to(room) {
        return {
            emit: (event, payload) => this.broadcasts.push({ room, event, payload })
        };
    }
}

test('a socket that has not joined a room cannot start its game by room ID', async () => {
    const io = new FakeIo();
    initSocket(io);

    memoryRooms.set('authcheck', {
        roomId: 'authcheck',
        hostName: 'Host',
        settings: { difficulty: 'easy', languages: ['Indian'], totalRounds: 1, guessingTime: 30 },
        status: 'lobby'
    });
    const host = new FakeSocket('host-socket');
    const guest = new FakeSocket('guest-socket');
    io.connect(host);
    io.connect(guest);
    await host.clientEmit('joinRoom', { roomId: 'authcheck', username: 'Host' });
    await guest.clientEmit('joinRoom', { roomId: 'authcheck', username: 'Guest' });

    const outsider = new FakeSocket('outsider-socket');
    io.connect(outsider);
    outsider.clientEmit('startGame', { roomId: 'authcheck' });

    assert.equal(io.broadcasts.some(({ event }) => event === 'turnSelecting'), false);
});

test('malformed socket event payloads are rejected without throwing', async () => {
    const io = new FakeIo();
    initSocket(io);

    memoryRooms.set('inputcheck', {
        roomId: 'inputcheck',
        hostName: 'Host',
        settings: { difficulty: 'easy', languages: ['Indian'], totalRounds: 1, guessingTime: 30 },
        status: 'lobby'
    });

    const socket = new FakeSocket('payload-socket');
    io.connect(socket);
    await socket.clientEmit('joinRoom', { roomId: 'inputcheck', username: 'Host' });

    for (const event of ['updateSettings', 'selectMovie', 'dropClue', 'chatMessage']) {
        assert.doesNotThrow(() => socket.clientEmit(event, null));
    }
    assert.equal(socket.emitted.some(({ event }) => event === 'gameError'), true);
});

test('a duplicate username cannot replace an active player or claim their host role', async () => {
    const io = new FakeIo();
    initSocket(io);

    memoryRooms.set('hostguard', {
        roomId: 'hostguard',
        hostName: 'Host',
        settings: { difficulty: 'easy', languages: ['Indian'], totalRounds: 1, guessingTime: 30 },
        status: 'lobby'
    });

    const host = new FakeSocket('original-host');
    const impersonator = new FakeSocket('impersonator');
    io.connect(host);
    io.connect(impersonator);
    await host.clientEmit('joinRoom', { roomId: 'hostguard', username: 'Host' });
    await impersonator.clientEmit('joinRoom', { roomId: 'hostguard', username: 'host' });

    const lastPlayersUpdate = io.broadcasts
        .filter(({ event }) => event === 'playersUpdated')
        .at(-1);
    assert.deepEqual(lastPlayersUpdate.payload.map(({ id, isHost }) => ({ id, isHost })), [
        { id: 'original-host', isHost: true }
    ]);
    assert.equal(
        impersonator.emitted.some(({ event }) => event === 'roomError'),
        true
    );
});

test('chat event bursts are rate limited per socket', async () => {
    const io = new FakeIo();
    initSocket(io);

    memoryRooms.set('ratecheck', {
        roomId: 'ratecheck',
        hostName: 'Host',
        settings: { difficulty: 'easy', languages: ['Indian'], totalRounds: 1, guessingTime: 30 },
        status: 'lobby'
    });

    const socket = new FakeSocket('rate-limited-player');
    io.connect(socket);
    await socket.clientEmit('joinRoom', { roomId: 'ratecheck', username: 'Host' });
    for (let index = 0; index < 9; index += 1) {
        socket.clientEmit('chatMessage', { message: `message ${index}` });
    }

    assert.equal(io.broadcasts.filter(({ event }) => event === 'chatMessage').length, 8);
    assert.equal(socket.emitted.some(({ event }) => event === 'gameError'), true);
});
