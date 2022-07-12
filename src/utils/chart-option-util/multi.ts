import _ from 'lodash';
import { find, round } from 'lodash';
import {
  colorArr,
  dataLabelsFormate,
  dataLabelsNumberFormate,
  decimalPrecision,
  primaryBarColor,
} from '../../constants/Variables';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { ChartType } from '../../enums/ChartType';
import { QuestionType } from '../../enums/QuestionType';
import { dataLabels } from '../../redux/reducers/chartReducer';
import store from '../../redux/store';
import { IQuestionOption } from '../../types/IBaseQuestion';
import { getToolTip } from '../ChartOptionFormatter';

export const getMultiChartOptionsSeries = (
  questionData: any,
  chartData: any,
  baseCount: any,
  bannerQuestionData: any,
  chartOptionsData: any,
  transposed: any,
) => {
  const {
    questions: { bannerQuestionList },
  } = store.getState();
  const selectedBannerQuestionId = bannerQuestionData?.qId;
  const series: any[] = [];

  const {
    chart: { chartLabelType },
  } = store.getState();

  const {
    chart: { chartType },
  } = store.getState();

  if (selectedBannerQuestionId) {
    debugger;
    console.log('multi data update with chart');
    //debugger;
    const categories: string[] = [];

    questionData.options.forEach((option: any) => {
      categories.push(option.labelText);
    });

    const subGroups = questionData.options.filter((option: IQuestionOption) => {
      const subGroup = chartData[0][option.labelCode];
      if (subGroup && subGroup?.length) return true;
      return false;
    });

    // @ts-ignore
    for (let index = 0; index < bannerQuestionData?.options.length; index++) {
      const bannerQuesOption = bannerQuestionData?.options[index];
      const data: any[] = [];

      for (let quesIndex = 0; quesIndex < subGroups.length; quesIndex++) {
        const quesOption = subGroups[quesIndex];

        let optionData = chartData[0][quesOption.labelCode];

        let count = 0;

        if (optionData) {
          const label = optionData.find(
            // @ts-ignore
            (option: any) => option.labelCode === bannerQuesOption.labelCode,
          );

          let localBase = optionData?.reduce(
            (sum: number, option: any) => sum + option.count,
            0,
          );

          const bannerQuestion: any = find(bannerQuestionList, function (o) {
            return o.qId === selectedBannerQuestionId;
          });
          const bannerQuestionType = bannerQuestion.type;

          if (bannerQuestionType == QuestionType.MULTI) {
            //this is working in multi 2 multi
            localBase = find(chartData[0], function (o) {
              return o.labelCode === quesOption.labelCode;
            })?.count;
          }

          if (chartLabelType === ChartLabelType.PERCENTAGE && label) {
            count = (label.count / 5400) * 100;
          } else if (chartLabelType === ChartLabelType.NUMBER && label) {
            count = label.count;
          }

          if (label) {
            let percentageValue = (label.count / 5400) * 100;
            let numberValue = label.count;
            if (count)
              data.push({
                name: quesOption.labelText,
                // y: +count.toFixed(decimalPrecision),
                y: count !== null ? round(count, decimalPrecision) : 0,
                percentageValue,
                numberValue,
                baseCount: localBase,
              });
          }
        }
      }

      if (data.length)
        series.push({
          name: bannerQuesOption?.labelText,
          color: index < colorArr.length ? colorArr[index] : undefined,
          data,
          dataLabels,
        });
    }
  } else {
    series.push(
      ...getMultiSeries(
        questionData,
        chartData,
        baseCount,
        chartLabelType,
        chartType,
      ),
    );
  }
  return series;
};

const getMultiSeries = (
  questionData: any,
  chartData: any,
  baseCount: any,
  chartLabelType: any,
  chartType: any,
) => {
  const data: any[] = [];
  const series: any[] = [];
  for (
    let optionIndex = 0;
    optionIndex < questionData.options.length;
    optionIndex++
  ) {
    const option = questionData.options[optionIndex];
    const label = chartData.find(
      (record: { labelCode: string; count: number }) =>
        record.labelCode === option.labelCode,
    );
    let count = 0;
    if (label) {
      count = label.count;
    }
    // const plotValue = +((count / baseCount) * 100).toFixed(decimalPrecision);
    let plotValue;
    // plotValue = (count / baseCount) * 100;
    let percentageValue = (count / baseCount) * 100;
    let numberValue = count;
    if (chartLabelType === ChartLabelType.PERCENTAGE) {
      plotValue = (count / baseCount) * 100;
    } else {
      plotValue = count;
    }

    if (plotValue > 0) {
      const seriesObject = _.find(questionData.options, function (o) {
        return o.labelCode === option.labelCode;
      });
      if (seriesObject?.labelCode.split('_')[0] == 'N') {
        data.push({
          name: option.labelText,
          y: plotValue,
          percentageValue,
          numberValue,
          baseCount: baseCount,
          color: '#f1ad0f',
        });
      } else {
        data.push({
          name: option.labelText,
          y: plotValue,
          percentageValue,
          numberValue,
          baseCount: baseCount,
        });
      }
    }
  }

  let newDataLabels: any;
  if (chartLabelType == ChartLabelType.PERCENTAGE) {
    newDataLabels = dataLabelsFormate;
  } else {
    newDataLabels = dataLabelsNumberFormate;
  }

  if (chartType === ChartType.STACK) {
    data.map((element: any, index: number) => {
      const name = element.name;
      const color = colorArr[index];
      const data = [
        {
          name: questionData.labelText,
          y: element.y,
          numberValue: element.numberValue,
          percentageValue: element.percentageValue,
          baseCount: baseCount,
        },
      ];
      series.push({
        name,
        color,
        data,
        dataLabels: {
          ...newDataLabels,
        },
      });
    });
  } else {
    series.push({
      color: primaryBarColor,
      name: questionData.labelText,
      data,
      dataLabels: {
        ...newDataLabels,
      },
    });
  }
  return series;
};
