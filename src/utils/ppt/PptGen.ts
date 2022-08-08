import pptxgen from "pptxgenjs";
import {
  sourceText,
  copyRightText,
  exportPrefix,
  significantText,
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
import { PptGenExport } from "./PptGenExport";
import { IchartOptionsDto } from "../../types/IChartOptionsDto";
import { fillEmptyDateSeries } from "../chart-option-util/significanceDiff";
import { getChartRows } from "../table-option-util";
import { BASE_TABLE_OPTS, BASE_TEXT_OPTS_L, BASE_TEXT_OPTS_R } from "./enum";
import { COLORS_RYGU } from "./enum_chart";

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
    console.log(appliedFilters);

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
    };

    // if (payloadObjectArr[i].chart.questionData.isGroupNet) {
    //   const updatedQuestionOptions: any[] = JSON.parse(
    //     JSON.stringify(questionData.options)
    //   );
    //   updatedQuestionOptions.push(...questionData.groupNetData);
    //   questionData.options.length = 0;
    //   questionData.options.push(...updatedQuestionOptions);
    // }

    const newSeriesData = {
      ...getChartOptions(
        chartOptionsPayload.questionData,
        chartOptionsPayload.chartData,
        chartOptionsPayload.baseCount,
        chartOptionsPayload.bannerQuestionData,
        chartOptionsPayload.chartOptionsData,
        chartOptionsPayload.questionChartData,
        chartOptionsPayload.bannerChartData,
        chartOptionsPayload.transposed
      ),
    };
    // debugger;

    console.log(JSON.parse(JSON.stringify(newSeriesData)));

    if (chartType === ChartType.TABLE) {
      const filledSeries = fillEmptyDateSeries(
        chartOptionsPayload.questionData.type,
        JSON.parse(JSON.stringify(newSeriesData.series)),
        chartOptionsPayload.transposed,
        chartOptionsPayload.questionData,
        chartOptionsPayload.bannerQuestionData,
        chartOptionsPayload.chartData
      );
      console.log(filledSeries);
      const chartRows = getChartRows(filledSeries, chartOptionsPayload)[0];
      seriesData = chartRows;
      const output = PptGenExport(seriesData);
      slide.addTable(output, { ...tableConfig });
    } else {
      // seriesData = newChartDataGen(newSeriesData);
      // console.log(seriesData);
      // const { pptChartType, chartColors } = slideChartConfig(
      //   chartType,
      //   pptxGenJsObj,
      //   seriesData,
      //   chartOrientation
      // );

      // slide.addChart(pptChartType, seriesData, {
      //   ...chartConfig,
      //   ...getGraphTypeProps(chartOrientation, chartType),
      //   chartColors: chartColors,
      //   ...getChartSettings(
      //     chartType,
      //     chartLabelType,
      //     showMean,
      //     questionData?.type
      //   ),
      // });
      genSlide14(pptxGenJsObj);
    }
  }

  await pptxGenJsObj.writeFile({ fileName: fileName + ".pptx" });
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
  const chartSettings: pptxgen.IChartOpts = {
    //show or hide legend
    showLegend:
      chartType === ChartType.COLUMN || questionType == QuestionType.SINGLE
        ? true
        : false,
    dataLabelFormatCode:
      chartLabelType === ChartLabelType.PERCENTAGE
        ? "##.##%;;;"
        : showMean
        ? "##.##"
        : "##",
    valLabelFormatCode:
      chartLabelType === ChartLabelType.PERCENTAGE
        ? "##.##%;;;"
        : showMean
        ? "##.##"
        : "##",
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

function genSlide14(pptx: any) {
  let slide = pptx.addSlide({ sectionTitle: "Charts" });
  slide.addNotes(
    "API Docs: https://gitbrent.github.io/PptxGenJS/docs/api-charts.html"
  );
  slide.addTable(
    [
      [
        { text: "Chart Examples: XY Scatter Chart", options: BASE_TEXT_OPTS_L },
        BASE_TEXT_OPTS_R,
      ],
    ],
    BASE_TABLE_OPTS
  );

  let arrDataScatter1 = [
    { name: "X-Axis", values: [-2, -1, 0, 1, 2] },
    {
      name: "Y-Value 1",
      values: [-2],
      labels: ["Jan1"],
    },
    {
      name: "Y-Value 2",
      values: [2],
      labels: ["Jan2"],
    },
    {
      name: "Y-Value 3",
      values: [null, null, null, -2],
      labels: ["Jan1", "Jan2", "Jan3", "Jan4"],
    },
    {
      name: "Y-Value 4",
      values: [null, null, null, 2],
      labels: ["Jan1", "Jan2", "Jan3", "Jan4"],
    },
  ];

  // TOP-LEFT
  let optsChartScat1 = {
    x: 0.5,
    y: 0.6,
    w: "45%",
    h: 3,
    valAxisTitle: "Renters",
    valAxisTitleColor: "428442",
    valAxisTitleFontSize: 14,
    showValAxisTitle: true,
    lineSize: 0,
    catAxisTitle: "Last 6 Months",
    catAxisTitleColor: "428442",
    catAxisTitleFontSize: 14,
    showCatAxisTitle: true,
    showLabel: false, // Must be set to true or labels will not be shown
    dataLabelPosition: "b", // Options: 't'|'b'|'l'|'r'|'ctr',
    dataLabelColor: "0088CC",
    color: "ff0000",
    chartColors: ["5F8D68", "FFCC00"],
    catAxisLabelColor: "0088CC",
    valAxisLabelColor: "0088CC",
    // catAxisHidden: true,
    valAxisLineShow: false,
  };
  slide.addChart(pptx.charts.SCATTER, arrDataScatter1, optsChartScat1);
}
