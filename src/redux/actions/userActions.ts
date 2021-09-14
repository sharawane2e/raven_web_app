import { createAction } from "@reduxjs/toolkit";
import { IUserProfile } from "../../types/IUserProfile";

export const setUserProfile = createAction<IUserProfile | null>("SET_USER");
