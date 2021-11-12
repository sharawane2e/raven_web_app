import store from "../redux/store";
import { ChartType } from "../enums/ChartType";
import { QuestionType } from "../enums/QuestionType";
import jsPDF from "jspdf";
import "svg2pdf.js";
import autoTable from "jspdf-autotable";
import { tableChartDataGen, appliedFiltersText } from "./ExportHelperUtils";
import { StaticText } from "../constants/StaticText";
const setDefaultPdfPageProperties = async (
  doc: any,
  baseX: any,
  baseY: any,
  sourceX: any,
  sourceY: any,
  logoX: any,
  logoY: any,
  copyRightX: any,
  copyRightY: any,
  qWordBreak: any,
  lWordBreak: any
) => {
  const {
    chart: { questionData, baseCount },
  } = store.getState();
  doc.setFontSize(10);
  const lText = doc.splitTextToSize(questionData?.labelText || "", lWordBreak);
  doc.text(lText, 10, 5);
  doc.setFontSize(8);
  doc.setTextColor(64, 64, 64);
  const filterText = doc.splitTextToSize(
    appliedFiltersText() || "",
    qWordBreak
  );
  doc.text(filterText, 10, 20);
  doc.text(
    "Sample set: " + baseCount + " executives across Global 2000 enterprises" ||
      "",
    baseX,
    baseY
  );
  doc.text(StaticText.SAMPLE_DATA_SOURCE_TEXT || "", sourceX, sourceY);
  // doc.setFontSize(6);
  doc.setTextColor(127, 127, 127);
  doc.text(StaticText.COPYRIGHT_TEXT || "", copyRightX, copyRightY);
  doc.setDrawColor(0);
  doc.setFillColor(244, 124, 60);
  doc.rect(5, 0, 3, 12, "F");
  // doc.addSvgAsImage("../BrandLogo", logoX, logoY, 50, 50);
  let logo = document.getElementsByClassName("appbar__brand-logo")[0];
  await doc.svg(logo, { x: logoX, y: logoY, width: 15, height: 15 });
};

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
    copyRightX = 30;
    copyRightY = 284;
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
      copyRightX = 30;
      copyRightY = 204;
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
      copyRightX = 30;
      copyRightY = 244;
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

  doc.save("HFS - " + questionData?.labelText + ".pdf");
};
