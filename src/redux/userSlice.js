import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    currentIndex: 0,
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload || [];
      state.currentIndex = 0;
    },
    nextUser: (state) => {
      if (state.users.length > 0) {
        state.currentIndex = (state.currentIndex + 1) % state.users.length;
      }
    },
    prevUser: (state) => {
      if (state.users.length > 0) {
        state.currentIndex =
          state.currentIndex === 0
            ? state.users.length - 1
            : state.currentIndex - 1;
      }
    },
  },
});

export const { setUsers, nextUser, prevUser } = userSlice.actions;
export default userSlice.reducer; // Ensure this is exported as default
