export const PptGenExport = (seriesData: any) => {
  console.log(seriesData);

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

  //         // const tableRows = tableChartDataGen(); //gaurav
  //         const tableRows = seriesData; //gaurav
  //         let scaleLength: any = "";
  //         let filtered: any;
  //         let results: any;
  //         let QuestionData: any;
  //         let singleGroupNet: any;
  //         const [maxValue, minValue] = tableRows;
  //         if (
  //           questionData?.isGroupNet &&
  //           questionData?.type === QuestionType.SINGLE
  //         ) {
  //           QuestionData = 0;
  //           singleGroupNet = questionData?.groupNetData.length;
  //         } else {
  //           QuestionData = questionData?.groupNetData;
  //           filtered = QuestionData.filter(function (el: any) {
  //             return el !== "";
  //           });
  //           results = questionData?.options.filter(function (option: any) {
  //             if (option.labelCode.split("_")[0] == "N") {
  //               return true;
  //             }
  //           });
  //         }
  //         scaleLength = filtered?.length > 1 ? filtered?.length : 0;
  //         let laberesult = results?.length === undefined ? 0 : results?.length;
  //         let removeSubGrop: any;
  //         if (chartTranspose) {
  //           removeSubGrop = tableRows.rows.length - scaleLength - 1;
  //         }
  //         if (laberesult > 0) {
  //           removeSubGrop = tableRows?.rows?.length - laberesult;
  //         } else {
  //           removeSubGrop = tableRows?.rows?.length - singleGroupNet - 1;
  //         }
  //         var output: any = [];
  //         tableRows.rows.forEach((rowData, rowIndex) => {
  //           //console.log(rowData);
  //           var rowArray: any = [];
  //           rowData.forEach(function (item, colIndex) {
  //             const currentMax = maxValue?.[colIndex - 1];
  //             const currentMin = minValue?.[colIndex - 1];
  //             const options = {
  //               fill: "ffffff",
  //               bold: false,
  //             };
  //             const rowcount = removeSubGrop - laberesult;
  //             const splitCol = item.toString().split("|")[0];
  //             const splitCol2 = item?.toString().split("|")[1];
  //             let splitcolNumber: any;
  //             if (isNaN(Number(splitCol))) {
  //               splitcolNumber = splitCol != undefined ? splitCol : "";
  //             } else {
  //               splitcolNumber = Number(splitCol);
  //             }
  //             const dataString2 = splitCol2 != undefined ? splitCol2 : "";
  //             if (splitcolNumber === currentMax) {
  //               if (laberesult > 0) {
  //                 rowIndex > removeSubGrop - rowcount &&
  //                 rowIndex < removeSubGrop + (laberesult - 1)
  //                   ? (options["fill"] = "b8e08c")
  //                   : !removeSubGrop && tableRows.rows.length > 3
  //                   ? (options["fill"] = "b8e08c")
  //                   : (options["fill"] = "ffffff");
  //               } else {
  //                 if (
  //                   bannerQuestionData?.type == QuestionType.SINGLE &&
  //                   questionData?.type == QuestionType.SINGLE
  //                 ) {
  //                   rowIndex < removeSubGrop + 1 && tableRows.rows.length > 3
  //                     ? (options["fill"] = "b8e08c")
  //                     : !removeSubGrop && tableRows.rows.length > 3
  //                     ? (options["fill"] = "b8e08c")
  //                     : (options["fill"] = "ffffff");
  //                 } else {
  //                   rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
  //                     ? (options["fill"] = "b8e08c")
  //                     : !removeSubGrop && tableRows.rows.length > 3
  //                     ? (options["fill"] = "b8e08c")
  //                     : (options["fill"] = "ffffff");
  //                   rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
  //                     ? (options["bold"] = true)
  //                     : !removeSubGrop && tableRows.rows.length > 3
  //                     ? (options["bold"] = true)
  //                     : (options["bold"] = false);
  //                 }
  //               }
  //             } else if (splitcolNumber === currentMin) {
  //               if (laberesult > 0) {
  //                 rowIndex > removeSubGrop - rowcount &&
  //                 rowIndex < removeSubGrop + (laberesult - 1)
  //                   ? (options["fill"] = "fbd9d4")
  //                   : !removeSubGrop && tableRows.rows.length > 3
  //                   ? (options["fill"] = "fbd9d4")
  //                   : (options["fill"] = "ffffff");
  //               } else {
  //                 if (
  //                   bannerQuestionData?.type == QuestionType.SINGLE &&
  //                   questionData?.type == QuestionType.SINGLE
  //                 ) {
  //                   rowIndex <= removeSubGrop + 1 && tableRows.rows.length > 3
  //                     ? (options["fill"] = "fbd9d4")
  //                     : !removeSubGrop
  //                     ? (options["fill"] = "fbd9d4")
  //                     : (options["fill"] = "ffffff");
  //                 } else {
  //                   rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
  //                     ? (options["fill"] = "fbd9d4")
  //                     : !removeSubGrop
  //                     ? (options["fill"] = "fbd9d4")
  //                     : (options["fill"] = "ffffff");
  //                   rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
  //                     ? (options["bold"] = true)
  //                     : !removeSubGrop
  //                     ? (options["bold"] = true)
  //                     : (options["bold"] = false);
  //                 }
  //               }
  //             }
  //             //}
  //             rowArray.push({
  //               text: splitcolNumber + dataString2,
  //               options: { ...options },
  //             });
  //           });
  //           output.push(rowArray);
  //         });
  //         slide.addTable(output, { ...tableConfig });
  return tablePptOutput;
};
