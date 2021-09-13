import { AnyMap } from "immer/dist/internal";
import { ChartOptionType } from "../components/Chart";
import { QuestionType } from "../enums/QuestionType";
import { IQuestion } from "../types/IQuestion";

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
        return getSingleChartOptions(questionData, chartData, baseCount);
      case QuestionType.GRID:
        return getGridChartOptions(questionData, chartData);
      case QuestionType.GRID_MULTI:
        return getGridChartOptions(questionData, chartData);

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
    const plotValue = (count / baseCount) * 100;
    data.push({ name: option.labelText, y: +plotValue.toFixed(2) });
  }

  return {
    chart: {
      type: "column",
    },
    title: {
      text: "",
    },

    xAxis: {
      type: "category",
    },
    yAxis: {
      min: 0,
      max: 100,
    },
    legend: {
      enabled: false,
    },

    tooltip: {
      headerFormat: '<span style="font-size:11px">{series.name}</span><br>',
      pointFormat:
        '<span style="color:{point.color}">{point.name}</span>: <b>{point.y:.2f}%</b> of total<br/>',
    },

    series: [
      {
        color: "#f47c3c",
        data,
      },
    ],
  };
};
const getGridChartOptions = (questionData: IQuestion, chartData: any): any => {
  return {};
};
