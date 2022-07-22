import { ChartLabelType } from "../../enums/ChartLabelType";

export function singleChartDataGen(series: any, chartLabelType: any) {
  let labels: any = [];
  let labelName: any = [];
  let values: any = [];
  let seriesData: any[] = [];

  if (
    (series.length == 1 && chartLabelType === ChartLabelType.PERCENTAGE) ||
    (series.length == 1 && chartLabelType === ChartLabelType.NUMBER)
  ) {
    labelName.push(series[0].name);
    series[0].data.forEach((data: any) => {
      labels.push(data.name);
      values.push(data.y);
    });
  } else {
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
