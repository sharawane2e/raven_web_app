import { createReducer } from "@reduxjs/toolkit";
import { ChartDataLabels } from "../../enums/ChartDataLabels";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { ChartType } from "../../enums/ChartType";
import { QuestionType } from "../../enums/QuestionType";
import { IQuestion } from "../../types/IQuestion";
import { changeChartOptions } from "../../utils/ChartOptionFormatter";
import {
  setChartData,
  setChartOrientation,
  setChartType,
  setDataLabelFormat,
} from "../actions/chartActions";

export interface IChartState {
  questionData: IQuestion | null;
  chartData: any[];
  chartOrientation: ChartOrientation;
  chartType: ChartType;

  chartOptions: any;
  baseCount: number;
  bannerQuestionData: IQuestion | null;
}

export const dataLabels = {
  enabled: true,
  // format: "{point.y:.1f}%",
  style: {
    fontSize: "10px",
  },
};

export const defaultPlotOptions = {
  series: {
    dataLabels: {
      enabled: true,
      format: ChartDataLabels.PERCENTAGE,
      allowOverlap: true,
      x: 0,
    },
  },
};

const initialState: IChartState = {
  questionData: null,
  bannerQuestionData: null,
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
      visible: false,
    },
    plotOptions: defaultPlotOptions,
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

  builder.addCase(setDataLabelFormat, (state, action) => ({
    ...state,
    chartOptions: {
      ...state.chartOptions,
      ...action.payload,
    },
  }));
});

export default chartReducer;
