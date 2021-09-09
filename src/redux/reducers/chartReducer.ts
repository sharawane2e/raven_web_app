import { createReducer } from "@reduxjs/toolkit";
import { IQuestion } from "../../types/IQuestion";
import { setChartData } from "../actions/chartActions";

export interface IChartState {
  questionData: IQuestion | null;
  chartData: any[];
}

const initialState: IChartState = {
  questionData: null,
  chartData: [],
};

const chartReducer = createReducer(initialState, (builder) => {
  builder.addCase(setChartData, (state, action) => ({
    ...state,
    ...action.payload,
  }));
});

export default chartReducer;
