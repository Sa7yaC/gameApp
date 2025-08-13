// sockets/socketHandler.js
const users = {}; // { socket.id: username }

export const initSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        // User joins a room with a username
        socket.on("joinRoom", ({ roomId, username }) => {
            socket.join(roomId);

            // Store the username for this socket
            users[socket.id] = username;

            console.log(`${username} joined room: ${roomId}`);

            // Notify others in the room
            socket.to(roomId,username).emit("chat message", {
                user: "Room",
                text: `New player joined the room`
            });
        });

        // Handle chat messages
        socket.on("chat message", ({ roomId, message }) => {
            const username = users[socket.id] || "Unknown";

            console.log(`Message from ${username} in room ${roomId}: ${message}`);
            let keyword = "hello";
            if(message.trim()===keyword){
                let newMessage ="";
                for(let i=0;i<keyword.length;i++){
                    newMessage+="*";
                }
                io.to(roomId).emit("chat message", {
                    user: username,
                    text: newMessage
                });
            }
            else{
                io.to(roomId).emit("chat message", {
                    user: username,
                    text: message
                });
            }
        });

        // Handle disconnect
        socket.on("disconnect", () => {
            const username = users[socket.id];
            console.log(`${username || "A user"} disconnected`);
            delete users[socket.id];
        });
    });
};