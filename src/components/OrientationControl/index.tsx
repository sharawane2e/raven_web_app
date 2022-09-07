import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PortraitIcon } from "../../assets/svg/portrait-icon.svg";
import { ReactComponent as LandscapeIcon } from "../../assets/svg/landscape-icon.svg";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setChartOrientation } from "../../redux/actions/chartActions";
import store from "../../redux/store";
import { getChartOptions } from "../../utils/ChartOptionFormatter";
import { setChartData } from "../../redux/actions/chartActions";
import Toaster from "../../utils/Toaster";
import { StaticText } from "../../constants/StaticText";
import { ChartType } from "../../enums/ChartType";

interface OrientationControlProps {}

const OrientationControl: React.FC<OrientationControlProps> = () => {
  const { chartOrientation, questionData } = useSelector(
    (state: RootState) => state.chart
  );
  const { chart } = store.getState();
  const dispatch: AppDispatch = useDispatch();

  const changeOrientation = (orientation: ChartOrientation) => {
    dispatch(setChartOrientation(orientation));
    const { chart } = store.getState();
    const chartDataClone = JSON.parse(JSON.stringify(chart));
    dispatch(setChartData(chartDataClone));
    dispatch(setChartOrientation(orientation));
    chartDataClone.chartOptions = {
      ...chart.chartOptions,
      ...getChartOptions(),
    };
    dispatch(setChartData(chartDataClone));
  };

  // const handlePieDisabled = () => {
  //   let isOrientation = true;
  //   if (chart?.chartType == ChartType.TABLE) {
  //     isOrientation = false;
  //   } else if (chart?.chartType == ChartType.LINE) {
  //     isOrientation = false;
  //   }

  //   return isOrientation;
  // };
  //console.log("handlePieDisabled", handlePieDisabled);

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
      disabled:
        questionData === null ||
        (chart?.chartType == ChartType.TABLE ? true : false) ||
        (chart?.chartType == ChartType.LINE ? true : false),
      disableClick: () => Toaster.error(StaticText?.DISABLED_CHART_LAND),
    },
  ];
  return (
    <ButtonGroup
      groupTitle=""
      buttonConfig={buttonConfig}
      className="Step-5 orientation-control"
    />
  );
};

export default OrientationControl;
