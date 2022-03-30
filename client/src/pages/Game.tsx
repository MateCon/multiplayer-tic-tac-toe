import React, { FC, useState, useEffect, useMemo, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import { UserContext } from '../context/user';
import { GameState, PlayerType, Room, Turn } from '../types/main';

interface BoardProps extends GameState {
    player_type: PlayerType;
    last_move: number | null;
    onMove: (move: number) => void;
}

const Board: FC<BoardProps> = ({
    state,
    turn,
    player_type,
    last_move,
    winner,
    onMove,
}) => {
    const turnMessage = useMemo(() => {
        if (player_type === 'Spectator') return '';
        if (turn === 'X' && player_type === 'X') return 'Your turn';
        if (turn === 'O' && player_type === 'O') return 'Your turn';
        return "Opponent's turn";
    }, [turn, player_type]);
    const winnerMessage = useMemo(() => {
        switch (winner) {
            case 'X':
                return 'X wins!';
            case 'O':
                return 'O wins!';
            case 'Draw':
                return 'Draw!';
            default:
                return '';
        }
    }, [winner]);

    return (
        <div className="board-container">
            {turnMessage}
            <div className="board">
                {state &&
                    state.split('').map((cell: string, i: number) => (
                        <button
                            // eslint-disable-next-line prettier/prettier
                            className={`cell ${last_move === i && 'cell__last'}`}
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
            </div>
            {winnerMessage}
        </div>
    );
};

const Game = () => {
    const { roomId } = useParams();
    const socket = useContext(SocketContext);
    const { name } = useContext(UserContext);
    const [isLoading, setIsLoading] = useState(true);
    const [room, setRoom] = useState<Room | null>(null);
    const player_type: PlayerType = useMemo(() => {
        if (room) {
            if (room.users[0].name === name) return 'X';
            if (room.users[1].name === name) return 'O';
        }
        return 'Spectator';
    }, [room, name]);
    const [lastMove, setLastMove] = useState<number | null>(null);

    const onMove = (move: number) => {
        socket.emit('move', roomId, move);
    };

    useEffect(() => {
        if (!roomId) return;

        socket.on('room_data', (data: Room) => {
            setRoom(data);
            setIsLoading(false);
        });

        socket.on('move', (state: string, turn: Turn, winner, move) => {
            setRoom((prev: Room | null) =>
                prev ? { ...prev, state, turn, winner } : null
            );
            setLastMove(move);
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
            winner={room.winner}
            player_type={player_type}
            last_move={lastMove}
            onMove={onMove}
        />
    ) : (
        <div>Loading...</div>
    );
};

export default Game;
