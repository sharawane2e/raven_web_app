import store from "../../redux/store";
import { ChartType } from "../../enums/ChartType";

import jsPDF from "jspdf";
import "svg2pdf.js";
import autoTable from "jspdf-autotable";
import { tableChartDataGen } from "../export-helper-utils/TableUtils";

import { exportPrefix } from "../../constants/Variables";
import { setDefaultPdfPageProperties } from "../pdf/DefaultPdfProps";
export const generatePdf = async () => {
  const {
    chart: { questionData, chartType },
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
    doc = new jsPDF("l", "mm", [pdfWidth, pdfHeight]);
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
      lWordBreak
    );
    const row = tableChartDataGen();
    autoTable(doc, { html: "#my-table" });

    autoTable(doc, {
      // head: [row[0]],
      body: [...row],
      startY: 40,
      styles: { fontSize: 6 },
    });
  } else {
    if (clientWidth >= 1300) {
      pdfWidth = 300;
      pdfHeight = 220;
      doc = new jsPDF("l", "mm", [pdfWidth, pdfHeight]);
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
      doc = new jsPDF("p", "mm", [pdfWidth, pdfHeight]);
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
    let source = document.getElementsByClassName("highcharts-root");
    let svgSource = source[0];
    let clonedSource = svgSource.cloneNode(true) as HTMLElement;

    clonedSource
      .querySelectorAll(".highcharts-text-outline")
      .forEach((node: any) => node.parentNode.removeChild(node));

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
      lWordBreak
    );
    await doc.svg(clonedSource, {
      x: x,
      y: y,
      width: w,
      height: h,
      loadExternalStyleSheets: true,
    });
  }

  doc.save(exportPrefix + questionData?.labelText + ".pdf");
};
