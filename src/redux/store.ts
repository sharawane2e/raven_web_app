import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers/userReducer";
import thunkMiddleware from "redux-thunk";
import filterReducer from "./reducers/filterReducer";

// export interface IStoreState {
//   selectedUser: any; // should be replaced with user interface
//   filters: {
//     filterList: any[];
//     appliedFilters: any[];
//   };
// }

const store = configureStore({
  reducer: {
    selectedUser: userReducer,
    filters: filterReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(thunkMiddleware),
});

export default store;

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;
