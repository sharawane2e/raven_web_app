import HighchartsReact from 'highcharts-react-official';
import Highcharts from 'highcharts';
import { connect, useSelector } from 'react-redux';
import store, { RootState } from '../../redux/store';
import { memo, useEffect, Component } from 'react';
import { colorArr } from '../../constants/Variables';
import { isEqual } from 'lodash';

import { ReactComponent as No_Data_Found } from '../../assets/svg/No_data_found.svg';

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
    const { chartOptions, questionData } = this.props.chart;
    const { sidebar } = store.getState();
    return (
      <>
        {sidebar?.nodata ? (
          <div className="noQuestion--selected">
            <No_Data_Found />
          </div>
        ) : questionData !== null ? (
          <HighchartsReact
            containerProps={{
              style: { height: '100%', overflow: 'unset' },
            }}
            highcharts={Highcharts}
            options={chartOptions}
            //onClick={reflow}s
            immutable
          />
        ) : (
          ''
        )}
      </>
    );
  }
}

const mapStateToProps = (state: RootState) => state;

export default connect(mapStateToProps)(Chart);
