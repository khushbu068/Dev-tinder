import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  authenticated: false,
  token: null,
};

const userSlice = createSlice({
  name: "users",
  initialState: {
    users: [],
    currentUser: null,
    interestedUsers: [],
    ignoredUsers: [],
    currentIndex: 0,
    isAuthenticated: !!localStorage.getItem("token"),
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
      if (!user || !token) {
        return;
      }

      localStorage.setItem("token", token);
      state.isAuthenticated = true;
      state.token = token;
      state.currentUser = user;
    },
  },
});

export const { setUsers, sendRequest, logoutUser, loginSuccess } =
  userSlice.actions;
export default userSlice.reducer;


