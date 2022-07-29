import { IchartOptionsDto } from "../../types/IChartOptionsDto";
import { MultiQuesExportUtils } from "./MultiQuesExportUtils";

export function newChartDataGen(
  newSeriesData: any,
  chartOptionsPayload: IchartOptionsDto
) {
  let seriesData: any[] = [];

  seriesData = MultiQuesExportUtils(newSeriesData, chartOptionsPayload);

  return seriesData;
}
