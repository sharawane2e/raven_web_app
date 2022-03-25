import { useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { memo, useEffect, useState } from 'react';
import { tableChartDataGen } from '../../utils/export-helper-utils/TableUtils';
import { Scrollbars } from 'react-custom-scrollbars';

interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {
  const [tableData, setTableData] = useState<any>([]);
  const { chartData } = useSelector((state: RootState) => state.chart);

  useEffect(() => {
    setTableData(tableChartDataGen());
  }, [chartData]);

  return (
    <Scrollbars>
      <div className="tableView">
        <div className="TableView">
          {tableData.map((row: any) => (
            <div className="Table-row">
              {row.map((col: any) => (
                <div className="Table-row-item">{col}</div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </Scrollbars>
  );
};

export default memo(TableView);
// hello
