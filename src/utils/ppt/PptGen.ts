import pptxgen from "pptxgenjs";
import {
  sourceText,
  copyRightText,
  exportPrefix,
  significantText,
  projectName as projectFileName,
} from "../../constants/Variables";
import {
  appliedFiltersText,
  meanStandardDeviation,
} from "../export-helper-utils/GeneralUtils";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { PptChartOrientation, PptChartType } from "../../enums/PptChart";
import { ChartType } from "../../enums/ChartType";
import { ISlideConfig } from "../../types/ISlideConfig";
import { chartFontFace } from "../../constants/Variables";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { QuestionType } from "../../enums/QuestionType";
import { colorArr, primaryBarPPt } from "../../constants/Variables";
import { chartConfig, tableConfig } from "../../config/PptConfig";
import _, { slice } from "lodash";
import { setDefaultSlideProperties } from "./DefaultPptProps";
import { getChartOptions } from "../ChartOptionFormatter";
import { newChartDataGen } from "../export-helper-utils/newExportChartDataGen";
import { PptGenExport, PptGenExportSignificane } from "./PptGenExport";
import { IchartOptionsDto } from "../../types/IChartOptionsDto";
import { fillEmptyDateSeries } from "../chart-option-util/significanceDiff";
import { getChartRows } from "../table-option-util";

export const generatePpt = async (payloadObjectArr: any[]) => {
  let pptxGenJsObj = new pptxgen();
  let fileName: string =
    exportPrefix + payloadObjectArr[0]["chart"]["questionData"]?.labelText;

  for (let i = 0; i < payloadObjectArr.length; i++) {
    // debugger;
    const {
      chart: {
        questionData,
        bannerQuestionData,
        chartOrientation,
        chartType,
        baseCount,
        showMean,
        significant,
        chartLabelType,
        chartTranspose,
      },
      filters: { appliedFilters },
      // standard: { isMean, standardDeviation, standardError },
    } = payloadObjectArr[i];

    let mainQuestionText: string = questionData?.labelText || "";
    let bannerQuestionText: string = bannerQuestionData?.labelText || "";
    let meanStandardDEviation = meanStandardDeviation(
      payloadObjectArr[i].chart
    );

    let baseText: string = `Sample set: ${baseCount}`;
    let filters: string = appliedFiltersText(appliedFilters);

    let significanceText: string =
      significant && chartType == ChartType.TABLE ? significantText : "";

    let slideConfig: ISlideConfig = {
      mainQuestionText,
      bannerQuestionText,
      filters,
      chartFontFace,
      baseText,
      sourceText,
      copyRightText,
      meanStandardDEviation,
      significanceText,
    };

    setDefaultSlideProperties(pptxGenJsObj, slideConfig, `slide_${i}`);

    let slide = pptxGenJsObj.addSlide({ masterName: `slide_${i}` });

    let seriesData: any[] = [];
    // debugger;
    const chartOptionsPayload: IchartOptionsDto = {
      questionData: payloadObjectArr[i].chart.questionData,
      chartData: payloadObjectArr[i].chart.chartData,
      baseCount: payloadObjectArr[i].chart.baseCount,
      bannerQuestionData: payloadObjectArr[i].chart.bannerQuestionData,
      chartOptionsData: payloadObjectArr[i].chart.chartOptions,
      questionChartData: payloadObjectArr[i].chart.questionChartData,
      bannerChartData: payloadObjectArr[i].chart.bannerChartData,
      transposed: payloadObjectArr[i].chart.chartTranspose,
      chartLabelType: payloadObjectArr[i].chart.chartLabelType,
      chartType: payloadObjectArr[i].chart.chartType,
      significant: payloadObjectArr[i].chart.significant,
      showMean: payloadObjectArr[i].chart.showMean,
      chartOrientation: undefined,
    };

    //  console.log(chartOptionsPayload);

    const newSeriesData = {
      ...getChartOptions(
        chartOptionsPayload.questionData,
        chartOptionsPayload.chartData,
        chartOptionsPayload.baseCount,
        chartOptionsPayload.bannerQuestionData,
        chartOptionsPayload.chartOptionsData,
        chartOptionsPayload.questionChartData,
        chartOptionsPayload.bannerChartData,
        chartOptionsPayload.transposed,
        chartOptionsPayload.chartLabelType,
        chartOptionsPayload.chartType,
        chartOptionsPayload.significant,
        chartOptionsPayload.showMean,
        chartOptionsPayload.chartOrientation
      ),
    };

    if (chartType === ChartType.TABLE) {
      const filledSeries = fillEmptyDateSeries(
        chartOptionsPayload.questionData.type,
        JSON.parse(JSON.stringify(newSeriesData.series)),
        chartOptionsPayload.transposed,
        chartOptionsPayload.questionData,
        chartOptionsPayload.bannerQuestionData,
        chartOptionsPayload.chartData
      );
      const chartRows = getChartRows(filledSeries, chartOptionsPayload)[0];
      seriesData = chartRows;
      const output = PptGenExport(seriesData);
      slide.addTable(output, { ...tableConfig });
    } else {
      seriesData = newChartDataGen(newSeriesData, chartOptionsPayload);
      const { pptChartType, chartColors } = slideChartConfig(
        chartType,
        pptxGenJsObj,
        seriesData,
        chartOrientation
      );

      /*This code use for ppt export signficance with table  */
      if (payloadObjectArr[i].chart.significant) {
        let slide1 = pptxGenJsObj.addSlide({ masterName: `slide_${i}` });
        const filledSeries = fillEmptyDateSeries(
          chartOptionsPayload.questionData.type,
          JSON.parse(JSON.stringify(newSeriesData.series)),
          chartOptionsPayload.transposed,
          chartOptionsPayload.questionData,
          chartOptionsPayload.bannerQuestionData,
          chartOptionsPayload.chartData
        );
        const chartRows = getChartRows(filledSeries, chartOptionsPayload)[0];
        const output = PptGenExportSignificane(chartRows);
        slide1.addTable(output, { ...tableConfig });
      }
      /*End */

      slide.addChart(pptChartType, seriesData, {
        ...chartConfig,
        ...getGraphTypeProps(chartOrientation, chartType),
        chartColors: chartColors,
        ...getChartSettings(
          chartType,
          chartLabelType,
          showMean,
          questionData?.type
        ),
      });
    }
  }

  await pptxGenJsObj.writeFile({ fileName: projectFileName + ".pptx" });
};

const getGraphTypeProps = (
  chartOrientation: ChartOrientation,
  chartType: ChartType
) => {
  const graphTypeProps = {
    barDir:
      chartOrientation === ChartOrientation.LANDSCAPE
        ? PptChartOrientation.LANDSCAPE
        : PptChartOrientation.PORTRAIT,
    barGrouping:
      chartType === ChartType.COLUMN ? PptChartType.COLUMN : PptChartType.STACK,
  };

  return graphTypeProps;
};

const getChartSettings = (
  chartType: ChartType,
  chartLabelType: ChartLabelType,
  showMean: boolean,
  questionType: string | undefined
) => {
  let legednshow = false;
  if (chartType === ChartType.COLUMN && questionType == QuestionType.SINGLE) {
    legednshow = false;
  } else {
    legednshow = true;
  }
  const chartSettings: pptxgen.IChartOpts = {
    //show or hide legend
    showLegend: legednshow,
    //showTitle: true,
    showValue: true,
    showLabel: true,
    dataLabelFormatCode:
      chartLabelType === ChartLabelType.PERCENTAGE
        ? "##.##%;;;"
        : showMean
        ? "##.##"
        : "####",
    // valLabelFormatCode:
    //   chartLabelType === ChartLabelType.PERCENTAGE
    //     ? "##.##%;;;"
    //     : showMean
    //     ? "##.##"
    //     : "####",
  };

  return chartSettings;
};

const slideChartConfig = (
  chartType: ChartType,
  pptxGenJsObj: any,
  seriesData: any,
  chartOrientation: ChartOrientation
) => {
  let pptChartType: any;
  let chartColors: any[] = [];

  if (chartType === ChartType.LINE) {
    chartColors = [...colorArr];
    pptChartType = pptxGenJsObj.ChartType.line;
  } else if (chartType === ChartType.PIE) {
    chartColors = [...colorArr];
    pptChartType = pptxGenJsObj.ChartType.pie;
  } else {
    if (seriesData.length > 1) {
      chartColors = slice(colorArr, 0, seriesData.length);
    } else {
      const colorArray: string[] = [];
      seriesData[0]?.labels.forEach(function (labelText: any) {
        // const seriesObject = _.find(questionData?.options, function (o) {
        //   return o.labelText === labelText;
        // });
        colorArray.push(primaryBarPPt);
        // if (seriesObject?.labelCode.split('_')[0] == 'N') {
        //   colorArray.push('f1ad0f');
        // } else {
        //   colorArray.push(primaryBarPPt);
        // }
      });

      chartColors = colorArray;
    }

    pptChartType = pptxGenJsObj.ChartType.bar;
    if (chartOrientation === ChartOrientation.LANDSCAPE) {
      seriesData.forEach((row: any, index: number) => {
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

  // if (chartLabelType === ChartLabelType.PERCENTAGE) {
  //   seriesData.forEach((row: any, index) => {
  //     row.values = row.values.map((value: number) => value / 100);
  //     seriesData[index] = row;
  //   });
  // }

  return { pptChartType, chartColors };
};
