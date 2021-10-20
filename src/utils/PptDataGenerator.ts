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
import { chartConfig } from "../config/PptConfig";
import { PptChartOrientation, PptChartType } from "../enums/PptChart";
import {
  singleChartDataGen,
  gridChartDataGen,
  bannerChartDataGen,
  tableChartDataGen,
} from "./ExportHelperUtils";

const setDefaultSlideProperties = (pptxGenJsObj: any, config: ISlideConfig) => {
  const { mainQuestionText, chartFontFace, baseText, questionText } = config;
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
          text: questionText,
          options: {
            x: 0.3,
            y: 4.9,
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
            y: 4.75,
            w: 9.5,
            fontFace: chartFontFace,
            fontSize: 8,
            color: "404040",
            align: "left",
            bold: true,
          },
        },
      },
      {
        text: {
          text: "© 2020, HFS Research Ltd",
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
  let baseText: string = `Base: Total = ${baseCount}`;
  let questionText: string = questionData?.questionText || "";

  let graphTypeProps = {
    barDir:
      chartOrientation === ChartOrientation.LANDSCAPE
        ? PptChartOrientation.LANDSCAPE
        : PptChartOrientation.PORTRAIT,
    barGrouping:
      chartType === ChartType.COLUMN ? PptChartType.COLUMN : PptChartType.STACK,
  };

  let slideConfig: ISlideConfig = {
    mainQuestionText,
    baseText,
    questionText,
    chartFontFace,
  };

  generatePptSlide(pptxGenJsObj, slideConfig, graphTypeProps);
  await pptxGenJsObj.writeFile({ fileName: fileName + ".pptx" });
};

function generatePptSlide(
  pptxGenJsObj: pptxgen,
  slideConfig: ISlideConfig,
  graphTypeProps: { barDir: PptChartOrientation; barGrouping: PptChartType }
) {
  const {
    chart: { chartType },
  } = store.getState();

  setDefaultSlideProperties(pptxGenJsObj, slideConfig);
  let slide = pptxGenJsObj.addSlide({ masterName: pptTemplateKey });
  let seriesData: any[] = [];

  if (chartType === ChartType.TABLE) {
    const row = tableChartDataGen();
    slide.addTable(row, {
      x: 0.3,
      y: 0.6,
      h: 3.5,
      w: 9.4,
      border: { pt: 0.4, type: "solid", color: "E6E6E6" },
      fontSize: 6,
      autoPage: true,
      autoPageHeaderRows: 1,
      autoPageLineWeight: 10,
      autoPageCharWeight: 10,
      autoPageRepeatHeader: true,
      autoPageSlideStartY: 0.6,
    });
  } else {
    let pptChartType;

    if (chartType === ChartType.PIE) {
      pptChartType = pptxGenJsObj.ChartType.pie;
    } else {
      pptChartType = pptxGenJsObj.ChartType.bar;
    }

    slide.addChart(pptChartType, seriesData, {
      ...chartConfig,
      ...graphTypeProps,
      chartColors: seriesData.length > 1 ? [...colorArr] : [primaryBarColor],
    });
  }
  return slide;
}
