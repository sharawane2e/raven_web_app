import HighchartsReact from "highcharts-react-official";
// import HighchartsReact from "react-highcharts";
import Highcharts from "highcharts";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface ChartProps {}

export type ChartOptionType = Highcharts.Options;

const Chart: React.FC<ChartProps> = (props) => {
  const {
    chart: { chartOptions },
  } = useSelector((state: RootState) => state);

  const newChartOptions = JSON.parse(JSON.stringify(chartOptions));
  console.log(newChartOptions);
  return (
    <HighchartsReact
      highcharts={Highcharts}
      options={newChartOptions}
      immutable
    />
  );
};

export default Chart;
