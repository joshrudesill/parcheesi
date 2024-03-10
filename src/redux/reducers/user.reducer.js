import { createSlice } from "@reduxjs/toolkit";
const initialState = { currentUser: {} };
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.currentUser = action.payload;
    },
    unsetUser: (state) => {
      state.currentUser = {};
    },
  },
});

export const { setUser, unsetUser } = userSlice.actions;
export default userSlice.reducer;
