import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    interestedUsers: [],
    ignoredUsers: [],
    currentIndex: 0,
    isAuthenticated: !!localStorage.getItem("token"),
    token: localStorage.getItem("token") || null,
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
    logoutUser: (state) => {
      state.users = [];
      state.interestedUsers = [];
      state.ignoredUsers = [];
      state.currentIndex = 0;
      state.isAuthenticated = false;
      state.token = null;
      localStorage.removeItem("token");
    },
    loginSuccess: (state, action) => {
      const { token, user } = action.payload;
      if (!user || !token) return;

      localStorage.setItem("token", token);
      state.isAuthenticated = true;
      state.token = token;
      state.users = [user];
    },
    setAuthenticated: (state, action) => {
      state.isAuthenticated = action.payload;
    },
  },
});

export const {
  setUsers,
  sendRequest,
  logoutUser,
  loginSuccess,
  setAuthenticated,
} = userSlice.actions;

export default userSlice.reducer;
