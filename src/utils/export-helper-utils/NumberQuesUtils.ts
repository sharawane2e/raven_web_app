import { decimalPrecision } from "../../constants/Variables";
import { round, getmedian } from "../../utils/Utility";
import store from "../../redux/store";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { ChartType } from "../../enums/ChartType";
import _ from "lodash";

export function numberChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {

 let seriesData: any[] = [];
 const data: any[] = [];
 let values;
  let weightedValueSum: any;
  let weightsSum: any;
  const meanMaxArr: any[] = [];

  chartData.forEach((chart_el: any, chartIndex: Number) => {
    values = chart_el?.values;
    weightedValueSum = chart_el?.weightedValueSum;
    weightsSum = chart_el?.weightsSum;
  });

  const valueSum = _.sum(values);

  const meanValue = valueSum / weightsSum;

  const minValue = _.min(values);
  const maxValue = _.max(values);
  const medainValue = getmedian(values);

  meanMaxArr.push(meanValue, medainValue, minValue, maxValue);

  // // const weightSum = _.sum(weightCount);
  // // const updatedweightSum = _.sum(updateWeight);

  // const meanValue = weightedValueSum / weightsSum;

  // const medainValue = getmedian(valueArr[0]);

  // const minValue = _.min(valueArr[0]);
  // const maxValue = _.max(valueArr[0]);
  // // console.log("weightValue",weightValue);

  // meanMaxArr.push(meanValue, medainValue, minValue, maxValue);

  questionData.options.forEach((option: any, Index: any) => {
    data.push(option.labelText);
  });
  // // console.log("data", data);

  seriesData = [
    {
      name: questionData?.labelText,
      labels: data,
      values: meanMaxArr,
    },
  ];

  // console.log("seriesData", seriesData);

  return seriesData;
}
