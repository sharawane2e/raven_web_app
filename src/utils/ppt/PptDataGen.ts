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
    },
  } = store.getState();

  setDefaultSlideProperties(pptxGenJsObj, slideConfig);

  let slide = pptxGenJsObj.addSlide({ masterName: pptTemplateKey });

  setSlideText(slide, slideConfig);

  let seriesData: any[] = [];
  let chartColors: any[] = [];

  seriesData = chartDataGen();

  if (chartType === ChartType.TABLE) {
    const tableRows = tableChartDataGen();
    let scaleLength: any = '';

    const [maxValue, minValue] = tableRows?.minmax[0];

    const QuestionData: any = questionData?.groupNetData;

    var filtered = QuestionData.filter(function (el: any) {
      return el !== '';
    });

    scaleLength = filtered.length > 1 ? filtered.length : 0;

    let results: any = questionData?.options.filter(function (option) {
      if (option.labelCode.split('_')[0] == 'N') {
        return true;
      }
    });
    let laberesult = results.length;

    let removeSubGrop: any;
    if (chartTranspose) {
      removeSubGrop = tableRows.rows.length - scaleLength - 1;
    }
    if (laberesult > 0) {
      removeSubGrop = tableRows?.rows?.length - laberesult;
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
        } else if (rowData[colIndex] === currentMin) {
          if (laberesult > 0) {
            rowIndex > removeSubGrop - rowcount &&
            rowIndex < removeSubGrop + (laberesult - 1)
              ? (options['fill'] = 'fbd9d4')
              : !removeSubGrop && tableRows.rows.length > 3
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
        seriesData[0]?.labels.forEach(function (labelText: any) {
          const seriesObject = _.find(questionData?.options, function (o) {
            return o.labelText === labelText;
          });
          if (seriesObject?.labelCode.split('_')[0] == 'N') {
            colorArray.push('01274c');
          } else {
            colorArray.push(primaryBarPPt);
          }
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
