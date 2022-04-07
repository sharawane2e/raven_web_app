import { decimalPrecision } from "../../constants/Variables";
import { getMatchedfilter, getmatchedFind, round } from "../Utility";
import store from "../../redux/store";
import { ChartLabelType } from "../../enums/ChartLabelType";
import _ from "lodash";

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

  const scales = [...questionData.scale]
  
  labels = questionData.subGroups.map((subGroup: any) => subGroup.labelText);
  scales.forEach((scaleOption: any,index:number) => {
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: questionData.subGroups.map((subGroup: any) => {
 
        const subGroupData = getmatchedFind(chartData,'_id',subGroup.qId);
       
        const base = subGroupData?.baseCount || baseCount;
        if (subGroupData) {

          const labels = getMatchedfilter(subGroupData?.options,'option',scaleOption.labelCode)
          const data = _.sumBy(labels,function(o){return o.count})

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
