import { decimalPrecision } from '../../constants/Variables';
import { IBaseQuestion, IQuestionOption } from '../../types/IBaseQuestion';
import { getMatchedfilter, round } from '../Utility';
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
    chart: { chartLabelType, chartTranspose },
  } = store.getState();

  const labels: Array<string> = questionData.options.map(
    (label: IQuestionOption) => label.labelText,
  );
  let seriesData: any = [];
  const chartDataComplete = chartData[0];
  let count = 0;
  let localBase = 0;
  const newOptionData: any = [];

  if (bannerQuestionData) {
    if (!chartTranspose) {
      bannerQuestionData?.options?.forEach((scaleOption: IQuestionOption) => {
        const countValues: any = [];
        let optionData;
        questionData.options.map((option: IQuestionOption) => {
          if (
            bannerQuestionData.type == QuestionType.SINGLE &&
            questionData.type == QuestionType.SINGLE
          ) {
            if (Array.isArray(option.labelCode)) {
              const labelCodeArr = option.labelCode;
              const labelCodeSum: any = [];
              const baseCountSum: any = [];
              var labeCodeSum = 0;
              for (let j = 0; j < labelCodeArr.length; j++) {
                let currKey = labelCodeArr[j];
                let dataArr = chartData[0][currKey];
                labelCodeSum.push(dataArr);
                for (let k: any = 0; k < dataArr.length; k++) {
                  if (dataArr[k].labelCode === scaleOption.labelCode) {
                    const dataArrValues: any = dataArr[k];
                    newOptionData.push(dataArrValues);
                    labeCodeSum += dataArrValues.count;
                  }
                }
              }
              optionData = newOptionData;
              labelCodeSum.forEach((el: any) => {
                const localbaseCount = el?.reduce(
                  (sum: number, option: any) => sum + option.count,
                  0,
                );
                baseCountSum.push(localbaseCount);
              });
              count = labeCodeSum;
              const sumofValue = _.sum(baseCountSum);
              localBase = sumofValue;
            } else {
              optionData = chartData[0][option.labelCode];
              const label = getMatchedfilter(
                optionData,
                'labelCode',
                scaleOption.labelCode,
              );
              count = _.sumBy(label, function (o) {
                return o.count;
              });
              localBase = optionData?.reduce(
                (sum: number, option: any) => sum + option.count,
                0,
              );
            }
            if (chartLabelType === ChartLabelType.PERCENTAGE) {
              if (count == 0 && localBase == 0) {
                count = 0;
              } else {
                count = (count / localBase) * 100;
              }
            } else {
              count = count;
            }
            //console.log(count);
            countValues.push(count);
          } else {
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
                let subOptionData;
                subOptionData = obj.find(
                  (subObj: any) => subObj.labelCode === scaleOption.labelCode,
                );
                if (!subOptionData) {
                  return 0;
                }
                if (chartLabelType === ChartLabelType.PERCENTAGE) {
                  const subOptionDataCount =
                    subOptionData.count !== undefined
                      ? subOptionData.count === 0
                        ? 0
                        : round(
                            +((subOptionData.count / base) * 100),
                            decimalPrecision,
                          )
                      : 0;
                  countValues.push(subOptionDataCount);
                } else {
                  const subOptionDataCount =
                    subOptionData.count !== undefined ? subOptionData.count : 0;
                  countValues.push(subOptionDataCount);
                }
              }
            }
          }
        });
        //console.log(countValues);
        seriesData.push({
          name: scaleOption.labelText,
          labels,
          values: countValues,
        });
      });
    } else {
      //debugger;
      bannerQuestionData?.options?.forEach((scaleOption: IQuestionOption) => {
        const countValues: any = [];
        let optionData;
        questionData.options.map((option: IQuestionOption) => {
          if (
            bannerQuestionData.type == QuestionType.SINGLE &&
            questionData.type == QuestionType.SINGLE
          ) {
            if (Array.isArray(option.labelCode)) {
              const labelCodeArr = option.labelCode;
              const labelCodeSum: any = [];
              const baseCountSum: any = [];
              var labeCodeSum = 0;
              for (let j = 0; j < labelCodeArr.length; j++) {
                let currKey = labelCodeArr[j];
                let dataArr = chartData[0][currKey];
                labelCodeSum.push(dataArr);
                for (let k: any = 0; k < dataArr.length; k++) {
                  if (dataArr[k].labelCode === scaleOption.labelCode) {
                    const dataArrValues: any = dataArr[k];
                    newOptionData.push(dataArrValues);
                    labeCodeSum += dataArrValues.count;
                  }
                }
              }
              optionData = newOptionData;
              labelCodeSum.forEach((el: any) => {
                const localbaseCount = el?.reduce(
                  (sum: number, option: any) => sum + option.count,
                  0,
                );
                baseCountSum.push(localbaseCount);
              });
              count = labeCodeSum;
              const sumofValue = _.sum(baseCountSum);
              localBase = sumofValue;
            } else {
              optionData = chartData[0][option.labelCode];
              const label = getMatchedfilter(
                optionData,
                'labelCode',
                scaleOption.labelCode,
              );
              count = _.sumBy(label, function (o) {
                return o.count;
              });
              localBase = optionData?.reduce(
                (sum: number, option: any) => sum + option.count,
                0,
              );
            }
            if (chartLabelType === ChartLabelType.PERCENTAGE) {
              if (count == 0 && localBase == 0) {
                count = 0;
              } else {
                count = (count / localBase) * 100;
              }
            } else {
              count = count;
            }
            //console.log(count);
            countValues.push(count);
          } else {
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
                let subOptionData;
                subOptionData = obj.find(
                  (subObj: any) => subObj.labelCode === scaleOption.labelCode,
                );
                if (!subOptionData) {
                  return 0;
                }
                if (chartLabelType === ChartLabelType.PERCENTAGE) {
                  const subOptionDataCount =
                    subOptionData.count !== undefined
                      ? subOptionData.count === 0
                        ? 0
                        : round(
                            +((subOptionData.count / base) * 100),
                            decimalPrecision,
                          )
                      : 0;
                  countValues.push(subOptionDataCount);
                } else {
                  const subOptionDataCount =
                    subOptionData.count !== undefined ? subOptionData.count : 0;
                  countValues.push(subOptionDataCount);
                }
              }
            }
          }
        });
        //console.log(countValues);
        seriesData.push({
          name: scaleOption.labelText,
          labels,
          values: countValues,
        });
      });
    }
  }

  //console.log(seriesData);
  return seriesData;
}

// const getSingleTransposeTableOptions = (
//   questionData: any,
//   chartData: any,
//   bannerQuestionData: any,
// ) => {
//   const {
//     chart: { chartLabelType },
//   } = store.getState();
//   let seriesData: Array<Object> = [];
//   const chartDataComplete = chartData[0];
//   let count = 0;
//   let localBase = 0;
//   const newOptionData: any = [];
//   const labels: Array<string> = questionData.options.map(
//     (label: IQuestionOption) => label.labelText,
//   );

//   bannerQuestionData?.options?.forEach((scaleOption: IQuestionOption) => {
//     const countValues: any = [];
//     let optionData;
//     questionData.options.map((option: IQuestionOption) => {
//       if (
//         bannerQuestionData.type == QuestionType.SINGLE &&
//         questionData.type == QuestionType.SINGLE
//       ) {
//         if (Array.isArray(option.labelCode)) {
//           const labelCodeArr = option.labelCode;
//           const labelCodeSum: any = [];
//           const baseCountSum: any = [];
//           var labeCodeSum = 0;
//           for (let j = 0; j < labelCodeArr.length; j++) {
//             let currKey = labelCodeArr[j];
//             let dataArr = chartData[0][currKey];
//             labelCodeSum.push(dataArr);
//             for (let k: any = 0; k < dataArr.length; k++) {
//               if (dataArr[k].labelCode === scaleOption.labelCode) {
//                 const dataArrValues: any = dataArr[k];
//                 newOptionData.push(dataArrValues);
//                 labeCodeSum += dataArrValues.count;
//               }
//             }
//           }
//           optionData = newOptionData;

//           labelCodeSum.forEach((el: any) => {
//             const localbaseCount = el?.reduce(
//               (sum: number, option: any) => sum + option.count,
//               0,
//             );
//             baseCountSum.push(localbaseCount);
//           });

//           count = labeCodeSum;
//           const sumofValue = _.sum(baseCountSum);
//           localBase = sumofValue;
//         } else {
//           optionData = chartData[0][option.labelCode];

//           const label = getMatchedfilter(
//             optionData,
//             'labelCode',
//             scaleOption.labelCode,
//           );

//           count = _.sumBy(label, function (o) {
//             return o.count;
//           });
//           localBase = optionData?.reduce(
//             (sum: number, option: any) => sum + option.count,
//             0,
//           );
//         }

//         if (chartLabelType === ChartLabelType.PERCENTAGE) {
//           if (count == 0 && localBase == 0) {
//             count = 0;
//           } else {
//             count = (count / localBase) * 100;
//           }
//         } else {
//           count = count;
//         }
//         //console.log(count);
//         countValues.push(count);
//       } else {
//         if (option.labelCode in chartDataComplete) {
//           const obj = chartDataComplete[option.labelCode] || [];
//           if (obj && obj.length > 0) {
//             let base = obj?.reduce(
//               (sum: number, option: any) => sum + option.count,
//               0,
//             );

//             if (
//               bannerQuestionData.type == QuestionType.MULTI &&
//               questionData.type == QuestionType.MULTI
//             ) {
//               base = find(chartData[1], function (o) {
//                 return o.labelCode === option.labelCode;
//               })?.count;
//             }

//             if (
//               bannerQuestionData.type == QuestionType.MULTI &&
//               questionData.type == QuestionType.SINGLE
//             ) {
//               base = find(chartData[1], function (o) {
//                 return o.labelCode === option.labelCode;
//               })?.count;
//             }

//             if (
//               bannerQuestionData.type == QuestionType.SINGLE &&
//               questionData.type == QuestionType.MULTI
//             ) {
//               base = _.sumBy(chartData[0][option.labelCode], function (o: any) {
//                 return o.count;
//               });
//             }

//             let subOptionData;

//             subOptionData = obj.find(
//               (subObj: any) => subObj.labelCode === scaleOption.labelCode,
//             );

//             if (!subOptionData) {
//               return 0;
//             }

//             if (chartLabelType === ChartLabelType.PERCENTAGE) {
//               const subOptionDataCount =
//                 subOptionData.count !== undefined
//                   ? subOptionData.count === 0
//                     ? 0
//                     : round(
//                         +((subOptionData.count / base) * 100),
//                         decimalPrecision,
//                       )
//                   : 0;
//               countValues.push(subOptionDataCount);
//             } else {
//               const subOptionDataCount =
//                 subOptionData.count !== undefined ? subOptionData.count : 0;
//               countValues.push(subOptionDataCount);
//             }
//           }
//         }
//       }
//     });

//     //   //console.log(countValues);

//     seriesData.push({
//       name: scaleOption.labelText,
//       labels,
//       values: countValues,
//     });
//   });
//   console.log(seriesData);
//   return seriesData;
// };
