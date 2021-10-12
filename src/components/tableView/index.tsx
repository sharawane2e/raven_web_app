import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { memo } from "react";
import { QuestionType } from "../../enums/QuestionType";
import {
  gridChartDataGen,
  singleChartDataGen,
  tableChartDataGen,
} from "../../utils/PptDataGenerator";
import { Grid } from "@material-ui/core";
interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {
  const {
    chart: { chartData, questionData, baseCount },
  } = useSelector((state: RootState) => state);
  console.log(chartData, questionData, baseCount);

  let seriesData: any[] = [];

  if (
    questionData?.type === QuestionType.SINGLE ||
    questionData?.type === QuestionType.RANK ||
    questionData?.type === QuestionType.MULTI
  ) {
    seriesData = singleChartDataGen(questionData, chartData, baseCount);
  } else if (
    questionData?.type === QuestionType.GRID ||
    questionData?.type === QuestionType.GRID_MULTI
  ) {
    seriesData = gridChartDataGen(questionData, chartData, baseCount);
  } else {
    console.log("under development");
  }

  let tableData = tableChartDataGen(seriesData);
  console.log(tableData);

  return (
    <div className="table-chart">
      {tableData.map((row) => (
        <Grid
          container
          justifyContent="space-evenly"
          style={{ border: "1px solid grey" }}
          className="table-chart__row"
          sm={12}
        >
          {row.map((col) => (
            <Grid item className="table-chart__item" wrap="wrap" sm={1}>
              {col}
            </Grid>
          ))}
        </Grid>
      ))}
    </div>
  );
};

export default memo(TableView);
