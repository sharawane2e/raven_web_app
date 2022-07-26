import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { memo, useEffect, useState } from "react";
import { tableChartDataGen } from "../../utils/export-helper-utils/TableUtils";
import { Scrollbars } from "react-custom-scrollbars";
import clsx from "clsx";
import { QuestionType } from "../../enums/QuestionType";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { getChartOptions } from "../../utils/ChartOptionFormatter";
import { singleTable } from "../../utils/table-option-util/singleTable";

interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {
  const getChartData = getChartOptions();
  const { chartRows, minMaxArr } = singleTable(getChartData.series);
  const tableTransformedData = chartRows;
  console.log(getChartData);
  console.log(tableTransformedData);
  // const [tableData, setTableData] = useState<any>([]);

  console.log("tableTransformedData", minMaxArr);

  return (
    <Scrollbars>
      <div className="tableView">
        <div className="TableView">
          {tableTransformedData.map((row: any) => (
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
// export default memo(TableView);
export default TableView;
