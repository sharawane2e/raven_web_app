import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { memo, useEffect, useState } from 'react';
import { tableChartDataGen } from '../../utils/export-helper-utils/TableUtils';
import { Scrollbars } from 'react-custom-scrollbars';
import clsx from 'clsx';

interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {
  const [tableData, setTableData] = useState<any>([]);

  const { chartData, showMean } = useSelector(
    (state: RootState) => state.chart,
  );

  const isEqual = (val1: any, val2: any) => val1 === val2;

  useEffect(() => {
    setTableData(tableChartDataGen());
  }, [chartData, showMean]);

  return (
    <Scrollbars>
      <div className="tableView">
        <div className="TableView">
          {tableData.rows?.map((row: any, index: any) => (
            <div className="Table-row">
              {row.map((col: any, colIndex: number) => {
                const [maxVal, minVal] = tableData.minmax[0];
                const currentMax = maxVal?.[colIndex - 1];
                const currentMin = minVal?.[colIndex - 1];

                return (
                  <>
                    <div
                      className={clsx({
                        'Table-row-item': true,
                        maxValue: isEqual(col, currentMax),
                        minValue: isEqual(col, currentMin),
                      })}
                    >
                      {col}
                    </div>
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
