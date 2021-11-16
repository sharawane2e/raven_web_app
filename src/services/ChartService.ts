import ApiUrl from "../enums/ApiUrl";
import { ChartType } from "../enums/ChartType";
import { setChartData } from "../redux/actions/chartActions";
import { IChartState } from "../redux/reducers/chartReducer";
import store from "../redux/store";
import ApiRequest from "../utils/ApiRequest";
import { getChartOptions } from "../utils/ChartOptionFormatter";
import { ChartDataLabels } from "../enums/ChartDataLabels";
import { IQuestion } from "../types/IQuestion";
import { QuestionType } from "../enums/QuestionType";
import { omit } from "lodash";

export const fetchChartData = async (
  qId?: string,
  bannerQuestionId?: string
) => {
  const {
    filters: { appliedFilters },
    questions: { questionList, selectedQuestionId, selectedBannerQuestionId },
    chart,
  } = store.getState();

  let chartData: IChartState = JSON.parse(JSON.stringify(chart));

  try {
    const chartFilters: any[] = [];
    if (appliedFilters.length) {
      appliedFilters.forEach((filter) => {
        const chartFilter = chartFilters.find(
          (chartFilter) => chartFilter.qId === filter.qId
        );
        if (chartFilter) {
          chartFilter.value.push(filter.code);
        } else {
          chartFilters.push({
            qId: filter.qId,
            value: [filter.code],
          });
        }
      });
    }

    const quesId = qId ? qId : selectedQuestionId;
    const bannerQuesId = bannerQuestionId
      ? bannerQuestionId
      : selectedBannerQuestionId;
    const body = {
      qId: quesId,
      type: questionList.find((ques) => ques.qId === quesId)?.type || "",
      filters: chartFilters,
      bannerQuestion: bannerQuesId,
    };

    const response = await ApiRequest.request(ApiUrl.CHART, "POST", body);

    if (response.success) {
      chartData.chartData = formatChartDataWithBaseCount(
        response.data.chartData,
        response.data.questionData,
        response.data.baseCount
      );
      chartData.questionData = response.data.questionData;
      chartData.baseCount = computeBaseCount(
        response.data.baseCount,
        response.data.questionData
      );
      chartData.bannerQuestionData = response.data.bannerQuestionData;

      chartData.chartOptions = {
        ...chart.chartOptions,
        ...getChartOptions(
          chartData.questionData,
          chartData.chartData,
          chartData.baseCount,
          response.data.bannerQuestionData
        ),
      };
    }
  } catch (error) {
    console.log(error);
  }
  return chartData;
};

export const formatChartDataWithBaseCount = (
  chartData: any[],
  question: IQuestion,
  baseCountData: any[]
) => {
  const chartDataWithUpdatedBase = JSON.parse(JSON.stringify(chartData));
  if (question.type === QuestionType.GRID) {
    chartDataWithUpdatedBase.forEach((data: any) => {
      data.baseCount = data?.options?.reduce(
        (sum: number, currentObj: any) => sum + currentObj.count,
        0
      );
    });
  } else if (question.type === QuestionType.GRID_MULTI) {
    const fieldCountData = baseCountData[0]?.fieldCount || [];
    chartDataWithUpdatedBase.forEach((data: any) => {
      data.baseCount =
        fieldCountData.find((countData: any) => countData.quesId === data._id)
          ?.count || undefined;
    });
  }
  return chartDataWithUpdatedBase;
};

export const computeBaseCount = (baseCount: any, question: IQuestion) => {
  if (Array.isArray(baseCount)) {
    if (question.type === QuestionType.GRID_MULTI) {
      return baseCount[0]?.baseCount[0]?.baseCount || 0;
    } else if (question.type === QuestionType.RANK) {
      return baseCount[0]?.count;
    } else {
      return baseCount[0]?.baseCount || 0;
    }
  }
  return 0;
};

export const changeChartType = (newChartType: ChartType) => {
  const { chart } = store.getState();
  const { dispatch } = store;
  const chartDataClone = JSON.parse(JSON.stringify(chart));

  chartDataClone.chartType = newChartType;

  let plotOptions = chartDataClone.chartOptions["plotOptions"];
  plotOptions = omit(plotOptions, ["column", "bar", "pie"]);

  if (newChartType === ChartType.STACK) {
    plotOptions["column"] = {
      stacking: "normal",
    };
    plotOptions["series"].dataLabels.format = "{point.y:.1f}%";
  } else if (newChartType === ChartType.COLUMN) {
    plotOptions["bar"] = {
      stacking: "normal",
    };
    plotOptions["series"].dataLabels.format = "{point.y:.1f}%";
  } else if (newChartType === ChartType.PIE) {
    plotOptions["pie"] = {
      allowPointSelect: false,
      cursor: "pointer",
    };
    plotOptions["series"].dataLabels.format =
      "<b>{point.name}</b>: {point.percentage:.1f}%";
  }

  if (newChartType === ChartType.PIE) {
    chartDataClone.chartOptions["chart"] = {
      ...chartDataClone.chartOptions["chart"],
      type: "pie",
    };
  } else {
    chartDataClone.chartOptions["chart"] = {
      ...chartDataClone.chartOptions["chart"],
      type: "column",
    };
  }
  chartDataClone.chartOptions["plotOptions"] = plotOptions;

  dispatch(setChartData(chartDataClone));
};

export const changeDataLabelFormat = (chartDataLabel: ChartDataLabels) => {
  const { chartOptions } = store.getState().chart;
  let newChartOptions = JSON.parse(JSON.stringify(chartOptions));
  newChartOptions.plotOptions.series.dataLabels.format = chartDataLabel;
  newChartOptions = {
    ...newChartOptions,
    ...getChartOptions(
      undefined,
      undefined,
      undefined,
      undefined,
      newChartOptions
    ),
  };

  return newChartOptions;
};
