import _ from "lodash";
import store from "../../redux/store";
import { getTablesignificantdifference } from "../chart-option-util/significanceDiff";

export function bannerChartDataGen(newSeriesData: any) {
  console.log(newSeriesData);
  const series = newSeriesData.series;
  const seriesData: any = [];
  const {
    chart: { significant },
  } = store.getState();

  const updatedSeries = JSON.parse(JSON.stringify(series));
  //const updatedSeries = series;

  const seriesName: string[] = [];
  if (newSeriesData.chartTranspose) {
    newSeriesData.bannerQuestionData.options.forEach((optionObject: any) => {
      seriesName.push(optionObject?.labelText);
    });
  } else {
    newSeriesData.questionData.options.forEach((optionObject: any) => {
      //  if (chartData[0][optionObject?.labelCode]?.length) {
      seriesName.push(optionObject?.labelText);
      // }
    });
  }
  if (!significant) {
    updatedSeries.forEach((seriesObject: any, seriesIndex: number) => {
      if (seriesObject.data.length != seriesName.length) {
        const updatedData: any = [];
        seriesName.forEach((labelName: string, labelIndex: number) => {
          const isLabel = _.find(seriesObject.data, function (o) {
            return o.name == labelName;
          });

          if (isLabel) {
            updatedData.push(isLabel);
          } else {
            updatedData.push({
              name: labelName,
              y: 0,
              percentageValue: 0,
              numberValue: 0,
              baseCount: 0,
              significance: "",
              significantDiffernce: "",
            });
          }
        });

        updatedSeries[seriesIndex].data = updatedData;
      }
    });
  }

  updatedSeries.forEach((seriesNewData: any) => {
    let labels: any = [];
    const values: number[] = [];
    const baseCounts: number[] = [];
    const percentageValues: number[] = [];
    seriesNewData.data.forEach((seriesdata: any) => {
      labels.push(seriesdata.name);
      values.push(seriesdata.y);
      baseCounts.push(seriesdata.baseCount);
      percentageValues.push(seriesdata.percentageValue);
    });
    seriesData.push({
      name: seriesNewData.name,
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
