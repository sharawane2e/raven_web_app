import { createReducer } from "@reduxjs/toolkit";
import { hideTourGuide, showTourGuide } from "../actions/tourAction";

const initialState = {
  showTourGuide: false,
};

const tourReducer = createReducer(initialState, (builder) => {
  builder.addCase(showTourGuide, (state, action) => ({
    ...state,
    showTourGuide: true,
  }));
  builder.addCase(hideTourGuide, (state, action) => ({
    ...state,
    showTourGuide: false,
  }));
});

export default tourReducer;
