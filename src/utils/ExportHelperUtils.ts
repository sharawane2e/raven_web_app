import { StaticText } from "../constants/StaticText";
import { decimalPrecision } from "../constants/Variables";
import { QuestionType } from "../enums/QuestionType";
import store, { RootState } from "../redux/store";
import { formatTableData, round } from "./Utility";

export function singleChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {
  let labels: any = [];
  let values: any = [];
  let seriesData: any[] = [];
  let options = questionData?.options || [];

  options.forEach((option: any) => {
    const dataObj = chartData.find(
      (data: any) => data.labelCode === option.labelCode
    );

    labels.push(option.labelText);
    if (dataObj && dataObj.count > 0) {
      let count = round((dataObj.count / baseCount) * 100, decimalPrecision);
      values.push(count);
    } else {
      values.push(0);
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
            ? round(+((data / subGroupData.baseCount) * 100), decimalPrecision)
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
          const obj = chartDataComplete[option.labelCode] || [];
          if (obj && obj.length > 0) {
            const localBase = obj?.reduce(
              (sum: number, option: any) => sum + option.count,
              0
            );
            const subOptionData = obj.find(
              (subObj: any) => subObj.labelCode === scaleOption.labelCode
            );
            if (subOptionData) {
              const data = (subOptionData.count / localBase) * 100;

              return round(data, decimalPrecision);
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
        subRow.push(round(d.values[k], 1) + "%");
      } else {
        // subRow.push(formatTableData(0, baseCount));
        subRow.push(0 + "%");
      }
    });
    rows.push([seriesData[0].labels[k], ...subRow]);

    subRow = [];
  }

  return rows;
}

export function appliedFiltersText() {
  const {
    filters: { appliedFilters },
  } = store.getState();

  let filters: string = "Filters: ";

  if (appliedFilters.length > 0) {
    appliedFilters.forEach((f) => {
      filters += f.label + " | ";
    });
  } else {
    filters += StaticText.NO_FILTER_APPLIED;
  }
  return filters;
}
