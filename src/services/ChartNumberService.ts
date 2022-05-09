// import { ChartType } from '../enums/ChartType';
import _, { find } from 'lodash';
import store from '../redux/store';
import { IQuestion } from '../types/IQuestion';
import { getPlotOptions, getToolTip } from '../utils/ChartOptionFormatter';
// import { round, getmedian } from '../utils/Utility';
import {
  colorArr,
  decimalPrecision,
  primaryBarColor,
} from '../constants/Variables';
import { dataLabels } from '../redux/reducers/chartReducer';
import { getNumberPlotOptions } from '../utils/NumberPlotOptions';
import { ChartType } from '../enums/ChartType';
import { IQuestionOption } from '../types/IBaseQuestion';
// import { QuestionType } from '../enums/QuestionType';
// import { ChartLabelType } from '../enums/ChartLabelType';
import { mean, median, min, max } from 'simple-statistics';

export const getNumberChartOption = (
  questionData: IQuestion,
  chartData: any[],
  baseCount: number,
  bannerQuestionData: any,
  chartOptionsData: any,
) => {
  const {
    questions: { selectedBannerQuestionId, questionList },
  } = store.getState();

  const {
    chart: { chartType },
  } = store.getState();
  const {
    chart: { chartLabelType, chartOptions },
  } = store.getState();

  const series: any[] = [];

  if (selectedBannerQuestionId) {
    //const categories: string[] = [];
    const series: any[] = [];

    // questionData.options.forEach((option) => {
    //   categories.push(option.labelText);
    // });
    const meanMaxArr: any[] = [];

    const subGroups = questionData.options.filter((option: IQuestionOption) => {
      const subGroup = chartData[0][option.labelCode];
      if (subGroup && subGroup?.length) return true;
      return false;
    });

    let optionData = chartData[0];
    let chartOptionsData: any = [];

    Object.keys(optionData).forEach(function (key) {
      chartOptionsData.push(optionData[key]);
    });

    chartOptionsData.forEach((chart_el: any, chartIndex: Number) => {
      const meanMediaArr: any = [];
      const chartelment = chart_el[0];
      const meanValue = mean(chartelment?.values);
      const minValue = min(chartelment?.values);
      const maxValue = max(chartelment?.values);
      const medainValue = median(chartelment?.values);
      meanMediaArr.push(meanValue, medainValue, minValue, maxValue);
      meanMaxArr.push(meanMediaArr);
    });

    for (let index = 0; index < bannerQuestionData?.options.length; index++) {
      const bannerQuesOption = bannerQuestionData?.options[index];
      const data: any[] = [];

      for (let quesIndex = 0; quesIndex < subGroups.length; quesIndex++) {
        const quesOption = subGroups[quesIndex];
        data.push({
          name: quesOption.labelText,
          y: meanMaxArr[index][quesIndex],
          baseCount: baseCount,
        });
      }

      if (data.length)
        series.push({
          name: bannerQuesOption?.labelText,
          color: index > colorArr.length ? colorArr[index] : undefined,
          data,
          dataLabels,
        });
    }

    return {
      legend: {
        enabled: true,
      },
      tooltip: { ...getToolTip() },
      series,
    };
  } else {
    const data: any[] = [];

    let values: any;
    let weightedValueSum: any;
    let weightsSum: any;
    const meanMaxArr: any[] = [];

    chartData.forEach((chart_el: any, chartIndex: Number) => {
      values = chart_el?.values;
      weightedValueSum = chart_el?.weightedValueSum;
      weightsSum = chart_el?.weightsSum;
    });

    //const valueSum = _.sum(values);
    // const meanValue = valueSum / weightsSum;
    // const minValue = _.min(values);
    // const maxValue = _.max(values);
    // const medainValue = getmedian(values);
    const meanValue = mean(values);
    const minValue = min(values);
    const maxValue = max(values);
    const medainValue = median(values);

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
  }

  return {
    legend: {
      enabled: true,
    },
    plotOptions: getNumberPlotOptions(),
    series,
  };
};
