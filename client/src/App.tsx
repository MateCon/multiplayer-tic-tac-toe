import React, { useState } from 'react';
import { socket, SocketContext } from './context/socket';
import { UserContext } from './context/user';
import Router from './Router';

<<<<<<< HEAD
const App = () => {
=======
function Index() {
    const navigate = useNavigate();
    const socket = useContext(SocketContext);
    const userContext = useContext(UserContext);
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
        };
    }, [navigate, socket, name]);

    return isLoading ? (
        <div>Loading...</div>
    ) : (
            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    userContext.setName(name);
                    socket.emit('enqueue', name);
                    setIsLoading(true);
                }}
            >
                <label>Name</label>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <button type="submit">Play</button>
            </form>
        );
}

interface BoardProps {
    state: string;
    player_type: 'X' | 'O' | 'Spectator';
    turn: Turn;
    last_move?: number;
    winner: 'X' | 'O' | null;
    onMove: (move: number) => void;
}

const Board: FC<BoardProps> = ({
    state,
    turn,
    player_type,
    winner,
    onMove,
}) => {
    useEffect(() => {
        console.log(state, player_type);
    });

    return (
        <div className="board">
            {state &&
                state.split('').map((cell: string, i: number) => (
                    <button
                        key={i}
                        onClick={() => onMove(i)}
                        disabled={
                            cell !== '-' ||
                            player_type !== turn ||
                            winner !== null
                        }
                    >
                        {cell === '-' ? '' : cell}
                    </button>
                ))}
            {winner && <div>{winner} won!</div>}
        </div>
    );
};

interface User {
    id: string;
    name: string;
}

type Turn = 'X' | 'O';

interface GameState {
    state: string;
    turn: Turn;
    winner: 'X' | 'O' | null;
}

interface Room extends GameState {
    id: string;
    users: User[];
}

function Game() {
    const { roomId } = useParams();
    const socket = useContext(SocketContext);
    const { name } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);
    const [room, setRoom] = useState<Room | null>(null);
    const player_type = useMemo(() => {
        if (room) {
            if (room.users[0].name === name) return 'X';
            if (room.users[1].name === name) return 'O';
        }
        return 'Spectator';
    }, [room, name]);

    const onMove = (move: number) => {
        socket.emit('move', roomId, move);
    };

    useEffect(() => {
        if (!roomId) return;

        socket.on('room_data', (data: Room) => {
            setRoom(data);
            setIsLoading(false);
        });

        socket.on('move', (state: string, turn: Turn, winner) => {
            setRoom((prev: Room | null) =>
                prev ? { ...prev, state, turn, winner } : null
            );
        });

        socket.emit('get_room_data', roomId);

        return () => {
            socket.off('room_data');
        };
    }, [socket, roomId]);

    return room ? (
        <Board
            state={room.state}
            turn={room.turn}
            player_type={player_type}
            winner={room.winner}
            onMove={onMove}
        />
    ) : (
            <div>Loading...</div>
        );
}

function App() {
>>>>>>> 156bb6a958fa4a84ef0b01b203c6aaf3d8990fca
    const [username, setUsername] = useState<string>('');

    return (
        <UserContext.Provider value={{ name: username, setName: setUsername }}>
            <SocketContext.Provider value={socket}>
                <Router />
            </SocketContext.Provider>
        </UserContext.Provider>
    );
};

export default App;
