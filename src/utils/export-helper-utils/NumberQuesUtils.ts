// import { decimalPrecision } from '../../constants/Variables';
// import { round, getmedian } from "../../utils/Utility";
// import store from '../../redux/store';
// import { ChartLabelType } from '../../enums/ChartLabelType';
// import { ChartType } from '../../enums/ChartType';
// import _ from 'lodash';
import _ from 'lodash';
import { find, round } from 'lodash';
import { mean, median, min, max } from 'simple-statistics';
import { decimalPrecision } from '../../constants/Variables';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { QuestionType } from '../../enums/QuestionType';
import store from '../../redux/store';
import { IQuestionOption } from '../../types/IBaseQuestion';

export function numberChartDataGen(
  questionData: any,
  chartData: any,
  // baseCount: any,
  bannerQuestionData: any,
) {
  const {
    questions: { selectedBannerQuestionId },
  } = store.getState();
  const labels: Array<string> = questionData.options.map(
    (label: IQuestionOption) => label.labelText,
  );
  let seriesData: Array<Object> = [];
  const chartDataComplete = chartData[0];

  if (selectedBannerQuestionId) {
    const meanMaxArr: any[] = [];
    const series: any[] = [];
    const labels: Array<string> = questionData.options.map(
      (label: IQuestionOption) => label.labelText,
    );

    const subGroups = questionData.options.filter((option: IQuestionOption) => {
      const subGroup = chartData[0][option.labelCode];
      if (subGroup && subGroup?.length) return true;
      return false;
    });

    let optionData = chartData[0];
    let chartOptionsData: any = [];

    Object.keys(optionData).forEach(function (key) {
      chartOptionsData.push(optionData[key]);
    });

    chartOptionsData.forEach((chart_el: any, chartIndex: Number) => {
      const meanMediaArr: any = [];
      const chartelment = chart_el[0];
      const meanValue = mean(chartelment?.values);
      const minValue = min(chartelment?.values);
      const maxValue = max(chartelment?.values);
      const medainValue = median(chartelment?.values);
      meanMediaArr.push(meanValue, medainValue, minValue, maxValue);
      meanMaxArr.push(meanMediaArr);
    });

    for (let index = 0; index < bannerQuestionData?.options.length; index++) {
      const bannerQuesOption = bannerQuestionData?.options[index];
      const data: any[] = [];

      for (let quesIndex = 0; quesIndex < subGroups.length; quesIndex++) {
        const values = meanMaxArr[index][quesIndex];
        data.push(values);
      }

      if (data.length)
        seriesData.push({
          name: bannerQuesOption?.labelText,
          values: data,
          labels,
        });
    }
  } else {
    const data: any[] = [];
    let values: any;
    let weightedValueSum: any;
    let weightsSum: any;
    const meanMaxArr: any[] = [];

    chartData.forEach((chart_el: any, chartIndex: Number) => {
      values = chart_el?.values;
      weightedValueSum = chart_el?.weightedValueSum;
      weightsSum = chart_el?.weightsSum;
    });

    const meanValue = mean(values);
    const minValue = min(values);
    const maxValue = max(values);
    const medainValue = median(values);

    meanMaxArr.push(meanValue, medainValue, minValue, maxValue);

    questionData.options.forEach((option: any, Index: any) => {
      data.push(option.labelText);
    });

    seriesData = [
      {
        name: questionData?.labelText,
        labels: data,
        values: meanMaxArr,
      },
    ];
  }

  return seriesData;
}
