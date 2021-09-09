import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import thunkMiddleware from "redux-thunk";
import filterReducer from "./reducers/filterReducer";
import chartReducer from "./reducers/chartReducer";
import questionReducer from "./reducers/questionReducer";

const store = configureStore({
  reducer: {
    selectedUser: userReducer,
    filters: filterReducer,
    questions: questionReducer,
    chart: chartReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunkMiddleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
