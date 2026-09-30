import { io } from 'socket.io-client';

const URL = 'http://localhost:3001';

async function runTest() {
    console.log('--- Starting Automated E2E Test ---');

    // 1. Host creates room via REST
    const createRes = await fetch(`${URL}/createRoom`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            username: 'CinemaHost',
            settings: {
                difficulty: 'easy',
                languages: ['Bollywood'],
                totalRounds: 1,
                guessingTime: 60
            }
        })
    }).then(r => r.json());

    console.log('Room Created via API:', createRes);
    if (!createRes.success) throw new Error('Failed to create room');
    const roomId = createRes.roomId;

    // 2. Host joins via Socket
    const hostSocket = io(URL);
    const guesserSocket = io(URL);

    let hostJoined = false;
    let guesserJoined = false;

    await new Promise((resolve) => {
        hostSocket.on('connect', () => {
            console.log('Host socket connected');
            hostSocket.emit('joinRoom', { roomId, username: 'CinemaHost' });
        });

        hostSocket.on('initRoomState', (state) => {
            console.log('Host received initRoomState: GameState =', state.gameState);
            hostJoined = true;
            if (hostJoined && guesserJoined) resolve();
        });

        guesserSocket.on('connect', () => {
            console.log('Guesser socket connected');
            guesserSocket.emit('joinRoom', { roomId, username: 'MovieGuesser' });
        });

        guesserSocket.on('initRoomState', (state) => {
            console.log('Guesser received initRoomState: GameState =', state.gameState);
            guesserJoined = true;
            if (hostJoined && guesserJoined) resolve();
        });
    });

    console.log('✅ Both players joined room successfully');

    // 3. Host updates settings (test medium difficulty, 2 languages)
    hostSocket.emit('updateSettings', {
        settings: {
            difficulty: 'medium',
            languages: ['Bollywood', 'Hollywood'],
            totalRounds: 1,
            guessingTime: 60
        }
    });

    await new Promise(r => setTimeout(r, 500));

    // Wait for movie choices or turnSelecting
    let currentActor = null;
    let choicesReceived = null;

    const gameStartedPromise = new Promise((resolve) => {
        hostSocket.on('turnSelecting', (data) => {
            console.log('TurnSelecting: Actor is', data.actorName, 'Phase:', data.gameState);
            currentActor = data.actorName;
        });

        hostSocket.on('movieChoices', (data) => {
            console.log('Host is the actor! Received 3 movie choices:', data.choices.map(c => c.title));
            choicesReceived = data.choices;
            resolve();
        });

        guesserSocket.on('movieChoices', (data) => {
            console.log('Guesser is the actor! Received choices:', data.choices.map(c => c.title));
            choicesReceived = data.choices;
            resolve();
        });
    });

    // 4. Host starts game
    console.log('Host starting game...');
    hostSocket.emit('startGame');

    await gameStartedPromise;

    // 5. The actor selects movie
    const selectedMovie = choicesReceived[0];
    console.log('Actor selecting movie:', selectedMovie.title);

    const actorSocket = currentActor === 'CinemaHost' ? hostSocket : guesserSocket;
    const guesserUserSocket = currentActor === 'CinemaHost' ? guesserSocket : hostSocket;

    actorSocket.emit('selectMovie', { movieTitle: selectedMovie.title });

    // 6. Wait for guessing started
    await new Promise((resolve) => {
        guesserUserSocket.on('guessingStarted', (data) => {
            console.log('Guessing Started! Masked Title:', data.maskedTitle, 'Hints:', data.hints);
            resolve();
        });
    });

    // 7. Actor drops emoji clues
    console.log('Actor dropping emoji clue: 🍿 🚢 🌊');
    actorSocket.emit('dropClue', { emojiClue: '🍿 🚢 🌊' });

    await new Promise((resolve) => {
        guesserUserSocket.on('clueDropped', (data) => {
            console.log('Guesser received clues on board:', data.clues);
            resolve();
        });
    });

    // 8. Guesser types incorrect guess first
    console.log('Guesser submitting incorrect guess: "Random Title"');
    guesserUserSocket.emit('chatMessage', { message: 'Random Title' });

    await new Promise(r => setTimeout(r, 400));

    // 9. Guesser types exact correct guess!
    console.log('Guesser submitting CORRECT guess:', selectedMovie.title);
    guesserUserSocket.emit('chatMessage', { message: selectedMovie.title });

    // 10. Verify masked chat message and celebratory announcement
    let maskedReceived = false;
    let celebrationReceived = false;

    await new Promise((resolve) => {
        hostSocket.on('chatMessage', (msg) => {
            console.log('Chat event received:', msg.user, '->', msg.text);
            if (msg.isCorrectGuess && msg.text === '****') {
                maskedReceived = true;
            }
            if (msg.isCelebration) {
                celebrationReceived = true;
            }
            if (maskedReceived && celebrationReceived) {
                resolve();
            }
        });
    });

    console.log('✅ Correct guess masked to **** and celebratory broadcast sent!');
    console.log('--- TEST PASSED SUCCESSFULLY ---');

    hostSocket.disconnect();
    guesserSocket.disconnect();
    process.exit(0);
}

runTest().catch(err => {
    console.error('Test Failed:', err);
    process.exit(1);
});
