import ApiUrl from "../enums/ApiUrl";
import { IChartState } from "../redux/reducers/chartReducer";
import store from "../redux/store";
import ApiRequest from "../utils/ApiRequest";

export const fetchChartData = async (qId?: string) => {
  const {
    filters: { appliedFilters },
    questions: { questionList, selectedQuestionId },
    chart,
  } = store.getState();

  let chartData: IChartState = { ...chart };

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

    const body = {
      qId: qId ? qId : selectedQuestionId,
      type: questionList.find((ques) => ques.qId === qId)?.type || "",
      filters: chartFilters,
    };

    const response = await ApiRequest.request(ApiUrl.CHART, "POST", body);
    if (response.success) {
      chartData.chartData = response.data.chartData;
      chartData.questionData = response.data.questionData;
    }
  } catch (error) {
    console.log(error);
  }
  return chartData;
};
