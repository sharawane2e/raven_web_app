import {
  colorArr,
  decimalPrecision,
  primaryBarColor,
} from "../constants/Variables";
import { ChartType } from "../enums/ChartType";
import { QuestionType } from "../enums/QuestionType";
import { dataLabels } from "../redux/reducers/chartReducer";
import store from "../redux/store";
import { IQuestion } from "../types/IQuestion";
import { round } from "./Utility";

export const getChartOptions = (
  questionData: IQuestion | null,
  chartData: any,
  baseCount: number
): any => {
  if (questionData !== null) {
    switch (questionData.type) {
      case QuestionType.SINGLE:
        return getSingleChartOptions(questionData, chartData, baseCount);
      case QuestionType.MULTI:
        return getSingleChartOptions(questionData, chartData, baseCount);
      case QuestionType.RANK:
        return getGridChartOptions(questionData, chartData, baseCount);
      case QuestionType.GRID:
        return getGridChartOptions(questionData, chartData, baseCount);
      case QuestionType.GRID_MULTI:
        return getGridChartOptions(questionData, chartData, baseCount);

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
  baseCount: number
): any => {
  const {
    questions: { selectedBannerQuestionId, questionList },
  } = store.getState();
  if (selectedBannerQuestionId) {
    const bannerQuestion = questionList.find(
      (question) => question.qId === selectedBannerQuestionId
    );

    const categories: string[] = [];
    const series: any[] = [];

    questionData.options.forEach((option) => {
      categories.push(option.labelText);
    });

    questionData.options.forEach((option) => {
      chartData[0][option.labelCode] = chartData[0][option.labelCode]?.map(
        (cv: any) => ({ ...cv, count: (cv.count / baseCount) * 100 })
      );
    });

    // @ts-ignore
    for (let index = 0; index < bannerQuestion?.options.length; index++) {
      const bannerQuesOption = bannerQuestion?.options[index];
      const data: any[] = [];

      for (
        let quesIndex = 0;
        quesIndex < questionData.options.length;
        quesIndex++
      ) {
        const quesOption = questionData.options[quesIndex];

        let optionData = chartData[0][quesOption.labelCode];

        let count = 0;
        // debugger;
        if (optionData) {
          const label = optionData.find(
            // @ts-ignore
            (option: any) => option.labelCode === bannerQuesOption.labelCode
          );

          if (label) {
            count = label.count;
          }
        }

        if (count > 0)
          data.push({
            name: quesOption.labelText,
            // y: +count.toFixed(decimalPrecision),
            y: round(count, decimalPrecision),
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
      const plotValue = (count / baseCount) * 100;
      if (plotValue > 0)
        data.push({
          name: option.labelText,
          y: round(plotValue, decimalPrecision),
        });
    }

    return {
      legend: {
        enabled: false,
      },

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
  for (
    let scaleIndex = 0;
    scaleIndex < questionData.scale.length;
    scaleIndex++
  ) {
    const scale = questionData.scale[scaleIndex];
    const data: any[] = [];

    for (
      let subGroupIndex = 0;
      subGroupIndex < questionData.subGroups.length;
      subGroupIndex++
    ) {
      const subGroup = questionData.subGroups[subGroupIndex];
      categories.push(subGroup.labelText);

      const optionData = chartData.find((c: any) => c._id === subGroup.qId);

      let count = 0;
      // debugger;
      if (optionData) {
        const label = optionData.options.find(
          (option: any) => option.option === scale.labelCode
        );

        if (label) {
          count = label.count;
        }
      }
      const plotValue = (count / baseCount) * 100;
      if (plotValue > 0) {
        data.push({
          name: subGroup.labelText,
          y: round(plotValue, decimalPrecision),
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
    series,
  };
};

export const changeChartOptions = (chartOptions: any, type: ChartType) => {
  const newChartOptions = { ...chartOptions };
  debugger;

  if (type === ChartType.COLUMN) {
  } else if (type === ChartType.STACK) {
  }

  return newChartOptions;
};
