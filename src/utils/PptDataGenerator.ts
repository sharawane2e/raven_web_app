import {
  chartFontFace,
  colorArr,
  logoBase64String,
  pptTemplateKey,
  primaryBarColor,
} from "../constants/Variables";
import pptxgen from "pptxgenjs";
import store from "../redux/store";
import { ISlideConfig } from "../types/ISlideConfig";
import { ChartOrientation } from "../enums/ChartOrientation";
import { ChartType } from "../enums/ChartType";
import { QuestionType } from "../enums/QuestionType";
import { chartConfig, tableConfig } from "../config/PptConfig";
import { PptChartOrientation, PptChartType } from "../enums/PptChart";
import { StaticText } from "../constants/StaticText";
import {
  singleChartDataGen,
  gridChartDataGen,
  bannerChartDataGen,
  tableChartDataGen,
  appliedFiltersText,
} from "./ExportHelperUtils";
import { slice } from "lodash";

const setDefaultSlideProperties = (pptxGenJsObj: any, config: ISlideConfig) => {
  const {
    mainQuestionText,
    filters,
    chartFontFace,
    baseText,
    sourceText,
    copyRightText,
  } = config;
  pptxGenJsObj.defineSlideMaster({
    title: pptTemplateKey,
    background: { color: "FFFFFF" },
    objects: [
      {
        rect: {
          x: 0.4,
          y: 0,
          w: 0.1,
          h: 0.5,
          fill: { color: primaryBarColor },
        },
      },
      {
        text: {
          text: mainQuestionText,
          options: {
            x: 0.5,
            y: 0.25,
            w: 8,
            fontFace: chartFontFace,
            fontSize: 12,
            color: "323c4e",
            align: "left",
            bold: true,
          },
        },
      },
      {
        text: {
          text: filters,
          options: {
            x: 0.3,
            y: 0.7,
            w: 9.5,
            fontFace: chartFontFace,
            fontSize: 8,
            color: "404040",
            align: "left",
          },
        },
      },
      {
        text: {
          text: baseText,
          options: {
            x: 0.3,
            y: 4.8,
            w: 9.5,
            fontFace: chartFontFace,
            fontSize: 8,
            color: "404040",
            align: "left",
            // bold: true,
          },
        },
      },
      {
        text: {
          text: sourceText,
          options: {
            x: 0.3,
            y: 4.95,
            w: 9.5,
            fontFace: chartFontFace,
            fontSize: 8,
            color: "404040",
            align: "left",
            // bold: true,
          },
        },
      },

      {
        text: {
          text: copyRightText,
          options: {
            x: 4.2,
            y: 5.4,
            w: 1.5,
            fontFace: chartFontFace,
            fontSize: 6,
            color: "7f7f7f",
            align: "center",
          },
        },
      },
      { image: { x: 0.38, y: 5.15, w: 1, h: 0.38, data: logoBase64String } },
    ],
  });
};

export const generateChart = async () => {
  const {
    chart: { questionData, chartOrientation, chartType, baseCount },
  } = store.getState();

  let pptxGenJsObj = new pptxgen();
  let fileName: string = "HFS- " + questionData?.labelText;

  let mainQuestionText: string = questionData?.labelText || "";
  let baseText: string = `Sample set: ${baseCount} executives across Global 2000 enterprises`;
  let questionText: string = questionData?.questionText || "";
  let sourceText: string = StaticText.SAMPLE_DATA_SOURCE_TEXT;
  let copyRightText: string = StaticText.COPYRIGHT_TEXT;
  let filters: string = appliedFiltersText();

  let graphTypeProps = {
    barDir:
      chartOrientation === ChartOrientation.LANDSCAPE
        ? PptChartOrientation.LANDSCAPE
        : PptChartOrientation.PORTRAIT,
    barGrouping:
      chartType === ChartType.COLUMN ? PptChartType.COLUMN : PptChartType.STACK,
  };

  let chartSettings: pptxgen.IChartOpts = {
    showValue: true,

    //show line on x-axis or y-axis
    catAxisLineShow: false,
    valAxisLineShow: false,

    //show or hide legend
    showLegend: true,

    //show or hide title
    showTitle: false,

    //change data label format

    //percentage number format
    dataLabelFormatCode: "##.##;;;",

    //simple number data format
    // dataLabelFormatCode: "###",

    //show or hide x-axis or y-axis
    catAxisHidden: false,
    valAxisHidden: false,

    //grid lines config
    catGridLine: { style: "solid" },
    valGridLine: { style: "solid" },
  };

  let slideConfig: ISlideConfig = {
    mainQuestionText,
    filters,
    chartFontFace,
    baseText,
    sourceText,

    copyRightText,
  };

  generatePptSlide(pptxGenJsObj, slideConfig, graphTypeProps, chartSettings);
  await pptxGenJsObj.writeFile({ fileName: fileName + ".pptx" });
};

function generatePptSlide(
  pptxGenJsObj: pptxgen,
  slideConfig: ISlideConfig,
  graphTypeProps: { barDir: PptChartOrientation; barGrouping: PptChartType },
  chartSettings: pptxgen.IChartOpts
) {
  const {
    chart: { questionData, chartData, chartType, baseCount, chartOrientation },
  } = store.getState();
  const {
    questions: { selectedBannerQuestionId, bannerQuestionList },
  } = store.getState();

  setDefaultSlideProperties(pptxGenJsObj, slideConfig);
  let slide = pptxGenJsObj.addSlide({ masterName: pptTemplateKey });
  let seriesData: any[] = [];
  let chartColors: any[] = [];

  if (selectedBannerQuestionId) {
    seriesData = bannerChartDataGen(
      bannerQuestionList,
      questionData,
      chartData,
      selectedBannerQuestionId
    );
  } else {
    if (
      questionData?.type === QuestionType.SINGLE ||
      questionData?.type === QuestionType.MULTI
    ) {
      seriesData = singleChartDataGen(questionData, chartData, baseCount);
    } else if (
      questionData?.type === QuestionType.GRID ||
      questionData?.type === QuestionType.GRID_MULTI ||
      questionData?.type === QuestionType.RANK
    ) {
      seriesData = gridChartDataGen(questionData, chartData, baseCount);
    }
  }

  if (chartType === ChartType.TABLE) {
    const row = tableChartDataGen();
    slide.addTable(row, {
      ...tableConfig,
    });
  } else {
    let pptChartType;

    if (chartType === ChartType.PIE) {
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
      seriesData.forEach((row: any, index) => {
        row.values = row.values.map((value: number) => value / 100);
        seriesData[index] = row;
      });
    }

    slide.addChart(pptChartType, seriesData, {
      ...chartConfig,
      ...graphTypeProps,
      chartColors: chartColors,
      // ...chartSettings,
    });
  }
  return slide;
}
