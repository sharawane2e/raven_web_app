import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as PortraitIcon } from "../../assets/svg/portrait-icon.svg";
import { ReactComponent as LandscapeIcon } from "../../assets/svg/landscape-icon.svg";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store";
import { setChartOrientation } from "../../redux/actions/chartActions";

interface OrientationControlProps {}

const OrientationControl: React.FC<OrientationControlProps> = () => {
  const { chartOrientation } = useSelector((state: RootState) => state.chart);
  const dispatch: AppDispatch = useDispatch();

  const changeOrientation = (orientation: ChartOrientation) => {
    dispatch(setChartOrientation(orientation));
  };
  const buttonConfig: ButtonGroupConfig[] = [
    {
      renderChild: () => <PortraitIcon />,
      onClick: () => changeOrientation(ChartOrientation.PORTRAIT),
      active: chartOrientation === ChartOrientation.PORTRAIT,
    },
    {
      renderChild: () => <LandscapeIcon />,
      onClick: () => changeOrientation(ChartOrientation.LANDSCAPE),
      active: chartOrientation === ChartOrientation.LANDSCAPE,
    },
  ];

  return <ButtonGroup groupTitle="Orientation" buttonConfig={buttonConfig} />;
};

export default OrientationControl;
