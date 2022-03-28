import { useContext, useEffect, useState } from 'react';
import { socket, SocketContext } from './context/socket';
import {
  BrowserRouter,
  Routes,
  Route,
  useNavigate,
  useParams
} from 'react-router-dom';

function Index() {
  const navigate = useNavigate();
  const socket = useContext(SocketContext);
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    socket.on('room_found', (roomId: number) => {
      socket.emit('join_room', roomId, name);
    });

    socket.on('room_joined', (roomId: number) => {
      navigate(`/game/${roomId}`);
    });

    return () => {
      socket.off('room_found');
      socket.off('room_joined');
    }
  }, [navigate, socket, name]);

  return (
    isLoading
      ? <div>Loading...</div>
      : <form onSubmit={(e) => {
        e.preventDefault();
        socket.emit('enqueue', name);
        setIsLoading(true);
      }}>
        <label>Name</label>
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
        <button type="submit">Play</button>
      </form>
  );
}

function Game() {
  const { roomId } = useParams();
  const socket = useContext(SocketContext);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!roomId) return;

    socket.on('room_data', (data: any) => {
      console.log(data)
      setIsLoading(false);
    });

    socket.emit('get_room_data', roomId);

    return () => {
      socket.off('room_data');
    }
  }, [socket, roomId]);

  return <div>Game</div>
}

function App() {
  return (
    <SocketContext.Provider value={socket}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/game/:roomId" element={<Game />} />
          <Route path="*" element={<div>404</div>} />
        </Routes>
      </BrowserRouter>
    </SocketContext.Provider>
  );
}

export default App;
