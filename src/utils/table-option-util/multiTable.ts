import { ChartLabelType } from "../../enums/ChartLabelType";
import { QuestionType } from "../../enums/QuestionType";
import { IchartOptionsDto } from "../../types/IChartOptionsDto";
import { round } from "../Utility";

export const multiTable = (
  chartSeries: any,
  chartOptionsPayload: IchartOptionsDto
) => {
  const { chartLabelType, questionData, transposed, bannerQuestionData } =
    chartOptionsPayload;
  const chartRows: any[] = [];

  const groupNetIndexArr = [...getGroupNetIndex(questionData.options)];

  if (transposed) {
    chartRows.push(...createChartRowsTranspose(chartSeries, groupNetIndexArr));
  } else {
    chartRows.push(...createChartRows(chartSeries));
  }

  console.log(chartRows);

  const count: number[] = [];
  const minMaxArr: any[] = [];

  if (transposed) {
    if (bannerQuestionData.isGroupNet) {
      //need to find situation in a question and then fix it
      // const { updatedMinMaxArr, updatedCount } = minMaxObjectNets(
      //   chartRows,
      //   questionData.groupNetData
      // );
      // count.push(...updatedCount);
      // minMaxArr.push(...updatedMinMaxArr);
    } else {
      const { updatedMinMaxArr, updatedCount } = minMaxObject(
        chartRows,
        groupNetIndexArr
      );
      count.push(...updatedCount);
      minMaxArr.push(...updatedMinMaxArr);
    }
  } else {
    // if (questionData.isGroupNet) {
    //   const { updatedMinMaxArr, updatedCount } = minMaxObjectNets(
    //     chartRows,
    //     questionData.groupNetData
    //   );
    //   count.push(...updatedCount);
    //   minMaxArr.push(...updatedMinMaxArr);
    // } else {

    const { updatedMinMaxArr, updatedCount } = minMaxObject(
      chartRows,
      questionData.options
    );
    count.push(...updatedCount);
    minMaxArr.push(...updatedMinMaxArr);

    // }
  }

  const roundedOffCount = roundOffCount(count);

  count.length = 0;
  count.push(...roundedOffCount);

  //merging maxMin
  const mergedChartRows: any[] = [
    ...maxMinChartRows(chartRows, chartLabelType, minMaxArr, groupNetIndexArr),
  ];

  //adding significant
  if (chartOptionsPayload.significant) {
    const updatedMergedChartRows = tableDataSignificance(
      mergedChartRows,
      chartSeries
    );
    mergedChartRows.length = 0;
    mergedChartRows.push(...updatedMergedChartRows);
  }

  //add header
  const headerMergedChartRows: any[] = [
    ...addHeaders(chartSeries, mergedChartRows),
  ];

  mergedChartRows.length = 0;
  mergedChartRows.push(...headerMergedChartRows);

  //add header

  //adding Grand Total

  mergedChartRows.push([...addGrandTotal(count, chartLabelType)]);

  //adding Grand Total

  return mergedChartRows;
};

const createChartRows = (chartSeries: any) => {
  const chartRows: any[] = [];
  //add labels in charts
  chartSeries[0]?.data.forEach((dataObject: any, serieIndex: number) => {
    const row: string[] = [];
    //serie.data.forEach((dataObject: any, dataObjectIndex: number) => {
    row.push(dataObject.name);
    chartRows.push(row);
    //});
  });

  chartSeries.forEach((serie: any, serieIndex: number) => {
    serie.data.forEach((dataObject: any, dataObjectIndex: number) => {
      chartRows[dataObjectIndex].push(round(dataObject.y, 2));
    });
  });

  chartRows.forEach((charRow: any[]) => {
    let tableDataSum: number = 0;

    charRow.forEach((tableDate: any, tableDateIndex: number) => {
      if (tableDateIndex != 0) {
        //because the first column is text
        tableDataSum += tableDate;
      }
    });

    charRow.push(round(tableDataSum, 1));
  });

  return chartRows;
};
const createChartRowsTranspose = (
  chartSeries: any,
  groupNetIndexArr: number[]
) => {
  const chartRows: any[] = [];
  //add labels in charts
  chartSeries[0]?.data.forEach((dataObject: any, serieIndex: number) => {
    const row: string[] = [];
    //serie.data.forEach((dataObject: any, dataObjectIndex: number) => {
    row.push(dataObject.name);
    chartRows.push(row);
    //});
  });

  chartSeries.forEach((serie: any, serieIndex: number) => {
    serie.data.forEach((dataObject: any, dataObjectIndex: number) => {
      chartRows[dataObjectIndex].push(round(dataObject.y, 2));
    });
  });

  chartRows.forEach((charRow: any[]) => {
    let tableDataSum: number = 0;

    charRow.forEach((tableDate: any, tableDateIndex: number) => {
      if (
        tableDateIndex != 0 &&
        groupNetIndexArr.indexOf(tableDateIndex - 1) == -1
      ) {
        //because the first column is text
        tableDataSum += tableDate;
      }
    });

    charRow.push(round(tableDataSum, 1));
  });

  return chartRows;
};
const gridCreateChartRowsNets = (chartSeries: any, groupNetData: any[]) => {
  const chartRows: any[] = [];
  //add labels in charts
  chartSeries[0]?.data.forEach((dataObject: any, serieIndex: number) => {
    const row: string[] = [];
    //serie.data.forEach((dataObject: any, dataObjectIndex: number) => {
    row.push(dataObject.name);
    chartRows.push(row);
    //});
  });

  chartSeries.forEach((serie: any, serieIndex: number) => {
    serie.data.forEach((dataObject: any, dataObjectIndex: number) => {
      chartRows[dataObjectIndex].push(round(dataObject.y, 2));
    });
  });

  chartRows.forEach((charRow: any[]) => {
    let tableDataSum: number = 0;

    charRow.forEach((tableDate: any, tableDateIndex: number) => {
      if (
        tableDateIndex != 0 &&
        tableDateIndex < charRow.length - groupNetData.length
      ) {
        //because the first column is text
        tableDataSum += tableDate;
      }
    });

    charRow.push(round(tableDataSum, 1));
  });

  return chartRows;
};

const roundOffCount = (count: any[]) => {
  const updatedCount = [...count];
  updatedCount.forEach((countValue: number, countIndex: number) => {
    updatedCount[countIndex] = round(countValue, 1);
  });

  return updatedCount;
};

const maxMinChartRows = (
  chartRows: any,
  chartLabelType: ChartLabelType,
  minMaxArr: any[],
  groupNetIndexArr: number[]
) => {
  const mergedChartRows: any[] = [];
  for (let i = 0; i < chartRows.length; i++) {
    const row: any[] = [];
    for (let j = 0; j < chartRows[i].length; j++) {
      row.push({ text: chartRows[i][j], minMax: false });
      if (j > 0) {
        if (chartLabelType === ChartLabelType.PERCENTAGE) {
          row[j]["text"] = row[j]["text"] + "%";
        }
      }
      if (
        j > 0 &&
        j < chartRows[i].length - 1 &&
        groupNetIndexArr.indexOf(i) == -1
      ) {
        if (chartRows[i][j] == minMaxArr[j - 1]["min"]) {
          row[j]["minMax"] = "min";
        }
        if (chartRows[i][j] == minMaxArr[j - 1]["max"]) {
          row[j]["minMax"] = "max";
        }
      }
    }

    mergedChartRows.push(row);
  }

  return mergedChartRows;
};
const addHeaders = (chartSeries: any, mergedChartRows: any[]) => {
  const headerRow: any[] = [];
  headerRow.push({ text: "", minMax: false });

  chartSeries.forEach((dataObject: any) => {
    headerRow.push({ text: dataObject.name, minMax: false });
  });
  headerRow.push({ text: "Total", minMax: false });
  mergedChartRows.unshift(headerRow);
  return mergedChartRows;
};

const addGrandTotal = (count: any[], chartLabelType: ChartLabelType) => {
  const grandTotalRow: any[] = [];
  grandTotalRow.push({ text: "Total", minMax: false });
  count.forEach((countValue: number) => {
    if (chartLabelType == ChartLabelType.PERCENTAGE) {
      grandTotalRow.push({ text: countValue + "%", minMax: false });
    } else {
      grandTotalRow.push({ text: countValue, minMax: false });
    }
  });

  grandTotalRow.push({ text: "", minMax: false });

  return grandTotalRow;
};
const minMaxObject = (chartRows: any[], groupNetIndexArr: number[]) => {
  const updatedMinMaxArr: any[] = [];
  const updatedCount: number[] = [];
  for (let i = 0; i < chartRows.length; i++) {
    for (let j = 0; j < chartRows[i].length - 1; j++) {
      if (j > 0 && groupNetIndexArr.indexOf(i) == -1) {
        updatedCount[j - 1] =
          updatedCount[j - 1] == undefined ? 0 : updatedCount[j - 1];
        updatedCount[j - 1] += chartRows[i][j];

        //for min max
        if (updatedMinMaxArr[j - 1] == undefined) {
          updatedMinMaxArr[j - 1] = {
            min: chartRows[i][j],
            max: chartRows[i][j],
          };
        }

        if (updatedMinMaxArr[j - 1]["min"] >= chartRows[i][j]) {
          updatedMinMaxArr[j - 1]["min"] = chartRows[i][j];
        }

        if (updatedMinMaxArr[j - 1]["max"] < chartRows[i][j]) {
          updatedMinMaxArr[j - 1]["max"] = chartRows[i][j];
        }

        //for min max
      }
    }
  }
  return { updatedMinMaxArr, updatedCount };
};
const minMaxObjectNets = (chartRows: any[], groupNetData: any[]) => {
  const groupNetDataLabels = groupNetData.map(
    (groupNetObj: any) => groupNetObj.labelText
  );
  const updatedMinMaxArr: any[] = [];
  const updatedCount: number[] = [];
  for (let i = 0; i < chartRows.length - groupNetDataLabels.length; i++) {
    for (let j = 0; j < chartRows[i].length - 1; j++) {
      // if (j > 0 && groupNetDataLabels.indexOf(chartRows[i][0]) == -1) {
      if (j > 0) {
        updatedCount[j - 1] =
          updatedCount[j - 1] == undefined ? 0 : updatedCount[j - 1];
        updatedCount[j - 1] += chartRows[i][j];

        //for min max
        if (updatedMinMaxArr[j - 1] == undefined) {
          updatedMinMaxArr[j - 1] = {
            min: chartRows[i][j],
            max: chartRows[i][j],
          };
        }

        if (updatedMinMaxArr[j - 1]["min"] >= chartRows[i][j]) {
          updatedMinMaxArr[j - 1]["min"] = chartRows[i][j];
        }

        if (updatedMinMaxArr[j - 1]["max"] < chartRows[i][j]) {
          updatedMinMaxArr[j - 1]["max"] = chartRows[i][j];
        }

        //for min max
      }
    }
  }

  return { updatedMinMaxArr, updatedCount };
};
const gridMinMaxObjectNets = (chartRows: any[], groupNetData: any[]) => {
  const updatedMinMaxArr: any[] = [];
  const updatedCount: number[] = [];
  for (let i = 0; i < chartRows.length; i++) {
    for (let j = 0; j < chartRows[i].length - 1; j++) {
      // if (j > 0 && groupNetDataLabels.indexOf(chartRows[i][0]) == -1) {
      if (j > 0) {
        updatedCount[j - 1] =
          updatedCount[j - 1] == undefined ? 0 : updatedCount[j - 1];
        updatedCount[j - 1] += chartRows[i][j];

        //for min max
        if (updatedMinMaxArr[j - 1] == undefined) {
          updatedMinMaxArr[j - 1] = {
            min: chartRows[i][j],
            max: chartRows[i][j],
          };
        }

        if (updatedMinMaxArr[j - 1]["min"] >= chartRows[i][j]) {
          updatedMinMaxArr[j - 1]["min"] = chartRows[i][j];
        }

        if (updatedMinMaxArr[j - 1]["max"] < chartRows[i][j]) {
          updatedMinMaxArr[j - 1]["max"] = chartRows[i][j];
        }

        //for min max
      }
    }
  }

  return { updatedMinMaxArr, updatedCount };
};

const tableDataSignificance = (chartRows: any[], chartSeries: any) => {
  const updatedChartRows = JSON.parse(JSON.stringify(chartRows));
  chartSeries.forEach((chartObject: any, chartObjectIndex: number) => {
    chartObject.data.forEach((dataObject: any, dataObjectIndex: number) => {
      if (dataObject.significantDiffernce != "") {
        updatedChartRows[dataObjectIndex][chartObjectIndex + 1] = {
          ...updatedChartRows[dataObjectIndex][chartObjectIndex + 1],
          significantDiffernce: dataObject.significantDiffernce,
          // text:
          //   updatedChartRows[dataObjectIndex][chartObjectIndex + 1].text +
          //   `<span class="significante-color table-significante">- + ${dataObject.significantDiffernce}</span>`,
          // minMax:
          //   updatedChartRows[dataObjectIndex][chartObjectIndex + 1].minMax,
        };
      }
    });
  });

  return updatedChartRows;
};
const getGroupNetIndex = (questionOptions: any[]) => {
  const groupNetIndex: number[] = [];
  questionOptions.forEach((option: any, optionsIndex: number) => {
    if (option.labelCode.split("_")[0] == "N") {
      groupNetIndex.push(optionsIndex);
    }
  });
  return groupNetIndex;
};
