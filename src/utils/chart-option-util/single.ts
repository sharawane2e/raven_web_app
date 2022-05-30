import { QuestionType } from '../../enums/QuestionType';
import store from '../../redux/store';
import { IQuestionOption } from '../../types/IBaseQuestion';
import { IQuestion } from '../../types/IQuestion';
import _, { find } from 'lodash';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { getMatchedfilter, getmatchedFind, getSum, round } from '../Utility';
import {
  colorArr,
  decimalPrecision,
  primaryBarColor,
} from '../../constants/Variables';
import { dataLabels } from '../../redux/reducers/chartReducer';
import { ChartType } from '../../enums/ChartType';

export const getSingleChartOptionsSeries = (
  questionData: IQuestion,
  chartData: any,
  baseCount: number,
  bannerQuestionData: IQuestion | null,
  chartOptionsData: any,
) => {
  const {
    chart: { chartLabelType, chartOptions, chartType },
    questions: { selectedBannerQuestionId, questionList },
  } = store.getState();

  if (selectedBannerQuestionId) {
    const series: any[] = [];
    let subGroups: any;
    let count = 0;
    subGroups = questionData.options.filter((option: IQuestionOption) => {
      const subGroup: any = [];
      const subGroup1 = getmatchedFind(
        questionData.options,
        'labelCode',
        option.labelCode,
      );
      subGroup.push(subGroup1);
      if (subGroup && subGroup?.length) return true;
      return false;
    });

    const curentdata: any = [];
    let localBase;

    // @ts-ignore
    for (let index = 0; index < bannerQuestionData?.options.length; index++) {
      const bannerQuesOption: any = bannerQuestionData?.options[index];
      const data: any[] = [];

      let optionData;
      for (let quesIndex = 0; quesIndex < subGroups.length; quesIndex++) {
        const quesOption = subGroups[quesIndex];

        if (!Array.isArray(quesOption.labelCode)) {
          optionData = chartData[0][quesOption.labelCode];
        } else {
          //  debugger;
          const labelCodeArr = quesOption.labelCode;
          //console.log(labelCodeArr);
          const mainData: any = [];
          const arryVale: any = [];
          for (let j = 0; j < labelCodeArr.length; j++) {
            let currKey = labelCodeArr[j];
            let dataArr = chartData[0][currKey];
            // console.log(dataArr);
            mainData.push(dataArr);

            for (let k: any = 0; k < dataArr.length; k++) {
              if (dataArr[k].labelCode === bannerQuesOption.labelCode) {
                const dataArrValues: any = dataArr[k];
                curentdata.push(dataArrValues);
              }
            }
          }
          optionData = curentdata;

          mainData.forEach((el: any) => {
            //console.log(el);
            const localbaseCount = el?.reduce(
              (sum: number, option: any) => sum + option.count,
              0,
            );
            // console.log(localBaseqq);
            arryVale.push(localbaseCount);
          });
          const sumofValue = _.sum(arryVale);
          // console.log(sumofValue);
          localBase = sumofValue;
        }

        if (!Array.isArray(quesOption.labelCode)) {
          localBase = optionData?.reduce(
            (sum: number, option: any) => sum + option.count,
            0,
          );
        } else {
          // console.log(optionData);
          localBase = localBase;
        }

        if (bannerQuestionData?.type == QuestionType.MULTI) {
          localBase = find(chartData[1], {
            labelCode: quesOption.labelCode,
          })?.count;
        }

        const label = getMatchedfilter(
          optionData,
          'labelCode',
          bannerQuesOption.labelCode,
        );

        //console.log(label);

        count = _.sumBy(label, function (o) {
          return o.count;
        });

        if (chartLabelType === ChartLabelType.PERCENTAGE) {
          count = (count / localBase) * 100;
        } else {
          count = count;
        }
        let percentageValue = count == 0 ? count : (count / localBase) * 100;
        let numberValue = count;

        data.push({
          name: quesOption.labelText,
          y: count,
          percentageValue,
          numberValue,
          baseCount: localBase,
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
    return series;
  } else {
    const data: any[] = [];

    for (
      let optionIndex = 0;
      optionIndex < questionData.options.length;
      optionIndex++
    ) {
      const option = questionData.options[optionIndex];

      const labelCollection = getMatchedfilter(
        chartData,
        'labelCode',
        option.labelCode,
      );

      let count = 0;
      if (labelCollection) {
        count = getSum(labelCollection, 'count');
      }
      let plotValue;
      let percentageValue = (count / baseCount) * 100;
      let numberValue = count;
      if (chartLabelType === ChartLabelType.PERCENTAGE) {
        plotValue = (count / baseCount) * 100;
      } else {
        plotValue = count;
      }
      if (plotValue > 0)
        data.push({
          name: option.labelText,
          // y: round(plotValue, decimalPrecision),
          y: plotValue,
          percentageValue,
          numberValue,
          baseCount: baseCount,
        });
    }

    const series: any[] = [];

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
            baseCount: element.baseCount,
          },
        ];
        series.push({ name, color, data, dataLabels });
      });
    } else {
      series.push({
        color: primaryBarColor,
        name: questionData.labelText,
        data,
        dataLabels,
      });
    }
    return series;
  }
};
