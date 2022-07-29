import {
  chartFontFace,
  catAxisFontSize,
  valAxisFontSize,
  lengendFontSize,
  dataLabelFontSize,
  dataLabelColor,
  chartAxisColor,
} from "../constants/Variables";
import pptxgen from "pptxgenjs";

export const chartConfig: pptxgen.IChartOpts = {
  x: 0.3,
  y: 0.9,
  w: 9.4,
  h: 3.8,
  dataLabelFontFace: chartFontFace,
  dataLabelFontSize: dataLabelFontSize,
  showValue: true,
  catAxisLabelColor: chartAxisColor,
  catAxisLabelFontFace: chartFontFace,
  catAxisLabelFontSize: catAxisFontSize,
  catAxisLineShow: false,
  valAxisLabelFontSize: valAxisFontSize,
  valAxisLabelColor: chartAxisColor,
  valAxisLineShow: false,
  valAxisLabelFontFace: chartFontFace,
  legendFontFace: chartFontFace,
  legendFontSize: lengendFontSize,
  showLegend: false,
  showTitle: false,
  showPercent: false,
  displayBlanksAs: "gap",
  legendPos: "b",
  dataBorder: { pt: 0.5, color: "0000ffff" },
  valAxisHidden: true,
  catGridLine: { style: "none" },
  valGridLine: { style: "none" },
  dataLabelColor: dataLabelColor,
  dataLabelFormatCode: "#,###;;;$",
  valLabelFormatCode: "#,###;;;$",
};

export const tableConfig: pptxgen.TableProps = {
  x: 0.4,
  y: 1.1,
  //h: 3.3,
  w: 9.4,
  // rowH: 2,
  border: { pt: 0.4, type: "solid", color: "E6E6E6" },
  fontSize: 6,
  autoPage: true,
  autoPageHeaderRows: 1,
  autoPageLineWeight: 10,
  autoPageCharWeight: 10,
  autoPageRepeatHeader: false,
  autoPageSlideStartY: 1.1,
};
