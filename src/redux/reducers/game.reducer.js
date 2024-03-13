import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  gameCode: "",
  players: [],
  admin: false,
  gameStarted: false,
  gameState: [],
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
} = gameSlice.actions;
export default gameSlice.reducer;
