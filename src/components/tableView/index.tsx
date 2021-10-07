import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { memo } from "react";

interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {
    const {
    chart: { chartData, questionData, baseCount},
    } = useSelector((state: RootState) => state);
    console.log(chartData, questionData, baseCount)

  return (
    <div>Table View</div>
  );
};

export default memo(TableView);
