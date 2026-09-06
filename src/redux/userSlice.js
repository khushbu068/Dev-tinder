import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  users: [],
  currentUser: null,
  interestedUsers: [],
  ignoredUsers: [],
  currentIndex: 0,
  isAuthenticated: false,
};

const userSlice = createSlice({
  name: "users",
  initialState,

  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload || [];
      state.currentIndex = 0;
    },

    sendRequest: (state, action) => {
      const { userId, actionType } = action.payload;

      const user = state.users.find(
        (user) => user._id === userId
      );

      if (user) {
        if (actionType === "interested") {
          state.interestedUsers.push(user);
        } else {
          state.ignoredUsers.push(user);
        }
      }

      state.users = state.users.filter(
        (user) => user._id !== userId
      );

      if (state.currentIndex >= state.users.length) {
        state.currentIndex = 0;
      }
    },

logoutUser: (state) => {
  state.users = [];
  state.interestedUsers = [];
  state.ignoredUsers = [];
  state.currentIndex = 0;
  state.currentUser = null;
  state.isAuthenticated = false;
},

    loginSuccess: (state, action) => {
  const { user } = action.payload;

  if (!user) {
    return;
  }

  state.isAuthenticated = true;
  state.currentUser = user;
},
  },
});

export const {
  setUsers,
  sendRequest,
  logoutUser,
  loginSuccess,
} = userSlice.actions;

export default userSlice.reducer;