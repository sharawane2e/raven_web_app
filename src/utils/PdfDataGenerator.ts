import store from "../redux/store";
import { ChartType } from "../enums/ChartType";
import { QuestionType } from "../enums/QuestionType";
import jsPDF from "jspdf";
import "svg2pdf.js";
import autoTable from "jspdf-autotable";
import { tableChartDataGen } from "./ExportHelperUtils";

const setDefaultPdfPageProperties = async (
  doc: any,
  baseX: any,
  baseY: any,
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
  const qText = doc.splitTextToSize(
    questionData?.questionText || "",
    qWordBreak
  );
  doc.text(qText, 10, 20);
  doc.text("n = " + baseCount || "", baseX, baseY);
  doc.setFontSize(6);
  doc.text("© 2020, HFS Research Ltd" || "", copyRightX, copyRightY);
  doc.setDrawColor(0);
  doc.setFillColor(244, 124, 60);
  doc.rect(5, 0, 3, 12, "F");
  doc.addSvgAsImage("../BrandLogo", logoX, logoY, 50, 50);
  let logo = document.getElementsByClassName("appbar__brand-logo")[0];
  await doc.svg(logo, { x: logoX, y: logoY, width: 40, height: 40 });
};

export const generatePdf = async () => {
  const {
    chart: { questionData, chartType },
  } = store.getState();

  let clientWidth = document.body.clientWidth;
  let doc = new jsPDF();
  let x,
    y,
    w,
    h,
    baseX,
    baseY,
    logoX,
    logoY,
    copyRightX,
    copyRightY,
    qWordBreak,
    lWordBreak;

  if (chartType === ChartType.TABLE) {
    doc = new jsPDF("l", "mm", [300, 400]);
    // doc.addPage([300, 297], "p");
    x = 5;
    y = 30;
    w = 290;
    h = 140;
    baseX = 12;
    baseY = 180;
    logoX = 10;
    logoY = 180;
    copyRightX = 200;
    copyRightY = 210;
    lWordBreak = 160;
    qWordBreak = 180;
    await setDefaultPdfPageProperties(
      doc,
      baseX,
      260,
      logoX,
      260,
      copyRightX,
      290,
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
      doc = new jsPDF("l", "mm", [300, 220]);
      x = 5;
      y = 30;
      w = 290;
      h = 140;
      baseX = 12;
      baseY = 180;
      logoX = 10;
      logoY = 180;
      copyRightX = 135;
      copyRightY = 210;
      lWordBreak = 160;
      qWordBreak = 180;
    } else {
      doc = new jsPDF("p", "mm", [180, 260]);
      x = 5;
      y = 30;
      w = 170;
      h = 180;
      baseX = 12;
      baseY = 220;
      logoX = 10;
      logoY = 220;
      copyRightX = 80;
      copyRightY = 255;
      lWordBreak = 160;
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
