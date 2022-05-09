import store from "../redux/store";
import _, { find, omit } from "lodash";
import { ChartType } from "../enums/ChartType";
import { ChartLabelType } from "../enums/ChartLabelType";
import { ChartOrientation } from "../enums/ChartOrientation";

export const getNumberPlotOptions = (
  chartType = store.getState().chart.chartType
) => {
  const chartDataClone = JSON.parse(JSON.stringify(store.getState().chart));
  let plotOptions = chartDataClone.chartOptions["plotOptions"];

  plotOptions = omit(plotOptions, ["column", "bar", "pie", "line"]);
  plotOptions["series"].dataLabels.format = "{point.y:.0f}";
  plotOptions["series"].dataLabels.y = undefined;
  plotOptions["series"].dataLabels.rotation = 0;
  delete plotOptions["series"].dataLabels.y;
  delete plotOptions["series"].dataLabels.rotation;

  // if (chartType === ChartType.STACK) {
  //   plotOptions["column"] = {
  //     stacking: "normal",
  //   };

  //   plotOptions["series"].dataLabels.format = "{point.y:.0f}";
  //   plotOptions["series"].dataLabels.y = undefined;
  //   plotOptions["series"].dataLabels.rotation = 0;
  // } else if (chartType === ChartType.COLUMN) {
  //   plotOptions["bar"] = {
  //     stacking: "normal",
  //   };
  //   plotOptions["series"].dataLabels.format = "{point.y:.0f}";
  //   if (chartDataClone.chartOrientation === ChartOrientation.PORTRAIT) {
  //     plotOptions["series"].dataLabels.y = -20;
  //     plotOptions["series"].dataLabels.rotation = -90;
  //   } else {
  //     plotOptions["series"].dataLabels.y = undefined;
  //     plotOptions["series"].dataLabels.rotation = 0;
  //   }
  // } else if (chartType === ChartType.PIE) {
  //   plotOptions["pie"] = {
  //     allowPointSelect: false,
  //     cursor: "pointer",
  //   };
  //   plotOptions["series"].dataLabels.format =
  //     "<b>{point.name}</b>: {point.y:.0f}";
  //   delete plotOptions["series"].dataLabels.y;
  //   delete plotOptions["series"].dataLabels.rotation;
  // } else if (chartType === ChartType.LINE) {
  //   plotOptions["line"] = {};

  //   plotOptions["series"].dataLabels.format = "{point.y:.0f}";
  // } else {
  //   delete plotOptions["series"].dataLabels.y;
  //   delete plotOptions["series"].dataLabels.rotation;
  // }
  return plotOptions;
};
