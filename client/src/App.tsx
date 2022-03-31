import React, { useState } from 'react';
import { socket, SocketContext } from './context/socket';
import { UserContext } from './context/user';
import Router from './Router';

const App = () => {
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
