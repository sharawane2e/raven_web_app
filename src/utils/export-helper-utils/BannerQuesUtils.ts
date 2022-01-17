import { decimalPrecision } from "../../constants/Variables";
import { IBaseQuestion, IQuestionOption } from "../../types/IBaseQuestion";
import { round } from "../Utility";
import store from "../../redux/store";
import { ChartLabelType } from "../../enums/ChartLabelType";


export function bannerChartDataGen(
  questionData: IBaseQuestion,
  chartData: any,
  bannerQuestionData: any
) {
  const {
    chart:{chartLabelType} 
  }= store.getState();
  const labels: Array<string> = questionData.options.map(
    (label: IQuestionOption) => label.labelText
  );
  let seriesData: Array<Object> = [];
  const chartDataComplete = chartData[0];
  bannerQuestionData.options.forEach((scaleOption: IQuestionOption) => {
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: questionData.options.map((option: IQuestionOption) => {
        if (option.labelCode in chartDataComplete) {
          const obj = chartDataComplete[option.labelCode] || [];
          if (obj && obj.length > 0) {
            const base = obj?.reduce(
              (sum: number, option: any) => sum + option.count,
              0
            );
            const subOptionData = obj.find(
              (subObj: any) => subObj.labelCode === scaleOption.labelCode
            );
            if (!subOptionData) {
              return 0;
            }
            if(chartLabelType===ChartLabelType.PERCENTAGE){
              return subOptionData.count !== undefined
              ? round(+((subOptionData.count / base) * 100), decimalPrecision)
              : 0;
            }
            else{
              return subOptionData.count !== undefined
              ? subOptionData.count
              : 0;
            }

           
          }
        }
      }),
    });
  });

  return seriesData;
}
