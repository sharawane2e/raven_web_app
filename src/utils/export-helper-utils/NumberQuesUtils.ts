import {
  getmean,
  getmedian,
  getmin,
  getmax,
} from '../../utils/simplestatistics';
import store from '../../redux/store';
import { IQuestionOption } from '../../types/IBaseQuestion';
import { getMedian } from '../Utility';

export function numberChartDataGen(
  questionData: any,
  chartData: any,
  chartTranspose: any,
  bannerQuestionData: any,
) {
  let seriesData: Array<Object> = [];

  const {
    questions: { selectedBannerQuestionId },
  } = store.getState();

  if (selectedBannerQuestionId) {
    if (
      questionData != undefined &&
      bannerQuestionData != (null || undefined)
    ) {
      const meanMaxArr: any = {};
      const labels: Array<string> = questionData.options.map(
        (label: IQuestionOption) => label.labelText,
      );

      const subGroups = questionData.options.filter(
        (option: IQuestionOption) => {
          const subGroup = chartData[0][option.labelCode];
          if (subGroup && subGroup?.length) return true;
          return false;
        },
      );

      let optionData = chartData[0];

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
          const minValue = getmin(chartelment?.values);
          const maxValue = getmax(chartelment?.values);
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
          if (meanMaxArr[bannerQuesOption.labelCode][quesIndex] != '') {
            const values: any =
              meanMaxArr[bannerQuesOption.labelCode][quesIndex];
            data.push(values);
          }
        }

        if (data.length)
          seriesData.push({
            name: bannerQuesOption?.labelText,
            values: data,
            labels,
          });
      }

      if (chartTranspose) {
        const transposedSeries = [];
        for (let index = 0; index < questionData.options.length; index++) {
          const seriesName = questionData.options[index].labelText;
          const data: any[] = [];
          const labels: any[] = [];

          for (let quesIndex = 0; quesIndex < seriesData.length; quesIndex++) {
            const dataValue: any = seriesData[quesIndex];
            data.push(dataValue.values[index]);
            labels.push(dataValue.name);
          }
          if (data.length)
            transposedSeries.push({
              name: seriesName,
              values: data,
              labels,
            });
        }

        seriesData.length = 0;
        seriesData.push(...transposedSeries);
      }
    }
  } else {
    if (bannerQuestionData === null) {
      const data: any[] = [];
      let values: any;
      let weightedValueSum: any;
      let weightsSum: any;
      const meanMaxArr: any[] = [];

      values = chartData[0]?.values;
      weightedValueSum = chartData[0]?.weightedValueSum;
      weightsSum = chartData[0]?.weightsSum;
      const meanValue = getmean(values);
      const minValue = getmin(values);
      const maxValue = getmax(values);
      const medainValue = getmedian(values);

      meanMaxArr.push(meanValue, medainValue, minValue, maxValue);

      questionData.options.forEach((option: any, Index: any) => {
        data.push(option.labelText);
      });

      seriesData = [
        {
          name: questionData?.labelText,
          labels: data,
          values: meanMaxArr,
        },
      ];
    }
  }

  return seriesData;
}
