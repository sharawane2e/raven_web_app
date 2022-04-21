import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { memo, useEffect, useState } from 'react';
import { tableChartDataGen } from '../../utils/export-helper-utils/TableUtils';
import { Scrollbars } from 'react-custom-scrollbars';
import clsx from 'clsx';

interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {
  const [tableData, setTableData] = useState<any>([]);

  const { chartData, showMean, questionData, chartTranspose } = useSelector(
    (state: RootState) => state.chart,
  );

  const isEqual = (val1: any, val2: any) => val1 === val2;
  let scaleLength: any = '';
  let columnIndex: any;

  useEffect(() => {
    setTableData(tableChartDataGen());
  }, [chartData, showMean]);
  if (questionData?.groupNetData) {
    scaleLength = questionData?.groupNetData.length;
  }

  let removeSubGrop: any;

  if (chartTranspose) {
    removeSubGrop = tableData?.rows?.length - scaleLength - 1;
  }
  /*This code used for single grid data column hide and show highlights  */
  //  else {
  //   tableData?.rows?.map((rows: any) => {
  //     dataValue = rows.length;
  //   });
  //   removeSubGrop = dataValue - scaleLength - 1;
  // }

  const tableColumn = (
    rowIndex: any,
    columnIndex: any,
    col: any,
    currentMin: any,
    currentMax: any,
  ) => {
    return chartTranspose ? (
      rowIndex < removeSubGrop && !showMean ? (
        <div
          className={clsx({
            'Table-row-item': true,
            maxValue: isEqual(col, currentMax),
            minValue: isEqual(col, currentMin),
          })}
        >
          {col}
        </div>
      ) : !removeSubGrop && !showMean ? (
        <div
          className={clsx({
            'Table-row-item': true,
            maxValue: isEqual(col, currentMax),
            minValue: isEqual(col, currentMin),
          })}
        >
          {col}
        </div>
      ) : (
        <div className="Table-row-item"> {col}</div>
      )
    ) : columnIndex && tableData.rows.length > 3 ? (
      <div
        className={clsx({
          'Table-row-item': true,
          maxValue: isEqual(col, currentMax),
          minValue: isEqual(col, currentMin),
        })}
      >
        {col}
      </div>
    ) : !removeSubGrop && tableData.rows.length > 3 ? (
      <div
        className={clsx({
          'Table-row-item': true,
          maxValue: isEqual(col, currentMax),
          minValue: isEqual(col, currentMin),
        })}
      >
        {col}
      </div>
    ) : (
      <div className="Table-row-item"> {col}</div>
    );
  };

  return (
    <Scrollbars>
      <div className="tableView">
        <div className="TableView">
          {tableData.rows?.map((row: any, rowIndex: any) => (
            <div className="Table-row">
              {row.map((col: any, colIndex: number) => {
                const [maxVal, minVal] = tableData.minmax[0];
                const currentMax = maxVal?.[colIndex - 1];
                const currentMin = minVal?.[colIndex - 1];
                columnIndex = col;
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
