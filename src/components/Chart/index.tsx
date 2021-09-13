import HighchartsReact from "highcharts-react-official";
// import HighchartsReact from "react-highcharts";
import Highcharts from "highcharts";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface ChartProps {}

export type ChartOptionType = Highcharts.Options;

const Chart: React.FC<ChartProps> = (props) => {
  const chartOptions = useSelector(
    (state: RootState) => state.chart.chartOptions
  );

  return (
    <HighchartsReact highcharts={Highcharts} options={chartOptions} immutable />
  );
};

export default Chart;
