import { decimalPrecision } from '../../constants/Variables';
import { getMatchedfilter, getmatchedFind, round } from '../Utility';
import store from '../../redux/store';
import { ChartLabelType } from '../../enums/ChartLabelType';
import _ from 'lodash';
// import { ChartType } from '../../enums/ChartType';
import { StaticText } from '../../constants/StaticText';

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
      const plotValue: any = round(
        totalSelections / baseCount,
        decimalPrecision,
      );
      //const floatPlotvalue = parseFloat(plotValue).toFixed(1);
      values.push(Number(plotValue));
      standardDeviation.push(Number(10));
      standardError.push(Number(10));
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
    // if (chartType === ChartType.STACK) {
    //   const stackSeriesData: any = [];
    //   const label: string = questionData.labelText;
    //   seriesData[0].labels.forEach((ele: any, index: number) => {
    //     stackSeriesData.push({
    //       name: seriesData[0].labels[index],
    //       labels: [label],
    //       values: [seriesData[0].values[index]],
    //     });
    //   });
    //   return stackSeriesData;
    // } else {
    //   return seriesData;
    // }
    console.log('seriesData', seriesData);
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
