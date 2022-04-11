import { round } from "../Utility";
import { chartDataGen } from "./ExportChartDataGen";
import store from "../../redux/store";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { QuestionType } from "../../enums/QuestionType";

export function tableChartDataGen() {
  let seriesData = [];
  seriesData = chartDataGen();

  let rows = [];
  let minmax = [];
  let lablecode_length: any = "";

  const tranposedTableData: any[] = [];
  const tranposedTableDataMin: any[] = [];

  const { chart } = store.getState();

  if (seriesData) {
    let scale: any = [];
    seriesData.forEach((index: any) => {
      scale.push(index.name);
    });
    rows.push(["", ...scale, "Total"]);
    let subRow: any = [];
    let totalRow: any = [];
    let scaleIndex: any = 0;
    let scaleLength: any = "";

    if (chart.questionData?.groupNetData) {
      scaleLength = chart.questionData?.groupNetData.length;
    }
    if (chart.chartTranspose) {
      scaleIndex = scale.length;
    } else {
      scaleIndex = scale.length - scaleLength;
    }

    if (seriesData[0])
      for (let k = 0; k < seriesData[0].labels.length; k++) {
        let totalrowSub = 0;
        //console.log(seriesData[0].labelCode);
        seriesData.forEach((d: any, rIndex: any) => {
          if (chart?.chartLabelType === ChartLabelType.PERCENTAGE) {
            if (d.values[k]) {
              subRow.push(round(d.values[k], 1) + "%");
              if (rIndex < scaleIndex) {
                totalrowSub += parseFloat(d.values[k]);
              }
            } else {
              subRow.push(0 + "%");
              totalrowSub += 0;
            }
          } else {
            if (d.values[k]) {
              subRow.push(round(d.values[k], 1));
              if (rIndex < scaleIndex) {
                totalrowSub += parseFloat(d.values[k]);
              }
            } else {
              subRow.push(0);
              totalrowSub += 0;
            }
          }
        });
        if (chart?.chartLabelType === ChartLabelType.PERCENTAGE) {
          totalRow.push(round(totalrowSub, 1) + "%");
        } else {
          totalRow.push(round(totalrowSub, 1));
        }

        rows.push([seriesData[0].labels[k], ...subRow, ...totalRow]);

        minmax.push([tranposedTableData, tranposedTableDataMin]);
        subRow = [];
        totalRow = [];
      }
  }
  let tColomn: any = [];
  // console.log("seriesData", seriesData);

  seriesData.forEach((series: any) => {
    let getColumnSum = 0;
    let columnValues = series.values;
    debugger;
    let results: any = chart.questionData?.options.filter(function (option) {
      if (option.labelCode.split("_")[0] == "N") {
        return true;
      }
    });
    lablecode_length = results.length;

    const updateRow: any[] = [];
    //let getColoumnTotal = columnValues.reduce((partialSum:any, a:any) => partialSum + a, 0);
    for (var i = 0; i < columnValues.length; i++) {
      if (typeof columnValues[i] === "undefined") {
        columnValues[i] = 0;
        updateRow.push(columnValues[i]);
      } else {
        updateRow.push(columnValues[i]);
      }
    }
    //console.log("lablecode_length", lablecode_length);

    if (
      chart.chartTranspose &&
      chart?.questionData?.type === QuestionType.GRID
    ) {
      columnValues.splice(-3);
    }
    // if (QuestionType.SINGLE) {
    // } else if (QuestionType.MULTI) {
    // debugger;
    //columnValues.slice(0, -lablecode_length);
    // }

    if (chart?.chartLabelType === ChartLabelType.PERCENTAGE) {
      tranposedTableData.push(Math.max(...updateRow) + "%");
      tranposedTableDataMin.push(Math.min(...updateRow) + "%");
    } else {
      tranposedTableData.push(Math.max(...updateRow));
      tranposedTableDataMin.push(Math.min(...updateRow));
    }

    let updateSeries = series.values.slice(0, -lablecode_length);

    let getColoumnTotal = updateSeries
      .filter(function (x: any) {
        return typeof x === "number";
      }) // remove any non numbers
      .reduce(function (s: number, v: number) {
        return s + Number(v);
      }, 0);

    console.log("getColoumnTotal", getColoumnTotal);

    if (chart?.chartLabelType === ChartLabelType.PERCENTAGE) {
      tColomn.push(round(getColoumnTotal, 1) + "%");
    } else {
      tColomn.push(round(getColoumnTotal, 1));
    }

    getColumnSum = 0;
  });
  console.log("lablecode_length", lablecode_length);
  //console.log(tColomn);

  minmax.push([tranposedTableData, tranposedTableDataMin]);

  rows.push(["Total", ...tColomn, ""]);
  const complteTable = { rows, minmax };

  return complteTable;
}
