import { decimalPrecision } from "../constants/Variables";
import { ChartDataLabels } from "../enums/ChartDataLabels";
import { QuestionType } from "../enums/QuestionType";
import store, { RootState } from "../redux/store";
import { formatTableData, round } from "./Utility";

export function singleChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {
  const state: RootState = store.getState();
  const dataFormat =
    state?.chart?.chartOptions?.plotOptions?.series?.dataLabels?.format ||
    ChartDataLabels.PERCENTAGE;
  let labels: any = [];
  let values: any = [];
  let seriesData: any[] = [];
  let options = questionData?.options || [];

  options.forEach((option: any) => {
    const dataObj = chartData.find(
      (data: any) => data.labelCode === option.labelCode
    );
    if (dataObj && dataObj.count > 0) {
      labels.push(option.labelText);
      // let count = dataObj.count;
      let count = round((dataObj.count / baseCount) * 100, 2);
      // if (dataFormat === ChartDataLabels.PERCENTAGE) {
      // }
      values.push(count);
    }
  });

  seriesData = [
    {
      name: questionData?.labelText,
      labels: labels,
      values: values,
    },
  ];

  return seriesData;
}

export function gridChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {
  let labels: any = [];
  let seriesData: any[] = [];
  labels = questionData.subGroups.map((subGroup: any) => subGroup.labelText);
  questionData.scale.forEach((scaleOption: any) => {
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: questionData.subGroups.map((subGroup: any) => {
        const subGroupData = chartData.find(
          (data: any) => data._id === subGroup.qId
        );
        if (subGroupData) {
          const data = subGroupData?.options?.find(
            (scaleData: any) => scaleData.option === scaleOption.labelCode
          )?.count;
          return data !== undefined
            ? +((data / baseCount) * 100).toFixed(decimalPrecision)
            : 0;
        } else {
          return 0;
        }
      }),
    });
  });
  // seriesData[0].labels = seriesData[0].labels.splice(0, 1);
  // seriesData[0].values = seriesData[0].values.splice(0, 1);
  // seriesData[0].labels = [...seriesData[0].labels];
  // seriesData[0].values = [...seriesData[0].values];
  // seriesData[0].labels.splice(0, 1);
  // seriesData[0].values.splice(0, 1);

  return seriesData;
}

export function bannerChartDataGen(
  bannerQuestionList: any,
  questionData: any,
  chartData: any,
  selectedBannerQuestionId: any
) {
  let labels: any = [];
  let seriesData: any[] = [];
  labels = questionData.options.map((label: any) => label.labelText);
  let scale =
    bannerQuestionList.find(
      (ques: any) => ques.qId === selectedBannerQuestionId
    )?.options || [];
  let chartDataComplete = chartData[0];

  scale.forEach((scaleOption: any) => {
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: questionData.options.map((option: any) => {
        if (option.labelCode in chartDataComplete) {
          const obj = chartDataComplete[option.labelCode];
          if (obj != []) {
            const subOptionData = obj.find(
              (subObj: any) => subObj.labelCode === scaleOption.labelCode
            );
            if (subOptionData) {
              const data = subOptionData.count;

              return data.toFixed(2);
            } else {
              return 0;
            }
          }
        }
      }),
    });
  });

  return seriesData;
}

export function tableChartDataGen() {
  let seriesData = [];
  const {
    chart: { chartData, questionData, baseCount, chartType },
    questions: { selectedBannerQuestionId, bannerQuestionList },
  } = store.getState();

  if (
    selectedBannerQuestionId &&
    (questionData?.type === QuestionType.SINGLE ||
      questionData?.type === QuestionType.MULTI)
  ) {
    seriesData = bannerChartDataGen(
      bannerQuestionList,
      questionData,
      chartData,
      selectedBannerQuestionId
    );
  } else {
    if (
      questionData?.type === QuestionType.SINGLE ||
      questionData?.type === QuestionType.MULTI
    ) {
      seriesData = singleChartDataGen(questionData, chartData, baseCount);
    } else if (
      questionData?.type === QuestionType.GRID ||
      questionData?.type === QuestionType.GRID_MULTI ||
      questionData?.type === QuestionType.RANK
    ) {
      seriesData = gridChartDataGen(questionData, chartData, baseCount);
    }
  }
  debugger;
  let rows = [];
  let scale: any = [];
  seriesData.forEach((index: any) => {
    scale.push(index.name);
  });
  rows.push(["", ...scale]);
  let subRow: any = [];
  for (let k = 0; k < seriesData[0].labels.length; k++) {
    seriesData.forEach((d: any) => {
      if (d.values[k]) {
        subRow.push(
          round(d.values[k], 0) +
            "|" +
            round((d.values[k] / baseCount) * 100, 1) +
            "%"
        );
      } else {
        subRow.push(formatTableData(0, baseCount));
      }
    });
    rows.push([seriesData[0].labels[k], ...subRow]);

    subRow = [];
  }

  return rows;
}
