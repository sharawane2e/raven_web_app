import store from "../../redux/store";
import { ChartType } from "../../enums/ChartType";
import jsPDF from "jspdf";
import "svg2pdf.js";
import autoTable from "jspdf-autotable";
import { tableChartDataGen } from "../export-helper-utils/TableUtils";
import { exportPrefix } from "../../constants/Variables";
import { setDefaultPdfPageProperties } from "../pdf/DefaultPdfProps";
import { getChartOptions } from "../ChartOptionFormatter";
import { PdfGenExport } from "./PdfGenExport";
import { getChartRows } from "../table-option-util";

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
        payloadObjectArr[i].chart
      );
      // const tableRows = tableChartDataGen();
      // autoTable(doc, { html: "#my-table" });

      // const [maxValue, minValue] = tableRows?.minmax[0];
      // let scaleLength: any = "";
      // if (questionData?.groupNetData) {
      //   scaleLength = questionData?.groupNetData.length;
      // }
      // let removeSubGrop: any;
      // if (chartTranspose) {
      //   removeSubGrop = tableRows.rows.length - scaleLength - 1;
      // }
      // var output: any = [];
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
      const chartRows = getChartRows(
        newSeriesData.series,
        chartOptionsPayload
      )[0]; //gaurav
      const seriesData = chartRows; //gaurav
      const output = PdfGenExport(seriesData);

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
