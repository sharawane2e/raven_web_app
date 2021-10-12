import { useDispatch, useSelector } from "react-redux";
import { ChartType } from "../../enums/ChartType";
import { AppDispatch, RootState } from "../../redux/store";
import ButtonGroup, { ButtonGroupConfig } from "../widgets/ButtonGroup";
import { ReactComponent as ColumnChartIcon } from "../../assets/svg/column-chart-icon.svg";
import { ReactComponent as StackChartIcon } from "../../assets/svg/stack-chart-icon.svg";
import { ReactComponent as TableIcon } from "../../assets/svg/table-icon.svg";
import { setChartData } from "../../redux/actions/chartActions";

interface ChartTypeControlProps {}

const ChartTypeControl: React.FC<ChartTypeControlProps> = () => {
  const { chart } = useSelector((state: RootState) => state);
  const dispatch: AppDispatch = useDispatch();
  const { chartType } = chart;

  const changeChartType = (chartType: ChartType) => {
    const newChartData = JSON.parse(JSON.stringify(chart));
    newChartData.chartType = chartType;
    let seriesData: any[] = newChartData.chartOptions.series;

    seriesData?.reverse();
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
    newChartData.chartOptions["series"] = seriesData;
    newChartData.chartOptions["legend"].reversed =
      !newChartData.chartOptions["legend"].reversed;
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
    {
      tooltip: "Table View",
      renderChild: () => <TableIcon />,
      onClick: () => changeChartType(ChartType.TABLE),
      active: chartType === ChartType.TABLE,
      // disabled: true,
    },
  ];

  return (
    <ButtonGroup
      groupTitle="Chart type"
      buttonConfig={buttonConfig}
      className=" Step-6"
    />
  );
};

export default ChartTypeControl;
