import { QuestionType } from "../../enums/QuestionType";
import store from "../../redux/store";
import { bannerChartDataGen } from "./BannerQuesUtils";
import { gridChartDataGen } from "./GridQuesUtils";
import { singleChartDataGen } from "./SingleQuesUtils";

export function chartDataGen() {
  let seriesData = [];
  const {
    chart: { chartData, questionData, bannerQuestionData, baseCount },
    questions: { selectedBannerQuestionId },
  } = store.getState();

  if (
    selectedBannerQuestionId &&
    (questionData?.type === QuestionType.SINGLE ||
      questionData?.type === QuestionType.MULTI)
  ) {
    seriesData = bannerChartDataGen(
      questionData,
      chartData,
      baseCount,
      bannerQuestionData
    );
  } else {
    if (questionData?.type === QuestionType.SINGLE) {
      seriesData = singleChartDataGen(questionData, chartData, baseCount);
    } else if (questionData?.type === QuestionType.MULTI) {
      seriesData = singleChartDataGen(questionData, chartData, baseCount);
    } else if (questionData?.type === QuestionType.GRID) {
      seriesData = gridChartDataGen(questionData, chartData, baseCount);
    } else if (questionData?.type === QuestionType.GRID_MULTI) {
      seriesData = gridChartDataGen(questionData, chartData, baseCount);
    } else if (questionData?.type === QuestionType.RANK) {
      seriesData = gridChartDataGen(questionData, chartData, baseCount);
    }
  }
  return seriesData;
}
