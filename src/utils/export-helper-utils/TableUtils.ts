import { round } from "../Utility";
import { chartDataGen } from "./ExportChartDataGen";
export function tableChartDataGen() {
  let seriesData = [];

  seriesData = chartDataGen();

  let rows = [];

  if (seriesData) {
    let scale: any = [];
    seriesData.forEach((index: any) => {
      scale.push(index.name);
    });
    rows.push(["", ...scale]);
    let subRow: any = [];
    for (let k = 0; k < seriesData[0].labels.length; k++) {
      seriesData.forEach((d: any) => {
        if (d.values[k]) {
          subRow.push(round(d.values[k], 1) + "%");
        } else {
          subRow.push(0 + "%");
        }
      });
      rows.push([seriesData[0].labels[k], ...subRow]);

      subRow = [];
    }
  }

  return rows;
}
