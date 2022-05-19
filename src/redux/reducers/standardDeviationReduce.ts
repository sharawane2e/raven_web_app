import { createReducer } from '@reduxjs/toolkit';
import {
  setMean,
  setStandardDeviation,
  setStandardError,
} from '../actions/standardDeviationAction';

export interface IStandardDeviation {
  isMean: Number;
  standardDeviation: Number;
  standardError: Number;
}

let initialState: IStandardDeviation = {
  isMean: 0,
  standardDeviation: 0,
  standardError: 0,
};

const userReducer = createReducer(initialState, (builder) => {
  builder.addCase(setMean, (state, action) => ({
    ...state,
    isMean: action.payload,
  }));
  builder.addCase(setStandardDeviation, (state, action) => ({
    ...state,
    standardDeviation: action.payload,
  }));
  builder.addCase(setStandardError, (state, action) => ({
    ...state,
    standardError: action.payload,
  }));
});

export default userReducer;
