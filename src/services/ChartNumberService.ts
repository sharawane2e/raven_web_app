import store from '../redux/store';
import { IQuestion } from '../types/IQuestion';
import { colorArr, primaryBarColor } from '../constants/Variables';
import { dataLabels } from '../redux/reducers/chartReducer';
import { getNumberPlotOptions, getToolTip } from '../utils/NumberPlotOptions';
import { ChartType } from '../enums/ChartType';
import { IQuestionOption } from '../types/IBaseQuestion';
import { mean, median, min, max } from 'simple-statistics';
import _ from 'lodash';
import { getMedian, round } from '../utils/Utility';

export const getNumberChartOption = (
  questionData: IQuestion,
  chartData: any[],
  baseCount: number,
  bannerQuestionData: any,
  chartOptionsData: any,
  transposed: any,
) => {
  const {
    questions: { selectedBannerQuestionId },
  } = store.getState();

  const {
    chart: { chartType },
  } = store.getState();

  const series: any[] = [];

  if (selectedBannerQuestionId) {
    const series: any[] = [];
    const meanMaxArr: any = {};

    const subGroups = questionData.options.filter((option: IQuestionOption) => {
      const subGroup = [option.labelCode];
      if (subGroup && subGroup?.length) return true;
      return false;
    });

    console.log(bannerQuestionData.options);

    let optionData = chartData[0];
    let chartOptionsData: any = [];

    for (let key in optionData) {
      if (optionData[key].length == 0) {
        const meanMedianArr: any = [];
        const meanValue = '';
        const minValue = '';
        const maxValue = '';
        const medainValue = '';
        meanMedianArr.push(meanValue, medainValue, minValue, maxValue);
        meanMaxArr[key] = meanMedianArr;
      } else {
        const meanMedianArr: any = [];
        const chartelment = optionData[key][0];
        const meanValue =
          chartelment?.weightedValueSum / chartelment?.weightsSum;
        const minValue = min(chartelment?.values);
        const maxValue = max(chartelment?.values);
        const medainValue = getMedian(
          chartelment?.values,
          chartelment?.weights,
        );
        meanMedianArr.push(meanValue, medainValue, minValue, maxValue);
        meanMaxArr[key] = meanMedianArr;
      }
    }

    for (let index = 0; index < bannerQuestionData?.options.length; index++) {
      const bannerQuesOption = bannerQuestionData?.options[index];
      const data: any[] = [];

      for (let quesIndex = 0; quesIndex < subGroups.length; quesIndex++) {
        const quesOption = subGroups[quesIndex];

        if (meanMaxArr[bannerQuesOption.labelCode][quesIndex] != '') {
          data.push({
            name: quesOption.labelText,
            y: meanMaxArr[bannerQuesOption.labelCode][quesIndex],
            baseCount: baseCount,
          });
        }
      }

      if (data.length)
        series.push({
          name: bannerQuesOption?.labelText,
          data,
          dataLabels,
        });
    }
    // debugger;

    if (transposed) {
      const transposedSeries = [];
      for (let index = 0; index < questionData.options.length; index++) {
        // console.log(questionData.options[index]);
        const seriesName = questionData.options[index].labelText;
        const data: any[] = [];

        for (let quesIndex = 0; quesIndex < series.length; quesIndex++) {
          data.push({
            name: series[quesIndex].name,
            y: series[quesIndex].data[index].y,
            baseCount: series[quesIndex].data[index].baseCount,
          });
        }

        if (data.length)
          transposedSeries.push({
            name: seriesName,
            data,
            dataLabels,
          });
      }

      series.length = 0;
      series.push(...transposedSeries);
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
    let weightArray: any;

    chartData.forEach((chart_el: any, chartIndex: Number) => {
      weightArray = chart_el.weights;
      values = chart_el?.values;
      weightedValueSum = chart_el?.weightedValueSum;
      weightsSum = chart_el?.weightsSum;
    });

    const medainValue = getMedian(values, weightArray);

    const meanValue = weightedValueSum / weightsSum;
    const minValue = min(values);
    const maxValue = max(values);

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
    tooltip: { ...getToolTip() },
    series,
  };
};
