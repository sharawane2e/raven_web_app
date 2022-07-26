import { ChartLabelType } from "../../enums/ChartLabelType";
import { IchartOptionsDto } from "../../types/IChartOptionsDto";
import { round } from "../Utility";

export const singleTable = (
  chartSeries: any,
  chartOptionsPayload: IchartOptionsDto
) => {
  console.log(chartOptionsPayload);
  const { chartLabelType, questionData } = chartOptionsPayload;
  const chartRows: any[] = [];

  chartSeries.forEach((serie: any) => {
    serie.data.forEach((dataObject: any) => {
      const row: any[] = [];
      row.push(dataObject.name);
      row.push(round(dataObject.y, 2));
      row.push(round(dataObject.y, 2));
      chartRows.push(row);
    });
  });

  //adding Grand Total
  const grandTotalRow: any[] = [];
  const count: number[] = [];
  const minMaxArr: any[] = [];

  if (questionData.isGroupNet) {
    const { updatedMinMaxArr, updatedCount } = minMaxObjectNets(
      chartRows,
      questionData.groupNetData
    );
    count.push(...updatedCount);
    minMaxArr.push(...updatedMinMaxArr);
  } else {
    const { updatedMinMaxArr, updatedCount } = minMaxObject(chartRows);
    count.push(...updatedCount);
    minMaxArr.push(...updatedMinMaxArr);
  }

  count.forEach((countValue: number, countIndex: number) => {
    count[countIndex] = round(countValue, 2);
  });

  console.log(chartRows);

  //merging maxMin
  const mergedChartRows: any[] = [];
  for (let i = 0; i < chartRows.length; i++) {
    const row: any[] = [];
    for (let j = 0; j < chartRows[i].length; j++) {
      // debugger;
      row.push({ text: chartRows[i][j], minMax: false });
      if (j > 0) {
        if (chartLabelType === ChartLabelType.PERCENTAGE) {
          row[j]["text"] = row[j]["text"] + "%";
        }
      }
      if (j > 0 && j < chartRows[i].length - 1) {
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

  console.log(mergedChartRows);

  //add header
  const headerRow: any[] = [];
  headerRow.push({ text: "", minMax: false });
  headerRow.push({ text: chartSeries[0].name, minMax: false });
  headerRow.push({ text: "Total", minMax: false });
  mergedChartRows.unshift(headerRow);

  //add header

  //adding Grand Total
  grandTotalRow.push({ text: "Total", minMax: false });
  count.forEach((countValue: number) => {
    if (chartLabelType == ChartLabelType.PERCENTAGE) {
      grandTotalRow.push({ text: countValue + "%", minMax: false });
    } else {
      grandTotalRow.push({ text: countValue, minMax: false });
    }
  });

  grandTotalRow.push({ text: "", minMax: false });
  mergedChartRows.push(grandTotalRow);
  console.log(mergedChartRows);
  console.log(minMaxArr);

  //adding Grand Total

  return mergedChartRows;
};

const minMaxObject = (chartRows: any[]) => {
  const updatedMinMaxArr: any[] = [];
  const updatedCount: number[] = [];
  for (let i = 0; i < chartRows.length; i++) {
    for (let j = 0; j < chartRows[i].length - 1; j++) {
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
const minMaxObjectNets = (chartRows: any[], groupNetData: any[]) => {
  const groupNetDataLabels = groupNetData.map(
    (groupNetObj: any) => groupNetObj.labelText
  );
  const updatedMinMaxArr: any[] = [];
  const updatedCount: number[] = [];
  for (let i = 0; i < chartRows.length; i++) {
    for (let j = 0; j < chartRows[i].length - 1; j++) {
      if (j > 0 && groupNetDataLabels.indexOf(chartRows[i][0]) == -1) {
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
