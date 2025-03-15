import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    interestedUsers: [],
    ignoredUsers: [],
    currentIndex: 0,
  },
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload || [];
      state.currentIndex = 0;
    },
    sendRequest: (state, action) => {
      const { userId, actionType } = action.payload;
      const user = state.users.find((user) => user._id === userId);

      if (user) {
        if (actionType === "interested") {
          state.interestedUsers.push(user);
        } else {
          state.ignoredUsers.push(user);
        }
      }

      state.users = state.users.filter((user) => user._id !== userId);
      if (state.currentIndex >= state.users.length) {
        state.currentIndex = 0;
      }
    },
  },
});

export const { setUsers, sendRequest } = userSlice.actions;
export default userSlice.reducer;
