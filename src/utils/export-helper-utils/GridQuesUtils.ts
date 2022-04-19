import { decimalPrecision } from '../../constants/Variables';
import { getMatchedfilter, getmatchedFind, round } from '../Utility';
import store from '../../redux/store';
import { ChartLabelType } from '../../enums/ChartLabelType';
import _ from 'lodash';

export function gridChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any,
) {
  let labels: any = [];
  let seriesData: any[] = [];
  let data: any = '';
  let values: any = [];

  const {
    chart: { chartLabelType, showMean },
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
      const plotValue: any = totalSelections / baseCount;
      const floatPlotvalue = parseFloat(plotValue).toFixed(1);
      values.push(Number(floatPlotvalue));
    }
    return (seriesData = [
      {
        name: questionData?.labelText,
        labels,
        values,
      },
    ]);
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
