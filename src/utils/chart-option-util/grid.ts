import _, { find } from 'lodash';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { getMatchedfilter, getmatchedFind, round } from '../Utility';
import {
  colorArr,
  dataLabelsFormate,
  dataLabelsNumberFormate,
  dataUpdatedFormate,
  decimalPrecision2,
  showMeanFormate,
} from '../../constants/Variables';
import { StaticText } from '../../constants/StaticText';
import {
  getsampleStandardDeviation,
  getStandarderrorFunction,
} from '../simplestatistics';
import { getsignificantdifference } from './significanceDiff';
import { IchartOptionsDto } from '../../types/IChartOptionsDto';
import { getPlotOptionsSeries } from '../ChartOptionFormatter';

export const getGridChartoptionSeries = (chart: IchartOptionsDto) => {
  const {
    questionData,
    chartData,
    baseCount,
    bannerQuestionData,
    chartOptionsData,
    questionChartData,
    transposed,
    chartLabelType,
    chartType,
    significant,
    chartOrientation,
  } = chart;
  const categories = [];
  const series = [];

  if (transposed) {
    series.push(...getGridTransposeChartOptions(chart));
  } else {
    const subGroups = questionData.subGroups.filter((subGroup: any) => {
      const subGroupData = getmatchedFind(chartData, '_id', subGroup.qId);
      if (subGroupData && subGroupData.options.length) return true;
      return false;
    });

    const scales = [...questionData.scale];

    for (let scaleIndex = 0; scaleIndex < scales.length; scaleIndex++) {
      const scale = scales[scaleIndex];

      const data: any[] = [];
      for (
        let subGroupIndex = 0;
        subGroupIndex < subGroups.length;
        subGroupIndex++
      ) {
        const subGroup = subGroups[subGroupIndex];
        categories.push(subGroup.labelText);

        const optionData = getmatchedFind(chartData, '_id', subGroup.qId);
        const labels = getMatchedfilter(
          optionData.options,
          'option',
          scale.labelCode,
        );

        const count = _.sumBy(labels, function (o) {
          return o.count;
        });

        //const base = optionData?.baseCount || baseCount;
        const base = optionData?.baseCount || baseCount;

        let percentageValue;
        let numberValue;
        numberValue = round(count, 0);
        percentageValue = (count / base) * 100;
        // debugger;
        data.push({
          name: subGroup.labelText,
          y:
            chartLabelType === ChartLabelType.PERCENTAGE
              ? percentageValue
              : numberValue,
          percentageValue,
          numberValue,
          baseCount: base,
        });
      }
      const newDataLabels = getPlotOptionsSeries(
        significant,
        chartLabelType,
        chartType,
        chartOrientation,
      );
      series.push({
        name: scale.labelText,
        color: colorArr[scaleIndex < colorArr.length ? scaleIndex : 0],
        data,
        dataLabels: {
          ...newDataLabels,
        },
      });
    }
  }

  if (significant) {
    const updatedSeries = getsignificantdifference(
      questionData,
      chartData,
      undefined,
      series,
      chartLabelType,
      transposed,
    );
    series.length = 0;
    series.push(...updatedSeries);
  }
  return series;
};

const getGridTransposeChartOptions = (chart: IchartOptionsDto) => {
  const {
    questionData,
    chartData,
    baseCount,
    bannerQuestionData,
    chartOptionsData,
    questionChartData,
    transposed,
    chartLabelType,
    chartType,
    significant,
    chartOrientation,
  } = chart;
  const series = [];
  for (let i = 0; i < questionData.subGroups.length; i++) {
    const currentSubGroup = questionData.subGroups[i];
    const data = [];
    const scales = questionData.scale;
    for (let j = 0; j < scales.length; j++) {
      const scale = scales[j];
      let baseCount: number = 0;
      let count: number = 0;
      chartData.forEach((chartDataObject: any, index: number) => {
        chartDataObject.options.forEach(
          (chartOption: any, chartindex: number) => {
            if (
              _.isArray(scale.labelCode) &&
              scale.labelCode.indexOf(chartOption.option) != -1
            ) {
              baseCount += chartOption.count;
            }
            if (chartOption.option == scale.labelCode) {
              baseCount += chartOption.count;
            }
          },
        );

        if (chartDataObject._id == questionData.subGroups[i].qId) {
          const countObject = getMatchedfilter(
            chartDataObject.options,
            'option',
            scale.labelCode,
          );

          count = _.sumBy(countObject, function (o) {
            return o.count;
          });
        }
      });

      let percentageValue;
      let numberValue;
      numberValue = round(count, 0);
      percentageValue = (count / baseCount) * 100;

      data.push({
        name: scale.labelText,
        y:
          chartLabelType === ChartLabelType.PERCENTAGE
            ? percentageValue
            : numberValue,
        percentageValue,
        numberValue,
        baseCount: baseCount,
      });
    }
    const newDataLabels = getPlotOptionsSeries(
      significant,
      chartLabelType,
      chartType,
      chartOrientation,
    );
    series.push({
      name: currentSubGroup.labelText,
      data,
      dataLabels: {
        ...newDataLabels,
      },
    });
  }

  return series;
};

export const getGridMeanChartOptions = (chart: IchartOptionsDto): any => {
  const {
    questionData,
    chartData,
    baseCount,
    bannerQuestionData,
    chartOptionsData,
    questionChartData,
    transposed,
    chartLabelType,
    chartType,
    significant,
  } = chart;

  const data: any[] = [];
  const standardDeviation: any[] = [];
  const standardError: any[] = [];

  for (
    let optionIndex = 0;
    optionIndex < questionData.subGroups.length;
    optionIndex++
  ) {
    const option = questionData.subGroups[optionIndex];
    const optionData = getmatchedFind(chartData, '_id', option.qId);

    const filteredOptions = _.remove(
      [...optionData.options],
      function (n: any) {
        return !Array.isArray(n.option);
      },
    ); //removing array options which come with subgroups

    const totalSelections = _.sumBy(filteredOptions, function (o: any) {
      return parseInt(o.option) * parseInt(o.count);
    });

    let valuesArr: any = [];

    filteredOptions.forEach((filteredOption: any) => {
      valuesArr = _.concat(valuesArr, filteredOption?.values);
    });

    const getSampleDeviationValues = getsampleStandardDeviation(
      valuesArr,
      decimalPrecision2,
    );

    const getStandarderror = getStandarderrorFunction(
      Number(getSampleDeviationValues),
      baseCount,
      decimalPrecision2,
    );

    const plotValue = totalSelections / baseCount;

    if (plotValue > 0) {
      data.push({
        name: option.labelText,
        y: plotValue,
        baseCount: baseCount,
      });
    }

    standardDeviation.push({
      name: option.labelText,
      y: Number(getSampleDeviationValues),
      baseCount: baseCount,
    });

    standardError.push({
      name: option.labelText,
      y: Number(getStandarderror),
      baseCount: baseCount,
    });
  }

  const series: any[] = [];
  const seriesLabels = StaticText.GRID_MEAN_SD_SE.split(',');
  const seriesData = [data, standardDeviation, standardError];

  for (let i = 0; i < 3; i++) {
    series.push({
      name: seriesLabels[i],
      color: colorArr[i],
      data: seriesData[i],
      dataLabels: {
        ...showMeanFormate,
      },
    });
  }

  if (transposed) {
    const transposeSeries = [];
    for (
      let optionIndex = 0;
      optionIndex < questionData.subGroups.length;
      optionIndex++
    ) {
      transposeSeries.push({
        name: questionData.subGroups[optionIndex].labelText,
        color: colorArr[optionIndex],
        data: [
          {
            name: seriesLabels[0],
            y: series[0].data[optionIndex].y,
            baseCount: series[0].data[optionIndex].baseCount,
          },
          {
            name: seriesLabels[1],
            y: series[1].data[optionIndex].y,
            baseCount: series[1].data[optionIndex].baseCount,
          },
          {
            name: seriesLabels[2],
            y: series[2].data[optionIndex].y,
            baseCount: series[2].data[optionIndex].baseCount,
          },
        ],
        dataLabels: {
          ...dataLabelsNumberFormate,
        },
      });
    }

    series.length = 0;

    series.push(...transposeSeries);
  }

  return series;
};
