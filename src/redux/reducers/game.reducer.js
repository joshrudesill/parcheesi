import { createSlice } from "@reduxjs/toolkit";
const initialState = { gameCode: "", players: [], admin: false };
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
  },
});

export const { setGameCode, addPlayer, setAdmin } = gameSlice.actions;
export default gameSlice.reducer;
