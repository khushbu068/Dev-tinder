import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./userSlice";
import requestSlice from "./requestSlice";

const store = configureStore({
  reducer: {
    users: userSlice,
    requests: requestSlice,
  },
});

export default store;