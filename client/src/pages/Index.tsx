import React, { FC, useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SocketContext } from '../context/socket';
import { UserContext } from '../context/user';

export const Index: FC = () => {
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
};

export default Index;
