import { colorArr } from "../constants/Variables";
import { QuestionType } from "../enums/QuestionType";
import store from "../redux/store";
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
  const {
    questions: { selectedBannerQuestionId, questionList },
  } = store.getState();
  // if (selectedBannerQuestionId) {
  //   debugger;
  //   const bannerQuestion = questionList.find(
  //     (question) => question.qId === selectedBannerQuestionId
  //   );

  //   const categories: string[] = [];
  //   const series: any[] = [];

  //   // @ts-ignore
  //   for (let index = 0; index < bannerQuestion?.options.length; index++) {
  //     const bannerQuesOption = bannerQuestion?.options[index];

  //     for (
  //       let quesIndex = 0;
  //       quesIndex < questionData.options.length;
  //       quesIndex++
  //     ) {
  //       const quesOption = questionData.options[quesIndex];

  //       let optionData = chartData[0][quesOption.labelCode];
  //       let baseCount = 0;
  //       let count = 0;
  //       // debugger;
  //       if (optionData) {
  //         const label = optionData.find(
  //           // @ts-ignore
  //           (option: any) => option.labelCode === bannerQuesOption.labelCode
  //         );

  //         if (label) {
  //           count = label.count;
  //         }

  //         optionData.forEach((d: any) => (baseCount += d.count));
  //       }

  //       const plotValue = (count / baseCount) * 100;

  //       data.push({
  //         name: quesOption.labelText,
  //         y: +plotValue.toFixed(2),
  //       });
  //     }

  //     series.push({
  //       name: bannerQuesOption?.labelText,
  //       color: colorArr[index < colorArr.length ? index : 0],
  //       data,
  //       dataLabels: {
  //         enabled: true,
  //         // rotation: -90,
  //         color: "#343434",
  //         align: "center",
  //         format: "{point.y:.1f}", // one decimal
  //         // y: 10, // 10 pixels down from the top
  //         style: {
  //           fontSize: "10px",
  //           fontFamily: "Roboto",
  //         },
  //       },
  //     });
  //   }

  //   return {
  //     title: {
  //       text: "",
  //     },

  //     xAxis: {
  //       categories,
  //     },

  //     yAxis: {
  //       allowDecimals: false,
  //       min: 0,
  //       title: {
  //         text: "",
  //       },
  //     },

  //     // plotOptions: {
  //     //   column: {
  //     //     stacking: "normal",
  //     //   },
  //     // },

  //     series,
  //   };
  // } else {
  // }
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
          color: "#343434",
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
        color: "#343434",
        align: "center",
        format: "{point.y:.1f}%", // one decimal
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
    legend: {
      enabled: true,
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
