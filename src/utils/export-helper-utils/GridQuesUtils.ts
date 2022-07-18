import { decimalPrecision, decimalPrecision2 } from '../../constants/Variables';
import { getMatchedfilter, getmatchedFind, round } from '../Utility';
import store from '../../redux/store';
import { ChartLabelType } from '../../enums/ChartLabelType';
import _ from 'lodash';
// import { ChartType } from '../../enums/ChartType';
import { StaticText } from '../../constants/StaticText';
import {
  getsampleStandardDeviation,
  getStandarderrorFunction,
} from '../simplestatistics';
import { IQuestion } from '../../types/IQuestion';
import { getTablesignificantdifference } from '../chart-option-util/significanceDiff';

export function gridChartTableGen(
  questionData: any,
  chartData: any,
  baseCount: any,
) {
  let seriesData: any[] = [];
  let labels: any = [];
  const {
    chart: { showMean },
  } = store.getState();

  labels = questionData.subGroups.map((subGroup: any) => subGroup.labelText);
  if (showMean) {
    seriesData.length = 0;
    seriesData = getGridMeanTableOptions(questionData, chartData, baseCount);
  } else {
    seriesData.length = 0;
    seriesData = getGridTableoptionSeries(questionData, chartData, baseCount);
  }

  return seriesData;
}

const getGridMeanTableOptions = (
  questionData: IQuestion,
  chartData: any,
  baseCount: number,
): any[] => {
  const seriesData: any[] = [];
  let labels: any = [];
  let data: any = '';
  let valuesdata: any = [];
  const standardDeviation: any[] = [];
  const standardError: any[] = [];

  const {
    chart: { chartTranspose },
  } = store.getState();

  labels = questionData.subGroups.map((subGroup: any) => subGroup.labelText);

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
      getSampleDeviationValues,
      baseCount,
      decimalPrecision2,
    );
    standardDeviation.push(
      round(Number(getSampleDeviationValues), decimalPrecision2),
    );
    standardError.push(round(Number(getStandarderror), 3));
    const plotValue: any = round(totalSelections / baseCount, decimalPrecision);
    valuesdata.push(Number(plotValue));
  }

  const seriesLabels = StaticText.GRID_MEAN_SD_SE.split(',');
  const seriesValue = [valuesdata, standardDeviation, standardError];

  if (!chartTranspose) {
    for (let i = 0; i < seriesLabels.length; i++) {
      seriesData.push({
        name: seriesLabels[i],
        labels,
        values: seriesValue[i],
      });
    }
  }

  if (chartTranspose) {
    const transposeSeries: any = [];

    const transposeSeriesValues: any = (valueIndex: number) => {
      const dataValue: any[] = [];
      seriesValue.forEach((seriesName: string, seriesIndex: number) => {
        dataValue.push(seriesValue[seriesIndex][valueIndex]);
      });

      return dataValue;
    };

    for (let i = 0; i < labels.length; i++) {
      transposeSeries.push({
        name: labels[i],
        labels: seriesLabels,
        values: [...transposeSeriesValues(i)],
      });
    }
    seriesData.length = 0;
    seriesData.push(...transposeSeries);
  }

  return seriesData;
};

const getGridTableoptionSeries = (
  questionData: IQuestion,
  chartData: any,
  baseCount: number,
): any => {
  let labels: any = [];
  let seriesData: any[] = [];
  let data: any = '';
  let percentageValues: any = [];
  let baseCounts: any = [];
  const scales = [...questionData.scale];
  const {
    chart: { chartLabelType, significant, chartTranspose },
  } = store.getState();

  if (chartTranspose) {
    seriesData.length = 0;
    seriesData.push(...getGridTransposeTableOptions(questionData, chartData));

    return seriesData;
  } else {
    labels = questionData.subGroups.map((subGroup: any) => subGroup.labelText);
    scales.forEach((scaleOption: any, index: number) => {
      seriesData.push({
        name: scaleOption.labelText,
        labels,
        percentageValues,
        baseCounts,
        values: questionData.subGroups.map((subGroup: any, index: number) => {
          const subGroupData = getmatchedFind(chartData, '_id', subGroup.qId);

          const base = subGroupData?.baseCount || baseCount;
          if (subGroupData) {
            const labels = getMatchedfilter(
              subGroupData?.options,
              'option',
              scaleOption.labelCode,
            );

            data = _.sumBy(labels, function (o) {
              return o.count;
            });

            baseCounts.push(base);
            percentageValues.push(
              round(+((data / base) * 100), decimalPrecision),
            );

            if (chartLabelType === ChartLabelType.PERCENTAGE) {
              return data !== undefined
                ? round(+((data / base) * 100), decimalPrecision)
                : 0;
            } else {
              return data !== undefined ? round(data, 0) : 0;
            }
          } else {
            return 0;
          }
        }),
      });
    });
  }

  if (significant) {
    return getTablesignificantdifference(seriesData);
  }

  return seriesData;
};

const getGridTransposeTableOptions = (questionData: any, chartData: any) => {
  const {
    chart: { chartLabelType, significant },
  } = store.getState();
  const seriesData: any = [];
  let labels: any = [];
  let percentageValues: any = [];
  let baseCounts: any = [];

  labels = questionData.scale.map((subScale: any) => subScale.labelText);

  questionData.subGroups.forEach(
    (subGroupObject: any, questionDataIndex: number) => {
      seriesData.push({
        name: subGroupObject.labelText,
        labels,
        values: getTableValues(subGroupObject.qId),
        percentageValues,
        baseCounts,
      });
    },
  );

  function getTableValues(qId: string) {
    const values: number[] = [];

    questionData.scale.forEach((scaleObject: any) => {
      let count: number = 0;
      let baseCount: number = 0;

      chartData.forEach((chartDataObject: any) => {
        chartDataObject.options.forEach(
          (chartOption: any, chartindex: number) => {
            if (
              _.isArray(scaleObject.labelCode) &&
              scaleObject.labelCode.indexOf(chartOption.option) != -1
            ) {
              baseCount += chartOption.count;
            }
            if (chartOption.option == scaleObject.labelCode) {
              baseCount += chartOption.count;
            }
          },
        );
        if (chartDataObject._id == qId) {
          const countObject = getMatchedfilter(
            chartDataObject.options,
            'option',
            scaleObject.labelCode,
          );

          count = _.sumBy(countObject, function (o) {
            return o.count;
          });
        }
      });
      percentageValues.push(round((count / baseCount) * 100, decimalPrecision));
      baseCounts.push(baseCount);

      if (chartLabelType === ChartLabelType.PERCENTAGE) {
        values.push(round((count / baseCount) * 100, decimalPrecision));
      } else {
        values.push(round(count, 0));
      }
    });

    return values;
  }

  if (significant) {
    return getTablesignificantdifference(seriesData);
  }

  return seriesData;
};
