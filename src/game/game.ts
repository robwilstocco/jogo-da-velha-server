interface IPlayer {
    id: string,
    symbol: 'circle' | 'cross'
}

interface IGame {
    board: null[] | string[],
    players: {
        p1: IPlayer,
        p2: IPlayer,
        viewers: string[]
    },
    currentPlayer: null | string
}

const createGame = () => {

    const state: IGame = {
        board: Array(9).fill(null),
        players: {
            p1: {
                id: '',
                symbol: 'circle'
            },
            p2: {
                id: '',
                symbol: 'cross'
            },
            viewers: []
        },
        currentPlayer: null
    }

    const winningPositions = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [2, 4, 6],
        [0, 4, 8],
    ]

    const addPlayer = (playerId: string) => {
        if (state.players.p1.id === '') {
            state.players.p1.id = playerId;
            state.currentPlayer = playerId;
        } else if (state.players.p2.id === '') state.players.p2.id = playerId;
        else state.players.viewers.push(playerId);
    }

    const removePlayer = (playerId: string) => {
        if (state.players.p1.id === playerId) state.players.p1.id = '';
        else if (state.players.p2.id === playerId) state.players.p2.id = '';
        else state.players.viewers = state.players.viewers.filter((viewer) => viewer !== playerId);
    }

    const newMove = (position: number, symbol: string) => {
        state.board[position] = symbol;
    }

    const reset = () => {
        state.board = Array(9).fill(null);
        state.currentPlayer = state.players.p1.id;
    }

    const changeTurn = () => {
        const nextPlayer = state.currentPlayer === state.players.p1.id ? state.players.p2.id : state.players.p1.id
        state.currentPlayer = nextPlayer;
    }

    const checkWinner = () => {
        const board = state.board;
        for (let [a, b, c] of winningPositions) {
            if (board[a] && board[a] === board[b] && board[a] === board[c]) {
                return {
                    positions: [a,b,c],
                    player: board[a]
                }; // cross ou circle
            }
        }
        return null
    }

    return {
        state,
        addPlayer,
        removePlayer,
        newMove,
        reset,
        changeTurn,
        checkWinner
    }
}

export default createGame;