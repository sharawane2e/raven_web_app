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
  chartOptions: any;
}

const initialState: IChartState = {
  questionData: null,
  chartData: [],
  chartOrientation: ChartOrientation.PORTRAIT,
  chartType: ChartType.COLUMN,
  chartOptions: {
    title: {
      text: "",
    },
    chart: {
      type: "column",
      inverted: false,
    },
    legend: {
      enabled: false,
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      min: 0,
      max: 100,
    },
    series: [
      // @ts-ignore
      {
        color: "#f47c3c",
        data: [],
      },
    ],
  },
};

const chartReducer = createReducer(initialState, (builder) => {
  builder.addCase(setChartData, (state, action) => ({
    ...state,
    ...action.payload,
  }));

  builder.addCase(setChartOrientation, (state, action) => ({
    ...state,
    chartOptions: {
      ...state.chartOptions,
      chart: {
        ...state.chartOptions.chart,
        inverted: action.payload === ChartOrientation.LANDSCAPE,
      },
    },
    chartOrientation: action.payload,
  }));

  builder.addCase(setChartType, (state, action) => ({
    ...state,
    chartType: action.payload,
  }));
});

export default chartReducer;
