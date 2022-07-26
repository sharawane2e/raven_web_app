import { ChartType } from '../../enums/ChartType';

export function singleChartDataGen(series: any) {
  let labels: any = [];
  let labelName: any = [];
  let values: any = [];
  let seriesData: any[] = [];

  if (series.length == 1) {
    labelName.push(series[0].name);
    series[0].data.forEach((data: any) => {
      labels.push(data.name);
      values.push(data.y);
    });
    seriesData = [
      {
        name: labelName[0],
        labels,
        values,
      },
    ];
    return seriesData;
  } else {
    const stackSeriesData: any = [];
    const name: any = [];
    const labels: any = [];
    const values: any = [];
    series?.forEach((seriesEl: any, index: number) => {
      name.push(series[0].data[0].name[0]);
      labels.push(seriesEl.name);
      values.push(seriesEl.data[0].y);
    });

    stackSeriesData.push({
      name,
      labels,
      values,
    });
    console.log(stackSeriesData);
    return stackSeriesData;
  }

  //return seriesData;
}
