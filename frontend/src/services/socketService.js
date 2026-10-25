import { io } from "socket.io-client";
import BACKEND_URL from '../config/backend';

const socket = io(BACKEND_URL, {
  autoConnect: false,
  reconnection: false,
  transports: ["websocket", "polling"],
});

export default socket;
