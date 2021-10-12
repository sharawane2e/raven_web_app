import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { memo } from "react";
import { colorArr } from "../../constants/Variables";

interface ChartProps {}

export type ChartOptionType = Highcharts.Options;

const Chart: React.FC<ChartProps> = (props) => {
  const chartOptions = useSelector(
    (state: RootState) => state.chart.chartOptions
  );
  Highcharts.setOptions({
    colors: colorArr,
  });
  return (
    <HighchartsReact
      containerProps={{ style: { height: "100%" } }}
      highcharts={Highcharts}
      options={chartOptions}
      immutable
    />
  );
};

export default memo(Chart);
