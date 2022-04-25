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
import { setDefaultSlideProperties } from './DefaultPptProps';
import { ChartLabelType } from '../../enums/ChartLabelType';
import chartSingleBar from '../../mock/chartBar.json';
import chartStack from '../../mock/chartStack.json';
import tabelview from '../../mock/tableDat.json';

console.log('tabelview', tabelview);

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

  //let slide: any = pptxGenJsObj.addSlide({ masterName: pptTemplateKey });
  // let slide2 = pptxGenJsObj.addSlide({ masterName: pptTemplateKey });
  // let slide3 = pptxGenJsObj.addSlide({ masterName: pptTemplateKey });

  let seriesData: any[] = [];
  let chartColors: any[] = [];

  seriesData = chartDataGen();

  if (chartType === ChartType.TABLE) {
    const tableRows = tableChartDataGen();

    const [maxValue, minValue] = tableRows?.minmax[0];
    let scaleLength: any = '';
    if (questionData?.groupNetData) {
      scaleLength = questionData?.groupNetData.length;
    }
    let removeSubGrop: any;
    if (chartTranspose) {
      removeSubGrop = tableRows.rows.length - scaleLength - 1;
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
        if (rowData[colIndex] === currentMax) {
          rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
            ? (options['fill'] = 'b8e08c')
            : !removeSubGrop && tableRows.rows.length > 3
            ? (options['fill'] = 'b8e08c')
            : (options['fill'] = 'ffffff');
          options['bold'] = true;
        } else if (rowData[colIndex] === currentMin) {
          rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
            ? (options['fill'] = 'fbd9d4')
            : !removeSubGrop
            ? (options['fill'] = 'fbd9d4')
            : (options['fill'] = 'ffffff');
          options['bold'] = true;
        }

        rowArray.push({ text: rowData[colIndex], options: { ...options } });
      });
      // console.log('rowArray', rowArray);

      output.push(rowArray);
    });

    pptxGenJsObj
      .addSlide({ masterName: pptTemplateKey })
      .addTable(output, { ...tableConfig });
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
        //debugger;
        seriesData[0]?.labels.forEach(function (labelText: any) {
          const seriesObject = _.find(questionData?.options, function (o) {
            return o.labelText === labelText;
          });
          if (seriesObject?.labelCode.split('_')[0] == 'N') {
            colorArray.push('F8971C');
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
    // console.log('pptChartType', pptChartType);
    // console.log('chartSingleBar', chartSingleBar);
    // console.log('chartStack', chartStack);
    pptxGenJsObj
      .addSlide({ masterName: pptTemplateKey })
      .addChart(pptChartType, seriesData, {
        ...chartConfig,
        ...graphTypeProps,
        chartColors: chartColors,
        ...chartSettings,
      });
    //console.log('seriesData', seriesData);
    // console.log('chartSingleBar', chartSingleBar);
    // console.log('chartStack', chartStack);
    //console.log('graphTypeProps', chartColors);

    // let dataget = { barDir: 'col', barGrouping: 'clustered' };
    // let dataget2 = { barDir: 'col', barGrouping: 'stacked' };
    // const data: any = tabelview;
    // //= pptxGenJsObj.addSlide({ masterName: pptTemplateKey });
    // //let slie: any;
    // //for (let i = 0; i < 3; i++) {
    // //slie + i;
    // if ('bar' && chartSingleBar) {
    //   pptxGenJsObj
    //     .addSlide({ masterName: pptTemplateKey })
    //     .addChart(pptChartType, chartSingleBar, {
    //       ...chartConfig,
    //       ...dataget,
    //       chartColors: chartColors,
    //       ...chartSettings,
    //     });
    // }
    // if ('bar' && chartStack) {
    //   pptxGenJsObj
    //     .addSlide({ masterName: pptTemplateKey })
    //     .addChart(pptChartType, chartStack, {
    //       ...chartConfig,
    //       ...dataget2,
    //       chartColors: chartColors,
    //       ...chartSettings,
    //     });
    // }
    // if (tabelview) {
    //   pptxGenJsObj
    //     .addSlide({ masterName: pptTemplateKey })
    //     .addTable(data, { ...tableConfig });
    // }
    // }
    //console.log('slie', slie);
  }
  return pptxGenJsObj.addSlide({ masterName: pptTemplateKey });
}
