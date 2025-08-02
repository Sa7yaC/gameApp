function generateRoomId(length=6){
    const chars = 'abcdefghijklmnopqrstuvwxyz123456789'
    let result = '';
    for(let i=0;i<length;i++){
        const randomIndex = Math.floor(Math.random()* chars.length);
        result+=chars[randomIndex];
    }
    return result;
}

export default generateRoomId;