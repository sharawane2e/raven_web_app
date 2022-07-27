import { QuestionType } from "../../enums/QuestionType";
import { IchartOptionsDto } from "../../types/IChartOptionsDto";
import { gridTable } from "./gridTable";
import { singleTable } from "./singleTable";

export const getChartRows = (
  chartSeries: any,
  chartOptionsPayload: IchartOptionsDto
) => {
  const chartRows: any[] = [];
  //   debugger;
  if (chartOptionsPayload.questionData.type == QuestionType.GRID) {
    chartRows.push(gridTable(chartSeries, chartOptionsPayload));
  } else {
    chartRows.push(singleTable(chartSeries, chartOptionsPayload));
  }

  return chartRows;
};
