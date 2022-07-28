export function MultiQuesExportUtils(newSeriesData: any) {
  const series = newSeriesData.series;
  const updatedSeries: any[] = [];

  series.forEach((seriesObject: any) => {
    const name = seriesObject.name;
    const labels: string[] = [];
    const values: number[] = [];

    seriesObject.data.forEach((dataObject: any) => {
      labels.push(dataObject.name);
      values.push(dataObject.y / 100);
    });

    updatedSeries.push({
      name,
      labels,
      values,
    });
  });

  return updatedSeries;
}
