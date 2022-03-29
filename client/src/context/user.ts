import { createContext } from 'react';

export const UserContext = createContext({
    name: '',
    setName: (name: string) => {
        return;
    },
});
