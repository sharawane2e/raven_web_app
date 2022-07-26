export const singleTable = (chartSeries: any) => {
  console.log(chartSeries);
  const chartRows: any[] = [];

  chartSeries.forEach((serie: any) => {
    //add header
    const headerRow: any[] = [];
    headerRow.push("");
    headerRow.push(serie.name);
    chartRows.push(headerRow);

    serie.data.forEach((dataObject: any) => {
      const row: any[] = [];
      row.push(dataObject.name);
      row.push(dataObject.y);
      chartRows.push(row);
    });
  });

  return chartRows;
};
