import _ from "lodash";
import store from "../redux/store";
import ApiRequest from "../utils/ApiRequest";
import {
  resetUserCache,
  setDialog,
  setuserCacheActive,
} from "../redux/actions/userCacheActions";
import ApiUrl from "../enums/ApiUrl";
import Toaster from "../utils/Toaster";
import { setFullScreenLoading } from "../redux/actions/chartActions";
import { generatePpt } from "../utils/ppt/PptGen";
import { IChartState } from "../redux/reducers/chartReducer";
import {
  computeBaseCount,
  formatChartDataWithBaseCount,
  removeEmptyDataLengends,
} from "./ChartService";
import { getChartOptions } from "../utils/ChartOptionFormatter";
import { QuestionType } from "../enums/QuestionType";
// import ExportPdfCharts, { exportPrint } from "../components/ExportPdfCharts";
import { setPdfExport } from "../redux/actions/exportActions";

export const handleDeleteChartCache = (cacheIdsArr: any) => {
  const body = {
    _ids: [...cacheIdsArr],
  };
  const { dispatch } = store;
  ApiRequest.request(ApiUrl.DELETE_CHART, "DELETE", body)
    .then((res) => {
      if (res.success) {
        dispatch(setDialog(false));
        const updatedSavedChart = addNewKeysToUserCache(res.data);
        store.dispatch(resetUserCache(updatedSavedChart));
        dispatch(setPdfExport([]));
        dispatch(setuserCacheActive(false));
        Toaster.warn(res.message);
      } else {
        Toaster.error(res.message);
      }
    })
    .catch((error) => console.log(error));
};

export const addNewKeysToUserCache = (savedChart: any) => {
  const _savedChart = JSON.parse(JSON.stringify(savedChart));
  const updateUserCache = _savedChart.map(function (userCacheItem: any) {
    userCacheItem.isSelected = false;
    userCacheItem.isActive = false;
    return userCacheItem;
  });

  return updateUserCache;
};

export const handleExportChartCache = async (
  cacheIdsArr: any,
  getsavedChart: any,
  exportType: string
) => {
  //export selected id's
  const filterExportData: any[] = [];
  const filterupdatedData: any[] = [];
  cacheIdsArr.forEach((ids: any) => {
    const filterData = _.filter(getsavedChart, function (o) {
      if (o?.filter.length > 0) {
        const dataFilter = o?.filter;
        const arrayHashmap = dataFilter.reduce((obj: any, item: any) => {
          obj[item.qId]
            ? obj[item.qId].push(...item)
            : (obj[item.id] = { ...item });

          return obj;
        }, {});
        filterupdatedData.push(arrayHashmap);
      }

      return o._id == ids;
    });
    filterExportData.push(...filterData);
  });

  const { dispatch } = store;

  const promiseAllArr: any = [];
  dispatch(setFullScreenLoading(true));
  const newAppliedFilter: any[] = [];
  filterExportData.forEach((el: any, Index: number) => {
    if (el.filter.length > 0) {
      newAppliedFilter.push(
        filterupdatedData.map((ele: any) => {
          return {
            qId: ele.undefined.qId,
            value: el.filter.map((el: any) => {
              return el.code;
            }),
          };
        })
      );
    }

    const body = {
      qId: el.qId,
      type: el.type,
      filters: newAppliedFilter[0],
      bannerQuestion: el.bannerQuestion,
      bannerType: el.bannerType ? el.bannerType : "",
    };
    promiseAllArr.push(ApiRequest.request(ApiUrl.CHART, "POST", body));
  });
  const apiResponse: any[] = await Promise.all(promiseAllArr);
  const updatedApiResponse: any[] = [];

  apiResponse.forEach((response: any) => {
    let chartData: IChartState = JSON.parse(JSON.stringify(response));
    if (response.success) {
      chartData.chartData = formatChartDataWithBaseCount(
        response.data.chartData,
        response.data.questionData,
        response.data.baseCount
      );
      chartData.questionChartData = response.data.questionChartData;
      chartData.bannerChartData = response.data.bannerChartData;
      chartData.baseCount = computeBaseCount(
        response.data.baseCount,
        response.data.questionData
      );
      const formatedQData = removeEmptyDataLengends(
        response.data.chartData,
        response.data.questionData,
        response.data.bannerQuestionData
      );

      chartData.questionData = formatedQData[0];
      chartData.bannerQuestionData = formatedQData[1];

      chartData.chartOptions = {
        ...response.chartOptions,
        ...getChartOptions(
          chartData.questionData,
          chartData.chartData,
          chartData.baseCount,
          response.data.bannerQuestionData,
          response.data.chartOptionsData,
          response.data.questionChartData,
          response.data.bannerChartData
        ),
      };
    }

    updatedApiResponse.push(chartData);
  });

  const payloadArr: any[] = [];
  filterExportData.forEach((el: any, index: number) => {
    const chart = {
      questionData: updatedApiResponse[index].questionData,
      bannerQuestionData: updatedApiResponse[index].data.bannerQuestionData,
      chartData: updatedApiResponse[index].chartData,
      questionChartData: updatedApiResponse[index].data.questionChartData,
      bannerChartData: updatedApiResponse[index].data.bannerChartData,
      chartOrientation: el.chartOrientation,
      chartType: el.chartType,
      baseCount: updatedApiResponse[index].data.baseCount[0].baseCount,
      showMean: el.showMean,
      significant: el.significant,
      chartLabelType: el.chartLabelType,
      chartTranspose: el.chartTranspose,
    };

    const filters = {
      appliedFilters: el.filter ? el.filter : [],
    };
    const payload = {
      chart,
      filters,
    };

    payloadArr.push(payload);
  });

  if (exportType === "pptexport") {
    generatePpt([...payloadArr]);
  } else {
    calcData(payloadArr);
    //exportPrint();
  }

  dispatch(setFullScreenLoading(false));
};

export const handelAddInUserCache = (
  chart: any,
  chartQuestionData: any,
  filters: any
) => {
  const { dispatch } = store;
  const userCachebody = {
    qText:
      chartQuestionData?.type === QuestionType.RANK
        ? chartQuestionData?.labelText
        : chartQuestionData?.questionText || chartQuestionData?.labelText,
    qId: chartQuestionData?.qId,
    type: chartQuestionData?.type,
    bannerType: chart?.bannerQuestionData?.type
      ? chart?.bannerQuestionData?.type
      : "",
    date: new Date(),
    filter: filters?.appliedFilters,
    bannerQuestion:
      chart?.bannerQuestionData == null ? "" : chart?.bannerQuestionData?.qId,
    chartType: chart?.chartType,
    chartLabelType: chart?.chartLabelType,
    chartOrientation: chart?.chartOrientation,
    chartTranspose: chart?.chartTranspose,
    significant: chart?.significant,
    showMean: chart?.showMean,
  };

  ApiRequest.request(ApiUrl.SAVE_CHART, "POST", userCachebody)
    .then((res) => {
      if (res.success) {
        dispatch(resetUserCache(res.data));
        Toaster.success(res.message);
      } else {
        dispatch(setuserCacheActive(false));
        Toaster.error(res.message); //add more things
      }
    })
    .catch((error) => console.log(error));
};

export const handelUpdatedUserCache = (
  chart: any,
  chartQuestionData: any,
  filters: any,
  cacheId: any
) => {
  const { dispatch } = store;
  const userCacheUpdatedbody = {
    qText:
      chartQuestionData?.type === QuestionType.RANK
        ? chartQuestionData?.labelText
        : chartQuestionData?.questionText,
    qId: chartQuestionData?.qId,
    type: chartQuestionData?.type,
    bannerType: chart?.bannerQuestionData?.type
      ? chart?.bannerQuestionData?.type
      : "",
    date: new Date(),
    filter: filters?.appliedFilters,
    bannerQuestion:
      chart?.bannerQuestionData == null ? "" : chart?.bannerQuestionData?.qId,
    chartType: chart?.chartType,
    chartLabelType: chart?.chartLabelType,
    chartOrientation: chart?.chartOrientation,
    chartTranspose: chart?.chartTranspose,
    significant: chart?.significant,
    showMean: chart?.showMean,
    id: cacheId,
  };

  ApiRequest.request(ApiUrl.SAVE_CHART, "POST", userCacheUpdatedbody)
    .then((res) => {
      if (res.success) {
        dispatch(setDialog(false));
        // dispatch(resetUserCache(res.data));
        Toaster.success(res.message);
      } else {
        //dispatch(setuserCacheActive(false));
        Toaster.error(res.message); //add more things
      }
    })
    .catch((error) => console.log(error));
};

function calcData(payloadObjectArr: any) {
  const { dispatch } = store;
  let chartsArray: Array<any> = [];

  for (let i = 0; i < payloadObjectArr.length; i++) {
    const chartOptionsPayload: any = {
      questionData: payloadObjectArr[i].chart.questionData,
      chartData: payloadObjectArr[i].chart.chartData,
      baseCount: payloadObjectArr[i].chart.baseCount,
      bannerQuestionData: payloadObjectArr[i].chart.bannerQuestionData,
      chartOptionsData: payloadObjectArr[i].chart.chartOptions,
      questionChartData: payloadObjectArr[i].chart.questionChartData,
      bannerChartData: payloadObjectArr[i].chart.bannerChartData,
      transposed: payloadObjectArr[i].chart.chartTranspose,
      chartLabelType: payloadObjectArr[i].chart.chartLabelType,
      chartType: payloadObjectArr[i].chart.chartType,
      significant: payloadObjectArr[i].chart.significant,
      showMean: payloadObjectArr[i].chart.showMean,
    };

    const newSeriesData = getChartOptions(
      chartOptionsPayload.questionData,
      chartOptionsPayload.chartData,
      chartOptionsPayload.baseCount,
      chartOptionsPayload.bannerQuestionData,
      chartOptionsPayload.chartOptionsData,
      chartOptionsPayload.questionChartData,
      chartOptionsPayload.bannerChartData,
      chartOptionsPayload.transposed,
      chartOptionsPayload.chartLabelType,
      chartOptionsPayload.chartType,
      chartOptionsPayload.significant,
      chartOptionsPayload.showMean
    );

    const payloadData: any = payloadObjectArr[i];
    const seriesData = newSeriesData.series;

    chartsArray.push({ payloadData, seriesData });
  }

  dispatch(setPdfExport(chartsArray));
}
