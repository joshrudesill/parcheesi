import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  gameCode: "",
  players: [],
  admin: false,
  gameStarted: false,
  gameState: [],
  lastTurn: [],
  turn: 0,
  playerNumber: -1,
};
// {
//   canMovePieces: false,
//   canRoll: false,
//   color: "yellow",
//   homeSquare: 5,
//   lastPiece: { player: -1, at: -1 },
//   moveBag: [],
//   pieceOptions: (4)[(Array(0), Array(0), Array(0), Array(0))],
//   pieces: (4)[(0, 0, 0, 0)],
//   turns: 1,
// }
const gameSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGameCode: (state, action) => {
      state.gameCode = action.payload;
    },
    addPlayer: (state, action) => {
      state.players = action.payload;
    },
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    setGameStarted: (state, action) => {
      state.gameStarted = action.payload;
    },
    setGame: (state, action) => {
      state.gameState = action.payload;
    },
    setLastTurn: (state, action) => {
      state.lastTurn = action.payload;
    },
    setTurn: (state, action) => {
      state.turn = action.payload;
    },
    takeTurnRedux: (state, action) => {
      const { turn, gs } = action.payload;

      state.gameState = state.gameState.map((g, i) => {
        if (i === turn) {
          console.log("et:", gs.extraRolls - 1);
          return {
            ...gs,
            moveBag:
              gs.pieceOptions.every((po) => po.length === 0) &&
              gs.moveBag[0] !== gs.moveBag[1]
                ? []
                : gs.moveBag,
            extraRolls:
              gs.pieceOptions.every((po) => po.length === 0) &&
              gs.moveBag[0] !== gs.moveBag[1]
                ? 0
                : gs.extraRolls,
          };
        }
        return g;
      });
    },
    makeMoveRedux: (state, action) => {
      state.gameState = action.payload;
    },
    setPlayerNumber: (state, action) => {
      state.playerNumber = action.payload;
    },
    gameReset: () => initialState,
  },
});

export const {
  setGameCode,
  addPlayer,
  setAdmin,
  setGameStarted,
  gameReset,
  setGame,
  setLastTurn,
  setTurn,
  takeTurnRedux,
  setPlayerNumber,
  makeMoveRedux,
} = gameSlice.actions;
export default gameSlice.reducer;
