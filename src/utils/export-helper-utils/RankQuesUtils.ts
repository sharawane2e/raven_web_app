import { gridChartDataGen } from "./GridQuesUtils";

export function rankChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {
  return gridChartDataGen(questionData, chartData, baseCount);
}
