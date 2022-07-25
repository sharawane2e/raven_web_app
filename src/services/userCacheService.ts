import _ from "lodash";
import store from "../redux/store";
import ApiRequest from "../utils/ApiRequest";
import { resetUserCache } from "../redux/actions/userCacheActions";
import ApiUrl from "../enums/ApiUrl";
import Toaster from "../utils/Toaster";
import { setFullScreenLoading } from "../redux/actions/chartActions";

export const isChartInCache = () => {
  let isChartDuplicate = false;
  let duplicateCacheIndex = -1;

  const {
    userCache: { savedChart },
    chart,
    filters,
  } = store.getState();

  const _savedChart = JSON.parse(JSON.stringify(savedChart));
  const _chart = {
    qText: chart.questionData?.questionText,
    qId: chart.questionData?.qId,
    type: chart.questionData?.type,
    filter: filters.filters,
    bannerQuestion:
      chart?.bannerQuestionData == null ? "" : chart?.bannerQuestionData?.qId,
    chartType: chart.chartType,
    chartLabelType: chart.chartLabelType,
    chartOrientation: chart.chartOrientation,
    chartTranspose: chart.chartTranspose,
  };

  _savedChart.forEach(function (element: any) {
    delete element.date;
    delete element._id;
    delete element.isSelected; // if question is checked
    delete element.isActive; // if question and other filters are visible on screen
  });

  _savedChart.forEach(function (element: any, index: number) {
    const checkEquality = _.isEqual(element, _chart);
    if (checkEquality == true) {
      isChartDuplicate = true;
      duplicateCacheIndex = index;
    }
  });
  return {
    isChartDuplicate,
    duplicateCacheId: isChartDuplicate
      ? savedChart[duplicateCacheIndex]._id
      : null,
  };
};

export const handleDeleteChartCache = (cacheIdsArr: any) => {
  const body = {
    _ids: [...cacheIdsArr],
  };
  ApiRequest.request(ApiUrl.DELETE_CHART, "DELETE", body)
    .then((res) => {
      if (res.success) {
        const updatedSavedChart = addNewKeysToUserCache(res.data);
        store.dispatch(resetUserCache(updatedSavedChart));

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

export const multiExport = async (savedChart: any) => {
  const { dispatch } = store;
  const promiseAllArr: any = [];
  dispatch(setFullScreenLoading(true));
  savedChart.forEach((el: any) => {
    const body = {
      qId: el.qId,
      type: el.type,
      filters: el.filter,
      bannerQuestion: el.bannerQuestion,
      bannerType: el.bannerType ? el.bannerType : "",
    };
    promiseAllArr.push(ApiRequest.request(ApiUrl.CHART, "POST", body));
  });

  const apiResponse = await Promise.all(promiseAllArr);
  console.log(apiResponse);
  dispatch(setFullScreenLoading(false));
  //console.log(apiResponse);
};
