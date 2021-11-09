import { chartFontFace } from "../constants/Variables";
import pptxgen from "pptxgenjs";

export const chartConfig: pptxgen.IChartOpts = {
  x: 0.3,
  y: 0.9,
  w: 9.4,
  h: 3.8,
  //   chartColors: colors,
  dataLabelFontFace: chartFontFace,
  dataLabelFontSize: 5,
  // dataLabelFontBold: true,
  showValue: true,
  catAxisLabelColor: "191919",
  catAxisLabelFontFace: chartFontFace,
  catAxisLabelFontSize: 8,
  catAxisLineShow: false,
  valAxisLabelFontSize: 8,
  valAxisLabelColor: "191919",
  valAxisLineShow: false,
  valAxisLabelFontFace: chartFontFace,
  legendFontSize: 8,
  showLegend: true,
  showTitle: false,
  dataLabelFormatCode: " ##.##;;;",
  legendPos: "b",
  dataBorder: { pt: 0.5, color: "0000ffff" },
  valAxisHidden: true,
  catGridLine: { style: "none" },

  valGridLine: { style: "none" },
  dataLabelColor: "000000",
};

export const tableConfig: pptxgen.TableProps = {
  x: 0.3,
  y: 0.9,
  h: 3.8,
  w: 9.4,
  border: { pt: 0.4, type: "solid", color: "E6E6E6" },
  fontSize: 6,
  autoPage: true,
  autoPageHeaderRows: 1,
  autoPageLineWeight: 10,
  autoPageCharWeight: 10,
  autoPageRepeatHeader: true,
  autoPageSlideStartY: 0.9,
};
