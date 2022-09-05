import { ChartLabelType } from "../../enums/ChartLabelType";
import { IchartOptionsDto } from "../../types/IChartOptionsDto";

export function MultiQuesExportUtils(
  newSeriesData: any,
  chartOptionsPayload: IchartOptionsDto
) {
  const series = [...newSeriesData.series];
  const updatedSeries: any[] = [];
  const allLabelsArr: string[] = [];

  series.forEach((seriesObject: any) => {
    seriesObject.data.forEach((dataObject: any) => {
      if (allLabelsArr.indexOf(dataObject.name) == -1) {
        allLabelsArr.push(dataObject.name);
      }
    });
  });

  series.forEach((seriesObject: any, index: number) => {
    const name = seriesObject.name;
    const labels: string[] = [];
    const values: number[] = [];

    const currentLabelsArr = seriesObject.data.map(
      (dataObject: any) => dataObject.name
    );
    const signData = seriesObject.data.map(
      (dataObject: any) => dataObject.significantDiffernce
    );

    allLabelsArr.forEach((labelName: string) => {
      const labelIndex = currentLabelsArr.indexOf(labelName);
      if (labelIndex == -1) {
        labels.push(labelName);
        values.push(0);
      } else {
        labels.push(seriesObject.data[labelIndex].name);
        if (chartOptionsPayload.chartLabelType == ChartLabelType.PERCENTAGE) {
          values.push(seriesObject.data[labelIndex].y / 100);
        } else {
          values.push(seriesObject.data[labelIndex].y);
        }
      }
    });

    updatedSeries.push({
      name,
      labels,
      values,
      signData,
    });
  });

  return updatedSeries;
}
