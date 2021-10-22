import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { memo, useEffect, useState } from "react";
import { tableChartDataGen } from "../../utils/ExportHelperUtils";

interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {
  const [tableData, setTableData] = useState<any>([]);
  const { chartData } = useSelector((state: RootState) => state.chart);

  useEffect(() => {
    console.log(chartData);

    setTableData(tableChartDataGen());
  }, [chartData]);

  return (
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
  );
};

export default memo(TableView);
