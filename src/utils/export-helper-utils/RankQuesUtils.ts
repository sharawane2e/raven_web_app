// import { gridChartDataGen } from "./GridQuesUtils";

// export function rankChartDataGen(
//   questionData: any,
//   chartData: any,
//   baseCount: any
// ) {
//   return gridChartDataGen(questionData, chartData, baseCount);
// }

import { decimalPrecision } from "../../constants/Variables";
import { round } from "../Utility";
import store from "../../redux/store";
import { ChartLabelType } from "../../enums/ChartLabelType";
import _,{ filter } from "lodash";

export function rankChartDataGen(
  questionData: any,
  chartData: any,
  baseCount: any
) {
  // debugger;
  
  let labels: any = [];
  let seriesData: any[] = [];

  const {
    chart: { chartLabelType },
  } = store.getState();

  labels = questionData.subGroups.map((subGroup: any) => subGroup.labelText);
  questionData.scale.forEach((scaleOption: any) => {
    // debugger;
    
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: questionData.subGroups.map((subGroup: any) => {
        // debugger;
        const subGroupData = chartData.find(
          (data: any) => data._id === subGroup.qId
        );
        // const base = subGroupData?.baseCount || baseCount; // this base coming from backend and will not work anymore

        let base = 0;
        
        chartData.forEach(function(eachRowData:any){
          const chartOptionObject:any =_.filter(eachRowData.options,{option:scaleOption.labelCode});
          if(chartOptionObject.length){
               base = base + chartOptionObject[0]["count"];
          }
        })

        
        
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
