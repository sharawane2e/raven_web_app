import { createReducer } from "@reduxjs/toolkit";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { ChartType } from "../../enums/ChartType";
import { QuestionType } from "../../enums/QuestionType";

import { IQuestion } from "../../types/IQuestion";
import { changeChartOptions } from "../../utils/ChartOptionFormatter";
import {
  setChartData,
  setChartOrientation,
  setChartType,
  setChartLabel,
  setChartTranspose,
  setChartFullScreen,
  setChartLoading,
  setUserCache,
  // getUserCache,
} from "../actions/chartActions";

export interface IChartState {
  chartLoading: boolean;
  questionData: IQuestion | null;
  chartData: any[];
  chartOrientation: ChartOrientation;
  chartType: ChartType;
  chartLabelType: ChartLabelType;
  chartTranspose: boolean;
  chartfullScreen: boolean;
  chartOptions: any;
  baseCount: number;
  bannerQuestionData: IQuestion | null;
  userCache: any;
  // getUserCache: any;
}

export const dataLabels = {
  enabled: true,
  // format: "{point.y:.1f}%",
  style: {
    fontSize: "10px",
    textOutline: false,
    fontWeight: null,
  },
};

export const defaultPlotOptions = {
  series: {
    pointPadding: 0.04,
    groupPadding: 0.05,
    borderWidth: 0,
    shadow: false,
    dataLabels: {
      enabled: true,
      format: "{point.y:.1f}%",
      allowOverlap: true,
      rotation: -90,
      x: 0,
      y: -20,
      crop: false,
    },
  },
};

const initialState: IChartState = {
  chartLoading: false,
  questionData: null,
  bannerQuestionData: null,
  chartData: [],
  chartOrientation: ChartOrientation.PORTRAIT,
  chartType: ChartType.COLUMN,
  chartLabelType: ChartLabelType.PERCENTAGE,
  chartTranspose: false,
  chartfullScreen: false,
  userCache: [],
  // getUserCache: [],
  chartOptions: {
    title: {
      text: "",
    },
    chart: {
      type: "column",

      style: {
        fontFamily: `"Avenir", Arial`,
      },
    },
    legend: {
      enabled: false,
      reversed: false,
    },
    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        "<span>{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>",
    },
    xAxis: {
      type: "category",
    },
    yAxis: {
      visible: false,
      reversedStacks: false,
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
    // const type = state.questionData?.type;
    // let chartOptions = JSON.parse(JSON.stringify(state.chartOptions));

    // if (type === QuestionType.SINGLE || type === QuestionType.MULTI) {
    //   chartOptions = changeChartOptions(chartOptions, action.payload);
    // }
    return {
      ...state,
      chartType: action.payload,
      // chartOptions,
    };
  });

  builder.addCase(setChartLabel, (state, action) => ({
    ...state,
    chartLabelType: action.payload,
  }));

  builder.addCase(setChartTranspose, (state, action) => ({
    ...state,
    chartTranspose: action.payload,
  }));

  builder.addCase(setChartFullScreen, (state, action) => ({
    ...state,
    chartfullScreen: action.payload,
  }));

  builder.addCase(setChartLoading, (state, action) => ({
    ...state,
    chartLoading: action.payload,
  }));

  builder.addCase(setUserCache, (state, action) => ({
    ...state,
    userCache: action.payload,
  }));

  // builder.addCase(getUserCache, (state, action) => ({
  //   ...state,
  //   getUserCache: action.payload,
  // }));
});

export default chartReducer;
