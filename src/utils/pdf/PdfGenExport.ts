export const PdfGenExport = (seriesData: any) => {
  const options = {
    fillColor: "ffffff",
    bold: false,
  };

  const tablePptOutput: any[] = [];

  seriesData.forEach((tableRowArr: any) => {
    const rowArr: any[] = [];

    tableRowArr.forEach((cellObject: any) => {
      const cellObj = {
        content: cellObject.text,
        styles: {
          ...options,
          fillColor:
            cellObject.minMax == "min"
              ? "b8e08c"
              : cellObject.minMax == "max"
              ? "fbd9d4"
              : "ffffff",
          bold:
            cellObject.minMax == "min"
              ? true
              : cellObject.minMax == "max"
              ? true
              : false,
        },
      };

      rowArr.push(cellObj);
    });

    tablePptOutput.push(rowArr);
  });

  return tablePptOutput;
};
