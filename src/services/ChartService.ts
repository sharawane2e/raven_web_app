import ApiUrl from '../enums/ApiUrl';
import { ChartType } from '../enums/ChartType';
import {
  setChartData,
  setChartLabel,
  setChartLoading,
  setChartOrientation,
  setChartTranspose,
  setChartType,
} from '../redux/actions/chartActions';
import { IChartState } from '../redux/reducers/chartReducer';
import store from '../redux/store';
import ApiRequest from '../utils/ApiRequest';
import { getChartOptions, getPlotOptions } from '../utils/ChartOptionFormatter';
import { IQuestion } from '../types/IQuestion';
import { QuestionType } from '../enums/QuestionType';
import _, { find } from 'lodash';
import { ChartLabelType } from '../enums/ChartLabelType';
import { ChartOrientation } from '../enums/ChartOrientation';

export const fetchChartData = async (
  qId?: string,
  bannerQuestionId?: string,
) => {
  const {
    filters: { appliedFilters },
    questions: {
      questionList,
      selectedQuestionId,
      selectedBannerQuestionId,
      bannerQuestionList,
    },
    chart,
  } = store.getState();

  const { dispatch } = store;

  let chartData: IChartState = JSON.parse(JSON.stringify(chart));

  try {
    const chartFilters: any[] = [];
    if (appliedFilters.length) {
      appliedFilters.forEach((filter: any) => {
        const chartFilter = chartFilters.find(
          (chartFilter) => chartFilter.qId === filter.qId,
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

    const type =
      questionList.find((ques: any) => ques.qId === quesId)?.type || '';
    const bannerQuestion = find(bannerQuestionList, function (o) {
      return o.qId === bannerQuesId;
    });
    const bannerQuestionType = bannerQuestion?.type;

    const body = {
      qId: quesId,
      type: type,
      filters: chartFilters,
      bannerQuestion: bannerQuesId,
      bannerType: bannerQuestionType ? bannerQuestionType : null,
    };

    let response: any = '';
    dispatch(setChartLoading(true));

    response = await ApiRequest.request(ApiUrl.CHART, 'POST', body);

    if (response.success) {
      dispatch(setChartLoading(false));

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
        ...chart.chartOptions,
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
  } catch (error) {
    console.log(error);
  }

  if (chartData.chartLabelType == ChartLabelType.NUMBER) {
    dispatch(setChartLabel(ChartLabelType.NUMBER));
  } else {
    dispatch(setChartLabel(ChartLabelType.PERCENTAGE));
  }

  if (chartData.chartOrientation == ChartOrientation.LANDSCAPE) {
    dispatch(setChartLabel(ChartOrientation.LANDSCAPE));
  } else {
    dispatch(setChartOrientation(ChartOrientation.PORTRAIT));
  }

  return chartData;
};

export const formatChartDataWithBaseCount = (
  chartData: any[],
  question: IQuestion,
  baseCountData: any[],
) => {
  const chartDataWithUpdatedBase = JSON.parse(JSON.stringify(chartData));
  if (question.type === QuestionType.GRID) {
    chartDataWithUpdatedBase.forEach((data: any) => {
      data.baseCount = data?.options?.reduce(
        (sum: number, currentObj: any) => sum + currentObj.count,
        0,
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

export const removeEmptyDataLengends = (
  chartData: any[],
  question: IQuestion,
  bannerQuestionData: any,
) => {
  const questionCopy = { ...question };

  const chartDataClone = JSON.parse(JSON.stringify(chartData));
  const uniqueLengends: any = [];
  const filteredOptions: any = [];
  if (
    (questionCopy.type === QuestionType.SINGLE ||
      questionCopy.type === QuestionType.MULTI) &&
    bannerQuestionData !== null
  ) {
    Object.values(chartDataClone[0]).forEach((obj: any) => {
      obj.forEach((subArr: any) => {
        if (!uniqueLengends.includes(subArr.labelCode))
          uniqueLengends.push(subArr.labelCode);
      });
    });
    bannerQuestionData.options.forEach((obj: any) => {
      if (uniqueLengends.includes(obj.labelCode)) filteredOptions.push(obj);
    });
    bannerQuestionData.options = filteredOptions;
  } else if (
    questionCopy.type === QuestionType.GRID ||
    questionCopy.type === QuestionType.GRID_MULTI ||
    questionCopy.type === QuestionType.RANK
  ) {
    Object.values(chartDataClone).forEach((obj: any) => {
      obj.options.forEach((subArr: any) => {
        if (!uniqueLengends.includes(subArr.option))
          uniqueLengends.push(subArr.option);
      });
    });
    questionCopy.scale.forEach((obj: any) => {
      if (uniqueLengends.includes(obj.labelCode)) filteredOptions.push(obj);
    });
    questionCopy.scale = filteredOptions;
  }

  if (questionCopy.isGroupNet) {
    if (questionCopy.type === QuestionType.GRID) {
      questionCopy.scale.push(...questionCopy.groupNetData);
    }
    if (questionCopy.type === QuestionType.SINGLE) {
      questionCopy.options.push(...questionCopy.groupNetData);
    }
  }

  return [questionCopy, bannerQuestionData];
};
export const computeBaseCount = (baseCount: any, question: IQuestion) => {
  if (Array.isArray(baseCount)) {
    if (question.type === QuestionType.GRID_MULTI) {
      return baseCount[0]?.baseCount[0]?.baseCount || 0;
    } else if (question.type === QuestionType.RANK) {
      return baseCount.reduce((basevalue, bcount) =>
        basevalue.count > bcount.count ? basevalue : bcount,
      ).count;
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

  if (
    (chart?.questionData?.type === QuestionType.SINGLE ||
      chart?.questionData?.type === QuestionType.GRID) &&
    newChartType === ChartType.COLUMN //we have put grid due to mean calculation
  ) {
    dispatch(setChartType(ChartType.COLUMN));
    chartDataClone.chartOptions = {
      ...chartDataClone.chartOptions,
      chart: {
        ...chartDataClone.chartOptions['chart'],
        type: 'column',
      },
      ...getChartOptions(),
    };
    chartDataClone.chartOptions['plotOptions'] = getPlotOptions(newChartType);
    dispatch(setChartData(chartDataClone));
  } else if (newChartType === ChartType.LINE) {
    const lineSetportrait: any = 'portrait';
    dispatch(setChartType(ChartType.LINE));

    chartDataClone.chartOptions = {
      ...chartDataClone.chartOptions,
      chart: {
        ...chartDataClone.chartOptions['chart'],
        type: 'line',
      },
      ...getChartOptions(),
    };
    chartDataClone.chartOptions['plotOptions'] = getPlotOptions(newChartType);
    dispatch(setChartData(chartDataClone));
    dispatch(setChartOrientation(lineSetportrait));
  } else if (newChartType === ChartType.PIE) {
    dispatch(setChartType(ChartType.PIE));

    chartDataClone.chartOptions = {
      ...chartDataClone.chartOptions,
      chart: {
        ...chartDataClone.chartOptions['chart'],
        type: 'pie',
      },
      ...getChartOptions(),
    };
    chartDataClone.chartOptions['plotOptions'] = getPlotOptions(newChartType);

    dispatch(setChartData(chartDataClone));
  } else if (newChartType === ChartType.COLUMN) {
    dispatch(setChartType(ChartType.COLUMN));
    chartDataClone.chartOptions = {
      ...chartDataClone.chartOptions,
      chart: {
        ...chartDataClone.chartOptions['chart'],
        type: 'column',
      },
      ...getChartOptions(),
    };
    chartDataClone.chartOptions['plotOptions'] = getPlotOptions(newChartType);

    dispatch(setChartData(chartDataClone));
  } else {
    dispatch(setChartType(ChartType.STACK));
    chartDataClone.chartOptions = {
      ...chartDataClone.chartOptions,
      chart: {
        ...chartDataClone.chartOptions['chart'],
        type: 'column',
      },
      ...getChartOptions(),
    };

    chartDataClone.chartOptions['plotOptions'] = getPlotOptions(newChartType);
    dispatch(setChartData(chartDataClone));
  }
};

export const transposeChart = () => {
  const { chart } = store.getState();
  const { dispatch } = store;
  const chartDataClone = JSON.parse(JSON.stringify(chart));
  const transposed = !chartDataClone.chartTranspose;

  if (chartDataClone.questionData.type == QuestionType.GRID) {
    dispatch(setChartTranspose(transposed));
  } else if (
    chartDataClone.bannerQuestionData &&
    chartDataClone.questionData.type == QuestionType.SINGLE
  ) {
    dispatch(setChartTranspose(transposed));
  } else if (
    chartDataClone.bannerQuestionData &&
    chartDataClone.questionData.type == QuestionType.MULTI
  ) {
    dispatch(setChartTranspose(transposed));
  }

  chartDataClone.chartOptions = {
    ...chart.chartOptions,
    ...getChartOptions(
      chartDataClone.questionData,
      chartDataClone.chartData,
      chartDataClone.baseCount,
      chartDataClone.bannerQuestionData,
      undefined,
      undefined,
      undefined,
      transposed,
    ),
  };

  dispatch(setChartData(chartDataClone));
  dispatch(setChartTranspose(transposed));
};
