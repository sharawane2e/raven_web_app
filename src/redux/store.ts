import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import thunkMiddleware from "redux-thunk";

const store = configureStore({
  reducer: {
    selectedUser: userReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunkMiddleware),
});

export default store;
