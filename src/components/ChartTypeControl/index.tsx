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
import Toaster from "../../utils/Toaster";
import { StaticText } from "../../constants/StaticText";

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
      disableClick: () => Toaster.error(StaticText.DISABLED_CHART),
    },
    {
      tooltip: "Stack chart",
      renderChild: () => <StackChartIcon />,
      onClick: () => changeChartType(ChartType.STACK),
      active: chartType === ChartType.STACK,
      disabled: chart.questionData === null,
      disableClick: () => Toaster.error(StaticText.DISABLED_CHART),
    },
    {
      tooltip: "Pie Chart",
      renderChild: () => <PieChartIcon />,
      onClick: () => changeChartType(ChartType.PIE),
      active: chartType === ChartType.PIE,
      disabled:
        !(chart.questionData?.type === QuestionType.SINGLE) ||
        !!selectedBannerQuestionId,
      disableClick: () => {
        if (!(chart.questionData?.type === QuestionType.SINGLE)) {
          return Toaster.error(StaticText.DISABLED_CHART);
        } else if (!!selectedBannerQuestionId) {
          Toaster.error(StaticText.PIE_NOT_AVAILABLE);
        }
      },
    },
    {
      tooltip: "Table",
      renderChild: () => <TableIcon />,
      onClick: () => changeChartType(ChartType.TABLE),
      active: chartType === ChartType.TABLE,
      disabled: chart.questionData === null,
      disableClick: () => Toaster.error(StaticText.DISABLED_CHART),
    },
  ];

  return (
    <ButtonGroup
      groupTitle="Chart type"
      buttonConfig={buttonConfig}
      className=" Step-6 chartTyle__option"
    />
  );
};

export default ChartTypeControl;
