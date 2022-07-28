import { QuestionType } from "../../enums/QuestionType";
import { IchartOptionsDto } from "../../types/IChartOptionsDto";
import { gridTable } from "./gridTable";
import { multiGridTable } from "./multiGridTable";
import { multiTable } from "./multiTable";
import { numberTable } from "./number";
import { singleTable } from "./singleTable";

export const getChartRows = (
  chartSeries: any,
  chartOptionsPayload: IchartOptionsDto
) => {
  const chartRows: any[] = [];
  if (chartOptionsPayload.questionData.type == QuestionType.GRID) {
    chartRows.push(gridTable(chartSeries, chartOptionsPayload));
  } else if (chartOptionsPayload.questionData.type == QuestionType.MULTI) {
    chartRows.push(multiTable(chartSeries, chartOptionsPayload));
  } else if (chartOptionsPayload.questionData.type == QuestionType.GRID_MULTI) {
    chartRows.push(multiGridTable(chartSeries, chartOptionsPayload));
  } else if (chartOptionsPayload.questionData.type == QuestionType.NUMBER) {
    chartRows.push(numberTable(chartSeries, chartOptionsPayload));
  } else {
    chartRows.push(singleTable(chartSeries, chartOptionsPayload));
  }
  return chartRows;
};
