// import { gridChartDataGen } from "./GridQuesUtils";
import { decimalPrecision } from '../../constants/Variables';
import { round } from '../Utility';
import { IBaseQuestion, IQuestionOption } from '../../types/IBaseQuestion';
import { IMultiGridSubGrpData, ISubGrpOptions } from '../../types/IChart';
import store from '../../redux/store';
import { ChartLabelType } from '../../enums/ChartLabelType';

export function multiGridChartDataGen(
  questionData: IBaseQuestion,
  chartData: any,
  baseCount: number,
) {
  let labels: Array<string> = [];
  let seriesData: Array<Object> = [];
  const {
    chart: { chartLabelType },
  } = store.getState();
  labels = questionData.subGroups.map((subGroup: any) => subGroup.labelText);
  questionData.scale.forEach((scaleOption: IQuestionOption) => {
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: questionData.subGroups.map((subGroup: any) => {
        const subGroupData = chartData.find(
          (data: IMultiGridSubGrpData) => data._id === subGroup.qId,
        );
        if (!subGroupData) {
          return 0;
        }
        const dataObj = subGroupData?.options?.find(
          (optionObj: ISubGrpOptions) =>
            optionObj.option === scaleOption.labelCode,
        );
        const base: number = subGroupData?.baseCount || dataObj.baseCount;
        if (chartLabelType === ChartLabelType.PERCENTAGE) {
          return dataObj.count !== undefined
            ? round(+((dataObj.count / base) * 100), decimalPrecision)
            : 0;
        } else {
          return dataObj.count !== undefined ? dataObj.count : 0;
        }
      }),
    });
  });

  return seriesData;
}
