import { createReducer } from "@reduxjs/toolkit";
import { setUser } from "../actions/userActions";

const initialState = "";

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUser, (state, action) => action.payload);
});

export default userReducer;
