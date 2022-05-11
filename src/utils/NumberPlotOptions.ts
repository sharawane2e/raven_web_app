import store from '../redux/store';
import _, { omit } from 'lodash';

export const getNumberPlotOptions = () => {
  const chartDataClone = JSON.parse(JSON.stringify(store.getState().chart));
  let plotOptions = chartDataClone.chartOptions['plotOptions'];

  plotOptions = omit(plotOptions, ['column', 'bar', 'pie', 'line']);
  plotOptions['series'].dataLabels.format = '{point.y:.0f}';
  plotOptions['series'].dataLabels.y = undefined;
  plotOptions['series'].dataLabels.rotation = 0;
  delete plotOptions['series'].dataLabels.y;
  delete plotOptions['series'].dataLabels.rotation;

  return plotOptions;
};

export const getToolTip = () => {
  const tooltip: { headerFormat: String; pointFormat: String } = {
    headerFormat: '',
    pointFormat: '',
  };

  tooltip['headerFormat'] =
    '<span style="font-size:11px">{series.name}</span><br>';

  tooltip['pointFormat'] =
    '<span>{point.name}</span>: Mean<b> {point.y:.2f}</b>,  of total <b>{point.baseCount}</b><br/>';

  return tooltip;
};
