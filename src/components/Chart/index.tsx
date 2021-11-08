import HighchartsReact from "highcharts-react-official";
import Highcharts from "highcharts";
import { connect, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { memo, useEffect, Component } from "react";
import { colorArr } from "../../constants/Variables";
import { isEqual } from "lodash";

interface ChartProps extends RootState {}

interface ChartState {}

class Chart extends Component<ChartProps, ChartState> {
  componentDidMount() {
    Highcharts.setOptions({
      colors: colorArr,
    });
  }

  componentDidUpdate(prevProps: ChartProps) {
    if (this.props?.sidebar?.open !== prevProps?.sidebar?.open) {
      setTimeout(this.reflow, 300);
    }
  }

  shouldComponentUpdate(prevProps: ChartProps) {
    if (
      isEqual(prevProps.chart.chartOptions, this.props.chart.chartOptions) &&
      this.props?.sidebar?.open === prevProps?.sidebar?.open
    )
      return false;
    return true;
  }

  reflow = () => {
    for (const chart of Highcharts.charts) {
      if (chart) {
        chart.reflow();
      }
    }
  };

  render() {
    // @ts-ignore
    const { chartOptions } = this.props.chart;
    return (
      <HighchartsReact
        containerProps={{ style: { height: "100%" } }}
        highcharts={Highcharts}
        options={chartOptions}
        //onClick={reflow}
        immutable
      />
    );
  }
}

const mapStateToProps = (state: RootState) => state;

export default connect(mapStateToProps)(Chart);
