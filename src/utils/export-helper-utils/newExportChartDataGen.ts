import { QuestionType } from "../../enums/QuestionType";
import store from "../../redux/store";
import { bannerChartDataGen } from "./BannerQuesUtils";
import { gridChartTableGen } from "./GridQuesUtils";
import { multiGridChartDataGen } from "./MultiGridQuesUtils";
import { multiChartDataGen } from "./MultiQuesUtils";
import { rankChartDataGen } from "./RankQuesUtils";
import { singleChartDataGen } from "./SingleQuesUtils";
import { numberChartDataGen } from "./NumberQuesUtils";
import { ChartLabelType } from "../../enums/ChartLabelType";

export function newChartDataGen(series: any) {
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
  //   seriesData = bannerChartDataGen(
  //     chartOptions.series,
  //     questionData,
  //     bannerQuestionData,
  //     chartTranspose
  //   );
  // }

  // else {
  //   if (questionData?.type === QuestionType.SINGLE) {
  seriesData = singleChartDataGen(series, ChartLabelType.PERCENTAGE);
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

  return seriesData;
}