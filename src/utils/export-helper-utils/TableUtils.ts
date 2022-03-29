import { round } from "../Utility";
import { chartDataGen } from "./ExportChartDataGen";
import store from "../../redux/store";
import { ChartLabelType } from "../../enums/ChartLabelType";

export function tableChartDataGen() {
  let seriesData = [];

  seriesData = chartDataGen();

  let rows = [];

  const {chart} = store.getState();

  if (seriesData) {
    let scale: any = [];
    seriesData.forEach((index: any) => {
      scale.push(index.name);
    });
    rows.push(["", ...scale]);
    let subRow: any = [];

    // console.log(seriesData[0])
   if(seriesData[0])
      for (let k = 0; k < seriesData[0].labels.length; k++) {
        seriesData.forEach((d: any) => {
          if(chart?.chartLabelType===ChartLabelType.PERCENTAGE){
            if (d.values[k]) {
              subRow.push(round(d.values[k], 1) + "%");
              //subRow.push(round(d.values[k], 1));
            } else {
              subRow.push(0 + "%");
              //subRow.push(0);
            }
          }else{
            if (d.values[k]) {
              subRow.push(round(d.values[k], 1));
            } else {
              subRow.push(0);
            }
          }
          
        });
        rows.push([seriesData[0].labels[k], ...subRow]);
        //console.log(rows)
        subRow = [];
      }
    //}

    
  }

  return rows;
}
