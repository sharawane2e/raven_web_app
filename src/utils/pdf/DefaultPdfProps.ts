import store from "../../redux/store";

import jsPDF from "jspdf";
import "svg2pdf.js";

import { appliedFiltersText } from "../export-helper-utils/AppliedFiltersUtils";
import { sourceText, copyRightText } from "../../constants/Variables";
import { logoBase64String, primaryBarColor } from "../../constants/Variables";
import { hexToRgb } from "@material-ui/core";

export const setDefaultPdfPageProperties = async (
  doc: jsPDF,
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

  // doc.addFont("Avenir", "Arial", "normal");

  // doc.setFont("Avenir");
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
  doc.text("Sample set: " + baseCount || "", baseX, baseY);
  doc.text(sourceText || "", sourceX, sourceY);
  // doc.setFontSize(6);
  doc.setTextColor(127, 127, 127);
  doc.text(copyRightText || "", copyRightX, copyRightY);
  doc.setDrawColor(0);
  doc.setFillColor(hexToRgb(primaryBarColor));
  doc.rect(5, 0, 3, 12, "F");

  doc.addImage(logoBase64String, "JPEG", logoX, logoY, 25, 12);
};
