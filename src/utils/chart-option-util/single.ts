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
    chart: { chartLabelType, chartOptions, chartType, chartTranspose },
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

    if (chartTranspose) {
      series.length = 0;
      series.push(
        ...getSingleTransposeChartOptions(
          questionData,
          chartData,
          bannerQuestionData,
          subGroups,
        ),
      );
      //series.push(getSingleTransposeChartOptions(questionData, chartData));
      return series;
    }

    const newOptionData: any = [];
    // @ts-ignore
    for (let index = 0; index < bannerQuestionData?.options.length; index++) {
      const bannerQuesOption: any = bannerQuestionData?.options[index];
      const data: any[] = [];
      let localBase;

      let optionData;
      for (let quesIndex = 0; quesIndex < subGroups.length; quesIndex++) {
        const quesOption = subGroups[quesIndex];

        if (Array.isArray(quesOption.labelCode)) {
          const labelCodeArr = quesOption.labelCode;
          const labelCodeSum: any = [];
          const baseCountSum: any = [];
          var labeCodeSum = 0;
          for (let j = 0; j < labelCodeArr.length; j++) {
            let currKey = labelCodeArr[j];
            let dataArr = chartData[0][currKey];
            labelCodeSum.push(dataArr);
            for (let k: any = 0; k < dataArr.length; k++) {
              if (dataArr[k].labelCode === bannerQuesOption.labelCode) {
                const dataArrValues: any = dataArr[k];
                newOptionData.push(dataArrValues);
                labeCodeSum += dataArrValues.count;
              }
            }
          }

          optionData = newOptionData;

          labelCodeSum.forEach((el: any) => {
            const localbaseCount = el?.reduce(
              (sum: number, option: any) => sum + option.count,
              0,
            );
            baseCountSum.push(localbaseCount);
          });

          count = labeCodeSum;
          const sumofValue = _.sum(baseCountSum);
          localBase = sumofValue;
        } else {
          optionData = chartData[0][quesOption.labelCode];

          const label = getMatchedfilter(
            optionData,
            'labelCode',
            bannerQuesOption.labelCode,
          );

          count = _.sumBy(label, function (o) {
            return o.count;
          });
          localBase = optionData?.reduce(
            (sum: number, option: any) => sum + option.count,
            0,
          );
        }

        if (bannerQuestionData?.type == QuestionType.MULTI) {
          localBase = find(chartData[0][1], {
            labelCode: quesOption.labelCode,
          })?.count;
        }

        if (chartLabelType === ChartLabelType.PERCENTAGE) {
          count = (count / localBase) * 100;
        } else {
          count = count;
        }
        // let percentageValue = count == 0 ? count : (count / localBase) * 100;
        let percentageValue = count;
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

const getSingleTransposeChartOptions = (
  questiondata: any,
  chartData: any,
  bannerQuestionData: any,
  optionSubGroups: any,
) => {
  const {
    chart: { chartLabelType },
  } = store.getState();

  const series: any[] = [];
  let count = 0;
  const newOptionData: any = [];

  for (let index = 0; index < questiondata?.options.length; index++) {
    const quesOption = optionSubGroups[index];
    const data: any[] = [];
    let localBase;
    let optionData;

    for (let quesIndex = 0; quesIndex < optionSubGroups.length; quesIndex++) {
      const bannerQuesOption: any = bannerQuestionData?.options[quesIndex];

      if (Array.isArray(quesOption.labelCode)) {
        const labelCodeArr = quesOption.labelCode;
        const labelCodeSum: any = [];
        const baseCountSum: any = [];
        var labeCodeSum = 0;
        for (let j = 0; j < labelCodeArr.length; j++) {
          let currKey = labelCodeArr[j];
          let dataArr = chartData[0][currKey];
          labelCodeSum.push(dataArr);
          for (let k: any = 0; k < dataArr.length; k++) {
            if (dataArr[k].labelCode === bannerQuesOption?.labelCode) {
              const dataArrValues: any = dataArr[k];
              newOptionData.push(dataArrValues);
              labeCodeSum += dataArrValues?.count;
            }
          }
        }

        optionData = newOptionData;

        labelCodeSum.forEach((el: any) => {
          const localbaseCount = el?.reduce(
            (sum: number, option: any) => sum + option.count,
            0,
          );
          baseCountSum.push(localbaseCount);
        });

        count = labeCodeSum;
        // const sumofValue = _.sum(baseCountSum);
        // localBase = sumofValue;

        //console.log('optionData', sumofValue);
      } else {
        optionData = chartData[0][quesOption?.labelCode];

        // console.log('chartData[0]', optionData);
        const label = getmatchedFind(
          optionData,
          'labelCode',
          bannerQuesOption?.labelCode,
        );
        const dataFind = _.find(optionData, function (o) {
          return o.labelCode === bannerQuesOption?.labelCode;
        });

        console.log(dataFind);
        // count = _.sumBy(label, function (o) {
        //   return o?.count;
        // });

        count = 0;
        localBase = optionData?.reduce(
          (sum: number, option: any) => sum + option?.count,
          0,
        );
      }
      console.log(localBase);
      if (bannerQuestionData?.type == QuestionType.MULTI) {
        localBase = find(chartData[0][1], {
          labelCode: quesOption.labelCode,
        })?.count;
      }

      if (chartLabelType === ChartLabelType.PERCENTAGE) {
        count = (count / localBase) * 100;
      } else {
        count = count;
      }
      // let percentageValue = count == 0 ? count : (count / localBase) * 100;
      let percentageValue = count;
      let numberValue = count;

      data.push({
        name: bannerQuesOption?.labelText,
        y: count,
        percentageValue,
        numberValue,
        baseCount: localBase,
      });
    }

    // if (data.length)
    series.push({
      name: quesOption?.labelText,
      color: index < colorArr.length ? colorArr[index] : undefined,
      data,
      dataLabels,
    });
  }
  //console.log(series);
  return series;
};
