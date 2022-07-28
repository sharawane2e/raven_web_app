import { MultiQuesExportUtils } from "./MultiQuesExportUtils";

export function newChartDataGen(newSeriesData: any) {
  let seriesData: any[] = [];

  //   const {
  //     chartData,
  //     questionData,
  //     bannerQuestionData,
  //     baseCount,
  //     chartTranspose,
  //     questionChartData,
  //     chartOptions,
  //     chartLabelType,
  //   } = chart;

  // const { selectedBannerQuestionId } = questions;

  // if (
  //   selectedBannerQuestionId &&
  //   (questionData?.type === QuestionType.SINGLE ||
  //     questionData?.type === QuestionType.MULTI)
  // ) {
  // seriesData = bannerChartDataGen(
  //   chartOptions.series,

  // );
  //}

  // else {
  //   if (questionData?.type === QuestionType.SINGLE) {
  // seriesData = singleChartDataGen(series);
  //console.log(seriesData);
  //   } else if (questionData?.type === QuestionType.MULTI) {
  //     seriesData = multiChartDataGen(chartOptions.series, chartLabelType);
  //   } else if (questionData?.type === QuestionType.GRID) {
  //     seriesData = gridChartTableGen(chartOptions.series, chartLabelType);
  //   } else if (questionData?.type === QuestionType.RANK) {
  //     seriesData = rankChartDataGen(chartOptions.series, chartLabelType);
  //   } else if (questionData?.type === QuestionType.NUMBER) {
  //     seriesData = numberChartDataGen(chartOptions.series, chartLabelType);
  //   } else if (questionData?.type === QuestionType.GRID_MULTI) {
  //     seriesData = multiGridChartDataGen(chartOptions.series, chartLabelType);
  //   }
  // }

  seriesData = MultiQuesExportUtils(newSeriesData);
  // if (
  //   newSeriesData.selectedBannerQuestionId &&
  //   (newSeriesData.questionData?.type === QuestionType.SINGLE ||
  //     newSeriesData.questionData?.type === QuestionType.MULTI)
  // ) {
  //   seriesData = bannerChartDataGen(newSeriesData);
  // } else {
  //   seriesData = singleChartDataGen(newSeriesData);
  // }

  //console.log('seriesData', seriesData);

  return seriesData;
}
