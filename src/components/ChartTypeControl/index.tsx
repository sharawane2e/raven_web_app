import { useDispatch, useSelector } from "react-redux";
import { ChartType } from "../../enums/ChartType";
import { AppDispatch, RootState } from "../../redux/store";
import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as ColumnChartIcon } from "../../assets/svg/column-chart-icon.svg";
import { ReactComponent as StackChartIcon } from "../../assets/svg/stack-chart-icon.svg";
import { setChartData } from "../../redux/actions/chartActions";

interface ChartTypeControlProps {}

const ChartTypeControl: React.FC<ChartTypeControlProps> = () => {
  const { chart } = useSelector((state: RootState) => state);
  const dispatch: AppDispatch = useDispatch();
  const { chartType } = chart;

  const changeChartType = (chartType: ChartType) => {
    const newChartData = JSON.parse(JSON.stringify(chart));
    newChartData.chartType = chartType;
    newChartData.chartOptions["plotOptions"] =
      chartType === ChartType.STACK
        ? {
            column: {
              stacking: "normal",
            },
          }
        : {
            bar: {
              stacking: "normal",
            },
          };

    dispatch(setChartData(newChartData));
  };
  const buttonConfig: ButtonGroupConfig[] = [
    {
      tooltip: "Column chart",
      renderChild: () => <ColumnChartIcon />,
      onClick: () => changeChartType(ChartType.COLUMN),
      active: chartType === ChartType.COLUMN,
    },
    {
      tooltip: "Stack chart",
      renderChild: () => <StackChartIcon />,
      onClick: () => changeChartType(ChartType.STACK),
      active: chartType === ChartType.STACK,
    },
  ];

  return <ButtonGroup groupTitle="Chart type" buttonConfig={buttonConfig} />;
};

export default ChartTypeControl;
