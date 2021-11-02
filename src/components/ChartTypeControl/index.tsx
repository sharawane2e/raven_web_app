import { useSelector } from "react-redux";
import { ChartType } from "../../enums/ChartType";
import { RootState } from "../../redux/store";
import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as ColumnChartIcon } from "../../assets/svg/column-chart-icon.svg";
import { ReactComponent as StackChartIcon } from "../../assets/svg/stack-chart-icon.svg";
import { ReactComponent as TableIcon } from "../../assets/svg/table-icon.svg";
import { ReactComponent as PieChartIcon } from "../../assets/svg/pie-chart.svg";
import { QuestionType } from "../../enums/QuestionType";
import { changeChartType } from "../../services/ChartService";

interface ChartTypeControlProps {}

const ChartTypeControl: React.FC<ChartTypeControlProps> = () => {
  const {
    chart,
    questions: { selectedBannerQuestionId },
  } = useSelector((state: RootState) => state);
  const { chartType } = chart;

  const buttonConfig: ButtonGroupConfig[] = [
    {
      tooltip: "Column chart",
      renderChild: () => <ColumnChartIcon />,
      onClick: () => changeChartType(ChartType.COLUMN),
      active: chartType === ChartType.COLUMN,
      disabled: chart.questionData === null,
    },
    {
      tooltip: "Stack chart",
      renderChild: () => <StackChartIcon />,
      onClick: () => changeChartType(ChartType.STACK),
      active: chartType === ChartType.STACK,
      disabled: chart.questionData === null,
    },
    {
      tooltip: "Pie Chart",
      renderChild: () => <PieChartIcon />,
      onClick: () => changeChartType(ChartType.PIE),
      active: chartType === ChartType.PIE,
      disabled:
        !(chart.questionData?.type === QuestionType.SINGLE) ||
        !!selectedBannerQuestionId,
    },
    {
      tooltip: "Table",
      renderChild: () => <TableIcon />,
      onClick: () => changeChartType(ChartType.TABLE),
      active: chartType === ChartType.TABLE,
      disabled: chart.questionData === null,
    },
  ];

  return (
    <ButtonGroup
      groupTitle="Chart type"
      buttonConfig={buttonConfig}
      className=" Step-6"
    />
  );
};

export default ChartTypeControl;
