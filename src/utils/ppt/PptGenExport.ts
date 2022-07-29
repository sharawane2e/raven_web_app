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
          ? cellObject.text + "- " + cellObject.significantDiffernce
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
