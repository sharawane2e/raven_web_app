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
  //   chartColors: colors,
  dataLabelFontFace: chartFontFace,
  dataLabelFontSize: dataLabelFontSize,
  // dataLabelFontBold: true,
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
  showLegend: true,
  showTitle: false,
  showPercent: false,

  // dataLabelFormatCode: "%;;;",
  legendPos: "b",
  dataBorder: { pt: 0.5, color: "0000ffff" },
  valAxisHidden: true,
  catGridLine: { style: "none" },
  // valAxisLabelFormatCode: "%",

  valGridLine: { style: "none" },
  dataLabelColor: dataLabelColor,
  dataLabelFormatCode: "##.##%;;;",
  valLabelFormatCode: "##.##%;;;",
};

export const tableConfig: pptxgen.TableProps = {
  x: 0.3,
  y: 0.9,
  //h: 3.8,
  //w: 9.4,
  border: { pt: 0.4, type: "solid", color: "E6E6E6" },
  fontSize: 6,
  autoPage: true,
  autoPageHeaderRows: 1,
  autoPageLineWeight: 10,
  autoPageCharWeight: 10,
  autoPageRepeatHeader: false,
  autoPageSlideStartY: 0.9,
  fontFace: "Arial" 
    
};
