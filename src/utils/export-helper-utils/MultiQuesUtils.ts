import { singleChartDataGen } from "./SingleQuesUtils";
export function multiChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {
  return singleChartDataGen(questionData, chartData, baseCount);
}
