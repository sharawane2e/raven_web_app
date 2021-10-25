import { chartFontFace } from "../constants/Variables";
import pptxgen from "pptxgenjs";

export const chartConfig: pptxgen.IChartOpts = {
  x: 0.3,
  y: 0.7,
  w: 9.4,
  h: 4,
  //   chartColors: colors,
  dataLabelFontFace: chartFontFace,
  dataLabelFontSize: 4,
  dataLabelFontBold: true,
  showValue: true,
  catAxisLabelColor: "191919",
  catAxisLabelFontFace: chartFontFace,
  catAxisLabelFontSize: 6,
  catAxisLineShow: false,
  valAxisLabelFontSize: 6,
  valAxisLabelColor: "191919",
  valAxisLineShow: false,
  valAxisLabelFontFace: chartFontFace,
  legendFontSize: 6,
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
