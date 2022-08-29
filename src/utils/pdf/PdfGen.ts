import store from "../../redux/store";
import { ChartType } from "../../enums/ChartType";
import jsPDF from "jspdf";
import "svg2pdf.js";
import autoTable from "jspdf-autotable";
import { exportPrefix } from "../../constants/Variables";
import { setDefaultPdfPageProperties } from "../pdf/DefaultPdfProps";
import { getChartOptions } from "../ChartOptionFormatter";
import { PdfGenExport } from "./PdfGenExport";
import { getChartRows } from "../table-option-util";
import { fillEmptyDateSeries } from "../chart-option-util/significanceDiff";

export const generatePdf = async (payloadObjectArr: any[]) => {
  let doc = new jsPDF();
  for (let i = 0; i < payloadObjectArr.length; i++) {
    const {
      chart: {
        questionData,
        bannerQuestionData,
        chartOrientation,
        chartType,
        baseCount,
        showMean,
        significant,
        chartLabelType,
        chartTranspose,
      },
      filters: { appliedFilters },
      // standard: { isMean, standardDeviation, standardError },
    } = payloadObjectArr[i];

    let clientWidth = document.body.clientWidth;

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
      baseY = 190;
      sourceX = 12;
      sourceY = 185;
      logoX = 10;
      logoY = 204;
      copyRightX = 40;
      copyRightY = 210.5;
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
        payloadObjectArr[i].chart
      );

      const chartOptionsPayload: any = {
        questionData: payloadObjectArr[i].chart.questionData,
        chartData: payloadObjectArr[i].chart.chartData,
        baseCount: payloadObjectArr[i].chart.baseCount,
        bannerQuestionData: payloadObjectArr[i].chart.bannerQuestionData,
        chartOptionsData: payloadObjectArr[i].chart.chartOptions,
        questionChartData: payloadObjectArr[i].chart.questionChartData,
        bannerChartData: payloadObjectArr[i].chart.bannerChartData,
        transposed: payloadObjectArr[i].chart.chartTranspose,
      };

      const newSeriesData = getChartOptions(
        chartOptionsPayload.questionData,
        chartOptionsPayload.chartData,
        chartOptionsPayload.baseCount,
        chartOptionsPayload.bannerQuestionData,
        chartOptionsPayload.chartOptionsData,
        chartOptionsPayload.questionChartData,
        chartOptionsPayload.bannerChartData,
        chartOptionsPayload.transposed
      );

      const filledSeries = fillEmptyDateSeries(
        chartOptionsPayload.questionData.type,
        JSON.parse(JSON.stringify(newSeriesData.series)),
        chartOptionsPayload.transposed,
        chartOptionsPayload.questionData,
        chartOptionsPayload.bannerQuestionData,
        chartOptionsPayload.chartData
      );

      const chartRows = getChartRows(filledSeries, chartOptionsPayload)[0]; //gaurav

      const seriesData = chartRows; //gaurav

      console.log(
        " payloadObjectArr[i]",
        payloadObjectArr[i]?.chart.chartLabelType
      );
      const output = PdfGenExport(
        seriesData,
        payloadObjectArr[i]?.chart.chartLabelType
      );

      autoTable(doc, {
        body: output,
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
        baseY = 190;
        sourceX = 12;
        sourceY = 185;
        logoX = 10;
        logoY = 204;
        copyRightX = 40;
        copyRightY = 210.5;
        lWordBreak = pdfWidth - 20;
        qWordBreak = 180;
      } else {
        pdfWidth = 250;
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
        lWordBreak,
        payloadObjectArr[i].chart
      );
      await doc.svg(clonedSource, {
        x: x,
        y: y,
        width: w,
        height: h,
        loadExternalStyleSheets: true,
      });
    }
  }

  doc.save(
    exportPrefix +
      payloadObjectArr[0]["chart"]["questionData"]?.labelText +
      ".pdf"
  );
};
