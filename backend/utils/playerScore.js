const players = new Map([["satya", 0], ["joe", 0], ["ryan", 0]]);

export function addPlayer(userName){
    players.set(userName, 0);
}

// basically i've to select a player that's not been selected in this round;
// later on if all players are selected round ends
export function choosePlayer(){
    const playersLeft = new Map(players);
    const randomPlayer = Math.floor(Math.random()* playersLeft.size);
    const selectedPlayer = playersLeft[randomPlayer];
    if(playersLeft.size!=0){
        return selectedPlayer;
    }
    for(let i = 0; i<=players.size;i++){
        console.log(selectedPlayer);
    }
    playersLeft.delete(selectedPlayer);
}

export function scorePlayer(userName, time){
    const previousScore = players.get(userName) || 0;
    const newScore = time*5;
    players.set(userName, previousScore + newScore);
}