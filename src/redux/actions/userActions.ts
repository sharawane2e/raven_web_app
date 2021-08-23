import { SET_SELECTED_USER } from "./actionTypes/userActionTypes";

export const setUser = (id: string) => {
  return {
    type: SET_SELECTED_USER,
    payload: {
      id,
    },
  };
};
