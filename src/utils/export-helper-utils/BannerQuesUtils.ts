import { decimalPrecision } from "../../constants/Variables";
import { round } from "../Utility";

export function bannerChartDataGen(
  bannerQuestionList: any,
  questionData: any,
  chartData: any,
  selectedBannerQuestionId: any
) {
  let labels: any = [];
  let seriesData: any[] = [];
  labels = questionData.options.map((label: any) => label.labelText);
  let scale =
    bannerQuestionList.find(
      (ques: any) => ques.qId === selectedBannerQuestionId
    )?.options || [];
  let chartDataComplete = chartData[0];

  scale.forEach((scaleOption: any) => {
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: questionData.options.map((option: any) => {
        if (option.labelCode in chartDataComplete) {
          const obj = chartDataComplete[option.labelCode] || [];
          if (obj && obj.length > 0) {
            const localBase = obj?.reduce(
              (sum: number, option: any) => sum + option.count,
              0
            );
            const subOptionData = obj.find(
              (subObj: any) => subObj.labelCode === scaleOption.labelCode
            );
            if (subOptionData) {
              const data = (subOptionData.count / localBase) * 100;

              return round(data, decimalPrecision);
            } else {
              return 0;
            }
          }
        }
      }),
    });
  });

  return seriesData;
}
