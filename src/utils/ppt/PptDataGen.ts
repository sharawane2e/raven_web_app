import {
  colorArr,
  pptTemplateKey,
  primaryBarPPt,
} from '../../constants/Variables';

import pptxgen from 'pptxgenjs';
import store from '../../redux/store';
import { ISlideConfig } from '../../types/ISlideConfig';
import { ChartOrientation } from '../../enums/ChartOrientation';
import { ChartType } from '../../enums/ChartType';

import { chartConfig, tableConfig } from '../../config/PptConfig';
import { PptChartOrientation, PptChartType } from '../../enums/PptChart';

import { tableChartDataGen } from '../export-helper-utils/TableUtils';
import { chartDataGen } from '../export-helper-utils/ExportChartDataGen';
import _, { slice } from 'lodash';
import { setDefaultSlideProperties, setSlideText } from './DefaultPptProps';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { QuestionType } from '../../enums/QuestionType';

export function pptDataGen(
  pptxGenJsObj: pptxgen,
  slideConfig: ISlideConfig,
  graphTypeProps: { barDir: PptChartOrientation; barGrouping: PptChartType },
  chartSettings: pptxgen.IChartOpts,
) {
  const {
    chart: {
      chartType,
      chartOrientation,
      chartLabelType,
      questionData,
      chartTranspose,
      bannerQuestionData,
    },
  } = store.getState();

  setDefaultSlideProperties(pptxGenJsObj, slideConfig);

  let slide = pptxGenJsObj.addSlide({ masterName: pptTemplateKey });
  setSlideText(slide, slideConfig);
  // slide.addText('How To Create PowerPoint Presentations with JavaScript', {
  //   x: 0.5,
  //   y: 0.7,
  //   h: 10,
  //   fontSize: 18,
  // });

  let seriesData: any[] = [];
  let chartColors: any[] = [];

  seriesData = chartDataGen();

  if (chartType === ChartType.TABLE) {
    const tableRows = tableChartDataGen();
    let scaleLength: any = '';
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
        return el !== '';
      });

      results = questionData?.options.filter(function (option) {
        if (option.labelCode.split('_')[0] == 'N') {
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
      var rowArray: any = [];
      rowData.forEach(function (item, colIndex) {
        const currentMax = maxValue?.[colIndex - 1];
        const currentMin = minValue?.[colIndex - 1];
        const options = {
          fill: 'ffffff',
          bold: false,
        };
        const rowcount = removeSubGrop - laberesult;

        if (rowData[colIndex] === currentMax) {
          if (laberesult > 0) {
            rowIndex > removeSubGrop - rowcount &&
            rowIndex < removeSubGrop + (laberesult - 1)
              ? (options['fill'] = 'b8e08c')
              : !removeSubGrop && tableRows.rows.length > 3
              ? (options['fill'] = 'b8e08c')
              : (options['fill'] = 'ffffff');
          } else {
            if (
              bannerQuestionData?.type == QuestionType.SINGLE &&
              questionData?.type == QuestionType.SINGLE
            ) {
              rowIndex < removeSubGrop + 1 && tableRows.rows.length > 3
                ? (options['fill'] = 'b8e08c')
                : !removeSubGrop && tableRows.rows.length > 3
                ? (options['fill'] = 'b8e08c')
                : (options['fill'] = 'ffffff');
            } else {
              rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
                ? (options['fill'] = 'b8e08c')
                : !removeSubGrop && tableRows.rows.length > 3
                ? (options['fill'] = 'b8e08c')
                : (options['fill'] = 'ffffff');
              rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
                ? (options['bold'] = true)
                : !removeSubGrop && tableRows.rows.length > 3
                ? (options['bold'] = true)
                : (options['bold'] = false);
            }
          }
        } else if (rowData[colIndex] === currentMin) {
          if (laberesult > 0) {
            rowIndex > removeSubGrop - rowcount &&
            rowIndex < removeSubGrop + (laberesult - 1)
              ? (options['fill'] = 'fbd9d4')
              : !removeSubGrop && tableRows.rows.length > 3
              ? (options['fill'] = 'fbd9d4')
              : (options['fill'] = 'ffffff');
          } else {
            if (
              bannerQuestionData?.type == QuestionType.SINGLE &&
              questionData?.type == QuestionType.SINGLE
            ) {
              rowIndex <= removeSubGrop + 1 && tableRows.rows.length > 3
                ? (options['fill'] = 'fbd9d4')
                : !removeSubGrop
                ? (options['fill'] = 'fbd9d4')
                : (options['fill'] = 'ffffff');
            } else {
              rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
                ? (options['fill'] = 'fbd9d4')
                : !removeSubGrop
                ? (options['fill'] = 'fbd9d4')
                : (options['fill'] = 'ffffff');
              rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
                ? (options['bold'] = true)
                : !removeSubGrop
                ? (options['bold'] = true)
                : (options['bold'] = false);
            }
          }
        }
        //}

        rowArray.push({ text: rowData[colIndex], options: { ...options } });
      });

      output.push(rowArray);
    });

    slide.addTable(output, { ...tableConfig });
  } else {
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
        seriesData[0]?.labels?.forEach(function (labelText: any) {
          const seriesObject = _.find(questionData?.options, function (o) {
            return o.labelText === labelText;
          });
          if (bannerQuestionData?.type == QuestionType.MULTI) {
            if (seriesObject?.labelCode.split('_')[0] == 'N') {
              colorArray.push('01274c');
            }
          }
          //if (seriesObject?.labelCode.split('_')[0] == 'N') {
          //colorArray.push('01274c');
          //} else {
          colorArray.push(primaryBarPPt);
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

    slide.addChart(pptChartType, seriesData, {
      ...chartConfig,
      ...graphTypeProps,
      chartColors: chartColors,
      ...chartSettings,
    });
  }
  return slide;
}
