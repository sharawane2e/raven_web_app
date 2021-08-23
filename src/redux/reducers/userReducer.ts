import * as actionType from "../actions/actionTypes/userActionTypes";

const initialState = null;
const userReducer = (state: any = initialState, action: any) => {
  switch (action.type) {
    case actionType.SET_SELECTED_USER:
      return action.payload;

    default:
      return state;
  }
};

export default userReducer;
