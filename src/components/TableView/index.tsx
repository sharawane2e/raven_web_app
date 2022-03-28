import { useSelector } from 'react-redux';
import store, { RootState } from '../../redux/store';
import { memo, useEffect, useState } from 'react';
import { tableChartDataGen } from '../../utils/export-helper-utils/TableUtils';
import { Scrollbars } from 'react-custom-scrollbars';
import { number } from 'yup';
import clsx from 'clsx';
import { ChartOrientation } from '../../enums/ChartOrientation';
import { ChartLabelType } from '../../enums/ChartLabelType';

interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {
  const [tableData, setTableData] = useState<any>([]);

  const { chart } = store.getState();
  const { chartData } = useSelector((state: RootState) => state.chart);

  console.log(chartData);

  const tranposedTableData: any[] = [];
  const tranposedTableDataMin: any[] = [];
  const totalFinalVal: any = [];

  if (tableData.length != 0) {
    tableData[0].map((item: any, index: number) => {
      const parentIndex = index;

      const updateRow: any[] = [];
      const totalColumn: any[] = [];
      let totalColumnVal = 0;
      tableData.map((row: any, rowIndex: number) => {
        if (rowIndex != 0) {
          //let totalColumnVal=0;
          if (row[parentIndex].toString().indexOf('%') != -1) {
            let cnvCell: any = row[parentIndex].split('%')[0];
            updateRow.push(cnvCell);

            if (row[parentIndex] != 0) {
              totalColumnVal += parseFloat(cnvCell);
            }
            //console.log(totalColumnVal + cnvCell);
          } else {
            let cnvCell: any = row[parentIndex];
            updateRow.push(cnvCell);
            if (row[parentIndex] != 0) {
              totalColumnVal += parseFloat(cnvCell);
            }
            //console.log(cnvCell)
          }
          //console.log(totalColumnVal)
          //console.log(totalColumnVal)
          //totalColumn[parentIndex]=(totalColumnVal)
        }
      });

      tranposedTableData.push(Math.max(...updateRow));
      tranposedTableDataMin.push(Math.min(...updateRow));

      //if(parentIndex !=0){
      totalFinalVal.push(totalColumnVal);
      //}
      //console.log(totalFinalVal)
    });

    //console.log(totalFinalVal)
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
              {row.map((col: any, colIndex: number) => {
                let colSplitVal: any = '';
                if (col != 0) {
                  if (row.toString().indexOf('%') != -1) {
                    colSplitVal = col.split('%')[0];
                  } else {
                    colSplitVal = col;
                  }
                }
                return (
                  <>
                    {chart.chartLabelType === ChartLabelType.PERCENTAGE ? (
                      <div
                        className={clsx({
                          'Table-row-item': true,
                          maxValue: tranposedTableData[colIndex] == colSplitVal,
                          minValue:
                            tranposedTableDataMin[colIndex] == colSplitVal,
                        })}
                      >
                        {col}
                      </div>
                    ) : (
                      <>
                        <div
                          className={clsx({
                            'Table-row-item': true,
                            maxValue:
                              tranposedTableData[colIndex] == colSplitVal,
                            minValue:
                              tranposedTableDataMin[colIndex] == colSplitVal,
                          })}
                        >
                          {col}
                        </div>
                      </>
                    )}
                  </>
                );
              })}
            </div>
          ))}
        </div>
        <div className="TableView topset">
          <div className="Table-row">
            {totalFinalVal.map((col: any, colIndex: number) => {
              let finalcol = 'Total';
              if (colIndex == 0) {
                finalcol = 'Total';
              } else if (chart.chartLabelType === ChartLabelType.PERCENTAGE) {
                finalcol = parseFloat(col.toFixed(1)) + '%';
              } else {
                finalcol = parseFloat(col.toFixed(1)).toString();
              }

              return (
                <>
                  {chart.chartLabelType === ChartLabelType.PERCENTAGE ? (
                    <div className="Table-row-item totalBold">{finalcol}</div>
                  ) : (
                    <>
                      <div className="Table-row-item totalBold">{finalcol}</div>
                    </>
                  )}
                </>
              );
            })}
          </div>
        </div>
      </div>
    </Scrollbars>
  );
};

export default memo(TableView);
