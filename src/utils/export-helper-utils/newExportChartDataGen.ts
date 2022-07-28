import { MultiQuesExportUtils } from "./MultiQuesExportUtils";

export function newChartDataGen(newSeriesData: any) {
  let seriesData: any[] = [];

  seriesData = MultiQuesExportUtils(newSeriesData);

  return seriesData;
}
