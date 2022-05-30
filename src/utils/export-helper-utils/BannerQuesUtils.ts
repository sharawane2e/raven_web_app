import { decimalPrecision } from '../../constants/Variables';
import { IBaseQuestion, IQuestionOption } from '../../types/IBaseQuestion';
import { round } from '../Utility';
import store from '../../redux/store';
import { ChartLabelType } from '../../enums/ChartLabelType';
import _, { find } from 'lodash';
import { QuestionType } from '../../enums/QuestionType';

export function bannerChartDataGen(
  questionData: IBaseQuestion,
  chartData: any,
  bannerQuestionData: any,
) {
  const {
    chart: { chartLabelType, baseCount },
    questions: { bannerQuestionList, selectedBannerQuestionId },
  } = store.getState();

  const labels: Array<string> = questionData.options.map(
    (label: IQuestionOption) => label.labelText,
  );
  let seriesData: Array<Object> = [];
  const chartDataComplete = chartData[0];
  //  console.log("chartDataComplete", chartDataComplete);
  // console.log(questionData);
  // console.log(questionData);

  // const DataAyy = questionData.options.forEach((el: any) => {
  //   el.labelCode;
  // });
  // console.log(DataAyy);
  const questionArr: any = questionData.options.map((label: any) => {
    return label.labelCode;
  });
  //console.log('questionArr', questionArr);

  if (bannerQuestionData)
    bannerQuestionData?.options?.forEach((scaleOption: IQuestionOption) => {
      seriesData.push({
        name: scaleOption.labelText,
        labels,
        values: questionData.options.map((option: IQuestionOption) => {
          if (option.labelCode in chartDataComplete) {
            const obj = chartDataComplete[option.labelCode] || [];

            if (obj && obj.length > 0) {
              let base = obj?.reduce(
                (sum: number, option: any) => sum + option.count,
                0,
              );

              if (
                bannerQuestionData.type == QuestionType.MULTI &&
                questionData.type == QuestionType.MULTI
              ) {
                base = find(chartData[1], function (o) {
                  return o.labelCode === option.labelCode;
                })?.count;
              }

              if (
                bannerQuestionData.type == QuestionType.MULTI &&
                questionData.type == QuestionType.SINGLE
              ) {
                base = find(chartData[1], function (o) {
                  return o.labelCode === option.labelCode;
                })?.count;
              }

              if (
                bannerQuestionData.type == QuestionType.SINGLE &&
                questionData.type == QuestionType.MULTI
              ) {
                base = _.sumBy(
                  chartData[0][option.labelCode],
                  function (o: any) {
                    return o.count;
                  },
                );
              }

              console.log(obj);

              let subOptionData;
              if (Array.isArray(questionArr)) {
                subOptionData = obj.find(
                  (subObj: any) => subObj.labelCode === scaleOption.labelCode,
                );
              } else {
                console.log('de');
                //const labelCodeArr = option.labelCode;
                //console.log(labelCodeArr);
              }

              if (!subOptionData) {
                return 0;
              }

              if (chartLabelType === ChartLabelType.PERCENTAGE) {
                // console.log(subOptionData);

                return subOptionData.count !== undefined
                  ? subOptionData.count === 0
                    ? 0
                    : round(
                        +((subOptionData.count / base) * 100),
                        decimalPrecision,
                      )
                  : 0;
              } else {
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
