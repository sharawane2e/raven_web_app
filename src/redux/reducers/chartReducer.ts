import { createReducer } from '@reduxjs/toolkit';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { ChartOrientation } from '../../enums/ChartOrientation';
import { ChartType } from '../../enums/ChartType';
import { IQuestion } from '../../types/IQuestion';
import {
  setChartData,
  setChartOrientation,
  setChartType,
  setChartLabel,
  setChartTranspose,
  setChartFullScreen,
  setChartLoading,
  resetChart,
  showMean,
  updateChartOptions,
} from '../actions/chartActions';

export interface IChartState {
  chartLoading: boolean;
  questionData: IQuestion | null;
  // openQSelection:boolean;
  chartData: any[];
  chartOrientation: ChartOrientation;
  chartType: ChartType;
  chartLabelType: ChartLabelType;
  chartTranspose: boolean;
  chartfullScreen: boolean;
  chartOptions: any;
  baseCount: number;
  bannerQuestionData: IQuestion | null;
  showMean: boolean;
}

export const dataLabels = {
  enabled: true,
  style: {
    fontSize: '10px',
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
      format: '{point.y:.1f}%',
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
  // openQSelection:false,
  bannerQuestionData: null,
  chartData: [],
  chartOrientation: ChartOrientation.PORTRAIT,
  chartType: ChartType.COLUMN,
  chartLabelType: ChartLabelType.PERCENTAGE,
  chartTranspose: false,
  chartfullScreen: false,
  chartOptions: {
    title: {
      text: '',
    },
    chart: {
      type: 'column',

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
        '<span>{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
    },
    xAxis: {
      type: 'category',
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
  showMean: false,
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

  builder.addCase(showMean, (state, action) => ({
    ...state,
    showMean: action.payload,
  }));

  builder.addCase(resetChart, (state, action) => ({
    ...state,
    questionData: null,
    chartData: [],
    chartOptions: {
      title: {
        text: '',
      },
      chart: {
        type: 'column',

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
          '<span>{point.name}</span>: <b>{point.y:.2f}%</b> of total <b>{point.baseCount}</b><br/>',
      },
      xAxis: {
        type: 'category',
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
  }));

  builder.addCase(updateChartOptions, (state, action) => ({
    ...state,
    chartOptions: { ...state.chartOptions, ...action.payload },
  }));
});

export default chartReducer;
