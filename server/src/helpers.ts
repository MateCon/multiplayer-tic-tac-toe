export const checkWinner = (state: string): 'X' | 'O' | null => {
    const options: number[][] = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let [a, b, c] of options) {
        if (state[a] === state[b] && state[a] === state[c]) {
            const winner = state[a];
            if (winner === 'X' || winner === 'O') {
                return winner;
            }
        }
    }
    return null;
};
