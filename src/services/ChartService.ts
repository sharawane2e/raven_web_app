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
      chartData.chartData = computeBaseCount(
        response.data.chartData,
        response.data.questionData
      );
      chartData.questionData = response.data.questionData;
      chartData.baseCount = response.data.baseCount;
      chartData.bannerQuestionData = response.data.bannerQuestionData;

      chartData.chartOptions = {
        ...chart.chartOptions,
        ...getChartOptions(
          chartData.questionData,
          chartData.chartData,
          response.data.baseCount,
          response.data.bannerQuestionData
        ),
      };
    }
  } catch (error) {
    console.log(error);
  }
  return chartData;
};

export const computeBaseCount = (chartData: any[], question: IQuestion) => {
  const chartDataWithUpdatedBase = JSON.parse(JSON.stringify(chartData));
  if (question.type === QuestionType.GRID) {
    chartDataWithUpdatedBase.forEach((data: any) => {
      data.baseCount = data?.options?.reduce(
        (sum: number, currentObj: any) => sum + currentObj.count,
        0
      );
    });
  }
  return chartDataWithUpdatedBase;
};

export const changeChartType = (newChartType: ChartType) => {
  const { chart } = store.getState();
  const { chartType } = chart;
  const { dispatch } = store;
  const newChartData = JSON.parse(JSON.stringify(chart));
  newChartData.chartType = newChartType;

  let seriesData: any[] = newChartData.chartOptions.series;

  if (newChartType === ChartType.STACK || chartType === ChartType.STACK) {
    seriesData?.reverse();
    newChartData.chartOptions["legend"].reversed =
      !newChartData.chartOptions["legend"].reversed;
  }

  let plotOptions = newChartData.chartOptions["plotOptions"];
  delete plotOptions.column;
  delete plotOptions.bar;
  delete plotOptions.pie;
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
    newChartData.chartOptions["chart"] = {
      ...newChartData.chartOptions["chart"],
      type: "pie",
    };
  } else {
    newChartData.chartOptions["chart"] = {
      ...newChartData.chartOptions["chart"],
      type: "column",
    };
  }
  newChartData.chartOptions["series"] = seriesData;

  dispatch(setChartData(newChartData));
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
