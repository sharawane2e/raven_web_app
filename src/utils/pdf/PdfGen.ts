import store from '../../redux/store';
import { ChartType } from '../../enums/ChartType';

import jsPDF from 'jspdf';
import 'svg2pdf.js';
import autoTable from 'jspdf-autotable';
import { tableChartDataGen } from '../export-helper-utils/TableUtils';

import { exportPrefix } from '../../constants/Variables';
import { setDefaultPdfPageProperties } from '../pdf/DefaultPdfProps';
export const generatePdf = async () => {
  const {
    chart: { questionData, chartType, chartTranspose },
  } = store.getState();

  let clientWidth = document.body.clientWidth;
  let doc = new jsPDF();

  let pdfWidth,
    pdfHeight,
    x,
    y,
    w,
    h,
    baseX,
    baseY,
    sourceX,
    sourceY,
    logoX,
    logoY,
    copyRightX,
    copyRightY,
    qWordBreak,
    lWordBreak;

  if (chartType === ChartType.TABLE) {
    pdfWidth = 300;
    pdfHeight = 400;
    doc = new jsPDF('l', 'mm', [pdfWidth, pdfHeight]);
    // doc.addPage([300, 297], "p");
    x = 5;
    y = 30;
    w = 290;
    h = 140;
    baseX = 12;
    baseY = 260;
    sourceX = 12;
    sourceY = 265;
    logoX = 10;
    logoY = 275;
    copyRightX = 40;
    copyRightY = 283;
    lWordBreak = pdfWidth - 20;
    qWordBreak = 180;
    await setDefaultPdfPageProperties(
      doc,
      baseX,
      baseY,
      sourceX,
      sourceY,
      logoX,
      logoY,
      copyRightX,
      copyRightY,
      qWordBreak,
      lWordBreak,
    );
    const tableRows = tableChartDataGen();
    autoTable(doc, { html: '#my-table' });

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
      rowData.forEach(function (item, index) {
        const currentMax = maxValue?.[index - 1];
        const currentMin = minValue?.[index - 1];
        const options = {
          fillColor: 'ffffff',
          bold: false,
        };
        if (rowData[index] === currentMax) {
          rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
            ? (options['fillColor'] = 'b8e08c')
            : !removeSubGrop && tableRows.rows.length > 3
            ? (options['fillColor'] = 'b8e08c')
            : (options['fillColor'] = 'ffffff');
          options['bold'] = true;
        } else if (rowData[index] === currentMin) {
          rowIndex <= removeSubGrop - 1 && tableRows.rows.length > 3
            ? (options['fillColor'] = 'fbd9d4')
            : !removeSubGrop && tableRows.rows.length > 3
            ? (options['fillColor'] = 'fbd9d4')
            : (options['fillColor'] = 'ffffff');

          options['bold'] = true;
        }

        rowArray.push({ content: rowData[index], styles: { ...options } });
      });

      output.push(rowArray);
    });

    autoTable(doc, {
      // head: [row[0]],
      body: output,
      //body: [...tableRow?.rows],
      startY: 40,
      styles: { fontSize: 6 },
    });
  } else {
    if (clientWidth >= 1300) {
      pdfWidth = 300;
      pdfHeight = 220;
      doc = new jsPDF('l', 'mm', [pdfWidth, pdfHeight]);
      x = 5;
      y = 30;
      w = 290;
      h = 140;
      baseX = 12;
      baseY = 180;
      sourceX = 12;
      sourceY = 185;
      logoX = 10;
      logoY = 195;
      copyRightX = 40;
      copyRightY = 203;
      lWordBreak = pdfWidth - 20;
      qWordBreak = 180;
    } else {
      pdfWidth = 300;
      pdfWidth = 180;
      pdfHeight = 260;
      doc = new jsPDF('p', 'mm', [pdfWidth, pdfHeight]);
      x = 5;
      y = 30;
      w = 170;
      h = 180;
      baseX = 12;
      baseY = 220;
      sourceX = 12;
      sourceY = 225;
      logoX = 10;
      logoY = 235;
      copyRightX = 40;
      copyRightY = 242;
      lWordBreak = pdfWidth - 20;
      qWordBreak = 160;
    }
    let source = document.getElementsByClassName('highcharts-root');

    let svgSource = source[0];
    let clonedSource = svgSource.cloneNode(true) as HTMLElement;

    clonedSource
      .querySelectorAll('.highcharts-text-outline')
      .forEach((node: any) => node.parentNode.removeChild(node));

    // const legendsHTML = document.getElementsByClassName(
    //   'highcharts-legend-item-hidden',
    // );
    // const hiddenLegends = Array.from(legendsHTML).map(
    //   (text: any) => text.textContent,
    // );
    // console.log('hiddenLegends:', hiddenLegends);

    await setDefaultPdfPageProperties(
      doc,
      baseX,
      baseY,
      sourceX,
      sourceY,
      logoX,
      logoY,
      copyRightX,
      copyRightY,
      qWordBreak,
      lWordBreak,
    );
    await doc.svg(clonedSource, {
      x: x,
      y: y,
      width: w,
      height: h,
      loadExternalStyleSheets: true,
    });
  }

  doc.save(exportPrefix + questionData?.labelText + '.pdf');
};
