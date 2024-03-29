import { createReducer } from "@reduxjs/toolkit";
import { ChartDataLabels } from "../../enums/ChartDataLabels";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { ChartType } from "../../enums/ChartType";
import { QuestionType } from "../../enums/QuestionType";
import { IChartOperations } from "../../types/IChartOperations";
import { IQuestion } from "../../types/IQuestion";
import { changeChartOptions } from "../../utils/ChartOptionFormatter";
import {
  setChartData,
  setChartOrientation,
  setChartType,
  setChartOperations
} from "../actions/chartActions";

export interface IChartState {
  questionData: IQuestion | null;
  chartData: any[];
  chartOrientation: ChartOrientation;
  chartType: ChartType;
  chartOperations:IChartOperations,
  chartOptions: any;
  baseCount: number;
  bannerQuestionData: IQuestion | null;
}

export const dataLabels = {
  enabled: true,
  // format: "{point.y:.1f}%",
  style: {
    fontSize: "10px",
    textOutline:false,
    fontWeight:null
  },
};

export const defaultPlotOptions = {
  series: {
    dataLabels: {
      enabled: true,
      format: "{point.y:.1f}%",
      allowOverlap: true,
      x: 0,
      y:-20,
      rotation:270,
    },
  },
};

const initialState: IChartState = {
  questionData: null,
  bannerQuestionData: null,
  chartData: [],
  chartOrientation: ChartOrientation.PORTRAIT,
  chartType: ChartType.COLUMN,
  chartOperations:{
    transposed:false,
    labelFormat:ChartDataLabels.PERCENTAGE
  },

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

  builder.addCase(setChartOperations, (state, action) => ({
    ...state,
   ...action.payload
  }));
});

export default chartReducer;
