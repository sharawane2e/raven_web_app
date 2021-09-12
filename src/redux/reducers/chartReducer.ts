import { createReducer } from "@reduxjs/toolkit";
import { ChartOptionType } from "../../components/Chart";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { ChartType } from "../../enums/ChartType";
import { IQuestion } from "../../types/IQuestion";
import {
  setChartData,
  setChartOrientation,
  setChartType,
} from "../actions/chartActions";

export interface IChartState {
  questionData: IQuestion | null;
  chartData: any[];
  chartOrientation: ChartOrientation;
  chartType: ChartType;
  chartOptions: ChartOptionType;
}

const initialState: IChartState = {
  questionData: null,
  chartData: [],
  chartOrientation: ChartOrientation.PORTRAIT,
  chartType: ChartType.COLUMN,
  chartOptions: {},
};

const chartReducer = createReducer(initialState, (builder) => {
  builder.addCase(setChartData, (state, action) => ({
    ...state,
    ...action.payload,
  }));

  builder.addCase(setChartOrientation, (state, action) => ({
    ...state,
    chartOrientation: action.payload,
  }));

  builder.addCase(setChartType, (state, action) => ({
    ...state,
    chartType: action.payload,
  }));
});

export default chartReducer;
