import { combineReducers } from "redux";
import userReducer from "./userReducer";

const combinedReducsers = combineReducers({ selectedUser: userReducer });
export default combinedReducsers;
