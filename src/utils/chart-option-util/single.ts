import { QuestionType } from '../../enums/QuestionType';
import store from '../../redux/store';
import { IQuestionOption } from '../../types/IBaseQuestion';
import { IQuestion } from '../../types/IQuestion';
import _, { find } from 'lodash';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { getMatchedfilter, getmatchedFind, getSum, round } from '../Utility';
import { colorArr, primaryBarColor } from '../../constants/Variables';
import { dataLabels } from '../../redux/reducers/chartReducer';
import { ChartType } from '../../enums/ChartType';

export const getSingleChartOptionsSeries = (
  questionData: IQuestion,
  chartData: any,
  baseCount: number,
  bannerQuestionData: IQuestion | null,
  chartOptionsData: any,
  transposed: boolean,
) => {
  //debugger;

  // console.log('questionData', questionData);
  // console.log('chartData', chartData);
  // console.log("questionData",questionData);
  const {
    chart: { chartLabelType, chartType },
    questions: { selectedBannerQuestionId, bannerQuestionList },
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

    //console.log(subGroups);

    if (transposed && bannerQuestionData?.type == QuestionType.SINGLE) {
      series.length = 0;
      series.push(
        ...getSingleTransposeChartOptions(
          questionData,
          chartData,
          bannerQuestionData,
          subGroups,
          transposed,
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
          // optionData = chartData[0][quesOption.labelCode];

          // if (chartData[0][quesOption.labelCode].length != 0) {
          optionData = chartData[0][quesOption.labelCode];
          // }

          const label = getMatchedfilter(
            optionData,
            'labelCode',
            bannerQuesOption.labelCode,
          );
          // if()
          //if (label.length != 0) {
          count = _.sumBy(label, function (o) {
            return o.count;
          });
          //   }
          //  console.log('filteredOptions', label);

          localBase = optionData?.reduce(
            (sum: number, option: any) => sum + option.count,
            0,
          );
        }

        if (chartLabelType === ChartLabelType.PERCENTAGE) {
          count = (count / localBase) * 100;
        } else {
          count = count;
        }
        // let percentageValue = count == 0 ? count : (count / localBase) * 100;
        let percentageValue = (count / localBase) * 100;
        let numberValue = count;

        if (count)
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
    console.log('series', series);

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
  transposed: any,
) => {
  console.log('demdo');
  const {
    chart: { chartLabelType, chartTranspose },
  } = store.getState();

  const series: any[] = [];
  let count = 0;
  const newOptionData: any = [];
  const allLabels: Array<string> = [];
  const newChartData: any = {};
  const basecountArr: any = [];
  //let dataSum = [];

  for (const labelArrays in chartData[0]) {
    const labelArray = chartData[0][labelArrays];
    labelArray.forEach((el: any) => {
      if (allLabels.indexOf(el.labelCode) == -1) {
        allLabels.push(el.labelCode);
        newChartData[el.labelCode] = [];
      }
      newChartData[el.labelCode].push({
        count: el.count,
        labelCode: labelArrays,
      });
    });
  }
  for (const key in newChartData) {
    const localBaseCount = _.sumBy(newChartData[key], function (o: any) {
      return o?.count;
    });
    basecountArr.push(localBaseCount);
  }

  for (let index = 0; index < questiondata?.options.length; index++) {
    const quesOption = optionSubGroups[index];
    const data: any[] = [];
    let localBase;
    let optionData: any;

    //console.log(bannerQuestionData?.options);

    for (
      let quesIndex = 0;
      quesIndex < bannerQuestionData?.options.length;
      quesIndex++
    ) {
      const bannerQuesOption: any = bannerQuestionData?.options[quesIndex];

      if (Array.isArray(quesOption.labelCode)) {
        const labelCodeArr = quesOption.labelCode;
        const labelCodeSum: any = [];
        // const baseCountSum: any = [];
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

        // optionData = newOptionData;
        count = labeCodeSum;
      } else {
        optionData = chartData[0][quesOption?.labelCode];
        console.log('optionData', optionData);
        // console.log('optionData', optionData);
        const label = getmatchedFind(
          optionData,
          'labelCode',
          bannerQuesOption?.labelCode,
        );

        count = label?.count;
      }

      // if (bannerQuestionData?.type == QuestionType.MULTI) {
      //   debugger;
      //   localBase = find(chartData[0][1], {
      //     labelCode: quesOption.labelCode,
      //   })?.count;
      // }
      localBase = basecountArr[quesIndex];

      if (chartLabelType === ChartLabelType.PERCENTAGE) {
        count = (count / localBase) * 100;
      } else {
        count = count;
      }

      let percentageValue = (count / localBase) * 100;
      let numberValue = count;
      data.push({
        name: bannerQuesOption?.labelText,
        y: count,
        percentageValue,
        numberValue,
        baseCount: localBase,
      });
    }

    series.push({
      name: quesOption?.labelText,
      color: index < colorArr.length ? colorArr[index] : undefined,
      data,
      dataLabels,
    });
  }
  return series;
};
