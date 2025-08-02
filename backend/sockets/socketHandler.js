// sockets/socketHandler.js
export const initSocket = (io) => {
    io.on("connection", (socket) => {
        console.log("Socket connected");

        socket.on("joinRoom", (roomId) => {
            socket.join(roomId);
            console.log(`Socket joined room: ${roomId}`);
        });

        socket.on("chat message", ({ roomId, message }) => {
            console.log(`Message to room ${roomId}: ${message}`);
            io.to(roomId).emit("chat message", message);
        });

        socket.on("disconnect", () => {
            console.log("A user disconnected");
        });
    });
};
