import { QuestionType } from "../../enums/QuestionType";
import store from "../../redux/store";
import { bannerChartDataGen } from "./BannerQuesUtils";
import { gridChartDataGen } from "./GridQuesUtils";
import { multiGridChartDataGen } from "./MultiGridQuesUtils";
import { multiChartDataGen } from "./MultiQuesUtils";
import { rankChartDataGen } from "./RankQuesUtils";
import { singleChartDataGen } from "./SingleQuesUtils";

export function chartDataGen() {
  // debugger
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
      bannerQuestionData
    );
  } else {
    if (questionData?.type === QuestionType.SINGLE) {
      seriesData = singleChartDataGen(questionData, chartData, baseCount);
    } else if (questionData?.type === QuestionType.MULTI) {
      seriesData = multiChartDataGen(questionData, chartData, baseCount);
    } else if (questionData?.type === QuestionType.GRID) {
      seriesData = gridChartDataGen(questionData, chartData, baseCount);
    } else if (questionData?.type === QuestionType.GRID_MULTI) {
      seriesData = multiGridChartDataGen(questionData, chartData, baseCount);
    } else if (questionData?.type === QuestionType.RANK) {
      seriesData = rankChartDataGen(questionData, chartData, baseCount);
    }
  }
  
  return seriesData;
}
