import _, { find, round } from "lodash";
import {
  colorArr,
  dataLabelsFormate,
  dataLabelsNumberFormate,
  dataUpdatedFormate,
  decimalPrecision,
  primaryBarColor,
} from "../../constants/Variables";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { ChartType } from "../../enums/ChartType";
import { QuestionType } from "../../enums/QuestionType";
import store from "../../redux/store";
import { IQuestionOption } from "../../types/IBaseQuestion";
import { IchartOptionsDto } from "../../types/IChartOptionsDto";
import { getMatchedfilter, getSum } from "../Utility";
import { getsignificantdifference } from "./significanceDiff";

export const getMultiChartOptionsSeries = (
  chart: IchartOptionsDto
  // questionData: any,
  // chartData: any,
  // baseCount: any,
  // bannerQuestionData: any,
  // chartOptionsData: any,
  // questionChartData: any,
  // bannerChartData: any,
  // transposed: any
) => {
  const {
    questionData,
    chartData,
    baseCount,
    bannerQuestionData,
    chartOptionsData,
    questionChartData,
    bannerChartData,
    transposed,
    significant,
    chartLabelType,
    chartType,
  } = chart;

  const selectedBannerQuestionId = bannerQuestionData?.qId;
  const series: any[] = [];

  if (selectedBannerQuestionId) {
    if (transposed) {
      if (bannerQuestionData?.type == QuestionType.SINGLE) {
        series.length = 0;
        series.push(...getSingleTransposeChartOptions(chart));
      }
      if (bannerQuestionData?.type == QuestionType.MULTI) {
        series.length = 0;
        series.push(...getMultiTransposeChartOptions(chart));
      }
    } else {
      series.length = 0;
      series.push(...multiSingleBannerChart(chart));
    }
  } else {
    series.length = 0;
    series.push(
      ...getChartMultiChartSeries(
        questionData,
        chartData,
        baseCount,
        chartLabelType,
        chartType
      )
    );

    //console.log(series);
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
  // if (selectedBannerQuestionId) {
  //   bannerChartDataGen(series, questionData, bannerQuestionData, transposed);
  // }
  return series;
};

const getChartMultiChartSeries = (
  questionData: any,
  chartData: any,
  baseCount: any,
  chartLabelType: any,
  chartType: any
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
        record.labelCode === option.labelCode
    );
    let count = 0;
    if (label) {
      count = label.count;
    }

    let plotValue;
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
      if (seriesObject?.labelCode.split("_")[0] == "N") {
        data.push({
          name: option.labelText,
          y: plotValue,
          percentageValue,
          numberValue,
          baseCount: baseCount,
          color: "#f1ad0f",
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

const multiSingleBannerChart = (chart: IchartOptionsDto) => {
  const {
    questionData,
    chartData,
    bannerQuestionData,
    chartLabelType,
    questionChartData,
    significant,
  } = chart;
  const {
    questions: { bannerQuestionList },
  } = store.getState();
  const selectedBannerQuestionId = bannerQuestionData?.qId;
  const categories: string[] = [];
  const series: any = [];

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
          (option: any) => {
            return option.labelCode === bannerQuesOption.labelCode;
          }
        );

        let localBase = optionData?.reduce(
          (sum: number, option: any) => sum + option.count,
          0
        );

        const bannerQuestion: any = find(bannerQuestionList, function (o) {
          return o.qId === selectedBannerQuestionId;
        });
        const bannerQuestionType = bannerQuestion.type;

        if (bannerQuestionType == QuestionType.MULTI) {
          //this is working in multi 2 multi
          localBase = find(questionChartData, function (o) {
            return o.labelCode === quesOption.labelCode;
          })?.count;
        }

        if (chartLabelType === ChartLabelType.PERCENTAGE && label) {
          count = (label.count / localBase) * 100;
        } else if (chartLabelType === ChartLabelType.NUMBER && label) {
          count = label.count;
        }

        //  console.log(label);

        //if (label) {
        let percentageValue = (label?.count / localBase) * 100;
        let numberValue = label?.count;
        if (count)
          data.push({
            name: quesOption.labelText,
            // y: +count.toFixed(decimalPrecision),
            y: count !== null ? round(count, decimalPrecision) : 0,
            percentageValue,
            numberValue,
            baseCount: localBase,
          });
        // }
      }
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
        color: index < colorArr.length ? colorArr[index] : undefined,
        data,
        dataLabels: {
          ...newDataLabels,
        },
      });
  }

  return series;
};

const getSingleTransposeChartOptions = (chart: IchartOptionsDto) => {
  const {
    questionData,
    chartData,
    baseCount,
    bannerQuestionData,
    chartOptionsData,
    questionChartData,
    bannerChartData,
    transposed,
    chartLabelType,
    significant,
  } = chart;

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

  const NettedBannerQuestionData = JSON.parse(
    JSON.stringify(bannerQuestionData)
  );
  if (NettedBannerQuestionData.isGroupNet) {
    NettedBannerQuestionData.options.push(
      ...NettedBannerQuestionData.groupNetData
    );
  }
  questionData.options.forEach(
    (questionOption: any, questionOptionIndex: number) => {
      const data: any[] = [];
      const name = questionOption.labelText;
      NettedBannerQuestionData.options.forEach(
        (bannerOption: any, bannerOptionIndex: number) => {
          const name = bannerOption.labelText;
          const chartDataArr = chartData[0][questionOption.labelCode];
          const chartObjectArr: any = getMatchedfilter(
            chartDataArr,
            "labelCode",
            bannerOption.labelCode
          );

          const numberValue = getSum(chartObjectArr, "count");

          let baseCount: number = 0;

          if (_.isArray(bannerOption.labelCode)) {
            const baseCountIndexArr: number[] = [];
            labelCodeArr.map((labelCode) => {
              if (bannerOption.labelCode.indexOf(labelCode) != -1) {
                baseCountIndexArr.push(labelCodeArr.indexOf(labelCode));
              }
            });

            baseCountIndexArr.forEach((baseCountIndex: number) => {
              baseCount += baseCountArr[baseCountIndex];
            });
          } else {
            bannerChartData.map((bannerChartobject: any) => {
              if (bannerChartobject.labelCode === bannerOption.labelCode) {
                baseCount = bannerChartobject.count;
              }
            });
          }

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

const getMultiTransposeChartOptions = (chart: IchartOptionsDto) => {
  const {
    questionData,
    chartData,
    bannerQuestionData,
    chartOptionsData,
    bannerChartData,
    chartLabelType,
    significant,
  } = chart;

  const series: any[] = [];

  questionData.options.forEach(
    (questionOptionObject: any, questionOptionIndex: number) => {
      const name = questionOptionObject.labelText;
      const data: any[] = [];
      bannerQuestionData.options.forEach(
        (bannerOptionObject: any, bannerOptionIndex: number) => {
          // debugger;
          const name = bannerOptionObject.labelText;
          const baseCountArr = getMatchedfilter(
            bannerChartData,
            "labelCode",
            bannerOptionObject.labelCode
          );
          const baseCount = baseCountArr[0]?.count;
          const numberValueArr = getMatchedfilter(
            chartData[0][questionOptionObject.labelCode],
            "labelCode",
            bannerOptionObject.labelCode
          );
          const numberValue = numberValueArr[0]?.count;
          let percentageValue: number = (numberValue / baseCount) * 100;
          if (!percentageValue) {
            percentageValue = 0;
          }
          const y =
            chartLabelType == ChartLabelType.PERCENTAGE
              ? percentageValue
              : numberValue;

          data.push({
            name,
            y,
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
        data,
        dataLabels: {
          ...newDataLabels,
        },
      });
    }
  );

  return series;
};
