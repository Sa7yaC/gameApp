// RoomCard.jsx
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles/HomePage.css'; // Assuming you have a CSS file for styling
import BACKEND_URL from '../config/backend';

function RoomCard() {
  const [roomCode, setRoomCode] = useState('');
  const navigate = useNavigate();

  const createRoomAction = async () => {
    const userId = prompt("Enter your username");
    try {
      const response = await axios.post(`${BACKEND_URL}/createRoom`, { userId });
      alert(`Room Created: ${response.data.roomId}`);
      navigate(`/room/${response.data.roomId}`);
    } catch (error) {
      alert('Room creation failed');
    }
  };

  const joinRoomAction = async () => {
    if (!roomCode.trim()) return alert("Enter a room code");

    try {
      const response = await axios.post(`${BACKEND_URL}/joinRoom`, { roomId: roomCode });
      navigate(`/room/${roomCode}`);
    } catch (error) {
      alert("Room doesn't exist");
    }
  };
  // const handleJoin = () => {
  //   if (username.trim()) {
  //     socket.connect();
  //     socket.emit("joinRoom", { roomId, username });
  //     prompt("Enter your username", username);
  //     setHasJoined(true);
  //   }
  // };

  return (
    <section>
      <div className="roomCard">
        <h2>Start Playing</h2>
        <div className="joinRoom">
          <input placeholder='Enter room code' type="text" value={roomCode} onChange={(e) => setRoomCode(e.target.value)} />
          <button className='joinbtn' onClick={joinRoomAction}>Join</button>
        </div>
        <div className="createRoom">
          <button className='createBtn' onClick={createRoomAction}>Create Room</button>
        </div>
      </div>
    </section>
  );
}

export default RoomCard;
