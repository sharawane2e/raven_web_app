// import { ChartType } from '../enums/ChartType';
import store from '../redux/store';
import { IQuestion } from '../types/IQuestion';
import { getPlotOptions, getToolTip } from '../utils/ChartOptionFormatter';

export const getNumberChartOption = (
  questionData: IQuestion,
  chartData: any,
  baseCount: Number,
) => {
  // console.log('questionData', questionData);
  //console.log('chartData', chartData);
  // console.log('baseCount', baseCount);

  const {
    chart: { chartType },
  } = store.getState();
  const data: any[] = [];
  const series: any[] = [];
  let weightSum: any;

  chartData.forEach((chart_el: any, chartIndex: Number) => {
    weightSum += chart_el?.weight;
  });
  console.log('weightSum', weightSum);

  questionData.options.forEach((option: any, optionIndex: Number) => {
    data.push({
      name: option.labelText,
      // y: round(plotValue, decimalPrecision),
      // y: plotValue,
      //baseCount: baseCount,
    });
  });
  series.push({
    // color: primaryBarColor,
    // name: questionData?.labelText,
    data,
    // dataLabels,
  });
  return {
    legend: {
      enabled: true,
    },
    plotOptions: getPlotOptions(),
    tooltip: { ...getToolTip() },
    series,
  };
  console.log('series', series);
};
