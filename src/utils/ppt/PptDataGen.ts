import {
  colorArr,
  pptTemplateKey,
  primaryBarColor,
} from "../../constants/Variables";

import pptxgen from "pptxgenjs";
import store from "../../redux/store";
import { ISlideConfig } from "../../types/ISlideConfig";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { ChartType } from "../../enums/ChartType";

import { chartConfig, tableConfig } from "../../config/PptConfig";
import { PptChartOrientation, PptChartType } from "../../enums/PptChart";

import { tableChartDataGen } from "../export-helper-utils/TableUtils";
import { chartDataGen } from "../export-helper-utils/ExportChartDataGen";
import { slice } from "lodash";
import { setDefaultSlideProperties } from "./DefaultPptProps";
import { ChartLabelType } from "../../enums/ChartLabelType";

export function pptDataGen(
  pptxGenJsObj: pptxgen,
  slideConfig: ISlideConfig,
  graphTypeProps: { barDir: PptChartOrientation; barGrouping: PptChartType },
  chartSettings: pptxgen.IChartOpts
) {
  const {
    chart: { chartType, chartOrientation, chartLabelType },
  } = store.getState();

  setDefaultSlideProperties(pptxGenJsObj, slideConfig);
  let slide = pptxGenJsObj.addSlide({ masterName: pptTemplateKey });
  let seriesData: any[] = [];
  let chartColors: any[] = [];

  seriesData = chartDataGen();

  if (chartType === ChartType.TABLE) {
    const row = tableChartDataGen();
    slide.addTable(row, {
      ...tableConfig,
    });
  } else {
    let pptChartType;

    if (chartType === ChartType.LINE) {
      chartColors = [...colorArr];
      pptChartType = pptxGenJsObj.ChartType.line;
    } else if (chartType === ChartType.PIE) {
      chartColors = [...colorArr];
      pptChartType = pptxGenJsObj.ChartType.pie;
    } else {
      chartColors =
        seriesData.length > 1
          ? slice(colorArr, 0, seriesData.length)
          : [primaryBarColor];
      pptChartType = pptxGenJsObj.ChartType.bar;

      if (chartOrientation === ChartOrientation.LANDSCAPE) {
        seriesData.forEach((row: any, index) => {
          row.values = row.values?.reverse();
          seriesData[index] = row;
        });
        seriesData[0]?.labels.reverse();

        if (chartType !== ChartType.STACK) {
          seriesData.reverse();
          chartColors.reverse();
        }
      }
    }

    if (chartLabelType === ChartLabelType.PERCENTAGE) {
      seriesData.forEach((row: any, index) => {
        row.values = row.values.map((value: number) => value / 100);
        seriesData[index] = row;
      });
    }

    // debugger;

    slide.addChart(pptChartType, seriesData, {
      ...chartConfig,
      ...graphTypeProps,
      chartColors: chartColors,
      ...chartSettings,
    });
  }
  return slide;
}
