import { decimalPrecision } from "../../constants/Variables";
import { round } from "../Utility";
import store from "../../redux/store";
import { ChartLabelType } from "../../enums/ChartLabelType";
import _ from "lodash";

export function gridChartDataGen(
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

  const scales = [...questionData.scale]

  // if(questionData.isGroupNet){
  //   scales.push(...questionData.groupNetData)
  // }


  labels = questionData.subGroups.map((subGroup: any) => subGroup.labelText);
  scales.forEach((scaleOption: any,index:number) => {
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: questionData.subGroups.map((subGroup: any) => {
        const subGroupData = chartData.find(
          (data: any) => data._id === subGroup.qId
        );
        const base = subGroupData?.baseCount || baseCount;
        if (subGroupData) {
          // if(index==8)debugger;
          const dollar = subGroupData?.options?.find(
            (scaleData: any) => scaleData.option === scaleOption.labelCode
          )?.count;

          const labels = _.filter(subGroupData?.options,function(o){

            if(_.isArray(scaleOption.labelCode)){
              return scaleOption.labelCode.indexOf(o.option) != -1;
            }else{
              return scaleOption.labelCode ===o.option;
            }
            
          });
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
