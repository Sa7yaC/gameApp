// hooks/useSocket.js
import { useContext, useEffect, useState } from "react";
import { SocketContext } from "../context/SocketContext";

const useSocket = (roomId) => {
  const socket = useContext(SocketContext);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    if (!socket.connected) {
      socket.connect();
    }

    socket.emit("joinRoom", roomId);

    socket.on("chat message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("chat message");
    };
  }, [roomId]);

  const sendMessage = (message) => {
    socket.emit("chat message", { roomId, message });
  };

  return {
    messages,
    sendMessage,
    isConnected: socket.connected,
    socket,
  };
};

export default useSocket;
