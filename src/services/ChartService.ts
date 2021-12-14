import ApiUrl from "../enums/ApiUrl";
import { ChartType } from "../enums/ChartType";
import { setChartData,setChartOperations } from "../redux/actions/chartActions";
import { IChartState } from "../redux/reducers/chartReducer";
import store from "../redux/store";
import ApiRequest from "../utils/ApiRequest";
import { getChartOptions } from "../utils/ChartOptionFormatter";
import { ChartDataLabels } from "../enums/ChartDataLabels";
import { IQuestion } from "../types/IQuestion";
import { QuestionType } from "../enums/QuestionType";
import { omit } from "lodash";
import { IChartOperations } from "../types/IChartOperations";

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
    // debugger;
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
  chartDataClone.chartOptions["plotOptions"] = getPlotOptions(newChartType);

  dispatch(setChartData(chartDataClone));
};

export const changeChartOperations = (chartOperationsObj: IChartOperations) => {
  const {dispatch} = store;
  const {chart} = store.getState();
  const chartDataClone = JSON.parse(JSON.stringify(chart));

  chartDataClone.chartOperations = chartOperationsObj;
  dispatch(setChartOperations(chartDataClone));
  getPlotOptions();
  chartDataClone.chartOptions = {
    ...chart.chartOptions,
    // plotOptions:getPlotOptions(),
    ...getChartOptions(
      chartDataClone.questionData,
      chartDataClone.chartData,
      chartDataClone.baseCount,
      chartDataClone.bannerQuestionData
    ),
    plotOptions:getPlotOptions()
  };
  dispatch(setChartData(chartDataClone));
};

export const transposeChart = () => {
  const { chart } = store.getState();
  const { dispatch } = store;
  const chartDataClone = JSON.parse(JSON.stringify(chart));

  if (chartDataClone.questionData.type == QuestionType.RANK) {
    const newSubGroup: any = [];
    const newScale: any = [];
    const newChartData: any = [];
    chartDataClone.questionData.subGroups.forEach(
      (scale: any, index: number) => {
        newScale.push({
          labelText: scale.labelText,
          labelCode: scale.qId,
          order: index,
        });
      }
    );

    chartDataClone.questionData.scale.forEach((scale: any, index: number) => {
      newSubGroup.push({
        qId: scale.labelCode,
        labelText: scale.labelText,
        questionText: scale.labelText,
        type: QuestionType.SINGLE,
      });
    });

    newSubGroup.forEach((col: any, index: number) => {
      const options: any = [];
      chartDataClone.chartData.forEach((data: any, index: number) => {
        const count: number = data.options.find(
          (subOption: any) => subOption.option === col.qId
        )?.count;
        options.push({
          option: data._id,
          count: count == undefined ? 0 : count,
        });
      });
      newChartData.push({ _id: col.qId, options: options });
    });
    chartDataClone.chartData = newChartData;
    chartDataClone.questionData.scale = newScale;
    chartDataClone.questionData.subGroups = newSubGroup;
  } else if (
    chartDataClone.bannerQuestionData &&
    (chartDataClone.questionData.type == QuestionType.SINGLE ||
      chartDataClone.questionData.type == QuestionType.MULTI)
  ) {
    const { chartData } = chartDataClone;
    const allLabels: Array<string> = [];
    const newChartData: any = {};
    const questionData = chartDataClone.questionData;
    const bannerData = chartDataClone.bannerQuestionData;

    for (const labelArrays in chartData[0]) {
      const labelArray = chartData[0][labelArrays];
      labelArray.forEach((el: any) => {
        if (allLabels.indexOf(el.labelCode) == -1) {
          allLabels.push(el.labelCode);
          newChartData[el.labelCode] = [];
        }
        newChartData[el.labelCode].push({
          count: el.count,
          labelCode: labelArrays,
        });
      });
    }

    chartDataClone.chartData[0] = newChartData;
    chartDataClone.questionData = bannerData;
    chartDataClone.bannerQuestionData = questionData;
  } else if (
    chartDataClone.questionData.type == QuestionType.GRID ||
    chartDataClone.questionData.type == QuestionType.GRID_MULTI
  ) {
  }
  chartDataClone.chartOptions = {
    ...chart.chartOptions,
    ...getChartOptions(
      chartDataClone.questionData,
      chartDataClone.chartData,
      chartDataClone.baseCount,
      chartDataClone.bannerQuestionData
    ),
  };
  dispatch(setChartData(chartDataClone));
};

export const getPlotOptions = (chartType = store.getState().chart.chartType) =>{
  const chartDataClone = JSON.parse(JSON.stringify(store.getState().chart));
  let plotOptions = chartDataClone.chartOptions["plotOptions"];
  plotOptions = omit(plotOptions, ["column", "bar", "pie"]);

  if (chartType === ChartType.STACK) {
    plotOptions["column"] = {
      stacking: "normal",
    };
    plotOptions["series"].dataLabels.format = `${chartDataClone.chartOperations.labelFormat===ChartDataLabels.PERCENTAGE?'{point.y:.1f}%':'{point.y:.0f}'}`;
  } else if (chartType === ChartType.COLUMN) {
    plotOptions["bar"] = {
      stacking: "normal",
    };
    plotOptions["series"].dataLabels.format = `${chartDataClone.chartOperations.labelFormat===ChartDataLabels.PERCENTAGE?'{point.y:.1f}%':'{point.y:.0f}'}`;
  } else if (chartType === ChartType.PIE) {
    plotOptions["pie"] = {
      allowPointSelect: false,
      cursor: "pointer",
    };
    plotOptions["series"].dataLabels.format =`${chartDataClone.chartOperations.labelFormat===ChartDataLabels.PERCENTAGE?'<b>{point.name}</b>: {point.percentage:.1f}%':'<b>{point.name}</b>: {point.percentage:.0f}'}`;
  }
  console.log(plotOptions)
  return plotOptions;
}
