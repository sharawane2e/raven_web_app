export function multiChartDataGen(series: any, chartLabelType: any) {
  let labels: any = [];
  let labelName: any = [];
  let values: any = [];
  let seriesData: any[] = [];

  series?.forEach((seriesdata: any) => {
    labels.push(seriesdata.name);
    seriesdata.data.forEach((data: any) => {
      labelName.push(data.name);
      values.push(data.y);
    });
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
