import { decimalPrecision } from '../../constants/Variables';
import { formatTableData, getMatchedfilter, getSum, round } from '../Utility';
import store from '../../redux/store';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { ChartType } from '../../enums/ChartType';

export function singleChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any,
) {
  let labels: any = [];
  let values: any = [];
  let seriesData: any[] = [];
  let options = questionData?.options || [];

  const {
    chart: { chartLabelType, chartType },
  } = store.getState();

  options.forEach((option: any) => {
    // const dataObj = chartData.find(
    //   (data: any) => data.labelCode === option.labelCode,
    // );
    const dataObj: any = getMatchedfilter(
      chartData,
      'labelCode',
      option.labelCode,
    );

    labels.push(option.labelText);

    if (dataObj) {
      let count: any = 0;
      count = getSum(dataObj, 'count');
      if (chartLabelType === ChartLabelType.PERCENTAGE) {
        count = round((count / baseCount) * 100, decimalPrecision);
      }
      values.push(count);
    } else {
      values.push(0);
    }
  });

  seriesData = [
    {
      name: questionData?.labelText,
      labels: labels,
      values: values,
    },
  ];

  if (chartType === ChartType.STACK) {
    const stackSeriesData: any = [];
    const label: string = questionData.questionText;
    seriesData[0].labels.forEach((ele: any, index: number) => {
      stackSeriesData.push({
        name: seriesData[0].labels[index],
        labels: [label],
        values: [seriesData[0].values[index]],
      });
    });
    return stackSeriesData;
  } else {
    return seriesData;
  }
}
