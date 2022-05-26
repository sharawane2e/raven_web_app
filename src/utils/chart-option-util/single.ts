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
    //debugger;
    const categories: string[] = [];
    const series: any[] = [];
    let subGroups: any;

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

    let resArr = [];

    // for (let i = 0; i < questionData.options.length; i++) {
    //   let currObj: any = questionData.options[i];
    //   if (Array.isArray(currObj.labelCode)) {
    //     let labelCodeArr = currObj.labelCode;
    //     let currCountSum = 0;
    //     for (let j = 0; j < labelCodeArr.length; j++) {
    //       let currKey = labelCodeArr[j];

    //       let dataArr = chartData[0][currKey];
    //       for (let k = 0; k < dataArr.length; k++) {
    //         let currDataObj = dataArr[k];
    //         if (currDataObj.labelCode == '1') currCountSum += currDataObj.count;
    //       }
    //     }
    //     resArr.push(currCountSum);
    //   } else {
    //   }
    // }

    let count = 0;
    // @ts-ignore
    for (let index = 0; index < bannerQuestionData?.options.length; index++) {
      const bannerQuesOption: any = bannerQuestionData?.options[index];
      const data: any[] = [];

      let optionData;
      for (let quesIndex = 0; quesIndex < subGroups.length; quesIndex++) {
        const quesOption = subGroups[quesIndex];
        const curentdata: any = [];
        // console.log(quesOption);
        // console.log(chartData[0]);
        if (!Array.isArray(quesOption.labelCode)) {
          optionData = chartData[0][quesOption.labelCode];
        } else {
          let labelCodeArr = quesOption.labelCode;
          for (let j = 0; j < labelCodeArr.length; j++) {
            let currKey = labelCodeArr[j];
            let currCountSum: any;
            let dataArr = chartData[0][currKey];

            for (let k = 0; k < dataArr.length; k++) {
              // console.log(dataArr[k]);

              if (dataArr[k].labelCode === bannerQuesOption.labelCode) {
                // dataArr[k];
                currCountSum += currCountSum;
                curentdata.push(dataArr[k]);
              }
            }
          }
          // curentdata.forEach((el: any) => {
          //   console.log('quesOption.labelCode', bannerQuesOption.labelCode);
          //   //console.log('el.labelCode', el.labelCode);
          //   if (el.labelCode === bannerQuesOption.labelCode) {
          //     console.log('chala');
          //   }
          // });
          //const optionData1 = curentdata;
          // optionData = curentdata;
          //debugger;
          //optionData = curentdata[bannerQuesOption.labelCode];
          count = _.sumBy(curentdata, function (o: any) {
            return o.count;
          });
        }

        //if (optionData) {
        const label = optionData.find(
          // @ts-ignore
          (option: any) => option.labelCode === bannerQuesOption.labelCode,
        );

        let localBase = optionData?.reduce(
          (sum: number, option: any) => sum + option.count,
          0,
        );

        if (bannerQuestionData?.type == QuestionType.MULTI) {
          localBase = find(chartData[1], {
            labelCode: quesOption.labelCode,
          })?.count;
        }

        if (chartLabelType === ChartLabelType.PERCENTAGE && label) {
          count = (label.count / localBase) * 100;
        } else if (chartLabelType === ChartLabelType.NUMBER && label) {
          count = label.count;
        }
        //console.log("baseCount", baseCount);
        if (label) {
          let percentageValue =
            label.count == 0 ? label.count : (label.count / localBase) * 100;
          let numberValue = label.count;

          data.push({
            name: quesOption.labelText,
            // y: +count.toFixed(decimalPrecision),
            y:
              count !== null
                ? label.count == 0
                  ? label.count
                  : round(count, decimalPrecision)
                : 0,
            percentageValue,
            numberValue,
            baseCount: localBase,
          });
        }
        // }
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
