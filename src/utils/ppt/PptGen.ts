import store from "../../redux/store";
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
import {
  colorArr,
  pptTemplateKey,
  primaryBarPPt,
} from "../../constants/Variables";

import { chartConfig, tableConfig } from "../../config/PptConfig";

import { tableChartDataGen } from "../export-helper-utils/TableUtils";
import { chartDataGen } from "../export-helper-utils/ExportChartDataGen";
import _, { slice } from "lodash";
import { setDefaultSlideProperties } from "./DefaultPptProps";
import { getChartOptions } from "../ChartOptionFormatter";
import { newChartDataGen } from "../export-helper-utils/newExportChartDataGen";

export const generatePpt = async (payloadObjectArr: any[]) => {
  console.log(payloadObjectArr);
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
    let meanStandardDEviation = meanStandardDeviation();

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

    setDefaultSlideProperties(pptxGenJsObj, slideConfig);

    let slide = pptxGenJsObj.addSlide({ masterName: pptTemplateKey });
    let seriesData: any[] = [];
    let chartColors: any[] = [];

    const chartOptionsPayload: any = {
      questionData: payloadObjectArr[i].chart.questionData,
      chartData: payloadObjectArr[i].chart.chartData,
      baseCount: payloadObjectArr[i].chart.baseCount,
      bannerQuestionData: payloadObjectArr[i].chart.bannerQuestionData,
      chartOptionsData: payloadObjectArr[i].chart.chartOptions,
      questionChartData: payloadObjectArr[i].chart.questionChartData,
      bannerChartData: payloadObjectArr[i].chart.bannerChartData,
      transposed: payloadObjectArr[i].chart.chartTranspose,
    };

    const newSeriesData = getChartOptions(
      chartOptionsPayload.questionData,
      chartOptionsPayload.chartData,
      chartOptionsPayload.baseCount,
      chartOptionsPayload.bannerQuestionData,
      chartOptionsPayload.chartOptionsData,
      chartOptionsPayload.questionChartData,
      chartOptionsPayload.bannerChartData,
      chartOptionsPayload.transposed
    );
    //seriesData = getChartOptions(...chartOptionsPayload);
    // seriesData.push(...newSeriesData.series);
    // console.log(seriesData);

    //console.log(newSeriesData.series);
    seriesData = newChartDataGen(newSeriesData); //gaurav
    // console.log(seriesData);

    if (chartType === ChartType.TABLE) {
      const tableRows = tableChartDataGen(); //gaurav
      let scaleLength: any = "";
      let filtered: any;
      let results: any;
      let QuestionData: any;
      let singleGroupNet: any;

      const [maxValue, minValue] = tableRows?.minmax[0];

      if (
        questionData?.isGroupNet &&
        questionData?.type === QuestionType.SINGLE
      ) {
        QuestionData = 0;
        singleGroupNet = questionData?.groupNetData.length;
      } else {
        QuestionData = questionData?.groupNetData;
        filtered = QuestionData.filter(function (el: any) {
          return el !== "";
        });

        results = questionData?.options.filter(function (option: any) {
          if (option.labelCode.split("_")[0] == "N") {
            return true;
          }
        });
      }

      scaleLength = filtered?.length > 1 ? filtered?.length : 0;

      let laberesult = results?.length === undefined ? 0 : results?.length;

      let removeSubGrop: any;
      if (chartTranspose) {
        removeSubGrop = tableRows.rows.length - scaleLength - 1;
      }
      if (laberesult > 0) {
        removeSubGrop = tableRows?.rows?.length - laberesult;
      } else {
        removeSubGrop = tableRows?.rows?.length - singleGroupNet - 1;
      }
      var output: any = [];

      tableRows.rows.forEach((rowData, rowIndex) => {
        //console.log(rowData);
        var rowArray: any = [];
        rowData.forEach(function (item, colIndex) {
          const currentMax = maxValue?.[colIndex - 1];
          const currentMin = minValue?.[colIndex - 1];
          const options = {
            fill: "ffffff",
            bold: false,
          };
          const rowcount = removeSubGrop - laberesult;
          const splitCol = item.toString().split("|")[0];
          const splitCol2 = item?.toString().split("|")[1];

          let splitcolNumber: any;
          if (isNaN(Number(splitCol))) {
            splitcolNumber = splitCol != undefined ? splitCol : "";
          } else {
            splitcolNumber = Number(splitCol);
          }

          const dataString2 = splitCol2 != undefined ? splitCol2 : "";

          if (splitcolNumber === currentMax) {
            if (laberesult > 0) {
              rowIndex > removeSubGrop - rowcount &&
              rowIndex < removeSubGrop + (laberesult - 1)
                ? (options["fill"] = "b8e08c")
                : !removeSubGrop && tableRows.rows.length > 3
                ? (options["fill"] = "b8e08c")
                : (options["fill"] = "ffffff");
            } else {
              if (
                bannerQuestionData?.type == QuestionType.SINGLE &&
                questionData?.type == QuestionType.SINGLE
              ) {
                rowIndex < removeSubGrop + 1 && tableRows.rows.length > 3
                  ? (options["fill"] = "b8e08c")
                  : !removeSubGrop && tableRows.rows.length > 3
                  ? (options["fill"] = "b8e08c")
                  : (options["fill"] = "ffffff");
              } else {
                rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
                  ? (options["fill"] = "b8e08c")
                  : !removeSubGrop && tableRows.rows.length > 3
                  ? (options["fill"] = "b8e08c")
                  : (options["fill"] = "ffffff");
                rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
                  ? (options["bold"] = true)
                  : !removeSubGrop && tableRows.rows.length > 3
                  ? (options["bold"] = true)
                  : (options["bold"] = false);
              }
            }
          } else if (splitcolNumber === currentMin) {
            if (laberesult > 0) {
              rowIndex > removeSubGrop - rowcount &&
              rowIndex < removeSubGrop + (laberesult - 1)
                ? (options["fill"] = "fbd9d4")
                : !removeSubGrop && tableRows.rows.length > 3
                ? (options["fill"] = "fbd9d4")
                : (options["fill"] = "ffffff");
            } else {
              if (
                bannerQuestionData?.type == QuestionType.SINGLE &&
                questionData?.type == QuestionType.SINGLE
              ) {
                rowIndex <= removeSubGrop + 1 && tableRows.rows.length > 3
                  ? (options["fill"] = "fbd9d4")
                  : !removeSubGrop
                  ? (options["fill"] = "fbd9d4")
                  : (options["fill"] = "ffffff");
              } else {
                rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
                  ? (options["fill"] = "fbd9d4")
                  : !removeSubGrop
                  ? (options["fill"] = "fbd9d4")
                  : (options["fill"] = "ffffff");
                rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
                  ? (options["bold"] = true)
                  : !removeSubGrop
                  ? (options["bold"] = true)
                  : (options["bold"] = false);
              }
            }
          }
          //}

          rowArray.push({
            text: splitcolNumber + dataString2,
            options: { ...options },
          });
        });

        output.push(rowArray);
      });

      slide.addTable(output, { ...tableConfig });
    } else {
      //  debugger;
      let pptChartType: any;

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
            const seriesObject = _.find(questionData?.options, function (o) {
              return o.labelText === labelText;
            });
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
      // console.log('seriesData', seriesData);
      // debugger;
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
    showLegend: chartType === ChartType.COLUMN ? true : false,
    dataLabelFormatCode:
      chartLabelType === ChartLabelType.PERCENTAGE
        ? "##.##%;;;"
        : showMean && questionType === QuestionType.GRID
        ? "##.##"
        : "##",
    valLabelFormatCode:
      chartLabelType === ChartLabelType.PERCENTAGE
        ? "##.##%;;;"
        : showMean && questionType === QuestionType.GRID
        ? "##.##"
        : "##",
  };

  return chartSettings;
};
