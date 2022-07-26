import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { memo, useEffect, useState } from 'react';
import { tableChartDataGen } from '../../utils/export-helper-utils/TableUtils';
import { Scrollbars } from 'react-custom-scrollbars';
import clsx from 'clsx';
import { QuestionType } from '../../enums/QuestionType';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { getChartOptions } from '../../utils/ChartOptionFormatter';
import { singleTable } from '../../utils/table-option-util/singleTable';
import { IchartOptionsDto } from '../../types/IChartOptionsDto';

interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {


  const {
    chartLabelType,
    questionData,
    chartData,
    baseCount,
    bannerQuestionData,
    questionChartData,
    bannerChartData,
    chartTranspose,
    chartType,
    significant
  } = useSelector((state: RootState) => state?.chart);

  const chart:IchartOptionsDto  = {
    chartLabelType,
    questionData,
    chartData,
    baseCount,
    bannerQuestionData,
    chartOptionsData:undefined,
    questionChartData,
    bannerChartData,
    transposed:chartTranspose,
    chartType,
    significant
  }

  const getChartData = getChartOptions();
  const chartRows = singleTable(getChartData.series,chart)
  const tableTransformedData = chartRows
  console.log(getChartData)
  console.log(tableTransformedData)
  // const [tableData, setTableData] = useState<any>([]);



  // const isEqual = (val1: any, val2: any) => val1 === val2;

  // let scaleLength: any = '';
  // let filtered: any;
  // let results: any;
  // let QuestionData: any;
  // let removeSubGrop: any;
  // let singleGroupNet: any;

  // useEffect(() => {
  //   setTableData(tableChartDataGen());
  //   console.log(tableChartDataGen())
  // }, [chartData, showMean, significant]);

  // if (questionData?.isGroupNet && questionData?.type === QuestionType.SINGLE) {
  //   QuestionData = 0;
  //   singleGroupNet = questionData?.groupNetData?.length;
  // } else {
  //   QuestionData = questionData?.groupNetData;

  //   filtered = QuestionData?.filter(function (el: any) {
  //     return el !== '';
  //   });

  //   scaleLength = filtered?.length > 1 ? filtered?.length : 0;

  //   results = questionData?.options.filter(function (option) {
  //     if (option?.labelCode === 'N') {
  //       if (option?.labelCode.split('_')[0] == 'N') {
  //         return true;
  //       }
  //     }
  //   });
  // }

  // let laberesult = results?.length === undefined ? 0 : results?.length;

  // if (chartTranspose) {
  //   removeSubGrop = tableData?.rows?.length - scaleLength - 1;
  // }
  // if (laberesult > 0) {
  //   removeSubGrop = tableData?.rows?.length - laberesult;
  // } else {
  //   const singleGroupNetData =
  //     singleGroupNet === undefined ? 0 : singleGroupNet;
  //   removeSubGrop = tableData?.rows?.length - singleGroupNetData - 1;
  // }

  // /*This code used for single grid data column hide and show highlights  */
  // //  else {
  // //   tableData?.rows?.map((rows: any) => {
  // //     dataValue = rows.length;
  // //   });
  // //   removeSubGrop = dataValue - scaleLength - 1;
  // // }

  // const highLight = (col: any, currentMax: any, currentMin: any) => {
  //   const splitCol = col.toString().split('|')[0];
  //   const splitCol2 = col.toString().split('|')[1];

  //   // console.log('splitCol2', splitCol2 == '()');

  //   const splicolNumber =
  //     chartLabelType == ChartLabelType.PERCENTAGE ? splitCol : Number(splitCol);

  //   return (
  //     <>
  //       <div
  //         className={clsx({
  //           'Table-row-item': true,
  //           maxValue: isEqual(splicolNumber, currentMin),
  //           minValue: isEqual(splicolNumber, currentMax),
  //         })}
  //       >
  //         {splitCol}
  //         {splitCol2 != undefined && splitCol2 != '()' ? (
  //           <span className="significante-color table-significante">
  //             {splitCol2}
  //           </span>
  //         ) : (
  //           ''
  //         )}
  //       </div>
  //     </>
  //   );
  // };

  // const tableColumn = (
  //   rowIndex: any,
  //   columnIndex: any,
  //   col: any,
  //   currentMin: any,
  //   currentMax: any,
  // ) => {
  //   const splitCol = col.toString().split('|')[0];
  //   const splitCol2 = col.toString().split('|')[1];
  //   const rowcount =
  //     removeSubGrop === undefined ? 0 : removeSubGrop - laberesult;

  //   if (
  //     laberesult > 0 &&
  //     questionData?.isGroupNet &&
  //     questionData?.type === QuestionType.GRID
  //   ) {
  //     return !chartTranspose ? (
  //       rowIndex > removeSubGrop - rowcount &&
  //       rowIndex < removeSubGrop + (laberesult - singleGroupNet) ? (
  //         highLight(col, currentMin, currentMax)
  //       ) : !removeSubGrop ? (
  //         highLight(col, currentMin, currentMax)
  //       ) : (
  //         <div className="Table-row-item">
  //           {splitCol}
  //           <span className="significante-color table-significante">
  //             {splitCol2}
  //           </span>
  //         </div>
  //       )
  //     ) : (
  //       <></>
  //     );
  //   } else {
  //     if (
  //       chartTranspose &&
  //       questionData?.isGroupNet &&
  //       questionData?.type === QuestionType.SINGLE &&
  //       rowIndex < removeSubGrop - (laberesult - singleGroupNet)
  //     ) {
  //       return highLight(col, currentMin, currentMax);
  //     } else {
  //       if (chartTranspose) {
  //         if (showMean) {
  //           return highLight(col, currentMin, currentMax);
  //         } else {
  //           return chartTranspose ? (
  //             rowIndex < removeSubGrop && !showMean ? (
  //               highLight(col, currentMin, currentMax)
  //             ) : !removeSubGrop && !showMean ? (
  //               highLight(col, currentMin, currentMax)
  //             ) : (
  //               <div className="Table-row-item">
  //                 {splitCol}
  //                 <span className="significante-color table-significante">
  //                   {splitCol2}
  //                 </span>
  //               </div>
  //             )
  //           ) : columnIndex && tableData?.rows?.length > 3 ? (
  //             highLight(col, currentMin, currentMax)
  //           ) : !removeSubGrop && tableData?.rows?.length > 3 ? (
  //             highLight(col, currentMin, currentMax)
  //           ) : (
  //             <div className="Table-row-item">
  //               {splitCol}
  //               <span className="significante-color table-significante">
  //                 {splitCol2}
  //               </span>
  //             </div>
  //           );
  //         }
  //       } else {
  //         return highLight(col, currentMin, currentMax);
  //       }
  //     }
  //   }
  // };
  // console.log(tableData);

  // const displayValue = (value:number|string,rowIndex:number,colIndex:number) =>{
  //   if(rowIndex!=0 && colIndex!= 0 && value!= ""){
  //     return value+"%";
  //   }
  //   return value;
  // }
  return (
    <Scrollbars>
<div className="tableView">	
	        <div className="TableView">
	          {chartRows.map((row: any,rowIndex:number) => (
	            <div className="Table-row">
	              {row.map((col: any,colIndex:number) => (
	                // <div className="Table-row-item">{col}</div>
	                // <div className={clsx({
                  //             'Table-row-item': true,
                  //             minValue: minMaxArr[colIndex-1]?.['min']===col?true:false,
                  //             maxValue: minMaxArr[colIndex-1]?.['max']===col?true:false,
                  //           })}>{displayValue(col,rowIndex,colIndex)}</div>
	                <div className={clsx({
                              'Table-row-item': true,
                              minValue: col.minMax=='min'?true:false,
                              maxValue: col.minMax=='max'?true:false,
                            })}>{col.text}</div>
	              ))}
	            </div>
	          ))}
	        </div>
	      </div>

    </Scrollbars>
  );
};
// export default memo(TableView);
export default TableView;
