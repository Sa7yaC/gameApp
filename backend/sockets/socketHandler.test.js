import test from 'node:test';
import assert from 'node:assert/strict';
import { initSocket } from './socketHandler.js';
import { memoryRooms } from '../controllers/room.controller.js';

const sessionToken = (character) => character.repeat(64);

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
    await host.clientEmit('joinRoom', { roomId: 'authcheck', username: 'Host', sessionToken: sessionToken('a') });
    await guest.clientEmit('joinRoom', { roomId: 'authcheck', username: 'Guest', sessionToken: sessionToken('b') });

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
    await socket.clientEmit('joinRoom', { roomId: 'inputcheck', username: 'Host', sessionToken: sessionToken('c') });

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
    await host.clientEmit('joinRoom', { roomId: 'hostguard', username: 'Host', sessionToken: sessionToken('d') });
    await impersonator.clientEmit('joinRoom', { roomId: 'hostguard', username: 'host', sessionToken: sessionToken('e') });

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
    await socket.clientEmit('joinRoom', { roomId: 'ratecheck', username: 'Host', sessionToken: sessionToken('f') });
    for (let index = 0; index < 9; index += 1) {
        socket.clientEmit('chatMessage', { message: `message ${index}` });
    }

    assert.equal(io.broadcasts.filter(({ event }) => event === 'chatMessage').length, 8);
    assert.equal(socket.emitted.some(({ event }) => event === 'gameError'), true);
});

test('a host can rejoin after a transient disconnect without closing or losing the room', async () => {
    const io = new FakeIo();
    initSocket(io);

    memoryRooms.set('reconnect', {
        roomId: 'reconnect',
        hostName: 'Host',
        settings: { difficulty: 'easy', languages: ['Indian'], totalRounds: 1, guessingTime: 30 },
        status: 'lobby'
    });

    const token = sessionToken('1');
    const host = new FakeSocket('host-before-disconnect');
    io.connect(host);
    await host.clientEmit('joinRoom', { roomId: 'reconnect', username: 'Host', sessionToken: token });
    host.clientEmit('disconnect');

    assert.equal(io.broadcasts.some(({ event }) => event === 'roomClosed'), false);

    const reconnectedHost = new FakeSocket('host-after-reconnect');
    io.connect(reconnectedHost);
    await reconnectedHost.clientEmit('joinRoom', { roomId: 'reconnect', username: 'Host', sessionToken: token });

    const latestPlayersUpdate = io.broadcasts
        .filter(({ event }) => event === 'playersUpdated')
        .at(-1);
    assert.deepEqual(latestPlayersUpdate.payload.map(({ id, isHost, isConnected }) => ({
        id,
        isHost,
        isConnected
    })), [{
        id: 'host-after-reconnect',
        isHost: true,
        isConnected: true
    }]);
    assert.equal(io.broadcasts.some(({ event }) => event === 'roomClosed'), false);
});

test('an intentional host leave still closes the lobby immediately', async () => {
    const io = new FakeIo();
    initSocket(io);

    memoryRooms.set('leaveit', {
        roomId: 'leaveit',
        hostName: 'Host',
        settings: { difficulty: 'easy', languages: ['Indian'], totalRounds: 1, guessingTime: 30 },
        status: 'lobby'
    });

    const host = new FakeSocket('leaving-host');
    io.connect(host);
    await host.clientEmit('joinRoom', {
        roomId: 'leaveit',
        username: 'Host',
        sessionToken: sessionToken('2')
    });
    host.clientEmit('leaveRoom');

    assert.equal(io.broadcasts.some(({ event }) => event === 'roomClosed'), true);
});
