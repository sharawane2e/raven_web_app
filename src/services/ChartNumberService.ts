// import { ChartType } from '../enums/ChartType';
import _ from "lodash";
import store from "../redux/store";
import { IQuestion } from "../types/IQuestion";
import { getPlotOptions, getToolTip } from "../utils/ChartOptionFormatter";
import { round, getmedian } from "../utils/Utility";
import {
  colorArr,
  decimalPrecision,
  primaryBarColor,
} from "../constants/Variables";
import { dataLabels } from "../redux/reducers/chartReducer";
import { getNumberPlotOptions } from "../utils/NumberPlotOptions";
import { ChartType } from "../enums/ChartType";

export const getNumberChartOption = (
  questionData: IQuestion,
  chartData: any,
  baseCount: Number
) => {
  const {
    chart: { chartType },
  } = store.getState();

  const data: any[] = [];
  const series: any[] = [];
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

  questionData.options.forEach((option: any, Index: any) => {
    data.push({
      name: option.labelText,
      y: meanMaxArr[Index],
      baseCount: baseCount,
    });
  });

  if (chartType === ChartType.STACK) {
    data.map((element: any, index: number) => {
      const name = element.name;
      const color = colorArr[index];
      const data = [
        {
          name: questionData?.labelText,
          y: element.y,
          baseCount: element.baseCount,
        },
      ];
      series.push({ name, color, data, dataLabels });
    });
  } else {
    series.push({
      color: primaryBarColor,
      name: questionData?.labelText,
      data,
      dataLabels,
    });
  }

  return {
    legend: {
      enabled: true,
    },
    plotOptions: getNumberPlotOptions(),
      series,
  };
};
