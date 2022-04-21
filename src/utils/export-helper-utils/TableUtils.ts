import { round } from '../Utility';
import { chartDataGen } from './ExportChartDataGen';
import store from '../../redux/store';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { QuestionType } from '../../enums/QuestionType';

export function tableChartDataGen() {
  let seriesData = [];
  seriesData = chartDataGen();
  let lablecode_length: any = '';
  let rows = [];
  let minmax = [];
  let scaleLength: any = '';
  let subRow: any = [];
  let totalRow: any = [];
  let scaleIndex: any = 0;

  const tranposedTableData: any[] = [];
  const tranposedTableDataMin: any[] = [];

  const { chart } = store.getState();
  let chartTransposeState = !chart.chartTranspose;

  if (seriesData) {
    let scale: any = [];
    seriesData.forEach((index: any) => {
      scale.push(index.name);
    });
    rows.push(['', ...scale, 'Total']);

    if (chart.questionData?.groupNetData) {
      scaleLength = chart.questionData?.groupNetData.length;
    }
    if (!chartTransposeState) {
      scaleIndex = scale.length;
    } else {
      scaleIndex = scale.length - scaleLength;
    }

    if (seriesData[0])
      for (let k = 0; k < seriesData[0].labels.length; k++) {
        let totalrowSub = 0;

        seriesData.forEach((d: any, rIndex: any) => {
          let netsLabelcode =
            chart.bannerQuestionData?.options[rIndex].labelCode.split('_')[0];
          if (chart?.chartLabelType === ChartLabelType.PERCENTAGE) {
            // console.log('d.values[k]', d.values[k]);
            if (d.values[k]) {
              subRow.push(round(d.values[k], 1) + '%');
              if (rIndex < scaleIndex) {
                totalrowSub += parseFloat(d.values[k]);
                if (netsLabelcode === 'N') {
                  totalrowSub += 0;
                }
              }
            } else {
              subRow.push(0 + '%');
              totalrowSub += 0;
            }
          } else {
            if (d.values[k]) {
              subRow.push(round(d.values[k], 1));
              // totalrowSub += parseFloat(d.values[k]);
              if (chart?.showMean) {
                totalrowSub += parseFloat(d.values[k]);
              }

              if (rIndex < scaleIndex) {
                totalrowSub += parseFloat(d.values[k]);
                if (netsLabelcode === 'N') {
                  totalrowSub += 0;
                }
              }
            } else {
              subRow.push(0);
              totalrowSub += 0;
            }
          }
        });

        if (chart?.chartLabelType === ChartLabelType.PERCENTAGE) {
          totalRow.push(round(totalrowSub, 1) + '%');
        } else {
          totalRow.push(round(totalrowSub, 1));
        }

        rows.push([seriesData[0].labels[k], ...subRow, ...totalRow]);

        minmax.push([tranposedTableData, tranposedTableDataMin]);
        subRow = [];
        totalRow = [];
      }

    let tColomn: any = [];
    const updatedSeries =
      scaleLength > 0 && !chart.chartTranspose && !chart?.showMean
        ? seriesData.slice(0, -scaleLength)
        : seriesData;

    seriesData.forEach((series: any) => {
      let getColumnSum = 0;

      let columnValues = series.values;

      let results: any = chart.questionData?.options.filter(function (option) {
        if (option.labelCode.split('_')[0] == 'N') {
          return true;
        }
      });
      lablecode_length = results.length;

      const updateRow: any[] = [];

      for (var i = 0; i < columnValues.length; i++) {
        if (typeof columnValues[i] === 'undefined') {
          columnValues[i] = 0;
          updateRow.push(columnValues[i]);
        } else {
          updateRow.push(columnValues[i]);
        }
      }

      if (
        chart.chartTranspose &&
        chart?.questionData?.type === QuestionType.GRID
      ) {
        columnValues.splice(-scaleLength);
      }

      if (QuestionType.MULTI && lablecode_length > 0) {
        columnValues.splice(-lablecode_length);
      }

      const newUpdatedRow =
        chart.chartTranspose && chart?.questionData?.type === QuestionType.GRID
          ? updateRow.slice(0, -scaleLength)
          : QuestionType.MULTI && lablecode_length > 0
          ? updateRow.slice(0, -lablecode_length)
          : updateRow;

      if (chart?.chartLabelType === ChartLabelType.PERCENTAGE) {
        tranposedTableData.push(Math.max(...newUpdatedRow) + '%');
        tranposedTableDataMin.push(Math.min(...newUpdatedRow) + '%');
      } else {
        tranposedTableData.push(Math.max(...newUpdatedRow));
        tranposedTableDataMin.push(Math.min(...newUpdatedRow));
      }

      let getColoumnTotal = series.values
        .filter(function (x: any) {
          return typeof x === 'number';
        }) // remove any non numbers
        .reduce(function (s: number, v: number) {
          return s + Number(v);
        }, 0);

      if (chart?.chartLabelType === ChartLabelType.PERCENTAGE) {
        tColomn.push(round(getColoumnTotal, 1) + '%');
      } else {
        tColomn.push(round(getColoumnTotal, 1));
      }

      getColumnSum = 0;
    });

    minmax.push([tranposedTableData, tranposedTableDataMin]);

    rows.push(['Total', ...tColomn, '']);
  }
  const complteTable = { rows, minmax };

  return complteTable;
}
