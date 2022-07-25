import store from "../../redux/store";
import { getTablesignificantdifference } from "../chart-option-util/significanceDiff";

export function gridChartTableGen(series: any, chartLabelType: any) {
  let seriesData: any[] = [];
  const {
    chart: { significant },
  } = store.getState();

  series.forEach((seriesName: any) => {
    let labels: any = [];
    const values: number[] = [];
    const baseCounts: number[] = [];
    const percentageValues: number[] = [];
    seriesName.data.forEach((seriesdata: any) => {
      labels.push(seriesdata.name);
      values.push(seriesdata.y);
      baseCounts.push(seriesdata.baseCount);
      percentageValues.push(seriesdata.percentageValue);
    });
    seriesData.push({
      name: seriesName.name,
      labels,
      values,
      baseCounts,
      percentageValues,
    });
  });
  if (significant) {
    return getTablesignificantdifference(seriesData);
  }

  return seriesData;
}
