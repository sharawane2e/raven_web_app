import { useSelector } from "react-redux";
import { ChartType } from "../../enums/ChartType";
import { RootState } from "../../redux/store";
import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as ColumnChartIcon } from "../../assets/svg/column-chart-icon.svg";
import { ReactComponent as StackChartIcon } from "../../assets/svg/stack-chart-icon.svg";

interface ChartTypeControlProps {}

const ChartTypeControl: React.FC<ChartTypeControlProps> = () => {
  const { chartType } = useSelector((state: RootState) => state.chart);
  const changeChartType = (chartTYpe: ChartType) => {};
  const buttonConfig: ButtonGroupConfig[] = [
    {
      renderChild: () => <ColumnChartIcon />,
      onClick: () => changeChartType(ChartType.COLUMN),
      active: chartType === ChartType.COLUMN,
    },
    {
      renderChild: () => <StackChartIcon />,
      onClick: () => changeChartType(ChartType.STACK),
      active: chartType === ChartType.STACK,
    },
  ];

  return <ButtonGroup groupTitle="Chart type" buttonConfig={buttonConfig} />;
};

export default ChartTypeControl;
