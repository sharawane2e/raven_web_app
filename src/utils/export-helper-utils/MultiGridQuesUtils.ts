import { gridChartDataGen } from "./GridQuesUtils";
import { decimalPrecision } from "../../constants/Variables";
import { round } from "../Utility";
export function multiGridChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {
  let labels: any = [];
  let seriesData: any[] = [];

  labels = questionData.subGroups.map((subGroup: any) => subGroup.labelText);
  questionData.scale.forEach((scaleOption: any) => {
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: questionData.subGroups.map((subGroup: any) => {
        const subGroupData = chartData.find(
          (data: any) => data._id === subGroup.qId
        );

        if (subGroupData) {
          const data = subGroupData?.options?.find(
            (scaleData: any) => scaleData.option === scaleOption.labelCode
          )?.count;
          const base = subGroupData?.baseCount;
          const transposeBase = subGroupData?.options?.find(
            (scaleData: any) => {
              if (scaleData.option === scaleOption.labelCode) {
                return scaleData.baseCount;
              }
            }
          );
          if (base) {
            return data !== undefined
              ? round(+((data / base) * 100), decimalPrecision)
              : 0;
          } else if (transposeBase) {
            return data !== undefined
              ? round(
                  +((data / transposeBase.baseCount) * 100),
                  decimalPrecision
                )
              : 0;
          }
        } else {
          return 0;
        }
      }),
    });
  });

  return seriesData;
}
