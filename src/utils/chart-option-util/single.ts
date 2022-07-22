import { QuestionType } from "../../enums/QuestionType";
import store from "../../redux/store";
import { IQuestionOption } from "../../types/IBaseQuestion";
import { IQuestion } from "../../types/IQuestion";
import _, { find } from "lodash";
import { ChartLabelType } from "../../enums/ChartLabelType";

import { getMatchedfilter, getmatchedFind, getSum } from "../Utility";
import {
  colorArr,
  dataLabelsFormate,
  dataLabelsNumberFormate,
  dataUpdatedFormate,
  primaryBarColor,
} from "../../constants/Variables";

import { ChartType } from "../../enums/ChartType";
import { getsignificantdifference } from "./significanceDiff";

export const getSingleChartOptionsSeries = (
  questionData: IQuestion,
  chartData: any,
  baseCount: number,
  bannerQuestionData: IQuestion | null,
  chartOptionsData: any,
  questionChartData: any,
  transposed: boolean
) => {
  const {
    chart: { chartLabelType, chartType, significant },
    questions: { selectedBannerQuestionId },
  } = store.getState();

  const series: any[] = [];
  if (selectedBannerQuestionId) {
    let subGroups: any;
    let count = 0;

    subGroups = questionData.options.filter((option: IQuestionOption) => {
      const subGroup: any = [];
      const subGroup1 = getmatchedFind(
        questionData.options,
        "labelCode",
        option.labelCode
      );
      subGroup.push(subGroup1);
      if (subGroup && subGroup?.length) return true;
      return false;
    });

    if (transposed) {
      if (bannerQuestionData?.type == QuestionType.SINGLE) {
        series.length = 0;
        series.push(
          ...getSingleTransposeChartOptions(
            questionData,
            chartData,
            bannerQuestionData,
            subGroups,
            transposed
          )
        );
      }
      if (bannerQuestionData?.type == QuestionType.MULTI) {
        series.length = 0;
        series.push(
          ...getMultiTransposeChartOptions(
            questionData,
            chartData,
            bannerQuestionData,
            subGroups,
            transposed
          )
        );
      }
    } else {
      //when question is single and banner is multi
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
                0
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
              "labelCode",
              bannerQuesOption.labelCode
            );
            count = _.sumBy(label, function (o) {
              return o.count;
            });
            if (bannerQuestionData?.type == QuestionType.MULTI) {
              localBase = find(questionChartData, {
                labelCode: quesOption.labelCode,
              })?.count;
            } else {
              localBase = optionData?.reduce(
                (sum: number, option: any) => sum + option.count,
                0
              );
            }
          }

          let percentageValue;
          let numberValue;
          numberValue = count;
          percentageValue = (count / localBase) * 100;

          if (numberValue)
            data.push({
              name: quesOption.labelText,
              y:
                chartLabelType === ChartLabelType.PERCENTAGE
                  ? percentageValue
                  : numberValue,
              percentageValue,
              numberValue,
              baseCount: localBase,
            });
        }
        let newDataLabels;
        if (significant) {
          newDataLabels = dataUpdatedFormate;
        } else {
          if (chartLabelType == ChartLabelType.PERCENTAGE) {
            newDataLabels = dataLabelsFormate;
          } else {
            newDataLabels = dataLabelsNumberFormate;
          }
        }
        if (data.length)
          series.push({
            name: bannerQuesOption?.labelText,
            color: index > colorArr.length ? colorArr[index] : undefined,
            data,
            dataLabels: {
              ...newDataLabels,
            },
          });
      }
    }
    if (significant) {
      const updatedSeries = getsignificantdifference(
        questionData,
        chartData,
        bannerQuestionData,
        series,
        chartLabelType,
        transposed
      );
      series.length = 0;
      series.push(...updatedSeries);
    }
  } else {
    series.push(
      ...getSingleSeries(
        questionData,
        chartData,
        baseCount,
        chartLabelType,
        chartType,
        significant
      )
    );
  }
  return series;
};

const getSingleSeries = (
  questionData: any,
  chartData: any,
  baseCount: any,
  chartLabelType: any,
  chartType: any,
  significant: boolean
) => {
  const series: any[] = [];
  const data: any[] = [];

  for (
    let optionIndex = 0;
    optionIndex < questionData.options.length;
    optionIndex++
  ) {
    const option = questionData.options[optionIndex];

    const labelCollection = getMatchedfilter(
      chartData,
      "labelCode",
      option.labelCode
    );

    let count = 0;
    if (labelCollection) {
      count = getSum(labelCollection, "count");
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
        y: plotValue,
        percentageValue,
        numberValue,
        baseCount: baseCount,
      });
  }
  let newDataLabels: any;
  if (significant) {
    newDataLabels = dataUpdatedFormate;
  } else {
    if (chartLabelType == ChartLabelType.PERCENTAGE) {
      newDataLabels = dataLabelsFormate;
    } else {
      newDataLabels = dataLabelsNumberFormate;
    }
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
          baseCount: element.baseCount,
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

const getSingleTransposeChartOptions = (
  questiondata: any,
  chartData: any,
  bannerQuestionData: any,
  optionSubGroups: any,
  transposed: any
) => {
  const {
    chart: { chartLabelType, significant },
  } = store.getState();

  const series: any[] = [];
  let count = 0;
  const newOptionData: any = [];
  const allLabels: Array<string> = [];
  const newChartData: any = {};
  const basecountArr: any = [];

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

        count = labeCodeSum;
      } else {
        optionData = chartData[0][quesOption?.labelCode];
        const label = getmatchedFind(
          optionData,
          "labelCode",
          bannerQuesOption?.labelCode
        );

        count = label?.count;
      }

      localBase = basecountArr[quesIndex];

      let percentageValue = (count / localBase) * 100;
      let numberValue = count;
      data.push({
        name: bannerQuesOption?.labelText,
        y:
          chartLabelType === ChartLabelType.PERCENTAGE
            ? percentageValue
            : numberValue,
        percentageValue,
        numberValue,
        baseCount: localBase,
      });
    }

    let newDataLabels;
    if (significant) {
      newDataLabels = dataUpdatedFormate;
    } else {
      if (chartLabelType == ChartLabelType.PERCENTAGE) {
        newDataLabels = dataLabelsFormate;
      } else {
        newDataLabels = dataLabelsNumberFormate;
      }
    }
    series.push({
      name: quesOption?.labelText,
      color: index < colorArr.length ? colorArr[index] : undefined,
      data,
      dataLabels: {
        ...newDataLabels,
      },
    });
  }
  return series;
};

const getMultiTransposeChartOptions = (
  questiondata: any,
  chartData: any,
  bannerQuestionData: any,
  optionSubGroups: any,
  transposed: any
) => {
  const {
    chart: { chartLabelType, significant },
  } = store.getState();
  const series: any[] = [];
  const labelCodeArr: string[] = [];
  const baseCountArr: number[] = [];
  for (const singleSeriesArr in chartData[0]) {
    chartData[0][singleSeriesArr].forEach((serieObject: any) => {
      if (labelCodeArr.indexOf(serieObject.labelCode) == -1) {
        labelCodeArr.push(serieObject.labelCode);
        baseCountArr.push(0);
      }
    });
  }

  labelCodeArr.forEach((labelCode: string, labelCodeIndex: number) => {
    for (const singleSeriesArr in chartData[0]) {
      const serieObject: any = getMatchedfilter(
        chartData[0][singleSeriesArr],
        "labelCode",
        labelCode
      );
      baseCountArr[labelCodeIndex] += serieObject[0]?.count
        ? serieObject[0]?.count
        : 0;
    }
  });

  questiondata.options.forEach(
    (questionOption: any, questionOptionIndex: number) => {
      if (_.isArray(questionOption.labelCode)) return;
      const data: any[] = [];

      const name = questionOption.labelText;

      bannerQuestionData.options.forEach(
        (bannerOption: any, bannerOptionIndex: number) => {
          const name = bannerOption.labelText;
          const chartDataArr = chartData[0][questionOption.labelCode];
          const chartObjectArr: any = getMatchedfilter(
            chartDataArr,
            "labelCode",
            bannerOption.labelCode
          );
          const numberValue = chartObjectArr[0]?.count
            ? chartObjectArr[0]?.count
            : 0;

          const baseCountIndex = labelCodeArr.indexOf(bannerOption.labelCode);

          const baseCount = baseCountArr[baseCountIndex];
          const percentageValue = (numberValue / baseCount) * 100;

          data.push({
            name,
            y:
              chartLabelType === ChartLabelType.PERCENTAGE
                ? percentageValue
                : numberValue,
            percentageValue,
            numberValue,
            baseCount,
          });
        }
      );
      let newDataLabels;
      if (significant) {
        newDataLabels = dataUpdatedFormate;
      } else {
        if (chartLabelType == ChartLabelType.PERCENTAGE) {
          newDataLabels = dataLabelsFormate;
        } else {
          newDataLabels = dataLabelsNumberFormate;
        }
      }
      series.push({
        name,
        color: colorArr[questionOptionIndex],
        data,
        dataLabels: {
          ...newDataLabels,
        },
      });
    }
  );

  return series;
};
