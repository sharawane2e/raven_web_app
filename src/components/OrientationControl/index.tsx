import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PortraitIcon } from "../../assets/svg/portrait-icon.svg";
import { ReactComponent as LandscapeIcon } from "../../assets/svg/landscape-icon.svg";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setChartOrientation } from "../../redux/actions/chartActions";
import store from "../../redux/store";
import { getChartOptions, getPlotOptions } from "../../utils/ChartOptionFormatter";
import { setChartData } from "../../redux/actions/chartActions";

interface OrientationControlProps {}

const OrientationControl: React.FC<OrientationControlProps> = () => {
  const { chartOrientation, questionData } = useSelector(
    (state: RootState) => state.chart
  );
  const dispatch: AppDispatch = useDispatch();

  const changeOrientation = (orientation: ChartOrientation) => {

    dispatch(setChartOrientation(orientation));
    const { chart } = store.getState();
    const chartDataClone = JSON.parse(JSON.stringify(chart));
    chartDataClone.chartOptions["plotOptions"] = getPlotOptions();
    dispatch(setChartData(chartDataClone));
  };
  const buttonConfig: ButtonGroupConfig[] = [
    {
      tooltip: "Portrait",
      renderChild: () => <PortraitIcon />,
      onClick: () => changeOrientation(ChartOrientation.PORTRAIT),
      active: chartOrientation === ChartOrientation.PORTRAIT,
      disabled: questionData === null,
    },
    {
      tooltip: "Landscape",
      renderChild: () => <LandscapeIcon />,
      onClick: () => changeOrientation(ChartOrientation.LANDSCAPE),
      active: chartOrientation === ChartOrientation.LANDSCAPE,
      disabled: questionData === null,
    },
  ];

  return (
    <ButtonGroup
      groupTitle="Orientation"
      buttonConfig={buttonConfig}
      className="Step-5 orientation-control"
    />
  );
};

export default OrientationControl;
