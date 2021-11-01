import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PortraitIcon } from "../../assets/svg/portrait-icon.svg";
import { ReactComponent as LandscapeIcon } from "../../assets/svg/landscape-icon.svg";
import { ChartDataLabels } from "../../enums/ChartDataLabels";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setDataLabelFormat } from "../../redux/actions/chartActions";
import { changeDataLabelFormat } from "../../services/ChartService";

interface ChartDataLabelControlProps {}

const ChartOptionsControl: React.FC<ChartDataLabelControlProps> = () => {
  const { chartOptions } = useSelector((state: RootState) => state.chart);
  const dispatch: AppDispatch = useDispatch();

  // const changeDataLabelFormat = (chartDataLabel: ChartDataLabels) => {
  //   const newChartOptions = changeDataLabelFormat(ChartDataLabels.PERCENTAGE);
  //   dispatch(setDataLabelFormat(newChartOptions));
  // };

  const buttonConfig: ButtonGroupConfig[] = [
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
        chartOptions.plotOptions.series.dataLabels.format ===
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
        chartOptions.plotOptions.series.dataLabels.format ===
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
