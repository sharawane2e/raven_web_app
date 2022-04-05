import { round } from "../Utility";
import { chartDataGen } from "./ExportChartDataGen";
import store from "../../redux/store";
import { ChartLabelType } from "../../enums/ChartLabelType";

export function tableChartDataGen() {
  let seriesData = [];

  seriesData = chartDataGen();

  let rows = [];
  let minmax = [];
  //let nettingStr = [];

  const tranposedTableData: any[] = [];
  const tranposedTableDataMin: any[] = [];

  const {chart} = store.getState();

  if (seriesData) {
    let scale: any = [];
    seriesData.forEach((index: any) => {
      scale.push(index.name);
    });
    rows.push(["", ...scale, "Total", "Top"]);
    let subRow: any = [];
    let totalRow:any = [];
    let topFirst:any = [];    

   if(seriesData[0])
      for (let k = 0; k < seriesData[0].labels.length; k++) {
        let totalrowSub=0;
        let topFisrtSub=0;

        //console.log(seriesData[0].labelsCode);
        
        seriesData.forEach((d: any, index:any) => { 
          
          //console.log(d.labelsCode[index] == "1" || d.labelsCode[index] == "2")
          
          if(chart?.chartLabelType===ChartLabelType.PERCENTAGE){
            if (d.values[k]) {              
              subRow.push(round(d.values[k], 1) + "%");
              totalrowSub += parseFloat(d.values[k]);
              if(d.labelsCode[index] == "1" || d.labelsCode[index] == "2"){
                topFisrtSub += parseFloat(d.values[k]);
              }  

            } else {
              subRow.push(0 + "%");
              totalrowSub += 0;
              topFisrtSub += 0;
            }
          }else{
            if (d.values[k]) {
              subRow.push(round(d.values[k], 1));
              totalrowSub += parseFloat(d.values[k]);
              if(d.labelsCode[index] == "1" || d.labelsCode[index] == "2"){
                topFisrtSub += parseFloat(d.values[k]);
              } 
            } else {
              subRow.push(0);
              totalrowSub += 0;
              topFisrtSub +=0;
            }
          }
          
          
        });
        
        if(chart?.chartLabelType===ChartLabelType.PERCENTAGE){
          totalRow.push(round(totalrowSub, 1) + "%");
          topFirst.push(round(topFisrtSub, 1) + "%");
        }else{
          totalRow.push(round(totalrowSub, 1));
          topFirst.push(round(topFisrtSub, 1));
        }
        
        rows.push([seriesData[0].labels[k], ...subRow, ...totalRow, ...topFirst]);
        
        minmax.push([tranposedTableData, tranposedTableDataMin]);
        subRow = [];
        totalRow= [];
        topFirst=[];
        
      }
  }

  seriesData.forEach((seriesValue: any, ind:any) => {

    seriesValue.values.forEach((val: any, cIndex:any) => {
      
      //console.log(val)
      if(seriesValue.labelsCode[cIndex] === "1"){
        //console.log(val)
      }
      if(seriesValue.labelsCode[cIndex] === "2"){
        //console.log(val)
      }
      //if(seriesValue.labelsCode[cIndex] === "1" || seriesValue.labelsCode[cIndex] === "2"){
        //console.log(val);
      //}
    });

    

    
  });

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
  

  minmax.push([tranposedTableData, tranposedTableDataMin]);
  //nettingStr.push(["9", "10"]);

  rows.push(["Total", ...tColomn, ""]);
  
  const complteTable={rows, minmax};

  return complteTable;
}

