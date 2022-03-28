import express from 'express';
import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

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
            rooms[roomId] = { id: roomId, users: [] };
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
