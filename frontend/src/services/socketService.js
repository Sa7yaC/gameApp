import { io } from "socket.io-client";
import BACKEND_URL from '../config/backend';

const socket = io(BACKEND_URL, {
  autoConnect: false,
  reconnection: true,
  reconnectionAttempts: 10,
  reconnectionDelay: 1000,
  transports: ["websocket", "polling"],
});

export default socket;
