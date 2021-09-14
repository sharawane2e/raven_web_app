import { createReducer } from "@reduxjs/toolkit";
import { IUserProfile } from "../../types/IUserProfile";
import { setUserProfile } from "../actions/userActions";

export interface IUserState {
  selectedUser: string;
  profile: IUserProfile | null;
}

let initialState: IUserState = {
  selectedUser: "",
  profile: null,
};

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setUserProfile, (state, action) => ({
    ...state,
    profile: action.payload,
  }));
});

export default userReducer;
