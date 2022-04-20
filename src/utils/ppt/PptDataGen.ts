import {
  colorArr,
  pptTemplateKey,
  primaryBarColor,
  barPptColor,
  primaryBarPPt,
} from "../../constants/Variables";

import pptxgen from "pptxgenjs";
import store from "../../redux/store";
import { ISlideConfig } from "../../types/ISlideConfig";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { ChartType } from "../../enums/ChartType";

import {
  chartConfig,
  tableConfig,
  chartConfigMean,
} from "../../config/PptConfig";
import { PptChartOrientation, PptChartType } from "../../enums/PptChart";

import { tableChartDataGen } from "../export-helper-utils/TableUtils";
import { chartDataGen } from "../export-helper-utils/ExportChartDataGen";
import _, { slice } from "lodash";
import { setDefaultSlideProperties } from "./DefaultPptProps";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { round } from "../Utility";

export function pptDataGen(
  pptxGenJsObj: pptxgen,
  slideConfig: ISlideConfig,
  graphTypeProps: { barDir: PptChartOrientation; barGrouping: PptChartType },
  chartSettings: pptxgen.IChartOpts
) {
  const {
    chart: {
      chartType,
      chartOrientation,
      chartLabelType,
      questionData,
      showMean,
    },
  } = store.getState();

  setDefaultSlideProperties(pptxGenJsObj, slideConfig);
  let slide = pptxGenJsObj.addSlide({ masterName: pptTemplateKey });
  let seriesData: any[] = [];
  let chartColors: any[] = [];
  let chartColorsbar: any = {};

  seriesData = chartDataGen();

  if (chartType === ChartType.TABLE) {
    const tableRows = tableChartDataGen();

    const [maxValue, minValue] = tableRows?.minmax[0];

    var output: any = [];

    tableRows.rows.forEach((rowData) => {
      var rowArray: any = [];
      rowData.forEach(function (item, index) {
        const currentMax = maxValue?.[index - 1];
        const currentMin = minValue?.[index - 1];
        const options = {
          fill: "ffffff",
          bold: false,
        };
        if (rowData[index] === currentMax) {
          options["fill"] = "b8e08c";
          options["bold"] = true;
        } else if (rowData[index] === currentMin) {
          options["fill"] = "fbd9d4";
          options["bold"] = true;
        }
        rowArray.push({ text: rowData[index], options: { ...options } });
      });

      output.push(rowArray);
    });

    slide.addTable(output, { ...tableConfig });
  } else {
    let pptChartType: any;

    if (chartType === ChartType.LINE) {
      chartColors = [...colorArr];
      pptChartType = pptxGenJsObj.ChartType.line;
    } else if (chartType === ChartType.PIE) {
      chartColors = [...colorArr];
      pptChartType = pptxGenJsObj.ChartType.pie;
    } else {
      debugger;
      if (seriesData.length > 1) {
        chartColors = slice(colorArr, 0, seriesData.length);
      } else {
        const colorArray: string[] = [];
        //debugger;
        seriesData[0]?.labels.forEach(function (labelText: any) {
          const seriesObject = _.find(questionData?.options, function (o) {
            return o.labelText === labelText;
          });
          if (seriesObject?.labelCode.split("_")[0] == "N") {
            colorArray.push("F8971C");
          } else {
            colorArray.push(primaryBarPPt);
          }
        });

        chartColors = colorArray;
      }

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
    } else {
      // if (showMean)
      // seriesData.forEach((row: any, index) => {
      //   row.values = row.values.map((value: number) => value / 10);
      //   seriesData[index] = row;
      // });
    }

    const config = showMean ? chartConfigMean : chartConfig;

    slide.addChart(pptChartType, seriesData, {
      ...config,
      ...graphTypeProps,
      chartColors: chartColors,
      ...chartSettings,
    });
  }
  return slide;
}
