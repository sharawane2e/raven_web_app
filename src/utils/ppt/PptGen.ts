import store from '../../redux/store';
import pptxgen from 'pptxgenjs';
import {
  sourceText,
  copyRightText,
  exportPrefix,
  significantText,
} from '../../constants/Variables';
import {
  appliedFiltersText,
  meanStandardDeviation,
} from '../export-helper-utils/GeneralUtils';
import { ChartOrientation } from '../../enums/ChartOrientation';
import { PptChartOrientation, PptChartType } from '../../enums/PptChart';
import { ChartType } from '../../enums/ChartType';
import { ISlideConfig } from '../../types/ISlideConfig';
import { chartFontFace } from '../../constants/Variables';
import { pptDataGen } from './PptDataGen';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { QuestionType } from '../../enums/QuestionType';

export const generatePpt = async () => {
  const {
    chart: {
      questionData,
      bannerQuestionData,
      chartOrientation,
      chartType,
      baseCount,
      showMean,
      significant,
    },
    // standard: { isMean, standardDeviation, standardError },
  } = store.getState();

  const {
    chart: { chartLabelType },
  } = store.getState();

  let pptxGenJsObj = new pptxgen();
  let fileName: string = exportPrefix + questionData?.labelText;

  let mainQuestionText: string = questionData?.labelText || '';
  let bannerQuestionText: string = bannerQuestionData?.labelText || '';
  let meanStandardDEviation = meanStandardDeviation();

  let baseText: string = `Sample set: ${baseCount}`;
  // let questionText: string = questionData?.questionText || "";

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
    //show or hide legend
    showLegend: chartType === ChartType.COLUMN ? true : false,
    dataLabelFormatCode:
      chartLabelType === ChartLabelType.PERCENTAGE
        ? '##.##%;;;'
        : showMean && questionData?.type === QuestionType.GRID
        ? '##.##'
        : '##',
    valLabelFormatCode:
      chartLabelType === ChartLabelType.PERCENTAGE
        ? '##.##%;;;'
        : showMean && questionData?.type === QuestionType.GRID
        ? '##.##'
        : '##',
  };
  let significanceText: string = '';
  if (significant && chartType == ChartType.TABLE) {
    significanceText = significantText;
  }

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
  pptDataGen(pptxGenJsObj, slideConfig, graphTypeProps, chartSettings);
  //}

  await pptxGenJsObj.writeFile({ fileName: fileName + '.pptx' });
};
