import { configureStore } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // uses localStorage
import { combineReducers } from "redux";

import userSlice from "./userSlice";
import requestSlice from "./requestSlice";

const persistConfig = {
  key: "root",
  storage,
};

const rootReducer = combineReducers({
  users: userSlice,
  requests: requestSlice,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
});

export const persistor = persistStore(store);
export default store;
