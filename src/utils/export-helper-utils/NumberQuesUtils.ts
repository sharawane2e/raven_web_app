export function numberChartDataGen(series: any, chartLabelType: any) {
  let seriesData: Array<Object> = [];

  series.forEach((seriesName: any) => {
    let labels: any = [];
    const values: number[] = [];
    const baseCounts: number[] = [];
    const percentageValues: number[] = [];
    seriesName.data.forEach((seriesdata: any) => {
      labels.push(seriesdata.name);
      values.push(seriesdata.y);
      percentageValues.push(seriesdata.percentageValue);
    });
    seriesData.push({
      name: seriesName.name,
      labels,
      values,
      baseCounts,
      percentageValues,
    });
  });

  return seriesData;
}
