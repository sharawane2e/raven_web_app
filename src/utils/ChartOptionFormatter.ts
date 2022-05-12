import {
  colorArr,
  decimalPrecision,
  decimalPrecision2,
  primaryBarColor,
} from "../constants/Variables";
import { ChartLabelType } from "../enums/ChartLabelType";
import { ChartType } from "../enums/ChartType";
import { QuestionType } from "../enums/QuestionType";
import { dataLabels } from "../redux/reducers/chartReducer";
import store from "../redux/store";
import { IQuestionOption } from "../types/IBaseQuestion";
import { IQuestion } from "../types/IQuestion";
import { getMatchedfilter, getmatchedFind, round } from "./Utility";
import _, { find, omit } from "lodash";
import { ChartOrientation } from "../enums/ChartOrientation";
import { getNumberChartOption } from "../services/ChartNumberService";
import { OptionUnstyled } from "@mui/base";
import { StaticText } from "../constants/StaticText";
import {
  getmean,
  getsampleStandardDeviation,
  getStandarderrorFunction,
} from "./simplestatistics";
//import { mean, median, min, max } from 'simple-statistics';

export const getChartOptions = (
  questionData: IQuestion | null = store.getState().chart.questionData,
  chartData: any = store.getState().chart.chartData,
  baseCount: number = store.getState().chart.baseCount,
  bannerQuestionData: IQuestion | null = store.getState().chart
    .bannerQuestionData,
  chartOptionsData: any = store.getState().chart.chartOptions,
  transposed: boolean = store.getState().chart.chartTranspose
): any => {
  if (questionData !== null) {
    switch (questionData.type) {
      case QuestionType.SINGLE:
        return getSingleChartOptions(
          questionData,
          chartData,
          baseCount,
          bannerQuestionData,
          chartOptionsData
        );
      case QuestionType.MULTI:
        return getMultiChartOptions(
          questionData,
          chartData,
          baseCount,
          bannerQuestionData,
          chartOptionsData
        );
      case QuestionType.RANK:
        return getRankChartOptions(
          questionData,
          chartData,
          baseCount,
          transposed
        );
      case QuestionType.GRID:
        return getGridChartOptions(questionData, chartData, baseCount);
      case QuestionType.GRID_MULTI:
        return getGridMultiChartOptions(questionData, chartData, baseCount);
      case QuestionType.NUMBER:
        return getNumberChartOption(
          questionData,
          chartData,
          baseCount,
          bannerQuestionData,
          chartOptionsData,
          transposed
        );

      default:
        return {};
    }
  } else {
    return {};
  }
};

const getMultiChartOptions = (
  questionData: IQuestion,
  chartData: any[],
  baseCount: number,
  bannerQuestionData: IQuestion | null,
  chartOptionsData: any
): any => {
  const {
    questions: { bannerQuestionList },
  } = store.getState();

  const selectedBannerQuestionId = bannerQuestionData?.qId;

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
    const categories: string[] = [];
    const series: any[] = [];

    questionData.options.forEach((option) => {
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
            (option: any) => option.labelCode === bannerQuesOption.labelCode
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

    return {
      legend: {
        enabled: true,
      },
      tooltip: { ...getToolTip() },
      series,
    };
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
          record.labelCode === option.labelCode
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
        if (seriesObject?.labelCode.split("_")[0] == "N") {
          data.push({
            name: option.labelText,
            // y: round(plotValue, decimalPrecision),
            y: plotValue,
            percentageValue,
            numberValue,
            baseCount: baseCount,
            color: "#01274c",
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

    const series: any[] = [];

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
        dataLabels,
      });
    }

    return {
      legend: {
        enabled: false,
      },
      tooltip: { ...getToolTip() },
      series,
    };
  }
};

const getSingleChartOptions = (
  questionData: IQuestion,
  chartData: any[],
  baseCount: number,
  bannerQuestionData: IQuestion | null,
  chartOptionsData: any
): any => {
  //debugger;

  const {
    questions: { selectedBannerQuestionId, questionList },
  } = store.getState();

  const {
    chart: { chartLabelType, chartOptions },
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
    const categories: string[] = [];
    const series: any[] = [];

    questionData.options.forEach((option) => {
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
            (option: any) => option.labelCode === bannerQuesOption.labelCode
          );

          let localBase = optionData?.reduce(
            (sum: number, option: any) => sum + option.count,
            0
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
        }
      }

      if (data.length)
        series.push({
          name: bannerQuesOption?.labelText,
          color: index > colorArr.length ? colorArr[index] : undefined,
          data,
          dataLabels,
        });
    }

    return {
      legend: {
        enabled: true,
      },
      tooltip: { ...getToolTip() },
      series,
    };
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

    return {
      legend: {
        enabled: true,
      },
      tooltip: { ...getToolTip() },
      series,
    };
  }
};

const getRankChartOptions = (
  questionData: IQuestion,
  chartData: any,
  baseCount: number,
  transposed: boolean
): any => {
  // debugger;
  const categories = [];
  const series = [];

  const subGroups = questionData.subGroups.filter((subGroup: any) => {
    const subGroupData = chartData.find(
      (data: any) => data._id === subGroup.qId
    );
    if (subGroupData && subGroupData.options.length) return true;
    return false;
  });

  const {
    chart: { chartLabelType, chartType },
  } = store.getState();

  for (
    let scaleIndex = 0;
    scaleIndex < questionData.scale.length;
    scaleIndex++
  ) {
    // debugger;
    const scale = questionData.scale[scaleIndex];
    const data: any[] = [];
    for (
      let subGroupIndex = 0;
      subGroupIndex < subGroups.length;
      subGroupIndex++
    ) {
      // debugger;
      const subGroup = subGroups[subGroupIndex];
      categories.push(subGroup.labelText);
      const optionData = chartData.find((c: any) => c._id === subGroup.qId);

      let count = 0;
      let label: any;

      if (optionData) {
        label = optionData.options.find(
          (option: any) => option.option === scale.labelCode
        );

        if (label) {
          count = label.count;
        }
      }
      const base = optionData?.baseCount || baseCount;

      let newBaseCount = 0;

      if (transposed) {
        newBaseCount = _.sumBy(optionData.options, function (o: any) {
          return o.count;
        });
      } else {
        chartData.forEach(function (eachRowData: any) {
          // debugger;
          const chartOptionObject: any = _.filter(eachRowData.options, {
            option: scale.labelCode,
          });
          if (chartOptionObject.length) {
            newBaseCount = newBaseCount + chartOptionObject[0]["count"];
          }
        });
      }

      let plotValue;
      let percentageValue = (count / newBaseCount) * 100;
      let numberValue = count;
      if (chartLabelType === ChartLabelType.PERCENTAGE) {
        plotValue = (count / newBaseCount) * 100;
      } else {
        plotValue = count;
      }

      if (chartType == ChartType.LINE) {
        console.log(plotValue);
        data.push({
          name: subGroup.labelText,
          y: plotValue !== null ? round(plotValue, decimalPrecision) : 0,
          percentageValue,
          numberValue,
          baseCount: newBaseCount,
        });
      } else {
        data.push({
          name: subGroup.labelText,
          y: plotValue > 0 ? round(plotValue, decimalPrecision) : null,
          percentageValue,
          numberValue,
          baseCount: newBaseCount,
        });
      }

      // }
    }
    if (data.length)
      series.push({
        name: scale.labelText,
        color: colorArr[scaleIndex < colorArr.length ? scaleIndex : 0],
        data,
        dataLabels,
      });
  }

  return {
    legend: {
      enabled: true,
    },
    tooltip: { ...getToolTip() },
    series,
  };
};

const getGridChartOptions = (
  questionData: IQuestion,
  chartData: any,
  baseCount: number
): any => {
  const categories = [];
  const series = [];

  const subGroups = questionData.subGroups.filter((subGroup: any) => {
    const subGroupData = getmatchedFind(chartData, "_id", subGroup.qId);
    if (subGroupData && subGroupData.options.length) return true;
    return false;
  });

  const {
    chart: { chartLabelType, chartType, showMean },
  } = store.getState();

  if (showMean) {
    return getGridMeanChartOptions(questionData, chartData, baseCount);
  }

  const scales = [...questionData.scale];

  for (let scaleIndex = 0; scaleIndex < scales.length; scaleIndex++) {
    const scale = scales[scaleIndex];

    //console.log(scale)

    const data: any[] = [];
    for (
      let subGroupIndex = 0;
      subGroupIndex < subGroups.length;
      subGroupIndex++
    ) {
      //console.log(scales[subGroupIndex].labelCode)
      const subGroup = subGroups[subGroupIndex];
      categories.push(subGroup.labelText);

      const optionData = getmatchedFind(chartData, "_id", subGroup.qId);

      const labels = getMatchedfilter(
        optionData.options,
        "option",
        scale.labelCode
      );
      const count = _.sumBy(labels, function (o) {
        return o.count;
      });

      //console.log(scale)
      const base = optionData?.baseCount || baseCount;
      let plotValue;
      let percentageValue = (count / base) * 100;
      let numberValue = count;

      if (chartLabelType === ChartLabelType.PERCENTAGE) {
        plotValue = (count / base) * 100;
      } else {
        plotValue = count;
      }

      if (chartType == ChartType.LINE) {
        data.push({
          name: subGroup.labelText,
          y: plotValue !== null ? round(plotValue, decimalPrecision) : 0,
          percentageValue,
          numberValue,
          baseCount: base,
        });
      } else {
        data.push({
          name: subGroup.labelText,
          y: plotValue > 0 ? round(plotValue, decimalPrecision) : null,
          percentageValue,
          numberValue,
          baseCount: base,
        });
      }
    }
    if (data.length)
      series.push({
        name: scale.labelText,
        color: colorArr[scaleIndex < colorArr.length ? scaleIndex : 0],
        data,
        dataLabels,
      });
  }

  return {
    legend: {
      enabled: true,
    },
    plotOptions: getPlotOptions(),
    tooltip: { ...getToolTip() },
    series,
  };
};

const getGridMeanChartOptions = (
  questionData: IQuestion,
  chartData: any,
  baseCount: number
): any => {
  const {
    chart: { chartType, chartTranspose },
  } = store.getState();

  const data: any[] = [];
  const standardDeviation: any[] = [];
  const standardError: any[] = [];

  for (
    let optionIndex = 0;
    optionIndex < questionData.subGroups.length;
    optionIndex++
  ) {
    const option = questionData.subGroups[optionIndex];
    const optionData = getmatchedFind(chartData, "_id", option.qId);

    const filteredOptions = _.remove(
      [...optionData.options],
      function (n: any) {
        return !Array.isArray(n.option);
      }
    ); //removing array options which come with subgroups

    const totalSelections = _.sumBy(filteredOptions, function (o: any) {
      return parseInt(o.option) * parseInt(o.count);
    });

    let valuesArr: any = [];
    // let weightsArr: any = [];
    // let getSampleDeviationValuesArr: any = [];

    // filteredOptions.forEach((filteredOption: any) => {
    //   weightsArr = _.concat(weightsArr, filteredOption?.weights);
    // });

    filteredOptions.forEach((filteredOption: any) => {
      valuesArr = _.concat(valuesArr, filteredOption?.values);
    });

    // const getSampleDeviationWeights: any = getsampleStandardDeviation(
    //   weightsArr,
    //   decimalPrecision2,
    // );

    const getSampleDeviationValues = getsampleStandardDeviation(
      valuesArr,
      decimalPrecision2
    );

    //getSampleDeviationValuesArr.push(getSampleDeviationValues);
    //console.log('getSampleDeviationWeights', getSampleDeviationWeights);

    const getStandarderror = getStandarderrorFunction(
      getSampleDeviationValues,
      4
    );

    const plotValue = totalSelections / baseCount;

    if (plotValue > 0) {
      data.push({
        name: option.labelText,
        // y: round(plotValue, decimalPrecision),
        y: plotValue,
        baseCount: baseCount,
      });
    }

    standardDeviation.push({
      name: option.labelText,
      y: Number(getSampleDeviationValues),
      baseCount: baseCount,
    });

    standardError.push({
      name: option.labelText,
      y: Number(getStandarderror),
      baseCount: baseCount,
    });
  }

  const series: any[] = [];
  const seriesLabels = StaticText.GRID_MEAN_SD_SE.split(",");
  const seriesData = [data, standardDeviation, standardError];

  for (let i = 0; i < 3; i++) {
    series.push({
      name: seriesLabels[i],
      color: colorArr[i],
      data: seriesData[i],
      dataLabels,
    });
  }

  console.log("series", series);

  if (chartTranspose) {
    // debugger;
    const transposeSeries = [];
    for (
      let optionIndex = 0;
      optionIndex < questionData.subGroups.length;
      optionIndex++
    ) {
      transposeSeries.push({
        name: questionData.subGroups[optionIndex].labelText,
        color: colorArr[optionIndex],
        data: [
          {
            name: seriesLabels[0],
            y: series[0].data[optionIndex].y,
            baseCount: series[0].data[optionIndex].baseCount,
          },
          {
            name: seriesLabels[1],
            y: series[1].data[optionIndex].y,
            baseCount: series[1].data[optionIndex].baseCount,
          },
          {
            name: seriesLabels[2],
            y: series[2].data[optionIndex].y,
            baseCount: series[2].data[optionIndex].baseCount,
          },
        ],
        dataLabels,
      });

      console.log(optionIndex);
      console.log(transposeSeries);
    }

    series.length = 0;

    series.push(...transposeSeries);
  }

  return {
    legend: {
      enabled: true,
    },
    plotOptions: getPlotOptions(),
    tooltip: { ...getToolTip() },
    series,
  };
};

const getGridMultiChartOptions = (
  questionData: IQuestion,
  chartData: any,
  baseCount: number
): any => {
  const categories = [];
  const series = [];

  const subGroups = questionData.subGroups.filter((subGroup: any) => {
    const subGroupData = chartData.find(
      (data: any) => data._id === subGroup.qId
    );
    if (subGroupData && subGroupData.options.length) return true;
    return false;
  });

  const {
    chart: { chartLabelType, chartType },
  } = store.getState();

  for (
    let scaleIndex = 0;
    scaleIndex < questionData.scale.length;
    scaleIndex++
  ) {
    const scale = questionData.scale[scaleIndex];
    const data: any[] = [];
    for (
      let subGroupIndex = 0;
      subGroupIndex < subGroups.length;
      subGroupIndex++
    ) {
      const subGroup = subGroups[subGroupIndex];
      categories.push(subGroup.labelText);
      const optionData = chartData.find((c: any) => c._id === subGroup.qId);

      let count = 0;
      let label;
      if (optionData) {
        label = optionData.options.find(
          (option: any) => option.option === scale.labelCode
        );

        if (label) {
          count = label.count;
        }
      }
      const base = label.baseCount ? label.baseCount : optionData?.baseCount;

      let plotValue;
      let percentageValue = (count / base) * 100;
      let numberValue = count;
      if (chartLabelType === ChartLabelType.PERCENTAGE) {
        plotValue = (count / base) * 100;
      } else {
        plotValue = count;
      }

      if (chartType === ChartType.LINE) {
        data.push({
          name: subGroup.labelText,
          y: plotValue !== null ? round(plotValue, decimalPrecision) : 0,
          baseCount: base,
          percentageValue,
          numberValue,
        });
      } else {
        data.push({
          name: subGroup.labelText,
          y: plotValue > 0 ? round(plotValue, decimalPrecision) : null,
          percentageValue,
          numberValue,
          baseCount: base,
        });
      }
    }
    if (data.length)
      series.push({
        name: scale.labelText,
        color: colorArr[scaleIndex < colorArr.length ? scaleIndex : 0],
        data,
        dataLabels,
      });
  }
  return {
    legend: {
      enabled: true,
    },
    tooltip: { ...getToolTip() },
    series,
  };
};

export const changeChartOptions = (chartOptions: any, type: ChartType) => {
  const newChartOptions = { ...chartOptions };

  if (type === ChartType.COLUMN) {
  } else if (type === ChartType.STACK) {
  }

  return newChartOptions;
};

export const getToolTip = () => {
  const {
    chart: { questionData, showMean },
  } = store.getState();
  const tooltip: { headerFormat: String; pointFormat: String } = {
    headerFormat: "",
    pointFormat: "",
  };

  tooltip["headerFormat"] =
    '<span style="font-size:11px">{series.name}</span><br>';

  if (showMean) {
    tooltip["pointFormat"] =
      "<span>{point.name}</span>: Mean<b> {point.y:.2f}</b>,  of total <b>{point.baseCount}</b><br/>";
  } else {
    if (questionData?.type === QuestionType?.NUMBER) {
      tooltip["pointFormat"] =
        "<span>{point.name}</span>: Mean<b> {point.y:.2f}</b>,  of total <b>{point.baseCount}</b><br/>";
    } else {
      tooltip["pointFormat"] =
        "<span>{point.name}</span>: Count<b> {point.numberValue}, {point.percentageValue:.2f}%</b> of total <b>{point.baseCount}</b><br/>";
    }
  }

  return tooltip;
};

export const getPlotOptions = (
  chartType = store.getState().chart.chartType
) => {
  const chartDataClone = JSON.parse(JSON.stringify(store.getState().chart));
  let plotOptions = chartDataClone.chartOptions["plotOptions"];
  plotOptions = omit(plotOptions, ["column", "bar", "pie", "line"]);
  if (chartType === ChartType.STACK) {
    plotOptions["column"] = {
      stacking: "normal",
    };

    plotOptions["series"].dataLabels.format = chartDataClone.showMean
      ? "{point.y:.1f}"
      : chartDataClone.chartLabelType === ChartLabelType.PERCENTAGE
      ? "{point.y:.1f}%"
      : "{point.y:.0f}";

    plotOptions["series"].dataLabels.y = undefined;
    plotOptions["series"].dataLabels.rotation = 0;
  } else if (chartType === ChartType.COLUMN) {
    plotOptions["bar"] = {
      stacking: "normal",
    };
    plotOptions["series"].dataLabels.format = chartDataClone.showMean
      ? "{point.y:.1f}"
      : chartDataClone.chartLabelType === ChartLabelType.PERCENTAGE
      ? "{point.y:.1f}%"
      : "{point.y:.0f}";
    if (chartDataClone.chartOrientation === ChartOrientation.PORTRAIT) {
      plotOptions["series"].dataLabels.y = -20;
      plotOptions["series"].dataLabels.rotation = -90;
    } else {
      plotOptions["series"].dataLabels.y = undefined;
      plotOptions["series"].dataLabels.rotation = 0;
    }
  } else if (chartType === ChartType.PIE) {
    plotOptions["pie"] = {
      allowPointSelect: false,
      cursor: "pointer",
    };
    plotOptions["series"].dataLabels.format = chartDataClone.showMean
      ? "<b>{point.name}</b>: {point.y:.1f}"
      : chartDataClone.chartLabelType === ChartLabelType.PERCENTAGE
      ? "<b>{point.name}</b>: {point.percentage:.1f}%"
      : "<b>{point.name}</b>: {point.y:.0f}";
    delete plotOptions["series"].dataLabels.y;
    delete plotOptions["series"].dataLabels.rotation;
  } else if (chartType === ChartType.LINE) {
    plotOptions["line"] = {
      // allowPointSelect: false,
      // cursor: "pointer",
    };

    plotOptions["series"].dataLabels.format = chartDataClone.showMean
      ? "{point.y:.1f}"
      : chartDataClone.chartLabelType === ChartLabelType.PERCENTAGE
      ? "{point.y:.1f}%"
      : "{point.y:.0f}";
  } else {
    delete plotOptions["series"].dataLabels.y;
    delete plotOptions["series"].dataLabels.rotation;
  }
  return plotOptions;
};
