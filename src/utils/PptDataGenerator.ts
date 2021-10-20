import {
  chartFontFace,
  colorArr,
  decimalPrecision,
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
import { StaticText } from "../constants/StaticText";
import { PptChartOrientation, PptChartType } from "../enums/PptChart";
import { round } from "./Utility";

export function singleChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {
  let lb: any = [];
  let val: any = [];
  let seriesData: any[] = [];
  let options = questionData?.options || [];
  let sortedOptions = options.map((i: any) => {
    return parseInt(i.labelCode, 10);
  });

  sortedOptions.map((item: any) => {
    let cLb = options.find(
      (element: any) => element.labelCode == item.toString()
    );

    lb.push(cLb?.labelText);
  });

  let ChartDataCodeToInt = chartData.map((i: any) => {
    let code = parseInt(i.labelCode);
    let count = i.count;

    return { code, count };
  });
  const sortedCountObj = ChartDataCodeToInt.sort((first: any, second: any) =>
    first.code > second.code ? 1 : -1
  );

  sortedCountObj.map((i: any) => {
    val.push(round((i.count / baseCount) * 100, decimalPrecision));
  });
  seriesData = [
    {
      name: questionData?.labelText,
      labels: lb,
      values: val,
    },
  ];

  return seriesData;
}

export function gridChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {
  let labels: any = [];
  let seriesData: any[] = [];
  labels = questionData.subGroups.map((subGroup: any) => subGroup.labelText);

  questionData.scale.forEach((scaleOption: any) => {
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: questionData.subGroups.map((subGroup: any) => {
        const subGroupData = chartData.find(
          (data: any) => data._id === subGroup.qId
        );
        if (subGroupData) {
          const data = subGroupData?.options?.find(
            (scaleData: any) => scaleData.option === scaleOption.labelCode
          )?.count;
          return data !== undefined
            ? +((data / baseCount) * 100).toFixed(decimalPrecision)
            : 0;
        } else {
          return 0;
        }
      }),
    });
  });

  return seriesData;
}

export function bannerChartDataGen(
  bannerQuestionList: any,
  questionData: any,
  chartData: any,

  selectedBannerQuestionId: any
) {
  let labels: any = [];
  let seriesData: any[] = [];
  labels = questionData.options.map((label: any) => label.labelText);
  let scale =
    bannerQuestionList.find(
      (ques: any) => ques.qId === selectedBannerQuestionId
    )?.options || [];
  let chartDataComplete = chartData[0];
  scale.forEach((scaleOption: any) => {
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: questionData.options.map((option: any) => {
        if (option.labelCode in chartDataComplete) {
          const obj = chartDataComplete[option.labelCode];
          if (obj != []) {
            const subOptionData = obj.find(
              (subObj: any) => subObj.labelCode === scaleOption.labelCode
            );
            if (subOptionData) {
              const data = subOptionData.count;
              return data.toFixed(2);
            } else {
              return 0;
            }
          }
        }
      }),
    });
  });
  return seriesData;
}

export function tableChartDataGen(seriesData: any) {
  let rows = [];
  let scale: any = [];
  seriesData.forEach((index: any) => {
    scale.push(index.name);
  });
  rows.push([".", ...scale]);
  let subRow: any = [];
  for (let k = 0; k < seriesData[0].labels.length; k++) {
    seriesData.forEach((d: any) => {
      if (d.values[k]) {
        subRow.push(d.values[k]);
      } else {
        subRow.push(0);
      }
    });
    rows.push([seriesData[0].labels[k], ...subRow]);
    subRow = [];
  }
  return rows;
}

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
    chart: { questionData, baseCount, chartData, chartType },
    questions: { bannerQuestionList, selectedBannerQuestionId },
  } = store.getState();

  setDefaultSlideProperties(pptxGenJsObj, slideConfig);
  let slide = pptxGenJsObj.addSlide({ masterName: pptTemplateKey });
  let seriesData: any[] = [];

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
    const row = tableChartDataGen(seriesData);
    slide.addTable(row, {
      x: 0.3,
      y: 0.6,
      h: 3,
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
