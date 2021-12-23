import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PortraitIcon } from "../../assets/svg/portrait-icon.svg";
import { ReactComponent as LandscapeIcon } from "../../assets/svg/landscape-icon.svg";
import { ChartDataLabels } from "../../enums/ChartDataLabels";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
// import { setChartOperations } from "../../redux/actions/chartActions";
import { changeChartOperations } from "../../services/ChartService";
import { changeChartType, transposeChart } from "../../services/ChartService";
import { QuestionType } from "../../enums/QuestionType";
import { ReactComponent as TransposeIcon } from "../../assets/svg/Transpose.svg";
import Toaster from "../../utils/Toaster";
import { StaticText } from "../../constants/StaticText";

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
      groupTitle="Transpose"
      buttonConfig={buttonConfig}
      className=""
    />
  );
};

export default ChartTransposeControl;
