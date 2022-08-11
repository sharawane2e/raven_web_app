import { ChartType } from '../enums/ChartType';
import { QuestionType } from '../enums/QuestionType';
import store from '../redux/store';
import { IQuestion } from '../types/IQuestion';
import _, { omit } from 'lodash';
import { getNumberChartOption } from '../services/ChartNumberService';
import { getSingleChartOptionsSeries } from './chart-option-util/single';

import {
  getGridChartoptionSeries,
  getGridMeanChartOptions,
} from './chart-option-util/grid';
import { getMultiChartOptionsSeries } from './chart-option-util/multi';
import { ChartOrientation } from '../enums/ChartOrientation';
import { getRankChartOptionsData } from './chart-option-util/rank';
import { getMultiGridChartOptionsData } from './chart-option-util/multiGrid';
import { IchartOptionsDto } from '../types/IChartOptionsDto';
import { ChartLabelType } from '../enums/ChartLabelType';

export const getChartOptions = (
  questionData: IQuestion | null = store.getState().chart.questionData,
  chartData: any = store.getState().chart.chartData,
  baseCount: number = store.getState().chart.baseCount,
  bannerQuestionData: IQuestion | null = store.getState().chart
    .bannerQuestionData,
  chartOptionsData: any = store.getState().chart.chartOptions,
  questionChartData: any = store.getState().chart.questionChartData,
  bannerChartData: any = store.getState().chart.bannerChartData,
  transposed: boolean = store.getState().chart.chartTranspose,
): any => {
  const chart: IchartOptionsDto = {
    questionData,
    chartData,
    baseCount,
    bannerQuestionData,
    chartOptionsData,
    questionChartData,
    bannerChartData,
    transposed,
    chartLabelType: store.getState().chart.chartLabelType,
    chartType: store.getState().chart.chartType,
    significant: store.getState().chart.significant,
    showMean: store.getState().chart.showMean,
  };
  // const questions = {
  //   selectedBannerQuestionId:
  //     store.getState().questions.selectedBannerQuestionId,
  // };

  if (questionData !== null) {
    switch (questionData.type) {
      case QuestionType.SINGLE:
        return getSingleChartOptions(chart);
      case QuestionType.MULTI:
        return getMultiChartOptions(chart);
      case QuestionType.RANK:
        return getRankChartOptions(chart);
      case QuestionType.GRID:
        return getGridChartOptions(chart);
      case QuestionType.GRID_MULTI:
        return getGridMultiChartOptions(chart);
      case QuestionType.NUMBER:
        return getNumberChartOption(chart);
      default:
        return {};
    }
  } else {
    return {};
  }
};

const getMultiChartOptions = (chart: IchartOptionsDto): any => {
  const series = getMultiChartOptionsSeries(chart);
  console.log(series);

  return {
    legend: {
      enabled: true,
    },
    tooltip: { ...getToolTip() },
    series,
  };
};

const getSingleChartOptions = (chart: IchartOptionsDto): any => {
  const series = getSingleChartOptionsSeries(chart);
  //console.log('series', series);

  return {
    legend: {
      enabled: true,
    },
    // plotOptions: getPlotOptions(),
    tooltip: { ...getToolTip() },
    series,
  };
};

const getRankChartOptions = (chart: IchartOptionsDto): any => {
  const series = [];
  series.push(...getRankChartOptionsData(chart));
  return {
    legend: {
      enabled: true,
    },
    tooltip: { ...getToolTip() },
    series,
  };
};

const getGridChartOptions = (
  // questionData: IQuestion,
  // chartData: any,
  // baseCount: number
  chart: IchartOptionsDto,
): any => {
  const series = [];

  const { showMean } = chart;

  if (showMean) {
    series.length = 0;
    series.push(...getGridMeanChartOptions(chart));
  } else {
    series.length = 0;
    series.push(...getGridChartoptionSeries(chart));
  }
  return {
    legend: {
      enabled: true,
    },
    plotOptions: getPlotOptions(),
    tooltip: { ...getToolTip() },
    series,
  };
};

const getGridMultiChartOptions = (chart: IchartOptionsDto): any => {
  const series: any = [];
  series.push(...getMultiGridChartOptionsData(chart));
  return {
    legend: {
      enabled: true,
    },
    tooltip: { ...getToolTip() },
    series,
  };
};

export const getToolTip = () => {
  const {
    chart: { questionData, showMean, significant },
  } = store.getState();
  const tooltip: { headerFormat: String; pointFormat: String } = {
    headerFormat: '',
    pointFormat: '',
  };

  tooltip['headerFormat'] =
    '<span style="font-size:11px">{series.name}</span><br>';

  if (significant) {
    if (questionData?.type === QuestionType?.NUMBER) {
      tooltip['pointFormat'] =
        '<span style="color:#000fff !important;">Sign text - {point.significantDiffernce}</span><br/<span>{point.name}</span>: Mean<b> {point.y:.2f}</b>,  of total <b>{point.baseCount}</b><br/>';
    } else {
      tooltip['pointFormat'] =
        '<span  style="color:#000fff !important;">Sign text - {point.significantDiffernce}</span><br/><span>{point.name}</span>: Count<b> {point.numberValue}, {point.percentageValue:.2f}%</b> of total <b>{point.baseCount}</b><br/>';
    }
  } else {
    if (showMean) {
      tooltip['pointFormat'] =
        '<span>{point.name}</span>: Mean<b> {point.y:.2f}</b>,  of total <b>{point.baseCount}</b><br/>';
    } else {
      if (questionData?.type === QuestionType?.NUMBER) {
        tooltip['pointFormat'] =
          '<span>{point.name}</span>: Mean<b> {point.y:.2f}</b>,  of total <b>{point.baseCount}</b><br/>';
      } else {
        tooltip['pointFormat'] =
          '<span>{point.name}</span>: Count<b> {point.numberValue}, {point.percentageValue:.2f}%</b> of total <b>{point.baseCount}</b><br/>';
      }
    }
  }

  return tooltip;
};

export const getPlotOptions = (
  chartType = store.getState().chart.chartType,
) => {
  const chartDataClone = JSON.parse(JSON.stringify(store.getState().chart));
  let plotOptions = chartDataClone.chartOptions['plotOptions'];
  plotOptions = omit(plotOptions, ['column', 'bar', 'pie', 'line']);
  if (chartType === ChartType.STACK) {
    plotOptions['column'] = {
      stacking: 'normal',
    };
    // plotOptions['series'].dataLabels.format = chartDataClone.showMean
    //   ? '{point.y:.1f}'
    //   : chartDataClone.chartLabelType === ChartLabelType.PERCENTAGE
    //   ? '{point.y:.1f}%'
    //   : '{point.y:.0f}';
    // plotOptions['series'].dataLabels.y = undefined;
    // plotOptions['series'].dataLabels.rotation = 0;
  } else if (chartType === ChartType.COLUMN) {
    plotOptions['bar'] = {
      stacking: 'normal',
    };
    // plotOptions['series'].dataLabels.format = chartDataClone.showMean
    //   ? '{point.y:.1f}'
    //   : chartDataClone.chartLabelType === ChartLabelType.PERCENTAGE
    //   ? '{point.y:.1f}%'
    //   : '{point.y:.0f}';
    if (chartDataClone.chartOrientation === ChartOrientation.PORTRAIT) {
      // plotOptions['series'].dataLabels.y = 0;
      // plotOptions['series'].dataLabels.rotation = -90;
    } else {
      // plotOptions['series'].dataLabels.y = undefined;
      // plotOptions['series'].dataLabels.rotation = 0;
    }
  } else if (chartType === ChartType.PIE) {
    plotOptions['pie'] = {
      allowPointSelect: false,
      cursor: 'pointer',
    };
    // plotOptions['series'].dataLabels.format = chartDataClone.showMean
    //   ? '<b>{point.name}</b>: {point.y:.1f}'
    //   : chartDataClone.chartLabelType === ChartLabelType.PERCENTAGE
    //   ? '<b>{point.name}</b>: {point.percentage:.1f}%'
    //   : '<b>{point.name}</b>: {point.y:.0f}';
    // delete plotOptions['series'].dataLabels.y;
    // delete plotOptions['series'].dataLabels.rotation;
  } else if (chartType === ChartType.LINE) {
    plotOptions['line'] = {
      allowPointSelect: false,
      cursor: 'pointer',
    };
    // plotOptions['series'].dataLabels.format = chartDataClone.showMean
    //   ? '{point.y:.1f}'
    //   : chartDataClone.chartLabelType === ChartLabelType.PERCENTAGE
    //   ? '{point.y:.1f}%'
    //   : '{point.y:.0f}';
  } else {
    delete plotOptions['series'].dataLabels.y;
    delete plotOptions['series'].dataLabels.rotation;
  }
  return plotOptions;
};
