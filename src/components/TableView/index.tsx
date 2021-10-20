import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { memo } from "react";
import { QuestionType } from "../../enums/QuestionType";
import {
  bannerChartDataGen,
  gridChartDataGen,
  singleChartDataGen,
  tableChartDataGen,
} from "../../utils/PptDataGenerator";

interface TableProps {}

const TableView: React.FC<TableProps> = (props) => {
  const {
    chart: { chartData, questionData, baseCount },
    questions: { selectedBannerQuestionId, bannerQuestionList },
  } = useSelector((state: RootState) => state);
  console.log(chartData, questionData, baseCount);

  let seriesData: any[] = [];

  if (
    (questionData?.type === QuestionType.SINGLE ||
      questionData?.type === QuestionType.MULTI) &&
    !selectedBannerQuestionId
  ) {
    seriesData = singleChartDataGen(questionData, chartData, baseCount);
  } else if (
    (questionData?.type === QuestionType.GRID ||
      questionData?.type === QuestionType.GRID_MULTI ||
      questionData?.type === QuestionType.RANK) &&
    !selectedBannerQuestionId
  ) {
    seriesData = gridChartDataGen(questionData, chartData, baseCount);
  } else if (selectedBannerQuestionId) {
    seriesData = bannerChartDataGen(
      bannerQuestionList,

      questionData,

      chartData,

      selectedBannerQuestionId
    );
  } else {
    console.log("under development");
  }

  let tableData = tableChartDataGen(seriesData, baseCount);
  console.log(tableData);

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
