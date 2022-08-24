import store from '../../redux/store';
import jsPDF from 'jspdf';
import 'svg2pdf.js';

import {
  appliedFiltersText,
  meanStandardDeviation,
} from '../export-helper-utils/GeneralUtils';
import {
  logoBase64String,
  primaryBarColor,
  copyRightText,
  significantText,
  significancecolor,
} from '../../constants/Variables';

import { hexToRgb } from '@material-ui/core';
import { QuestionType } from '../../enums/QuestionType';
import { ChartType } from '../../enums/ChartType';
import { IchartOptionsDto } from '../../types/IChartOptionsDto';

export const setDefaultPdfPageProperties = async (
  doc: jsPDF,
  baseX: any,
  baseY: any,
  sourceX: any,
  sourceY: any,
  logoX: any,
  logoY: any,
  copyRightX: any,
  copyRightY: any,
  qWordBreak: any,
  lWordBreak: any,
  chart: any,
) => {
  const {
    chart: {
      questionData,
      baseCount,
      bannerQuestionData,
      significant,
      chartType,
    },
    filters: { appliedFilters },
  } = store.getState();

  const appliedFiltersnew = chart?.filters;

  const charts: any = {
    chart,
    filters: { appliedFilters },
  };

  doc.setFontSize(10);
  const lText = doc.splitTextToSize(
    charts?.chart?.questionData?.labelText ||
      charts?.chart?.chart?.questionData?.labelText ||
      '',
    lWordBreak,
  );

  doc.text(lText, 10, 5);
  doc.setFontSize(8);
  doc.setTextColor(64, 64, 64);
  const filterText = doc.splitTextToSize(
    // appliedFiltersText(chart?.filters?.appliedFilters) ||
    appliedFiltersText(
      appliedFiltersnew?.appliedFilters || appliedFilters || '',
    ),
    qWordBreak,
  );
  doc.text(filterText, 10, 20);
  doc.setTextColor(64, 64, 64);

  if (
    charts?.chart?.questionData?.type === QuestionType.SINGLE &&
    charts?.chart?.questionData?.isMean
  ) {
    doc.text(meanStandardDeviation(chart), 10, 25);
  }

  const basecountData =
    chart?.chart?.baseCount == undefined
      ? chart?.baseCount
      : chart?.chart?.baseCount;

  doc.text('Sample set: ' + basecountData || '', baseX, baseY);
  if (charts?.chart.bannerQuestionData) {
    doc.text(
      'Cross tabulated:  ' + chart?.bannerQuestionData?.labelText || '',
      baseX,
      baseY + 5,
    );
  }
  if (charts?.chart?.significant) {
    if (charts?.chart?.chartType == ChartType.TABLE) {
      doc.text(significantText, 300, 5);
    } else {
      doc.text(significantText, 150, 5);
    }
    doc.setFontSize(8);
    doc.setTextColor(101, 110, 255);
    doc.setDrawColor(0);
    doc.setFillColor(hexToRgb(significancecolor));
    doc.rect(295, 3, 3, 2, 'F');
  }
  doc.setTextColor(127, 127, 127);
  doc.text(copyRightText || '', copyRightX, copyRightY);
  doc.setDrawColor(0);
  doc.setFillColor(hexToRgb(primaryBarColor));
  doc.rect(5, 0, 3, 12, 'F');

  doc.addImage(logoBase64String, 'JPEG', logoX, logoY, 25, 12);
};
