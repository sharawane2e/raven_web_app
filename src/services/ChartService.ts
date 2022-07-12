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
    };

    let response: any = '';

    if (bannerQuestionType == QuestionType.MULTI && type) {
      dispatch(setChartLoading(true));
      // response = await ApiRequestMulti.request(ApiUrl.CHART, 'POST', body);
    } else {
      response = await ApiRequest.request(ApiUrl.CHART, 'POST', body);
    }
    if (response.success) {
      chartData.chartData = formatChartDataWithBaseCount(
        response.data.chartData,
        response.data.questionData,
        response.data.baseCount,
      );
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

      if (bannerQuestionType == QuestionType.MULTI && type) {
        const updatedBody = { ...body, bannerQuestion: '' };
        // const baseChartresponse = await ApiRequestMulti.request(
        //   ApiUrl.CHART,
        //   'POST',
        //   updatedBody,
        // );
        // // console.log(baseChartresponse.data.chartData)
        // chartData.chartData.push(baseChartresponse.data.chartData);

        chartData.chartOptions = {
          ...chart.chartOptions,
          ...getChartOptions(
            chartData.questionData,
            chartData.chartData,
            chartData.baseCount,
            response.data.bannerQuestionData,
          ),
        };
        dispatch(setChartLoading(false));
      } else {
        chartData.chartOptions = {
          ...chart.chartOptions,
          ...getChartOptions(
            chartData.questionData,
            chartData.chartData,
            chartData.baseCount,
            response.data.bannerQuestionData,
          ),
        };
      }

      chartData.showMean = false;
      // chartData.significant = false;
    }
  } catch (error) {
    console.log(error);
  }

  if (chartData.chartLabelType == ChartLabelType.NUMBER) {
    //debugger;
    dispatch(setChartLabel(ChartLabelType.NUMBER));
  } else {
    dispatch(setChartLabel(ChartLabelType.PERCENTAGE));
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
    // debugger;
    Object.values(chartDataClone).forEach((obj: any) => {
      obj.options.forEach((subArr: any) => {
        if (!uniqueLengends.includes(subArr.option))
          uniqueLengends.push(subArr.option);
      });
    });
    questionCopy.scale.forEach((obj: any) => {
      if (uniqueLengends.includes(obj.labelCode)) filteredOptions.push(obj);
    });
    // questionCopy.scale = [];
    // questionCopy.scale.length = 0;
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
  //console.log("newChartType", newChartType);
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
  //debugger;
  const { chart, questions } = store.getState();
  const { dispatch } = store;
  const chartDataClone = JSON.parse(JSON.stringify(chart));
  const transposed = !chartDataClone.chartTranspose;

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
      },
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
      let baseCount: number = 0;
      chartDataClone.chartData.forEach((data: any, index: number) => {
        const count: number = data.options.find(
          (subOption: any) => subOption.option === col.qId,
        )?.count;
        options.push({
          option: data._id,
          count: count == undefined ? 0 : count,
        });

        baseCount += count == undefined ? 0 : count;
      });
      if (
        chartDataClone.questionData.type == QuestionType.GRID ||
        chartDataClone.questionData.type == QuestionType.GRID_MULTI
      ) {
        newChartData.push({
          _id: col.qId,
          options: options,
          baseCount: baseCount,
        });
      } else {
        newChartData.push({ _id: col.qId, options: options });
      }
    });
    chartDataClone.chartData = newChartData;
    chartDataClone.questionData.scale = newScale;
    chartDataClone.questionData.subGroups = newSubGroup;
  } else if (chartDataClone.questionData.type == QuestionType.GRID) {
    if (chart.showMean) {
      dispatch(setChartTranspose(transposed));
    } else {
      dispatch(setChartTranspose(transposed));
    }
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
    //   console.log('transpose data for update');
    // const { chartData } = chartDataClone;
    // const allLabels: Array<string> = [];
    // const newChartData: any = {};
    // const questionData = chartDataClone.questionData;
    // const bannerData = chartDataClone.bannerQuestionData;
    // for (const labelArrays in chartData[0]) {
    //   const labelArray = chartData[0][labelArrays];
    //   labelArray.forEach((el: any) => {
    //     if (allLabels.indexOf(el.labelCode) == -1) {
    //       allLabels.push(el.labelCode);
    //       newChartData[el.labelCode] = [];
    //     }
    //     newChartData[el.labelCode].push({
    //       count: el.count,
    //       labelCode: labelArrays,
    //     });
    //   });
    // }
    // chartDataClone.chartData[0] = newChartData;
    // chartDataClone.questionData = bannerData;
    // chartDataClone.bannerQuestionData = questionData;
  } else if (chartDataClone.questionData.type == QuestionType.GRID_MULTI) {
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
      },
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
      let baseCount: number = 0;
      let withoutTransposeBaseCount: any = 0;
      chartDataClone.chartData.forEach((data: any, index: number) => {
        const count: number = data.options.find(
          (subOption: any) => subOption.option === col.qId,
        )?.count;
        withoutTransposeBaseCount = data.options.find((subOption: any) => {
          if (subOption.option === col.qId && subOption.baseCount) {
            return subOption.baseCount;
          }
        });

        withoutTransposeBaseCount = withoutTransposeBaseCount?.baseCount;
        options.push({
          option: data._id,
          count: count == undefined ? 0 : count,
          baseCount: data.baseCount,
        });

        baseCount += count == undefined ? 0 : count;
      });

      newChartData.push({
        _id: col.qId,
        options: options,
        baseCount: withoutTransposeBaseCount,
      });
    });
    chartDataClone.chartData = newChartData;
    chartDataClone.questionData.scale = newScale;
    chartDataClone.questionData.subGroups = newSubGroup;
  }

  chartDataClone.chartOptions = {
    ...chart.chartOptions,
    ...getChartOptions(
      chartDataClone.questionData,
      chartDataClone.chartData,
      chartDataClone.baseCount,
      chartDataClone.bannerQuestionData,
      undefined,
      transposed,
    ),
  };

  dispatch(setChartData(chartDataClone));
  dispatch(setChartTranspose(transposed));
};

export const transposeChartMulti = async () => {
  const { chart, questions } = store.getState();
  const { dispatch } = store;
  const chartDataClone = JSON.parse(JSON.stringify(chart));
  const transposed = !chartDataClone.chartTranspose;
  dispatch(setChartLoading(false));
  if (transposed) {
    const chartData = await fetchChartData(
      questions.selectedBannerQuestionId,
      questions.selectedQuestionId,
    );
    dispatch(setChartData(chartData));
    dispatch(setChartTranspose(transposed));
  } else {
    const chartData = await fetchChartData(
      questions.selectedQuestionId,
      questions.selectedBannerQuestionId,
    );
    dispatch(setChartData(chartData));
    dispatch(setChartTranspose(transposed));
  }
};
