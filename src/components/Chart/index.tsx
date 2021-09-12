import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

interface ChartProps {}

export type ChartOptionType = Highcharts.Options;

const Chart: React.FC<ChartProps> = (props) => {
  const {
    chart: { chartOptions },
  } = useSelector((state: RootState) => state);

  return <HighchartsReact highcharts={Highcharts} options={chartOptions} />;
};

export default Chart;

// const [chartOptions, setChartOptinos] = useState<Highcharts.Options>({
//   title: {
//     text: "",
//   },
//   chart: {
//     type: "column",
//   },
//   legend: {
//     enabled: false,
//   },
//   xAxis: {
//     type: "category",
//   },
//   // plotOptions: {
//   //   series: {
//   //     // @ts-ignore
//   //     dataLabels: {
//   //       formatter: (value: number) => "fff" + value,
//   //     },
//   //   },
//   // },
//   yAxis: {
//     min: 0,
//     max: 100,
//   },
//   series: [
//     // @ts-ignore
//     {
//       color: "#f47c3c",
//       data: [],
//     },
//   ],
// });
