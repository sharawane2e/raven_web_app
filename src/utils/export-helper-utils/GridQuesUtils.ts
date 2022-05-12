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

export function gridChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any,
) {
  let labels: any = [];
  let seriesData: any[] = [];
  let data: any = '';
  let values: any = [];
  const standardDeviation: any[] = [];
  const standardError: any[] = [];

  const {
    chart: { chartLabelType, showMean, chartType },
  } = store.getState();

  const scales = [...questionData.scale];

  labels = questionData.subGroups.map((subGroup: any) => subGroup.labelText);
  if (showMean) {
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
      //const plotValue: any = round(totalSelections / baseCount, 2);
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
      standardDeviation.push(Number(getSampleDeviationValues));
      standardError.push(Number(getStandarderror));
      const plotValue: any = round(
        totalSelections / baseCount,
        decimalPrecision,
      );
      values.push(Number(plotValue));
    }

    const seriesLabels = StaticText.GRID_MEAN_SD_SE.split(',');
    const seriesValue = [values, standardDeviation, standardError];

    for (let i = 0; i < 3; i++) {
      seriesData.push({
        name: seriesLabels[i],
        labels,
        values: seriesValue[i],
      });
    }
  } else {
    scales.forEach((scaleOption: any, index: number) => {
      seriesData.push({
        name: scaleOption.labelText,
        labels,
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

            if (chartLabelType === ChartLabelType.PERCENTAGE) {
              return data !== undefined
                ? round(+((data / base) * 100), decimalPrecision)
                : 0;
            } else {
              return data !== undefined ? data : 0;
            }
          } else {
            return 0;
          }
        }),
      });
    });
  }

  return seriesData;
}
