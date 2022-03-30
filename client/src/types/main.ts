// Game
export type Turn = 'X' | 'O';
export type Winner = Turn | 'Draw' | null;
export type PlayerType = Turn | 'Spectator';

export interface GameState {
    state: string;
    turn: Turn;
    winner: Winner;
}

// User
export interface User {
    id: string;
    name: string;
}

// Room
export interface Room extends GameState {
    id: string;
    users: User[];
}
