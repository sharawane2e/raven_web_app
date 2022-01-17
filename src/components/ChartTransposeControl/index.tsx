import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PortraitIcon } from "../../assets/svg/portrait-icon.svg";
import { ReactComponent as LandscapeIcon } from "../../assets/svg/landscape-icon.svg";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { changeChartType, transposeChart } from "../../services/ChartService";
import { QuestionType } from "../../enums/QuestionType";
import { ReactComponent as TransposeIcon } from "../../assets/svg/Transpose.svg";
import Toaster from "../../utils/Toaster";
import { StaticText } from "../../constants/StaticText";
import store from "../../redux/store";

interface ChartTransposeControlProps {}

const ChartTransposeControl: React.FC<ChartTransposeControlProps> = () => {
  const { chart } = useSelector((state: RootState) => state);
  const { chartOperations } = chart;

  const dispatch: AppDispatch = useDispatch();

  const buttonConfig: ButtonGroupConfig[] = [
   
    {
        tooltip: "Transpose",
        renderChild: () => <TransposeIcon />,
        onClick: () => transposeChart(),
        active: chartOperations.transposed,
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
      groupTitle=""
      buttonConfig={buttonConfig}
      className="transpose"
    />
  );
};

export default ChartTransposeControl;
