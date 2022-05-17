import { QuestionType } from '../../enums/QuestionType';
import store from '../../redux/store';
import { bannerChartDataGen } from './BannerQuesUtils';
import { gridChartTableGen } from './GridQuesUtils';
import { multiGridChartDataGen } from './MultiGridQuesUtils';
import { multiChartDataGen } from './MultiQuesUtils';
import { rankChartDataGen } from './RankQuesUtils';
import { singleChartDataGen } from './SingleQuesUtils';
import { numberChartDataGen } from './NumberQuesUtils';

export function chartDataGen() {
  let seriesData: any[] = [];
  const {
    chart: {
      chartData,
      questionData,
      bannerQuestionData,
      baseCount,
      chartTranspose,
    },
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
      bannerQuestionData,
    );
  } else {
    if (questionData?.type === QuestionType.SINGLE) {
      seriesData = singleChartDataGen(questionData, chartData, baseCount);
    } else if (questionData?.type === QuestionType.MULTI) {
      seriesData = multiChartDataGen(questionData, chartData, baseCount);
    } else if (questionData?.type === QuestionType.GRID) {
      seriesData = gridChartTableGen(questionData, chartData, baseCount);
    } else if (questionData?.type === QuestionType.GRID_MULTI) {
      seriesData = multiGridChartDataGen(questionData, chartData, baseCount);
    } else if (questionData?.type === QuestionType.RANK) {
      seriesData = rankChartDataGen(
        questionData,
        chartData,
        baseCount,
        chartTranspose,
      );
    } else if (questionData?.type === QuestionType.NUMBER) {
      seriesData = numberChartDataGen(
        questionData,
        chartData,
        chartTranspose,
        bannerQuestionData,
      );
    }
  }
  return seriesData;
}
