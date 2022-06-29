import { round } from "../Utility";
import { chartDataGen } from "./ExportChartDataGen";
import store from "../../redux/store";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { QuestionType } from "../../enums/QuestionType";

export function tableChartDataGen() {
  let seriesData = [];
  seriesData = chartDataGen();
  let lablecode_length: any = "";
  let crosstab_length: any = "";
  let rows = [];
  let minmax = [];
  let scaleLength: any = "";
  let subRow: any = [];
  let totalRow: any = [];
  let scaleIndex: any = 0;

  const tranposedTableData: any[] = [];
  const tranposedTableDataMin: any[] = [];

  const { chart } = store.getState();
  let chartTransposeState = !chart.chartTranspose;

  let results: any = chart.questionData?.options.filter(function (option) {
    if (option.labelCode.split("_")[0] == "N") {
      return true;
    }
  });

  lablecode_length = results.length;
  let bannerQuestionresults: any = chart.bannerQuestionData?.options.filter(
    function (option) {
      if (option.labelCode.split("_")[0] == "N") {
        return true;
      }
    }
  );
  crosstab_length = bannerQuestionresults?.length;

  if (seriesData) {
    let scale: any = [];
    seriesData.forEach((index: any) => {
      scale.push(index.name);
    });
    rows.push(["", ...scale, "Total"]);
    const QuestionData: any = chart.questionData?.groupNetData;

    var filtered = QuestionData.filter(function (el: any) {
      return el !== "";
    });

    scaleLength = filtered.length > 1 ? filtered.length : 0;

    if (!chartTransposeState) {
      scaleIndex = scale.length;
    } else {
      if (scaleLength > 0) {
        scaleIndex = scale.length - scaleLength;
      } else {
        scaleIndex = scale.length - crosstab_length;
      }
    }
    const curentRow = scaleIndex - crosstab_length + 1;

    if (seriesData[0])
      for (let k = 0; k < seriesData[0].labels.length; k++) {
        let totalrowSub = 0;

        seriesData.forEach((d: any, rIndex: any) => {
          let netsLabelcode =
            chart.bannerQuestionData?.options[rIndex]?.labelCode.split("_")[0];

          let netsQuestionLabelcode =
            chart.questionData?.options[rIndex]?.labelCode?.split("_")[0];

          if (
            chart?.chartLabelType === ChartLabelType.PERCENTAGE &&
            chart?.questionData?.type !== QuestionType?.NUMBER
          ) {
            if (d.values[k]) {
              subRow.push(round(d.values[k], 1) + "%");
              if (rIndex < scaleIndex && !crosstab_length) {
                totalrowSub += parseFloat(d.values[k]);
                if (netsLabelcode === "N") {
                  totalrowSub += 0;
                }
              } else {
                if (netsQuestionLabelcode === "N") {
                  totalrowSub += parseFloat(d.values[k]);
                } else {
                  //totalrowSub += parseFloat(d.values[k]);
                  if (chart.showMean === false && scaleLength > 0) {
                    totalrowSub += 0;
                  } else {
                    totalrowSub += parseFloat(d.values[k]);
                  }
                }
              }

              if (crosstab_length && rIndex + curentRow > scaleIndex) {
                totalrowSub += parseFloat(d.values[k]);
              }
            } else {
              subRow.push(0 + "%");
              totalrowSub += 0;
            }
          } else {
            if (d.values[k]) {
              subRow.push(round(d.values[k], 1));
              if (chart?.questionData?.type === "N") {
                totalrowSub += parseFloat(d.values[k]);
              } else {
                if (rIndex < scaleIndex && chart.showMean) {
                  totalrowSub += parseFloat(d.values[k]);
                  if (netsLabelcode === "N") {
                    totalrowSub += 0;
                  }
                } else {
                  if (netsQuestionLabelcode === "N") {
                    totalrowSub += parseFloat(d.values[k]);
                  } else {
                    if (scaleLength === 0 && chartTransposeState) {
                      totalrowSub += parseFloat(d.values[k]);
                    } else {
                      if (chart.showMean === false && scaleLength > 0) {
                        totalrowSub += 0;
                      } else {
                        totalrowSub += parseFloat(d.values[k]);
                      }
                    }
                  }
                }
                if (chart.showMean === true) {
                  totalrowSub += 0;
                }

                if (rIndex < scaleIndex && !crosstab_length) {
                  //totalrowSub += parseFloat(d.values[k]);
                  if (netsLabelcode === "N") {
                    totalrowSub += parseFloat(d.values[k]);
                  }
                }

                if (crosstab_length && rIndex + curentRow > scaleIndex) {
                  totalrowSub += parseFloat(d.values[k]);
                }
              }
            } else {
              subRow.push(0);
              totalrowSub += 0;
            }
          }
        });

        if (
          chart?.chartLabelType === ChartLabelType.PERCENTAGE &&
          chart?.questionData?.type !== QuestionType?.NUMBER
        ) {
          totalRow.push(round(totalrowSub, 1) + "%");
        } else {
          totalRow.push(round(totalrowSub, 1));
        }

        rows.push([seriesData[0].labels[k], ...subRow, ...totalRow]);

        minmax.push([tranposedTableData, tranposedTableDataMin]);
        subRow = [];
        totalRow = [];
      }

    let tColomn: any = [];

    seriesData.forEach((series: any) => {
      let getColumnSum = 0;

      let columnValues = series.values;

      const updateRow: any[] = [];

      for (var i = 0; i < columnValues.length; i++) {
        if (typeof columnValues[i] === "undefined") {
          columnValues[i] = 0;
          updateRow.push(columnValues[i]);
        } else {
          updateRow.push(columnValues[i]);
        }
      }
      if (
        chart.chartTranspose &&
        chart?.questionData?.type === QuestionType.GRID &&
        scaleLength > 0
      ) {
        columnValues.splice(-scaleLength);
      }

      if (QuestionType.MULTI && lablecode_length > 0) {
        columnValues = columnValues.splice(lablecode_length);
      }

      const newUpdatedRow =
        chart.chartTranspose &&
        chart?.questionData?.type === QuestionType.GRID &&
        scaleLength > 0
          ? updateRow.slice(0, -scaleLength)
          : QuestionType.MULTI && lablecode_length > 0
          ? updateRow.splice(lablecode_length)
          : updateRow;

      if (
        chart?.chartLabelType === ChartLabelType.PERCENTAGE &&
        chart?.questionData?.type !== QuestionType?.NUMBER
      ) {
        tranposedTableData.push(Math.max(...newUpdatedRow) + "%");
        tranposedTableDataMin.push(Math.min(...newUpdatedRow) + "%");
      } else {
        tranposedTableData.push(Math.max(...newUpdatedRow));
        tranposedTableDataMin.push(Math.min(...newUpdatedRow));
      }

      const updatedColum =
        QuestionType.MULTI && lablecode_length > 0
          ? columnValues
          : series.values;

      let getColoumnTotal = updatedColum
        .filter(function (x: any) {
          return typeof x === "number";
        }) // remove any non numbers
        .reduce(function (s: number, v: number) {
          return s + Number(v);
        }, 0);

      if (
        chart?.chartLabelType === ChartLabelType.PERCENTAGE &&
        chart?.questionData?.type !== QuestionType?.NUMBER
      ) {
        tColomn.push(round(getColoumnTotal, 1) + "%");
      } else {
        tColomn.push(round(getColoumnTotal, 1));
      }

      getColumnSum = 0;
    });

    minmax.push([tranposedTableData, tranposedTableDataMin]);

    rows.push(["Total", ...tColomn, ""]);
  }
  const complteTable = { rows, minmax };

  return complteTable;
}
