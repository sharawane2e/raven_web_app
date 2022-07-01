import { decimalPrecision } from "../../constants/Variables";
import { IBaseQuestion, IQuestionOption } from "../../types/IBaseQuestion";
import { getMatchedfilter, getmatchedFind, round } from "../Utility";
import store from "../../redux/store";
import { ChartLabelType } from "../../enums/ChartLabelType";
import _, { find } from "lodash";
import { QuestionType } from "../../enums/QuestionType";

export function bannerChartDataGen(
  questionData: IBaseQuestion,
  chartData: any,
  bannerQuestionData: any,
  chartTranspose: any
) {
  const {
    chart: { chartLabelType },
  } = store.getState();

  let seriesData: any = [];

  if (
    bannerQuestionData &&
    bannerQuestionData?.type == QuestionType.SINGLE &&
    questionData.type == QuestionType.SINGLE
  ) {
    if (!chartTranspose && bannerQuestionData?.type == QuestionType.SINGLE) {
      return getSingleOptions(bannerQuestionData, questionData, chartData);
    } else {
      seriesData.length = 0;
      seriesData.push(
        ...getSingleTransposeTableOptions(
          questionData,
          chartData,
          bannerQuestionData,
          chartTranspose
        )
      );
      return seriesData;
    }
  } else {
    return getSingleOptions(bannerQuestionData, questionData, chartData);
  }
}

const getSingleOptions = (
  bannerQuestionData: any,
  questionData: any,
  chartData: any
) => {
  const {
    chart: { chartLabelType },
  } = store.getState();

  //let labels: any = [];

  let seriesData: any = [];
  const newOptionData: any = [];
  const chartDataComplete = chartData[0];
  let count = 0;
  let localBase = 0;

  // const labels: Array<string> = questionData.options.map(
  //   (label: IQuestionOption) => {
  //     if (label.labelCode in chartDataComplete) {
  //       const obj = chartDataComplete[label.labelCode] || [];
  //       if (obj && obj.length != 0 && label.labelText != undefined) {
  //         console.log(label.labelText);
  //         return label.labelText;
  //       }
  //     }
  //   }
  // );

  let labels: any = [];

  questionData.options.map((option: IQuestionOption) => {
    if (option.labelCode in chartDataComplete) {
      const obj = chartDataComplete[option.labelCode] || [];
      if (obj && obj.length != 0) {
        labels.push(option.labelText);
      }
    }
  });
  //console.log("dataMain", labels);

  //console.log(labels);
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
              0
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
            "labelCode",
            scaleOption.labelCode
          );
          count = _.sumBy(label, function (o) {
            return o.count;
          });
          localBase = optionData?.reduce(
            (sum: number, option: any) => sum + option.count,
            0
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
          // console.log("obj", obj);
          if (obj && obj.length != 0) {
            // labels.push(option?.labelText);
            // console.log(option?.labelText);
            let base = obj?.reduce(
              (sum: number, option: any) => sum + option.count,
              0
            );
            //console.log("base", base);
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
              //   debugger;
              // base = find(chartData[1], function (o) {
              //   return o.labelCode === option.labelCode;
              // })?.count;
              //console.log(option?.labelCode);
              const optionData = chartData[0][option?.labelCode];
              // base = find(obj, function (o) {
              //   return o?.labelCode === option?.labelCode;
              // })?.count;
              base = optionData?.reduce(
                (sum: number, option: any) => sum + option.count,
                0
              );
              //console.log("optionData", base);
            }

            if (
              bannerQuestionData.type == QuestionType.SINGLE &&
              questionData.type == QuestionType.MULTI
            ) {
              base = _.sumBy(chartData[0][option.labelCode], function (o: any) {
                return o.count;
              });
              //console.log("Demo", base);
            }
            let subOptionData;
            subOptionData = obj.find(
              (subObj: any) => subObj.labelCode === scaleOption.labelCode
            );
            if (!subOptionData) {
              return 0;
            }

            console.log("obj", obj);

            if (chartLabelType === ChartLabelType.PERCENTAGE) {
              const subOptionDataCount =
                subOptionData.count !== undefined
                  ? subOptionData.count === 0
                    ? 0
                    : round(
                        +((subOptionData.count / base) * 100),
                        decimalPrecision
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
    //console.log(labels);
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: countValues,
    });
  });
  // console.log(seriesData);
  return seriesData;
};

const getSingleTransposeTableOptions = (
  questiondata: any,
  chartData: any,
  bannerQuestionData: any,
  chartTranspose: any
) => {
  console.log("inside data for table");
  const {
    chart: { chartLabelType },
  } = store.getState();
  let seriesData: Array<Object> = [];
  // const chartDataComplete = chartData[0];
  let count = 0;
  let localBase = 0;
  const newOptionData: any = [];
  const labels: Array<string> = bannerQuestionData.options.map(
    (label: IQuestionOption) => label.labelText
  );

  const allLabels: Array<string> = [];
  const newChartData: any = {};
  const basecountArr: any = [];

  for (const labelArrays in chartData[0]) {
    const labelArray = chartData[0][labelArrays];
    labelArray.forEach((el: any) => {
      if (allLabels.indexOf(el?.labelCode) == -1) {
        allLabels.push(el?.labelCode);
        newChartData[el?.labelCode] = [];
      }
      newChartData[el?.labelCode].push({
        count: el?.count,
        labelCode: labelArrays,
      });
    });
  }
  for (const key in newChartData) {
    const localBaseCount = _.sumBy(newChartData[key], function (o: any) {
      return o?.count;
    });
    basecountArr.push(localBaseCount);
  }
  //debugger;

  questiondata?.options?.forEach((scaleOption: IQuestionOption) => {
    const countValues: any = [];
    let optionData;
    bannerQuestionData.options.map(
      (option: IQuestionOption, quesIndex: any) => {
        if (
          bannerQuestionData.type == QuestionType.SINGLE &&
          questiondata.type == QuestionType.SINGLE
        ) {
          if (Array.isArray(scaleOption.labelCode)) {
            const labelCodeArr = scaleOption.labelCode;

            //const labelCodeSum: any = [];
            //const baseCountSum: any = [];
            var labeCodeSum = 0;
            for (let j = 0; j < labelCodeArr.length; j++) {
              let currKey = labelCodeArr[j];
              let dataArr = chartData[0][currKey];
              for (let k: any = 0; k < dataArr.length; k++) {
                if (dataArr[k].labelCode === option.labelCode) {
                  const dataArrValues: any = dataArr[k];
                  newOptionData.push(dataArrValues);
                  labeCodeSum += dataArrValues.count;
                }
              }
            }

            count = labeCodeSum;
          } else {
            optionData = chartData[0][scaleOption?.labelCode];

            const label = getmatchedFind(
              optionData,
              "labelCode",
              option?.labelCode
            );

            count = label?.count;
          }

          localBase = basecountArr[quesIndex];

          //console.log(count);

          if (chartLabelType === ChartLabelType.PERCENTAGE) {
            if (count === 0 || count === undefined) {
              count = 0;
            } else {
              count = (count / localBase) * 100;
            }
          } else {
            count = count;
          }
          countValues.push(count);
        }
      }
    );
    seriesData.push({
      name: scaleOption.labelText,
      labels,
      values: countValues,
    });
  });
  // console.log(seriesData);
  return seriesData;
};
