import { createReducer } from "@reduxjs/toolkit";
import { ChartOptionType } from "../../components/Chart";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { ChartType } from "../../enums/ChartType";
import { IQuestion } from "../../types/IQuestion";
import {
  resetChartData,
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
      // width: "100%",
      // height: "100%",
      // style: {
      //   height: "100%",
      // },
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
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
        },
      },
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

  builder.addCase(setChartType, (state, action) => {
    return {
      ...state,
      chartType: action.payload,
    };
  });
});

export default chartReducer;
