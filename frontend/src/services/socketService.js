// services/socketService.js
import { io } from "socket.io-client";

const socket = io("http://localhost:3001", {
  autoConnect: false, // controlled by app logic
});

export default socket;
