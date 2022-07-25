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
import { pptDataGen } from "./PptDataGen";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { QuestionType } from "../../enums/QuestionType";

export const generatePpt = async (payloadObject: any) => {
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
    },
    filters: { appliedFilters },
    // standard: { isMean, standardDeviation, standardError },
  } = payloadObject;

  let pptxGenJsObj = new pptxgen();
  let fileName: string = exportPrefix + questionData?.labelText;

  let mainQuestionText: string = questionData?.labelText || "";
  let bannerQuestionText: string = bannerQuestionData?.labelText || "";
  let meanStandardDEviation = meanStandardDeviation();

  let baseText: string = `Sample set: ${baseCount}`;
  // let questionText: string = questionData?.questionText || "";

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

  // for (let i = 0; i == 2; i++) {
  pptDataGen(pptxGenJsObj, slideConfig);
  //}

  await pptxGenJsObj.writeFile({ fileName: fileName + ".pptx" });
};
