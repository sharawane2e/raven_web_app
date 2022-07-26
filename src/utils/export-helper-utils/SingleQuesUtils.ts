export function singleChartDataGen(newSeriesData: any) {
  const series = newSeriesData.series;
  console.log("series", series);
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
    console.log(series);

    series?.forEach((seriesEl: any, index: number) => {
      stackSeriesData.push({
        name: series[index].name,
        labels: [seriesEl.data[0].name],
        values: [seriesEl.data[0].y],
      });
    });

    return stackSeriesData;
  }
}
