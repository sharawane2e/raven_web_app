import { ChartType } from '../../enums/ChartType';

export function singleChartDataGen(series: any) {
  let labels: any = [];
  let labelName: any = [];
  let values: any = [];
  let seriesData: any[] = [];

  console.log(series.length);

  if (series.length == 1) {
    labelName.push(series[0].name);
    series[0].data.forEach((data: any) => {
      labels.push(data.name);
      values.push(data.y);
    });
  } else {
    // console.log('series', series);
    series?.forEach((seriesdata: any) => {
      labels.push(seriesdata.name);
      seriesdata.data.forEach((data: any) => {
        labelName.push(data.name);
        values.push(data.y);
      });
    });
  }

  seriesData = [
    {
      name: labelName[0],
      labels,
      values,
    },
  ];
  return seriesData;
}
