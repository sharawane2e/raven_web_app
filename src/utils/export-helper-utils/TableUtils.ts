import { round } from "../Utility";
import { chartDataGen } from "./ExportChartDataGen";
import store from "../../redux/store";
import { ChartLabelType } from "../../enums/ChartLabelType";

export function tableChartDataGen() {
  let seriesData = [];

  seriesData = chartDataGen();

  // let complteTable = [];
  let rows = [];
  let minmax = [];

  const tranposedTableData: any[] = [];
  const tranposedTableDataMin: any[] = [];

  const {chart} = store.getState();

  if (seriesData) {
    let scale: any = [];
    seriesData.forEach((index: any) => {
      scale.push(index.name);
    });
    rows.push(["", ...scale, "Total"]);
    let subRow: any = [];
    let totalRow:any = [];    

    // console.log(seriesData[0])
   if(seriesData[0])
      for (let k = 0; k < seriesData[0].labels.length; k++) {
        let totalrowSub=0;
        //const updateRow: any[] = [];
        
        seriesData.forEach((d: any) => {          
          if(chart?.chartLabelType===ChartLabelType.PERCENTAGE){
            if (d.values[k]) {
              //subRow.push(round(d.values[k], 1) + "%");
              subRow.push(round(d.values[k], 1) + "%");
              totalrowSub += parseFloat(d.values[k]);
              //updateRow.push(d.values[k]);

            } else {
              //subRow.push(0 + "%");
              subRow.push(0 + "%");
              totalrowSub += 0;
              //updateRow.push(d.values[k]);
            }
          }else{
            if (d.values[k]) {
              subRow.push(round(d.values[k], 1));
              totalrowSub += parseFloat(d.values[k]);
              //updateRow.push(d.values[k]);
              //totalColomn.push(d.values)
            } else {
              subRow.push(0);
              totalrowSub += 0;
              //updateRow.push(d.values[k]);
              //totalColumnSub += parseFloat(d.values)
            }
          }
          
          
        });
        
        //tranposedTableData.push(Math.max(...updateRow));
        //tranposedTableDataMin.push(Math.min(...updateRow));
       
        if(chart?.chartLabelType===ChartLabelType.PERCENTAGE){
          totalRow.push(round(totalrowSub, 1) + "%");
          //console.log(totalrowSub)
        }else{
          totalRow.push(round(totalrowSub, 1));
          //console.log(totalrowSub)
        }
        
        //console.log(subRow);
        rows.push([seriesData[0].labels[k], ...subRow, ...totalRow]);
        
        minmax.push([tranposedTableData, tranposedTableDataMin]);
        //console.log(subRow);
        subRow = [];
        totalRow= [];
        
      }
}
  let tColomn:any = [];
  
  seriesData.forEach((index: any) => {

    let getColumnSum=0;
    let columnValues = index.values
    
    const updateRow: any[] = [];
    //let getColoumnTotal = columnValues.reduce((partialSum:any, a:any) => partialSum + a, 0);
    for( var i = 0; i < columnValues.length; i++ ) {
      if( typeof(columnValues[i])==="undefined" ) {
        columnValues[i] = 0;
        updateRow.push(columnValues[i])
      }
      else{
        updateRow.push(columnValues[i])
      }
     };

     if(chart?.chartLabelType===ChartLabelType.PERCENTAGE){

       tranposedTableData.push(Math.max(...updateRow)+'%');
       tranposedTableDataMin.push(Math.min(...updateRow)+'%');
      }else{
       tranposedTableData.push(Math.max(...updateRow));
       tranposedTableDataMin.push(Math.min(...updateRow));

     }


    let getColoumnTotal = index.values
    .filter(function(x:any) { return typeof(x) === 'number'}) // remove any non numbers
    .reduce(function( s:number, v:number ){ return s + Number(v) }, 0);
    
    if(chart?.chartLabelType===ChartLabelType.PERCENTAGE){
      tColomn.push(round(getColoumnTotal, 1) + "%");
    }else{
      tColomn.push(round(getColoumnTotal, 1));
    }
  
    getColumnSum=0;
   
  });
  
  //console.log(tColomn);

  minmax.push([tranposedTableData, tranposedTableDataMin]);

  rows.push(["Total", ...tColomn, ""]);
  const complteTable={rows, minmax};

  return complteTable;
}

