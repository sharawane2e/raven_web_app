import { decimalPrecision } from "../../constants/Variables";
import { round } from "../Utility";

export function singleChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {
  let labels: any = [];
  let values: any = [];
  let seriesData: any[] = [];
  let options = questionData?.options || [];

  options.forEach((option: any) => {
    const dataObj = chartData.find(
      (data: any) => data.labelCode === option.labelCode
    );

    labels.push(option.labelText);
    if (dataObj && dataObj.count > 0) {
      let count = round((dataObj.count / baseCount) * 100, decimalPrecision);
      values.push(count);
    } else {
      values.push(0);
    }
  });

  seriesData = [
    {
      name: questionData?.labelText,
      labels: labels,
      values: values,
    },
  ];

  return seriesData;
}
