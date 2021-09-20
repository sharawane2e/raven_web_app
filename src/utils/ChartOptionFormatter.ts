import { colorArr } from "../constants/Variables";
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
    title: {
      text: "",
    },

    xAxis: {
      type: "category",
    },
    yAxis: {
      min: 0,
      // max: 100,
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
        dataLabels: {
          enabled: true,
          // rotation: -90,
          color: "#FFFFFF",
          align: "center",
          format: "{point.y:.1f}%", // one decimal
          // y: 10, // 10 pixels down from the top
          // x: -10,
          // y: 30,
          style: {
            fontSize: "10px",
          },
        },
      },
    ],
  };
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

      data.push({
        name: subGroup.labelText,
        y: +plotValue.toFixed(2),
      });
    }

    series.push({
      name: scale.labelText,
      color: colorArr[scaleIndex < colorArr.length ? scaleIndex : 0],
      data,
      dataLabels: {
        enabled: true,
        // rotation: -90,
        color: "#FFFFFF",
        align: "center",
        format: "{point.y:.1f}", // one decimal
        // y: 10, // 10 pixels down from the top
        style: {
          fontSize: "10px",
          fontFamily: "Roboto",
        },
      },
    });
  }

  return {
    title: {
      text: "",
    },

    xAxis: {
      categories,
    },

    yAxis: {
      allowDecimals: false,
      min: 0,
      title: {
        text: "",
      },
    },

    // plotOptions: {
    //   column: {
    //     stacking: "normal",
    //   },
    // },

    series,
  };
};