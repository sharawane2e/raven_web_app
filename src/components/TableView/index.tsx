import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { memo } from "react";
import { QuestionType } from "../../enums/QuestionType";
import {
  singleChartDataGen,
  gridChartDataGen,
  bannerChartDataGen,
  tableChartDataGen,
} from "../../utils/ExportHelperUtils";

interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {
  let tableData = tableChartDataGen();

  return (
    <div className="tableView">
      <div className="TableView">
        {tableData.map((row) => (
          <div className="Table-row">
            {row.map((col) => (
              <div className="Table-row-item">{col}</div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default memo(TableView);
