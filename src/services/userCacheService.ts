import _ from 'lodash';
import store from '../redux/store';
import ApiRequest from '../utils/ApiRequest';
import { resetUserCache } from '../redux/actions/userCacheActions';
import ApiUrl from '../enums/ApiUrl';
import Toaster from '../utils/Toaster';
import { setFullScreenLoading } from '../redux/actions/chartActions';
import { generatePpt } from '../utils/ppt/PptGen';
import { IChartState } from '../redux/reducers/chartReducer';
import {
  computeBaseCount,
  formatChartDataWithBaseCount,
  removeEmptyDataLengends,
} from './ChartService';
import { getChartOptions } from '../utils/ChartOptionFormatter';
import { QuestionType } from '../enums/QuestionType';

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
      chart?.bannerQuestionData == null ? '' : chart?.bannerQuestionData?.qId,
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
  ApiRequest.request(ApiUrl.DELETE_CHART, 'DELETE', body)
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

export const handleExportChartCache = async (
  cacheIdsArr: any,
  getsavedChart: any,
) => {
  //export selected id's
  const filterExportData: any[] = [];
  cacheIdsArr.forEach((ids: any) => {
    const filterData = _.filter(getsavedChart, function (o) {
      return o._id == ids;
    });
    filterExportData.push(...filterData);
  });

  const { dispatch } = store;

  const promiseAllArr: any = [];
  dispatch(setFullScreenLoading(true));
  const newAppliedFilter: any[] = [];
  filterExportData.forEach((el: any) => {
    if (el.filter.length > 0) {
      newAppliedFilter.push({
        qId: el.qId,
        value: el.filter.map((el: any) => {
          return el.code;
        }),
      });
    }

    const body = {
      qId: el.qId,
      type: el.type,
      filters: newAppliedFilter,
      bannerQuestion: el.bannerQuestion,
      bannerType: el.bannerType ? el.bannerType : '',
    };
    promiseAllArr.push(ApiRequest.request(ApiUrl.CHART, 'POST', body));
  });
  const apiResponse: any[] = await Promise.all(promiseAllArr);
  const updatedApiResponse: any[] = [];

  apiResponse.forEach((response: any) => {
    let chartData: IChartState = JSON.parse(JSON.stringify(response));
    if (response.success) {
      chartData.chartData = formatChartDataWithBaseCount(
        response.data.chartData,
        response.data.questionData,
        response.data.baseCount,
      );
      chartData.questionChartData = response.data.questionChartData;
      chartData.bannerChartData = response.data.bannerChartData;
      chartData.baseCount = computeBaseCount(
        response.data.baseCount,
        response.data.questionData,
      );
      const formatedQData = removeEmptyDataLengends(
        response.data.chartData,
        response.data.questionData,
        response.data.bannerQuestionData,
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
          response.data.bannerChartData,
        ),
      };
    }

    updatedApiResponse.push(chartData);
  });
  //console.log('chartData', updatedApiResponse);
  debugger;
  const payloadArr: any[] = [];
  filterExportData.forEach((el: any, index: number) => {
    //console.log(el);
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

  generatePpt([...payloadArr]);
  dispatch(setFullScreenLoading(false));
};
