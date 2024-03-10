import { createSlice } from "@reduxjs/toolkit";
const initialState = { gameCode: "" };
const gameSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setGameCode: (state, action) => {
      state.gameCode = action.payload;
    },
  },
});

export const { setGameCode } = gameSlice.actions;
export default gameSlice.reducer;
