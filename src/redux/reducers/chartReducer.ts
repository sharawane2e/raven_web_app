import { createReducer } from "@reduxjs/toolkit";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { ChartType } from "../../enums/ChartType";
import { QuestionType } from "../../enums/QuestionType";
import { IQuestion } from "../../types/IQuestion";
import { changeChartOptions } from "../../utils/ChartOptionFormatter";
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
  baseCount: number;
}

export const dataLabels = {
  enabled: true,
  format: "{point.y:.2f}%",
  style: {
    fontSize: "10px",
  },
};

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
      reversed: false,
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      allowDecimals: false,
      gridLineWidth: 0,
      tickInterval: 25,
      min: 0,
      title: {
        text: "",
      },
    },
    plotOptions: {
      series: {
        dataLabels: {
          enabled: true,
          x: 0,
        },
      },
    },
    series: [
      {
        data: [],
      },
    ],
  },
  baseCount: 0,
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
    const type = state.questionData?.type;
    let chartOptions = JSON.parse(JSON.stringify(state.chartOptions));

    if (type === QuestionType.SINGLE || type === QuestionType.MULTI) {
      chartOptions = changeChartOptions(chartOptions, action.payload);
    }
    return {
      ...state,
      chartType: action.payload,
      chartOptions,
    };
  });
});

export default chartReducer;
