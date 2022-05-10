import { mean, median, min, max } from 'simple-statistics';
import store from '../../redux/store';
import { IQuestionOption } from '../../types/IBaseQuestion';

export function numberChartDataGen(
  questionData: any,
  chartData: any,
  chartTranspose: any,
  bannerQuestionData: any,
) {
  console.log(questionData);
  console.log(chartData);
  console.log(chartTranspose);
  console.log(bannerQuestionData);
  const {
    questions: { selectedBannerQuestionId },
  } = store.getState();
  let seriesData: Array<Object> = [];

  if (selectedBannerQuestionId) {
    const meanMaxArr: any[] = [];
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

    console.log('chart_el.length', chartOptionsData);
    chartOptionsData.forEach((chart_el: any, chartIndex: Number) => {
      if (chart_el.length) {
        const meanMediaArr: any = [];
        const chartelment = chart_el[0];
        const meanValue = mean(chartelment?.values);
        const minValue = min(chartelment?.values);
        const maxValue = max(chartelment?.values);
        const medainValue = median(chartelment?.values);
        meanMediaArr.push(meanValue, medainValue, minValue, maxValue);
        meanMaxArr.push(meanMediaArr);
      }
    });

    for (let index = 0; index < bannerQuestionData?.options.length; index++) {
      const bannerQuesOption = bannerQuestionData?.options[index];
      const data: any[] = [];

      for (let quesIndex = 0; quesIndex < subGroups.length; quesIndex++) {
        if (meanMaxArr[index] != undefined) {
          const values: any = meanMaxArr[index][quesIndex];
          data.push(values);
        }
      }

      if (data.length)
        seriesData.push({
          name: bannerQuesOption?.labelText,
          values: data,
          labels,
        });
    }

    if (chartTranspose) {
      const transposedSeries = [];
      for (let index = 0; index < questionData.options.length; index++) {
        //console.log(questionData.options[index]);
        const seriesName = questionData.options[index].labelText;
        const data: any[] = [];
        const labels: any[] = [];

        for (let quesIndex = 0; quesIndex < seriesData.length; quesIndex++) {
          const dataValue: any = seriesData[quesIndex];
          data.push(dataValue.values[index]);
          labels.push(dataValue.name);
        }

        // console.log('transposedSeries', data);
        if (data.length)
          transposedSeries.push({
            name: seriesName,
            values: data,
            labels,
          });
      }

      seriesData.length = 0;
      seriesData.push(...transposedSeries);
    }
  } else {
    const data: any[] = [];
    let values: any;
    let weightedValueSum: any;
    let weightsSum: any;
    const meanMaxArr: any[] = [];

    values = chartData[0]?.values;
    weightedValueSum = chartData[0]?.weightedValueSum;
    weightsSum = chartData[0]?.weightsSum;

    console.log(values);

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
