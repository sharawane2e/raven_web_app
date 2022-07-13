import { QuestionType } from "../../enums/QuestionType";
import store from "../../redux/store";
import { IQuestionOption } from "../../types/IBaseQuestion";
import { IQuestion } from "../../types/IQuestion";
import _, { find } from "lodash";
import { ChartLabelType } from "../../enums/ChartLabelType";
import {
  getMatchedfilter,
  getmatchedFind,
  getSum,
  indexToChar,
  significantDifference,
} from "../Utility";
import {
  colorArr,
  dataLabelsFormate,
  dataLabelsNumberFormate,
  dataUpdatedFormate,
  primaryBarColor,
} from "../../constants/Variables";
import { dataLabels } from "../../redux/reducers/chartReducer";
import { ChartType } from "../../enums/ChartType";

export const getSingleChartOptionsSeries = (
  questionData: IQuestion,
  chartData: any,
  baseCount: number,
  bannerQuestionData: IQuestion | null,
  chartOptionsData: any,
  transposed: boolean
) => {
  debugger;
  const {
    chart: { chartLabelType, chartType, significant },
    questions: { selectedBannerQuestionId },
  } = store.getState();

  const series: any[] = [];
  if (selectedBannerQuestionId) {
    // const series: any[] = [];
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

    if (transposed && bannerQuestionData?.type == QuestionType.SINGLE) {
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
    } else {
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
              localBase = find(chartData[1], {
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
      const updatedSeries = getsignificantdifference(series, chartLabelType);
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

const getsignificantdifference = (series: any, chartLabelType: any) => {
  const updatedSeries = series.map((singleSeries: any) => {
    const updatedSeriesData = {
      ...singleSeries,
      data: singleSeries.data.map((data: any, index: number) => {
        return {
          ...data,
          name:
            data?.name +
            `<div className="significante--icon">(${indexToChar(index)})</div>`,
          significance: indexToChar(index),
          significantDiffernce: "",
        };
      }),
      dataLabels: {
        ...singleSeries.dataLabels,
        formatter: function (this: any, options: any) {
          return ` ${parseFloat(this.y.toFixed(2))}${
            chartLabelType == ChartLabelType.PERCENTAGE ? "%" : ""
          } <span class="significante-color">${
            this.point.significantDiffernce
          } </span>`;
        },
      },
    };
    return updatedSeriesData;
  });

  updatedSeries.forEach((singleSeries: any, seriesIndex: number) => {
    const seriesdata: any = singleSeries.data;
    //bubble sort
    for (let i = 0; i < seriesdata.length; i++) {
      const significantArry = [];
      const name = [];
      for (let j = 0; j < seriesdata.length; j++) {
        name.push(series.name + indexToChar(j));
        const SignificantObject1: SignificantObject = {
          value: seriesdata[i]["percentageValue"],
          baseCount: seriesdata[i]["baseCount"],
        };
        const SignificantObject2: SignificantObject = {
          value: seriesdata[j]["percentageValue"],
          baseCount: seriesdata[j]["baseCount"],
        };

        if (i != j) {
          if (i == 1 && j == 2 && seriesIndex == 0) {
            // console.log(seriesdata[i]);
            // console.log(seriesdata[j]);
          }
          const isSignificant = significantDifference(
            SignificantObject1,
            SignificantObject2
          );

          if (isSignificant) {
            significantArry.push(indexToChar(j));
          }
        }
      }
      if (significantArry.length) {
        singleSeries.data[i]["significantDiffernce"] =
          "(" + significantArry.join("") + ")";
      }
    }
  });

  return updatedSeries;
};

export interface SignificantObject {
  value: any;
  baseCount: any;
}
