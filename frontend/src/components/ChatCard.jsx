import useSocket from "../hooks/useSocket";
import { useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

function ChatCard() {
  const { roomId } = useParams();
  const { messages, sendMessage, isConnected, socket } = useSocket(roomId);
  const [input, setInput] = useState("");
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input);
      setInput("");
    }
  };

  const handleToggle = () => {
    if (socket.connected) {
      socket.disconnect();
    } else {
      socket.connect();
      socket.emit("joinRoom", roomId);
    }
  };

  return (
    <div className="chat-card">
      <ul ref={messagesRef} className="message-list">
        {messages.map((msg, index) => (
          <li key={index}>{msg}</li>
        ))}
      </ul>

      <form onSubmit={handleSubmit} className="chat-form">
        <input
          autoComplete="off"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button type="submit">Send</button>
        <button type="button" onClick={handleToggle}>
          {isConnected ? "Disconnect" : "Connect"}
        </button>
      </form>
    </div>
  );
}

export default ChatCard;
