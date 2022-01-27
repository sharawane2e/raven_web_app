import React from "react";
import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as FullScreenIcon } from "../../assets/svg/fullscreen_exit_line_icon.svg";
import store from "../../redux/store";
import Toaster from "../../utils/Toaster";
import { StaticText } from "../../constants/StaticText";
import { setChartFullScreen } from "../../redux/actions/chartActions";

interface ChartFullScreenProps {}

const ChartFullScreen: React.FC<ChartFullScreenProps> = () => {
    const {chart} = store.getState();
    const {dispatch} = store;
  const buttonConfig: ButtonGroupConfig[] = [
    {
      tooltip: "Full Screen",
      renderChild: () => <FullScreenIcon />,
      onClick: () => {dispatch(setChartFullScreen(true))},
      active: chart.chartfullScreen,
      disabled: chart.questionData === null,
      disableClick: () => Toaster.error(StaticText.DISABLED_CHART),
    },
  ];

  return (
    <ButtonGroup
      groupTitle=""
      buttonConfig={buttonConfig}
      className="full--screen"
    />
  );
};

export default ChartFullScreen;
