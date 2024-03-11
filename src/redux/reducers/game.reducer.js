import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  gameCode: "",
  players: [],
  admin: false,
  gameStarted: false,
};
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
    gameReset: () => initialState,
  },
});

export const { setGameCode, addPlayer, setAdmin, setGameStarted, gameReset } =
  gameSlice.actions;
export default gameSlice.reducer;
