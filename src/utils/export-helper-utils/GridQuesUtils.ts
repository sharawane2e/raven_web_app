import { decimalPrecision } from "../../constants/Variables";
import { round } from "../Utility";
import store from "../../redux/store";
import { ChartLabelType } from "../../enums/ChartLabelType";

export function gridChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {
  let labels: any = [];
  let seriesData: any[] = [];

  const {
    chart: { chartLabelType },
  } = store.getState();

  labels = questionData.subGroups.map((subGroup: any) => subGroup.labelText);
  questionData.scale.forEach((scaleOption: any) => {
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: questionData.subGroups.map((subGroup: any) => {
        const subGroupData = chartData.find(
          (data: any) => data._id === subGroup.qId
        );
        const base = subGroupData?.baseCount || baseCount;
        if (subGroupData) {
          const data = subGroupData?.options?.find(
            (scaleData: any) => scaleData.option === scaleOption.labelCode
          )?.count;

          if (chartLabelType === ChartLabelType.PERCENTAGE) {
            return data !== undefined
              ? round(+((data / base) * 100), decimalPrecision)
              : 0;
          } else {
            return data !== undefined ? data : 0;
          }
        } else {
          return 0;
        }
      }),
    });
  });
  return seriesData;
}
