import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { transposeChart } from "../../services/ChartService";
import { QuestionType } from "../../enums/QuestionType";
import { ReactComponent as TableIcon } from "../../assets/svg/table-icon.svg";
import Toaster from "../../utils/Toaster";
import { StaticText } from "../../constants/StaticText";

interface ChartDataLabelControlProps {}

const ChartOptionsControl: React.FC<ChartDataLabelControlProps> = () => {
  const { chart } = useSelector((state: RootState) => state);

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
