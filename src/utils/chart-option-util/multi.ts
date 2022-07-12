import _ from 'lodash';
import { find, round } from 'lodash';
import {
  colorArr,
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

  const {
    plotOptions: {
      series: {
        dataLabels: { format },
      },
    },
  } = chartOptionsData;

  if (selectedBannerQuestionId) {
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
        // console.log(optionData);

        let count = 0;
        // debugger;
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
            localBase = find(chartData[1], function (o) {
              return o.labelCode === quesOption.labelCode;
            })?.count;
          }

          if (chartLabelType === ChartLabelType.PERCENTAGE && label) {
            count = (label.count / localBase) * 100;
          } else if (chartLabelType === ChartLabelType.NUMBER && label) {
            count = label.count;
          }

          if (label) {
            let percentageValue = (label.count / localBase) * 100;
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

    // return {
    //   legend: {
    //     enabled: true,
    //   },
    //   tooltip: { ...getToolTip() },
    //   series,
    // };
  } else {
    const data: any[] = [];
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
            // y: round(plotValue, decimalPrecision),
            y: plotValue,
            percentageValue,
            numberValue,
            baseCount: baseCount,
            color: '#f1ad0f',
          });
        } else {
          data.push({
            name: option.labelText,
            // y: round(plotValue, decimalPrecision),
            y: plotValue,
            percentageValue,
            numberValue,
            baseCount: baseCount,
          });
        }
      }
    }

    if (chartType === ChartType.STACK) {
      data.map((element: any, index: number) => {
        //console.log("element", element);
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
        series.push({ name, color, data, dataLabels });
      });
    } else {
      series.push({
        color: primaryBarColor,
        name: questionData.labelText,
        data,
        dataLabels: {
          formatter: function (this: any) {
            // if (this.y > 100) {
            //   return this.y + 'CB';
            // }
            return this.y + 'AB' + this.key;
          },
        },
      });
    }
  }
  return series;
};