import { createSlice } from "@reduxjs/toolkit";

const requestSlice = createSlice({
  name: "requests",
  initialState: {
    receiveRequests: [],
  },
  reducers: {
    setRequests: (state, action) => {
      state.receiveRequests = action.payload;
    },
    removeRequest: (state, action) => {
      state.receiveRequests = state.receiveRequests.filter(
        (request) => request._id !== action.payload
      );
    },
  },
});

export const { setRequests, removeRequest } = requestSlice.actions;
export default requestSlice.reducer;