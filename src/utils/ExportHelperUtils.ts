import { decimalPrecision } from "../constants/Variables";
import { QuestionType } from "../enums/QuestionType";
import store from "../redux/store";
import { formatTableData, round } from "./Utility";

export function singleChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {
  let lb: any = [];
  let val: any = [];
  let seriesData: any[] = [];
  let options = questionData?.options || [];
  let sortedOptions = options.map((i: any) => {
    return parseInt(i.labelCode, 10);
  });

  sortedOptions.map((item: any) => {
    let cLb = options.find(
      (element: any) => element.labelCode == item.toString()
    );

    lb.push(cLb?.labelText);
  });

  let ChartDataCodeToInt = chartData.map((i: any) => {
    let code = parseInt(i.labelCode);
    let count = i.count;

    return { code, count };
  });
  const sortedCountObj = ChartDataCodeToInt.sort((first: any, second: any) =>
    first.code > second.code ? 1 : -1
  );

  sortedCountObj.map((i: any) => {
    val.push(round((i.count / baseCount) * 100, decimalPrecision));
  });
  seriesData = [
    {
      name: questionData?.labelText,
      labels: lb,
      values: val,
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
  } = store.getState();

  const {
    questions: { selectedBannerQuestionId, bannerQuestionList },
  } = store.getState();

  if (selectedBannerQuestionId) {
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
          round((d.values[k] / 100) * baseCount, 0) +
            "|" +
            round(d.values[k], 1) +
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
