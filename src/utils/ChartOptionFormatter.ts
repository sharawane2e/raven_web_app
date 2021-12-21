import {
  colorArr,
  decimalPrecision,
  primaryBarColor,
} from "../constants/Variables";
import { ChartDataLabels } from "../enums/ChartDataLabels";
import { ChartType } from "../enums/ChartType";
import { QuestionType } from "../enums/QuestionType";
import { dataLabels } from "../redux/reducers/chartReducer";
import store from "../redux/store";
import { IQuestionOption } from "../types/IBaseQuestion";
import { IQuestion } from "../types/IQuestion";
import { round } from "./Utility";
import { omit } from "lodash";
import { ChartOrientation } from "../enums/ChartOrientation";

export const getChartOptions = (
  questionData: IQuestion | null = store.getState().chart.questionData,
  chartData: any = store.getState().chart.chartData,
  baseCount: number = store.getState().chart.baseCount,
  bannerQuestionData: IQuestion | null = store.getState().chart
    .bannerQuestionData,
  chartOptionsData: any = store.getState().chart.chartOptions
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
        return getSingleChartOptions(
          questionData,
          chartData,
          baseCount,
          bannerQuestionData,
          chartOptionsData
        );
      case QuestionType.RANK:
        return getGridChartOptions(questionData, chartData, baseCount);
      case QuestionType.GRID:
        return getGridChartOptions(questionData, chartData, baseCount);
      case QuestionType.GRID_MULTI:
        return getGridMultiChartOptions(questionData, chartData, baseCount);

      default:
        return {};
    }
  } else {
    return {};
  }
};

const getSingleChartOptions = (
  questionData: IQuestion,
  chartData: any[],
  baseCount: number,
  bannerQuestionData: IQuestion | null,
  chartOptionsData: any
): any => {
  const {
    questions: { selectedBannerQuestionId, questionList },
  } = store.getState();

  const {
    chart: { chartOperations },
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
        // debugger;
        if (optionData) {
          const label = optionData.find(
            // @ts-ignore
            (option: any) => option.labelCode === bannerQuesOption.labelCode
          );

          const localBase = optionData?.reduce(
            (sum: number, option: any) => sum + option.count,
            0
          );

          if (label) {
            count = (label.count / localBase) * 100;
          }
        }

        // if (count > 0)
        data.push({
          name: quesOption.labelText,
          // y: +count.toFixed(decimalPrecision),
          y: count > 0 ? round(count, decimalPrecision) : null,
        });
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
      if (chartOperations.labelFormat === "percentage") {
        plotValue = (count / baseCount) * 100;
      } else {
        plotValue = count;
      }

      if (plotValue > 0)
        data.push({
          name: option.labelText,
          // y: round(plotValue, decimalPrecision),
          y: plotValue,
        });
    }

    return {
      legend: {
        enabled: false,
      },

      tooltip: { ...getToolTip() },

      series: [
        {
          color: primaryBarColor,
          name: questionData.labelText,
          data,
          dataLabels,
        },
      ],
    };
  }
};

const getGridChartOptions = (
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
      // debugger;
      if (optionData) {
        label = optionData.options.find(
          (option: any) => option.option === scale.labelCode
        );

        if (label) {
          count = label.count;
        }
      }
      const base = optionData?.baseCount || baseCount;

      const plotValue = (count / base) * 100;
      // if (plotValue > 0) {
      data.push({
        name: subGroup.labelText,
        y: plotValue > 0 ? round(plotValue, decimalPrecision) : null,
      });
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
      const plotValue = (count / base) * 100;

      data.push({
        name: subGroup.labelText,
        y: plotValue > 0 ? round(plotValue, decimalPrecision) : null,
      });
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

const getToolTip = () => {
  const {
    chart: { chartOperations },
  } = store.getState();
  const tooltip: { headerFormat: String; pointFormat: String } = {
    headerFormat: "",
    pointFormat: "",
  };

  if (chartOperations.labelFormat === "percentage") {
    tooltip["headerFormat"] =
      '<span style="font-size:11px">{series.name}</span><br>';
    tooltip["pointFormat"] =
      "<span>{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>";
  } else {
    tooltip["headerFormat"] =
      '<span style="font-size:11px">{series.name}</span><br>';
    tooltip["pointFormat"] =
      "<span>{point.name}</span>: <b>{point.y:.0f}</b> of total<br/>";
  }

  return tooltip;
};

export const getPlotOptions = (
  chartType = store.getState().chart.chartType
) => {
  const chartDataClone = JSON.parse(JSON.stringify(store.getState().chart));
  let plotOptions = chartDataClone.chartOptions["plotOptions"];
  plotOptions = omit(plotOptions, ["column", "bar", "pie"]);

  if (chartType === ChartType.STACK) {
    plotOptions["column"] = {
      stacking: "normal",
    };
    plotOptions["series"].dataLabels.format = `${
      chartDataClone.chartOperations.labelFormat === ChartDataLabels.PERCENTAGE
        ? "{point.y:.1f}%"
        : "{point.y:.0f}"
    }`;
    plotOptions["series"].dataLabels.y = undefined;
    plotOptions["series"].dataLabels.rotation = 0;
  } else if (chartType === ChartType.COLUMN) {
    plotOptions["bar"] = {
      stacking: "normal",
    };
    plotOptions["series"].dataLabels.format = `${
      chartDataClone.chartOperations.labelFormat === ChartDataLabels.PERCENTAGE
        ? "{point.y:.1f}%"
        : "{point.y:.0f}"
    }`;
    if (chartDataClone.chartOrientation === ChartOrientation.PORTRAIT) {
      plotOptions["series"].dataLabels.y = -20;
      plotOptions["series"].dataLabels.rotation = 270;
    } else {
      plotOptions["series"].dataLabels.y = undefined;
      plotOptions["series"].dataLabels.rotation = 0;
    }
  } else if (chartType === ChartType.PIE) {
    plotOptions["pie"] = {
      allowPointSelect: false,
      cursor: "pointer",
    };
    plotOptions["series"].dataLabels.format = `${
      chartDataClone.chartOperations.labelFormat === ChartDataLabels.PERCENTAGE
        ? "<b>{point.name}</b>: {point.percentage:.1f}%"
        : "<b>{point.name}</b>: {point.percentage:.0f}"
    }`;
    // plotOptions["series"].dataLabels.y = undefined;
    // plotOptions["series"].dataLabels.rotation = undefined;
    delete plotOptions["series"].dataLabels.y;
    delete plotOptions["series"].dataLabels.rotation;
  }
  return plotOptions;
};
