export function MultiQuesExportUtils(newSeriesData: any) {
  console.log(JSON.parse(JSON.stringify(newSeriesData)));
  const series = [...newSeriesData.series];
  const updatedSeries: any[] = [];
  const allLabelsArr: string[] = [];

  series.forEach((seriesObject: any) => {
    seriesObject.data.forEach((dataObject: any) => {
      if (allLabelsArr.indexOf(dataObject.name) == -1) {
        allLabelsArr.push(dataObject.name);
      }
    });
  });

  series.forEach((seriesObject: any) => {
    const name = seriesObject.name;
    const labels: string[] = [];
    const values: number[] = [];
    const currentLabelsArr = seriesObject.data.map(
      (dataObject: any) => dataObject.name
    );

    allLabelsArr.forEach((labelName: string) => {
      const labelIndex = currentLabelsArr.indexOf(labelName);
      if (labelIndex == -1) {
        labels.push(labelName);
        values.push(0);
      } else {
        labels.push(seriesObject.data[labelIndex].name);
        values.push(seriesObject.data[labelIndex].y / 100);
      }
    });

    // seriesObject.data.forEach((dataObject: any) => {
    //   labels.push(dataObject.name);
    //   values.push(dataObject.y / 100);
    // });

    updatedSeries.push({
      name,
      labels,
      values,
    });
  });

  return updatedSeries;
}
