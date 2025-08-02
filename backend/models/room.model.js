import mongoose from 'mongoose';

const roomSchema = new mongoose.Schema({
    roomName: {type: String, require: true}
});

const gameApp = mongoose.model('gameApp', roomSchema);

export default gameApp;