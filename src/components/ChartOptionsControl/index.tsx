import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PortraitIcon } from "../../assets/svg/portrait-icon.svg";
import { ReactComponent as LandscapeIcon } from "../../assets/svg/landscape-icon.svg";
import { ChartDataLabels } from "../../enums/ChartDataLabels";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { changeChartOperations } from "../../services/ChartService";
import { changeChartType, transposeChart } from "../../services/ChartService";
import { QuestionType } from "../../enums/QuestionType";
import { ReactComponent as TableIcon } from "../../assets/svg/table-icon.svg";
import Toaster from "../../utils/Toaster";
import { StaticText } from "../../constants/StaticText";

interface ChartDataLabelControlProps {}

const ChartOptionsControl: React.FC<ChartDataLabelControlProps> = () => {
  const { chart } = useSelector((state: RootState) => state);
  const { chartOperations } = chart;

  const dispatch: AppDispatch = useDispatch();

  const buttonConfig: ButtonGroupConfig[] = [
    {
      tooltip: "Transpose",
      renderChild: () => <TableIcon />,
      onClick: () => transposeChart(),
      active: true,
      disabled:
        (chart.questionData?.type === QuestionType.SINGLE &&
          !chart.bannerQuestionData) ||
        (chart.questionData?.type === QuestionType.MULTI &&
          !chart.bannerQuestionData) ||
        chart.questionData === null,
      disableClick: () => Toaster.error(StaticText.DISABLED_CHART_TRANS),
    },
    {
      tooltip: "Percentage",
      renderChild: () => <PortraitIcon />,
      onClick: () => {
        changeChartOperations({...chartOperations,labelFormat:ChartDataLabels.PERCENTAGE})
      },
      active:chart.chartOperations.labelFormat===ChartDataLabels.PERCENTAGE
    },
    {
      tooltip: "Number",
      renderChild: () => <LandscapeIcon />,
      onClick: () => {
        changeChartOperations({...chartOperations,labelFormat:ChartDataLabels.NUMBER})
      },
      active:chart.chartOperations.labelFormat===ChartDataLabels.NUMBER
    },
  ];

  return (
    <ButtonGroup
      groupTitle="Data Label"
      buttonConfig={buttonConfig}
      className="Step-5 orientation-control"
    />
  );
};

export default ChartOptionsControl;
