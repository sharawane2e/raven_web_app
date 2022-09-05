import _ from "lodash";

export const PptGenExport = (seriesData: any) => {
  const options = {
    fill: "ffffff",
    bold: false,
  };

  const tablePptOutput: any[] = [];

  seriesData.forEach((tableRowArr: any) => {
    const rowArr: any[] = [];

    tableRowArr.forEach((cellObject: any) => {
      const cellObj = {
        text: cellObject.significantDiffernce
          ? cellObject.text + " " + cellObject.significantDiffernce
          : cellObject.text,
        // text: cellObject.text,
        options: {
          ...options,
          fill:
            cellObject.minMax == "min"
              ? "fbd9d4"
              : cellObject.minMax == "max"
              ? "b8e08c"
              : "ffffff",
        },
      };

      rowArr.push(cellObj);
    });

    tablePptOutput.push(rowArr);
  });

  return tablePptOutput;
};
export const PptGenExportSignificane = (seriesData: any) => {
  const tablePptOutput: any[] = [];

  seriesData.forEach((tableRowArr: any) => {
    const rowArr: any[] = [];

    tableRowArr.forEach((cellObject: any) => {
      const cellObj = {
        text: cellObject.significantDiffernce
          ? cellObject.text + " " + cellObject.significantDiffernce
          : cellObject.text,
      };

      rowArr.push(cellObj);
    });

    tablePptOutput.push(rowArr);
  });

  const newseriesData = tablePptOutput.slice(0, -1);
  for (let index = 0; index < newseriesData.length; index++) {
    newseriesData[index] = newseriesData[index].slice(0, -1);
  }

  newseriesData[0][0]["text"] = "Significance Difference";
  newseriesData[0][0]["options"] = { bold: true, underline: true };

  let updatedSeries = [];
  updatedSeries.push(newseriesData[0]);

  for (let index = 1; index < newseriesData.length; index++) {
    for (let index1 = 1; index1 < newseriesData[index].length; index1++) {
      if (newseriesData[index][index1].text.split(" ").length >= 2) {
        updatedSeries.push(newseriesData[index]);
        break;
      }
    }
  }
  for (let i = 1; i < updatedSeries.length; i++) {
    for (let j = 1; j < updatedSeries[i].length; j++) {
      if (updatedSeries[i][j].text.split(" ")[1] != undefined) {
        updatedSeries[i][j].text = updatedSeries[i][j].text.split(" ")[1];
      } else {
        updatedSeries[i][j].text = "";
      }
    }
  }

  return updatedSeries;
};
