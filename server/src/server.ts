import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';
import { checkWinner } from './helpers';

const port: number = 8080;
const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
    },
});

interface User {
    id: string;
    name: string;
}

interface Room {
    id: string;
    users: User[];
    state: string;
    turn: 'X' | 'O';
    winner: 'X' | 'O' | 'Draw' | null;
}

let queue: User[] = [];
let rooms: { [key: string]: Room } = {};

io.on('connection', (socket: Socket) => {
    socket.on('enqueue', (name: string) => {
        if (queue.length === 0) {
            queue.push({ id: socket.id, name });
        } else {
            const roomId = Math.floor(Math.random() * 1000000).toString();
            const firstUser: User = queue.shift()!;
            rooms[roomId] = {
                id: roomId,
                users: [],
                state: '---------',
                turn: 'X',
                winner: null,
            };
            socket.emit('room_found', roomId);
            socket.to(firstUser.id).emit('room_found', roomId);
        }
    });

    socket.on('join_room', (roomId: string, name: string) => {
        rooms[roomId].users.push({ id: socket.id, name });
        socket.join(roomId);
        socket.emit('room_joined', roomId);
    });

    socket.on('get_room_data', (roomId: string) => {
        socket.emit('room_data', rooms[roomId]);
    });

    socket.on('move', (roomId: number, move: number) => {
        const room = rooms[roomId];
        room.state =
            room.state.substr(0, move) +
            room.turn +
            room.state.substr(move + 1);
        room.turn = room.turn === 'X' ? 'O' : 'X';
        room.winner = checkWinner(room.state);
        io.to(roomId.toString()).emit(
            'move',
            room.state,
            room.turn,
            room.winner,
            move
        );
    });

    socket.on('disconnect', () => {
        for (let i = 0; i < queue.length; i++) {
            if (queue[i].id === socket.id) {
                queue.splice(i, 1);
                break;
            }
        }
    });
});

httpServer.listen(port);
