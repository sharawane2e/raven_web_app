import { useSelector } from "react-redux";
import store, { RootState } from "../../redux/store";
import { memo, useEffect, useState } from "react";
import { tableChartDataGen } from "../../utils/export-helper-utils/TableUtils";
import { Scrollbars } from "react-custom-scrollbars";
import { number } from "yup";
import clsx from "clsx";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { ChartLabelType } from "../../enums/ChartLabelType";

interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {
  const [tableData, setTableData] = useState<any>([]);

  const { chart } = store.getState();
  const { chartData } = useSelector((state: RootState) => state.chart);
  
  const tranposedTableData:any[] = [];
  const tranposedTableDataMin:any[] = [];
  const totalColumnVal:any = ["Total"]

  if(tableData.length != 0){
    
    tableData[0].map((item:any, index:number) => {
      const parentIndex = index;
      
     const updateRow:any[] = [];
     const totalColumn:any[] = ["Total"];
      tableData.map((row:any,rowIndex:number)=>{

        if(rowIndex != 0){
         
          if(row[parentIndex].toString().indexOf("%") != -1){ 
            let cnvCell:any = row[parentIndex].split("%")[0];                             
            updateRow.push(cnvCell);
            totalColumn.push(cnvCell)
                   
          }else{
            let cnvCell:any = row[parentIndex];     
            updateRow.push(cnvCell);
            totalColumn.push(cnvCell)            
          }
          console.log(totalColumn)
        }
      })
     
      
      tranposedTableData.push(Math.max(...updateRow));
      tranposedTableDataMin.push(Math.min(...updateRow))
  
    });
  

  }
  


  useEffect(() => {
    setTableData(tableChartDataGen());
  }, [chartData]);


  
  return (
    <Scrollbars>
      <div className="tableView">
        <div className="TableView">
          {tableData.map((row: any) => (
            <div className="Table-row">
              {
              
              row.map((col: any,colIndex:number) => {
                let colSplitVal:any ="";
                if(col != 0){
                  if (row.toString().indexOf("%") != -1){
                    colSplitVal=col.split("%")[0];
                  }
                  else{
                    colSplitVal=col;
                  }
                }
                return <>
                  {
                    chart.chartLabelType===ChartLabelType.PERCENTAGE?<div className={clsx({"Table-row-item":true,"maxValue":tranposedTableData[colIndex] == colSplitVal,"minValue":tranposedTableDataMin[colIndex] == colSplitVal})}>{col}</div>:<>
                      <div className={clsx({"Table-row-item":true,"maxValue":tranposedTableData[colIndex] == colSplitVal,"minValue":tranposedTableDataMin[colIndex] == colSplitVal})}>{col}</div>
                    </>
                  }
                </>
              })
              
              }

            </div>
          ))}
        </div>
        
      </div>
    </Scrollbars>
  );
};

export default memo(TableView);
