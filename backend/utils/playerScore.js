const players = new Map();

export function addPlayer(userName){
    players.set(userName, 0);
}

export function scorePlayer(userName, time){
    const previousScore = players.get(userName) || 0;
    const newScore = time*5;
    players.set(userName, previousScore + newScore);
}