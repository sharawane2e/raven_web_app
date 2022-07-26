import { ChartLabelType } from "../../enums/ChartLabelType";

export function singleChartDataGen(series: any) {
  let labels: any = [];
  let labelName: any = [];
  let values: any = [];
  let seriesData: any[] = [];

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
}
