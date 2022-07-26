export const singleTable = (chartSeries: any) => {
  console.log(chartSeries);
  const chartRows: any[] = [];

  chartSeries.forEach((serie: any) => {
    //add header
    const headerRow: any[] = [];
    headerRow.push("");
    headerRow.push(serie.name);
    headerRow.push("Total");
    chartRows.push(headerRow);

    serie.data.forEach((dataObject: any) => {
      const row: any[] = [];
      row.push(dataObject.name);
      row.push(dataObject.y);
      row.push(dataObject.y);
      chartRows.push(row);
    });
  });

  //adding Grand Total
  const grandTotalRow: any[] = [];
  const count: number[] = [];
  const minMaxArr: any[] = [];
  for (let i = 0; i < chartRows.length; i++) {
    if (i != 0) {
      for (let j = 0; j < chartRows[i].length - 1; j++) {
        if (j > 0) {
          count[j - 1] = count[j - 1] == undefined ? 0 : count[j - 1];
          count[j - 1] += Number(chartRows[i][j]);

          //for min max
          if (minMaxArr[j - 1] == undefined) {
            minMaxArr[j - 1] = {
              min: chartRows[i][j],
              max: chartRows[i][j],
            };
          }

          if (minMaxArr[j - 1]["min"] >= chartRows[i][j]) {
            minMaxArr[j - 1]["min"] = chartRows[i][j];
          }

          if (minMaxArr[j - 1]["max"] < chartRows[i][j]) {
            minMaxArr[j - 1]["max"] = chartRows[i][j];
          }

          //for min max
        }
      }
    }
  }
  grandTotalRow.push("Total");
  grandTotalRow.push(...count);
  grandTotalRow.push("");
  chartRows.push(grandTotalRow);

  return { chartRows, minMaxArr };
};
