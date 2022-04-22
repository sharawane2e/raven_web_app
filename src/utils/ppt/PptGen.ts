import store from '../../redux/store';
import pptxgen from 'pptxgenjs';
import {
  sourceText,
  copyRightText,
  exportPrefix,
} from '../../constants/Variables';
import { appliedFiltersText } from '../export-helper-utils/GeneralUtils';
import { ChartOrientation } from '../../enums/ChartOrientation';
import { PptChartOrientation, PptChartType } from '../../enums/PptChart';
import { ChartType } from '../../enums/ChartType';
import { ISlideConfig } from '../../types/ISlideConfig';
import { chartFontFace } from '../../constants/Variables';
import { pptDataGen } from './PptDataGen';
import { ChartLabelType } from '../../enums/ChartLabelType';

export const generatePpt = async () => {
  const {
    chart: {
      questionData,
      bannerQuestionData,
      chartOrientation,
      chartType,
      baseCount,
      showMean,
    },
  } = store.getState();

  const {
    chart: { chartLabelType },
  } = store.getState();

  let pptxGenJsObj = new pptxgen();
  let fileName: string = exportPrefix + questionData?.labelText;

  let mainQuestionText: string = questionData?.labelText || '';
  let bannerQuestionText: string = bannerQuestionData?.labelText || '';

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
    showLegend: chartType === ChartType.COLUMN ? false : true,
    dataLabelFormatCode:
      chartLabelType === ChartLabelType.PERCENTAGE
        ? '##.##%;;;'
        : showMean
        ? '##.##'
        : '##',
    valLabelFormatCode:
      chartLabelType === ChartLabelType.PERCENTAGE
        ? '##.##%;;;'
        : showMean
        ? '##.##'
        : '##',
  };

  let slideConfig: ISlideConfig = {
    mainQuestionText,
    bannerQuestionText,
    filters,
    chartFontFace,
    baseText,
    sourceText,
    copyRightText,
  };

  // for (let i = 0; i < 2; i++) {
  pptDataGen(pptxGenJsObj, slideConfig, graphTypeProps, chartSettings);
  await pptxGenJsObj.writeFile({ fileName: fileName + '.pptx' });
  //}
};
