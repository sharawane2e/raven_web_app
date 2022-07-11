import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { memo, useEffect, useState } from "react";
import { tableChartDataGen } from "../../utils/export-helper-utils/TableUtils";
import { Scrollbars } from "react-custom-scrollbars";
import clsx from "clsx";
import { QuestionType } from "../../enums/QuestionType";
import { ChartLabelType } from "../../enums/ChartLabelType";

interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {
  const [tableData, setTableData] = useState<any>([]);

  //console.log(tableData);

  const {
    chartData,
    showMean,
    questionData,
    chartTranspose,
    significant,
    chartLabelType,
  } = useSelector((state: RootState) => state?.chart);

  const isEqual = (val1: any, val2: any) => val1 === val2;

  let scaleLength: any = "";
  let filtered: any;
  let results: any;
  let QuestionData: any;
  let removeSubGrop: any;
  let singleGroupNet: any;

  useEffect(() => {
    setTableData(tableChartDataGen());
  }, [chartData, showMean, significant]);

  if (questionData?.isGroupNet && questionData?.type === QuestionType.SINGLE) {
    QuestionData = 0;
    singleGroupNet = questionData?.groupNetData?.length;
  } else {
    QuestionData = questionData?.groupNetData;
    //console.log(QuestionData);

    filtered = QuestionData?.filter(function (el: any) {
      return el !== "";
    });

    scaleLength = filtered?.length > 1 ? filtered?.length : 0;

    results = questionData?.options.filter(function (option) {
      if (option?.labelCode === "N") {
        if (option?.labelCode.split("_")[0] == "N") {
          return true;
        }
      }
    });
  }

  let laberesult = results?.length === undefined ? 0 : results?.length;
  // console.log(laberesult);

  if (chartTranspose) {
    // console.log('ssssss');
    removeSubGrop = tableData?.rows?.length - scaleLength - 1;
  }
  if (laberesult > 0) {
    //console.log('sssdddd');
    removeSubGrop = tableData?.rows?.length - laberesult;
  } else {
    const singleGroupNetData =
      singleGroupNet === undefined ? 0 : singleGroupNet;
    removeSubGrop = tableData?.rows?.length - singleGroupNetData - 1;
  }
  // console.log(removeSubGrop);

  /*This code used for single grid data column hide and show highlights  */
  //  else {
  //   tableData?.rows?.map((rows: any) => {
  //     dataValue = rows.length;
  //   });
  //   removeSubGrop = dataValue - scaleLength - 1;
  // }

  const highLight = (col: any, currentMax: any, currentMin: any) => {
    // const charColNumber =
    //   typeof col == "string"
    //     ? col.split("|")[0]
    //     : Number(col.toString().split("|")[0]);
    const splitCol =
      chartLabelType == ChartLabelType.PERCENTAGE
        ? col.toString().split("|")[0]
        : Number(col.toString().split("|")[0]);
    const splitCol2 = col.toString().split("|")[1];

    return (
      <>
        {significant ? (
          <>
            <div className="Table-row-item">
              <span
                className={clsx({
                  "Table-col": true,
                  maxValue: isEqual(splitCol, currentMin),
                  minValue: isEqual(splitCol, currentMax),
                })}
              >
                {splitCol}
              </span>
              <span className="significante-color">{splitCol2}</span>
            </div>
          </>
        ) : (
          //  <div className="Table-row-item">
          <div
            className={clsx({
              "Table-row-item": true,
              maxValue: isEqual(col, currentMin),
              minValue: isEqual(col, currentMax),
            })}
          >
            {col}
          </div>
        )}
      </>
    );
  };

  const tableColumn = (
    rowIndex: any,
    columnIndex: any,
    col: any,
    currentMin: any,
    currentMax: any
  ) => {
    // console.log('col2', col2);
    // const splitCol = col.toString().split("|")[0];
    // const splitCol2 = col.toString().split("|")[1];
    const rowcount =
      removeSubGrop === undefined ? 0 : removeSubGrop - laberesult;

    if (
      laberesult > 0 &&
      questionData?.isGroupNet &&
      questionData?.type === QuestionType.GRID
    ) {
      return !chartTranspose ? (
        rowIndex > removeSubGrop - rowcount &&
        rowIndex < removeSubGrop + (laberesult - singleGroupNet) ? (
          highLight(col, currentMin, currentMax)
        ) : !removeSubGrop ? (
          highLight(col, currentMin, currentMax)
        ) : (
          <div className="Table-row-item">
            {col}
            <span className="significante-color"> {col}</span>
          </div>
        )
      ) : (
        <></>
      );
    } else {
      if (
        chartTranspose &&
        questionData?.isGroupNet &&
        questionData?.type === QuestionType.SINGLE &&
        rowIndex < removeSubGrop - (laberesult - singleGroupNet)
      ) {
        return highLight(col, currentMin, currentMax);
      } else {
        if (chartTranspose) {
          if (showMean) {
            return highLight(col, currentMin, currentMax);
          } else {
            return chartTranspose ? (
              rowIndex < removeSubGrop && !showMean ? (
                highLight(col, currentMin, currentMax)
              ) : !removeSubGrop && !showMean ? (
                highLight(col, currentMin, currentMax)
              ) : (
                <div className="Table-row-item">
                  {" "}
                  {col}
                  <span className="significante-color"> {col}</span>
                </div>
              )
            ) : columnIndex && tableData?.rows?.length > 3 ? (
              highLight(col, currentMin, currentMax)
            ) : !removeSubGrop && tableData?.rows?.length > 3 ? (
              highLight(col, currentMin, currentMax)
            ) : (
              <div className="Table-row-item">
                {" "}
                {col}
                <span className="significante-color"> {col}</span>
              </div>
            );
          }
        } else {
          // console.log('demo ffj', col, currentMin, currentMax);
          return highLight(col, currentMin, currentMax);
          // return !chartTranspose ? (
          //   rowIndex < removeSubGrop && !showMean ? (
          //     highLight(col, currentMin, currentMax)
          //   ) : !removeSubGrop && !showMean ? (
          //     highLight(col, currentMin, currentMax)
          //   ) : (
          //     <div className="Table-row-item">  {col}</div>
          //   )
          // ) : columnIndex && tableData?.rows?.length > 3 ? (
          //   highLight(col, currentMin, currentMax)
          // ) : !removeSubGrop && tableData?.rows?.length > 3 ? (
          //   highLight(col, currentMin, currentMax)
          // ) : (
          //   <div className="Table-row-item">   {col}</div>
          // );
        }
        //return highLight(col, currentMin, currentMax);
      }
    }
  };

  return (
    <Scrollbars>
      <div className="tableView">
        <div className="TableView">
          {/* {console.log(tableData.rows)} */}
          {tableData.rows?.map((row: any, rowIndex: any) => (
            <div className="Table-row">
              {row.map((col: any, colIndex: number) => {
                //console.log("col", col);
                const [maxVal, minVal] = tableData?.minmax[0];
                const currentMin = minVal[colIndex - 1];
                const currentMax = maxVal[colIndex - 1];
                //const col1 = col?;
                // console.log(currentMax);
                // console.log(currentMin);
                return (
                  <>
                    {tableColumn(
                      rowIndex,
                      colIndex,
                      col,
                      currentMax,
                      currentMin
                    )}
                  </>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </Scrollbars>
  );
};
export default memo(TableView);
