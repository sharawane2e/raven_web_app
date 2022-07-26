import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { memo, useEffect, useState } from 'react';
import { tableChartDataGen } from '../../utils/export-helper-utils/TableUtils';
import { Scrollbars } from 'react-custom-scrollbars';
import clsx from 'clsx';
import { QuestionType } from '../../enums/QuestionType';
import { ChartLabelType } from '../../enums/ChartLabelType';

interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {
  const [tableData, setTableData] = useState<any>([]);

  const {
    chartData,
    showMean,
    questionData,
    chartTranspose,
    significant,
    chartLabelType,
  } = useSelector((state: RootState) => state?.chart);

  const isEqual = (val1: any, val2: any) => val1 === val2;

  let scaleLength: any = '';
  let filtered: any;
  let results: any;
  let QuestionData: any;
  let removeSubGrop: any;
  let singleGroupNet: any;

  useEffect(() => {
    //setTableData(tableChartDataGen(seriesData));
  }, [chartData, showMean, significant]);

  if (questionData?.isGroupNet && questionData?.type === QuestionType.SINGLE) {
    QuestionData = 0;
    singleGroupNet = questionData?.groupNetData?.length;
  } else {
    QuestionData = questionData?.groupNetData;

    filtered = QuestionData?.filter(function (el: any) {
      return el !== '';
    });

    scaleLength = filtered?.length > 1 ? filtered?.length : 0;

    results = questionData?.options.filter(function (option) {
      if (option?.labelCode === 'N') {
        if (option?.labelCode.split('_')[0] == 'N') {
          return true;
        }
      }
    });
  }

  let laberesult = results?.length === undefined ? 0 : results?.length;

  if (chartTranspose) {
    removeSubGrop = tableData?.rows?.length - scaleLength - 1;
  }
  if (laberesult > 0) {
    removeSubGrop = tableData?.rows?.length - laberesult;
  } else {
    const singleGroupNetData =
      singleGroupNet === undefined ? 0 : singleGroupNet;
    removeSubGrop = tableData?.rows?.length - singleGroupNetData - 1;
  }

  /*This code used for single grid data column hide and show highlights  */
  //  else {
  //   tableData?.rows?.map((rows: any) => {
  //     dataValue = rows.length;
  //   });
  //   removeSubGrop = dataValue - scaleLength - 1;
  // }

  const highLight = (col: any, currentMax: any, currentMin: any) => {
    const splitCol = col.toString().split('|')[0];
    const splitCol2 = col.toString().split('|')[1];

    // console.log('splitCol2', splitCol2 == '()');

    const splicolNumber =
      chartLabelType == ChartLabelType.PERCENTAGE ? splitCol : Number(splitCol);

    return (
      <>
        <div
          className={clsx({
            'Table-row-item': true,
            maxValue: isEqual(splicolNumber, currentMin),
            minValue: isEqual(splicolNumber, currentMax),
          })}
        >
          {splitCol}
          {splitCol2 != undefined && splitCol2 != '()' ? (
            <span className="significante-color table-significante">
              {splitCol2}
            </span>
          ) : (
            ''
          )}
        </div>
      </>
    );
  };

  const tableColumn = (
    rowIndex: any,
    columnIndex: any,
    col: any,
    currentMin: any,
    currentMax: any,
  ) => {
    const splitCol = col.toString().split('|')[0];
    const splitCol2 = col.toString().split('|')[1];
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
            {splitCol}
            <span className="significante-color table-significante">
              {splitCol2}
            </span>
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
                  {splitCol}
                  <span className="significante-color table-significante">
                    {splitCol2}
                  </span>
                </div>
              )
            ) : columnIndex && tableData?.rows?.length > 3 ? (
              highLight(col, currentMin, currentMax)
            ) : !removeSubGrop && tableData?.rows?.length > 3 ? (
              highLight(col, currentMin, currentMax)
            ) : (
              <div className="Table-row-item">
                {splitCol}
                <span className="significante-color table-significante">
                  {splitCol2}
                </span>
              </div>
            );
          }
        } else {
          return highLight(col, currentMin, currentMax);
        }
      }
    }
  };

  return (
    <Scrollbars>
      <div className="tableView">
        <div className="TableView">
          {tableData.rows?.map((row: any, rowIndex: any) => (
            <div className="Table-row">
              {row.map((col: any, colIndex: number) => {
                const [maxVal, minVal] = tableData?.minmax[0];
                const currentMin = minVal[colIndex - 1];
                const currentMax = maxVal[colIndex - 1];

                return (
                  <>
                    {tableColumn(
                      rowIndex,
                      colIndex,
                      col,
                      currentMax,
                      currentMin,
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
