import React, { ReactElement } from 'react';
import ButtonGroup, { ButtonGroupConfig } from '../widgets/ButtonGroup';
import { ReactComponent as PortraitIcon } from '../../assets/svg/portrait-icon.svg';
import { ReactComponent as LandscapeIcon } from '../../assets/svg/landscape-icon.svg';
import { ReactComponent as NumberIcon } from '../../assets/svg/Number.svg';
import { ReactComponent as PercentageIcon } from '../../assets/svg/Percentage.svg';
import { ChartLabelType } from '../../enums/ChartLabelType';
import store from '../../redux/store';
import { setChartData, setChartLabel } from '../../redux/actions/chartActions';
import {
  getChartOptions,
  getPlotOptions,
} from '../../utils/ChartOptionFormatter';
import Toaster from '../../utils/Toaster';
import { StaticText } from '../../constants/StaticText';

interface LabelTypeControlProps {}

const LabelTypeControl: React.FC<LabelTypeControlProps> = () => {
  const { chart } = store.getState();
  const { dispatch } = store;

  const changeChartLabelType = (labelType: ChartLabelType) => {
    const chartDataClone = JSON.parse(JSON.stringify(chart));
    chartDataClone.chartLabelType = labelType;
    dispatch(setChartLabel(labelType));
    chartDataClone.chartOptions = {
      ...chart.chartOptions,
      ...getChartOptions(),
      plotOptions: getPlotOptions(),
    };
    dispatch(setChartData(chartDataClone));
  };

  const buttonConfig: ButtonGroupConfig[] = [
    {
      tooltip: 'Percentage',
      renderChild: () => <PercentageIcon />,
      onClick: () => {
        changeChartLabelType(ChartLabelType.PERCENTAGE);
      },
      active: chart.chartLabelType === ChartLabelType.PERCENTAGE,
      disabled: chart.questionData === null || chart?.meanHideshow,
      disableClick: () => Toaster.error(StaticText.DISABLED_CHART),
    },
    {
      tooltip: 'Number',
      renderChild: () => <NumberIcon />,
      onClick: () => {
        changeChartLabelType(ChartLabelType.NUMBER);
      },
      active: chart.chartLabelType === ChartLabelType.NUMBER,
      disabled: chart.questionData === null,
      disableClick: () => Toaster.error(StaticText.DISABLED_CHART),
    },
  ];

  return (
    <ButtonGroup
      // groupTitle='Label type'
      groupTitle=""
      buttonConfig={buttonConfig}
      className="Step-5 label-type-control"
    />
  );
};

export default LabelTypeControl;
