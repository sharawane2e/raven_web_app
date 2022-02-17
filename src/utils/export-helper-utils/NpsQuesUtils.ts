import { round } from "lodash";
import { decimalPrecision } from "../../constants/Variables";
export function npsChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {
  const labels: any = [];
  const seriesData: any[] = [];
  const labelsQIds: any[] = [];
  questionData.subGroups.forEach((subGroup: any) => {
    if (chartData.find((data: any) => data._id === subGroup.qId)) {
      labels.push(subGroup.labelText);
      labelsQIds.push({ qId: subGroup.qId });
    }
  });

  questionData.scale.forEach((scaleOption: any) => {
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: labelsQIds.map((subGroup: any) => {
        const subGroupData = chartData.find(
          (data: any) => data._id === subGroup.qId
        );
        const base = subGroupData?.baseCount || baseCount;
        if (subGroupData) {
          const data = subGroupData?.options?.find(
            (scaleData: any) => scaleData.option === scaleOption.labelCode
          )?.count;

          return data !== undefined
            ? round(+((data / base) * 100), decimalPrecision)
            : 0;
        } else {
          return 0;
        }
      }),
    });
  });

  return seriesData;
}
