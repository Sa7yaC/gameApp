// App.jsx
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import RoomCard from './components/RoomCard';
import ChatCard from './components/ChatCard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<RoomCard />} />
        <Route path="/room/:roomId" element={<ChatCard />} />
      </Routes>
    </Router>
  );
}

export default App;
