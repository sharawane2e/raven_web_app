import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PortraitIcon } from "../../assets/svg/portrait-icon.svg";
import { ReactComponent as LandscapeIcon } from "../../assets/svg/landscape-icon.svg";
import { ChartDataLabels } from "../../enums/ChartDataLabels";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setDataLabelFormat } from "../../redux/actions/chartActions";
import { changeDataLabelFormat } from "../../services/ChartService";
import { changeChartType, transposeChart } from "../../services/ChartService";
import { QuestionType } from "../../enums/QuestionType";
import { ReactComponent as TableIcon } from "../../assets/svg/table-icon.svg";
import Toaster from "../../utils/Toaster";
import { StaticText } from "../../constants/StaticText";

interface ChartDataLabelControlProps {}

const ChartOptionsControl: React.FC<ChartDataLabelControlProps> = () => {
  const { chart } = useSelector((state: RootState) => state);
  const { chartType } = chart;

  const dispatch: AppDispatch = useDispatch();

  const buttonConfig: ButtonGroupConfig[] = [
    {
      tooltip: "Transpose",
      renderChild: () => <TableIcon />,
      onClick: () => transposeChart(),
      active: true,
      disabled:
        chart.questionData === null ||
        chart.questionData.type === QuestionType.GRID_MULTI ||
        chart.questionData.type === QuestionType.MULTI,
      disableClick: () => Toaster.error(StaticText.DISABLED_CHART_TRANS),
    },
    {
      tooltip: "Percentage",
      renderChild: () => <PortraitIcon />,
      onClick: () => {
        const newChartOptions = changeDataLabelFormat(
          ChartDataLabels.PERCENTAGE
        );
        dispatch(setDataLabelFormat(newChartOptions));
      },
      active:
        chart.chartOptions.plotOptions.series.dataLabels.format ===
        ChartDataLabels.PERCENTAGE,
    },
    {
      tooltip: "Number",
      renderChild: () => <LandscapeIcon />,
      onClick: () => {
        const newChartOptions = changeDataLabelFormat(ChartDataLabels.NUMBER);
        dispatch(setDataLabelFormat(newChartOptions));
      },
      active:
        chart.chartOptions.plotOptions.series.dataLabels.format ===
        ChartDataLabels.NUMBER,
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
