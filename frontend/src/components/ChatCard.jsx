import useSocket from "../hooks/useSocket";
import { scoreMap, toScore } from "../utils/score";  // import the shared map & function
import { useParams } from "react-router-dom";
import { useRef, useEffect, useState } from "react";

function ChatCard() {
  const { roomId } = useParams();
  const { messages, sendMessage, isConnected, socket } = useSocket(roomId);
  const [input, setInput] = useState("");
  const [username, setUsername] = useState("");
  const [hasJoined, setHasJoined] = useState(false);
  const messagesRef = useRef(null);

  useEffect(() => {
    if (messagesRef.current) {
      messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
    }
  }, [messages]);

  // Join chat when clicking "Join Chat"
  const handleJoin = () => {
    if (username.trim()) {
      socket.connect();
      socket.emit("joinRoom", { roomId, username });
      setHasJoined(true);
      toScore(username);  // Add user to scoreMap with initial score 0
      console.log("Current scoreMap entries after join:");
      scoreMap.forEach((score, user) => {
        console.log(`${user}: ${score}`);
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      sendMessage(input); // Backend attaches username
      setInput("");
    }
  };

  const handleToggle = () => {
    if (socket.connected) {
      socket.disconnect();
      setHasJoined(false);
    } else if (username.trim()) {
      socket.connect();
      socket.emit("joinRoom", { roomId, username });
      setHasJoined(true);
    }
  };

  return (
    <div className="chat-card">
      {/* Ask for username before joining */}
      {!hasJoined && (
        <div className="username-setup">
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter your username"
          />
          <button onClick={handleJoin}>Join Chat</button>
        </div>
      )}

      {/* Messages list */}
      {hasJoined && (
        <>
        <div className="messageBox">
            <ul ref={messagesRef} className="message-list">
              {messages.map((msg, index) => (
                <li key={index}>
                  <strong>{msg.user}:</strong> {msg.text}
                </li>
              ))}
            </ul>
            <div className="sendMessage">
              {/* Chat input form */}
              <form onSubmit={handleSubmit} className="chat-form">
                <input
                  autoComplete="off"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message..."
                />
                <button type="submit">Send</button>
                <button type="button" onClick={handleToggle}>
                  {isConnected ? "Disconnect" : "Connect"}
                </button>
              </form>
            </div>      
        </div>
        </>
      )}
    </div>
  );
}

export default ChatCard;
