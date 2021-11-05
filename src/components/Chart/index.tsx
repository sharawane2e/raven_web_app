import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { memo, useContext, useEffect } from "react";
import { colorArr } from "../../constants/Variables";
import { SidebarContext } from "../../contexts/SidebarContext";

interface ChartProps {}

export type ChartOptionType = Highcharts.Options;

const Chart: React.FC<ChartProps> = (props) => {
  const chartOptions = useSelector(
    (state: RootState) => state.chart.chartOptions
  );

  const { open } = useContext(SidebarContext);

  useEffect(() => {
    Highcharts.setOptions({
      colors: colorArr,
    });
  }, []);

  useEffect(() => {
    setTimeout(reflow, 300);
  }, [open]);

  function reflow() {
    //console.log("called reflow", HighchartsReact, Highcharts);
    // console.log(Highcharts.charts)
    for (const chart of Highcharts.charts) {
      if (chart) {
        chart.reflow();
      }
    }
  }

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
