import { QuestionType } from "../../enums/QuestionType";
import store from "../../redux/store";
import { IQuestionOption } from "../../types/IBaseQuestion";
import { IQuestion } from "../../types/IQuestion";
import _, { find } from "lodash";
import { ChartLabelType } from "../../enums/ChartLabelType";
import {
  getMatchedfilter,
  getmatchedFind,
  getSum,
  indexToChar,
  round,
} from "../Utility";
import { colorArr, primaryBarColor } from "../../constants/Variables";
import { dataLabels } from "../../redux/reducers/chartReducer";
import { ChartType } from "../../enums/ChartType";
import { number } from "yup";
import { cumulativeStdNormalProbability } from "simple-statistics";

export const getSingleChartOptionsSeries = (
  questionData: IQuestion,
  chartData: any,
  baseCount: number,
  bannerQuestionData: IQuestion | null,
  chartOptionsData: any,
  transposed: boolean
) => {
  const {
    chart: { chartLabelType, chartType, significant },
    questions: { selectedBannerQuestionId, bannerQuestionList },
  } = store.getState();

  if (selectedBannerQuestionId) {
    const series: any[] = [];
    let subGroups: any;
    let count = 0;

    subGroups = questionData.options.filter((option: IQuestionOption) => {
      const subGroup: any = [];
      const subGroup1 = getmatchedFind(
        questionData.options,
        "labelCode",
        option.labelCode
      );
      subGroup.push(subGroup1);
      if (subGroup && subGroup?.length) return true;
      return false;
    });

    if (transposed && bannerQuestionData?.type == QuestionType.SINGLE) {
      series.length = 0;
      series.push(
        ...getSingleTransposeChartOptions(
          questionData,
          chartData,
          bannerQuestionData,
          subGroups,
          transposed
        )
      );

      if (significant) {
        return getsignificantdifference(series);
      } else {
        return series;
      }
    }

    const newOptionData: any = [];
    // @ts-ignore
    for (let index = 0; index < bannerQuestionData?.options.length; index++) {
      const bannerQuesOption: any = bannerQuestionData?.options[index];
      const data: any[] = [];
      let localBase;

      let optionData;
      for (let quesIndex = 0; quesIndex < subGroups.length; quesIndex++) {
        const quesOption = subGroups[quesIndex];

        if (Array.isArray(quesOption.labelCode)) {
          const labelCodeArr = quesOption.labelCode;
          const labelCodeSum: any = [];
          const baseCountSum: any = [];
          var labeCodeSum = 0;
          for (let j = 0; j < labelCodeArr.length; j++) {
            let currKey = labelCodeArr[j];
            let dataArr = chartData[0][currKey];
            labelCodeSum.push(dataArr);
            for (let k: any = 0; k < dataArr.length; k++) {
              if (dataArr[k].labelCode === bannerQuesOption.labelCode) {
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
          optionData = chartData[0][quesOption.labelCode];

          const label = getMatchedfilter(
            optionData,
            "labelCode",
            bannerQuesOption.labelCode
          );
          count = _.sumBy(label, function (o) {
            return o.count;
          });
          localBase = optionData?.reduce(
            (sum: number, option: any) => sum + option.count,
            0
          );
        }

        let percentageValue;
        let numberValue;
        if (chartLabelType === ChartLabelType.PERCENTAGE) {
          numberValue = count;
          count = (count / localBase) * 100;
          percentageValue = count;
        } else {
          numberValue = count;
          count = count;
          percentageValue = (count / localBase) * 100;
        }

        data.push({
          name: quesOption.labelText,
          y: count,
          percentageValue,
          numberValue,
          baseCount: localBase,
          // sd: ,
        });
      }

      if (data.length)
        series.push({
          name: bannerQuesOption?.labelText,
          color: index > colorArr.length ? colorArr[index] : undefined,
          data,
          dataLabels: {
            enabled: true,
            // format: '{point.y:.1f}%',
            formatter: function (this: any) {
              // if (this.y > 100) {
              //   return this.y + 'CB';
              // }
              return ` ${parseFloat(this.y.toFixed(2))}`;
            },
            style: {
              fontSize: "10px",
              textOutline: false,
              fontWeight: null,
            },
          },
        });
    }

    if (significant) {
      return getsignificantdifference(series);
    } else {
      return series;
    }
  } else {
    const data: any[] = [];

    for (
      let optionIndex = 0;
      optionIndex < questionData.options.length;
      optionIndex++
    ) {
      const option = questionData.options[optionIndex];

      const labelCollection = getMatchedfilter(
        chartData,
        "labelCode",
        option.labelCode
      );

      let count = 0;
      if (labelCollection) {
        count = getSum(labelCollection, "count");
      }
      let plotValue;
      let percentageValue = (count / baseCount) * 100;
      let numberValue = count;
      if (chartLabelType === ChartLabelType.PERCENTAGE) {
        plotValue = (count / baseCount) * 100;
      } else {
        plotValue = count;
      }
      if (plotValue > 0)
        data.push({
          name: option.labelText,
          y: plotValue,
          percentageValue,
          numberValue,
          baseCount: baseCount,
        });
    }

    const series: any[] = [];

    if (chartType === ChartType.STACK) {
      data.map((element: any, index: number) => {
        const name = element.name;
        const color = colorArr[index];
        const data = [
          {
            name: questionData.labelText,
            y: element.y,
            numberValue: element.numberValue,
            percentageValue: element.percentageValue,
            baseCount: element.baseCount,
          },
        ];
        series.push({ name, color, data, dataLabels });
      });
    } else {
      series.push({
        color: primaryBarColor,
        name: questionData.labelText,
        data,
        dataLabels,
      });
    }

    return series;
  }
};

const getSingleTransposeChartOptions = (
  questiondata: any,
  chartData: any,
  bannerQuestionData: any,
  optionSubGroups: any,
  transposed: any
) => {
  const {
    chart: { chartLabelType, chartTranspose },
  } = store.getState();

  const series: any[] = [];
  let count = 0;
  const newOptionData: any = [];
  const allLabels: Array<string> = [];
  const newChartData: any = {};
  const basecountArr: any = [];
  //let dataSum = [];

  for (const labelArrays in chartData[0]) {
    const labelArray = chartData[0][labelArrays];
    labelArray.forEach((el: any) => {
      if (allLabels.indexOf(el.labelCode) == -1) {
        allLabels.push(el.labelCode);
        newChartData[el.labelCode] = [];
      }
      newChartData[el.labelCode].push({
        count: el.count,
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

  for (let index = 0; index < questiondata?.options.length; index++) {
    const quesOption = optionSubGroups[index];
    const data: any[] = [];
    let localBase;
    let optionData: any;

    for (
      let quesIndex = 0;
      quesIndex < bannerQuestionData?.options.length;
      quesIndex++
    ) {
      const bannerQuesOption: any = bannerQuestionData?.options[quesIndex];

      if (Array.isArray(quesOption.labelCode)) {
        const labelCodeArr = quesOption.labelCode;
        const labelCodeSum: any = [];
        // const baseCountSum: any = [];
        var labeCodeSum = 0;
        for (let j = 0; j < labelCodeArr.length; j++) {
          let currKey = labelCodeArr[j];
          let dataArr = chartData[0][currKey];
          labelCodeSum.push(dataArr);
          for (let k: any = 0; k < dataArr.length; k++) {
            if (dataArr[k].labelCode === bannerQuesOption?.labelCode) {
              const dataArrValues: any = dataArr[k];
              newOptionData.push(dataArrValues);
              labeCodeSum += dataArrValues?.count;
            }
          }
        }

        count = labeCodeSum;
      } else {
        optionData = chartData[0][quesOption?.labelCode];
        // console.log("optionData", optionData);
        // console.log('optionData', optionData);
        const label = getmatchedFind(
          optionData,
          "labelCode",
          bannerQuesOption?.labelCode
        );

        count = label?.count;
      }

      localBase = basecountArr[quesIndex];

      if (chartLabelType === ChartLabelType.PERCENTAGE) {
        count = (count / localBase) * 100;
      } else {
        count = count;
      }

      let percentageValue = (count / localBase) * 100;
      let numberValue = count;
      data.push({
        name: bannerQuesOption?.labelText,
        y: count,
        percentageValue,
        numberValue,
        baseCount: localBase,
      });
    }

    series.push({
      name: quesOption?.labelText,
      color: index < colorArr.length ? colorArr[index] : undefined,
      data,
      dataLabels,
    });
  }
  return series;
};

const getsignificantdifference = (series: any) => {
  const updatedSeries = series.map((singleSeries: any) => {
    const updatedSeriesData = {
      ...singleSeries,
      data: singleSeries.data.map((data: any, index: number) => {
        return {
          ...data,
          significance: indexToChar(index),
          significantDiffernce: "",
        };
      }),
      dataLabels: {
        ...singleSeries.dataLabels,
        formatter: function (this: any, options: any) {
          // if (this.y > 100) {
          //   return this.y + 'CB';
          // }
          // console.log(this);
          return ` ${parseFloat(this.y.toFixed(2))} ${
            this.point.significantDiffernce
          }`;
        },
      },
    };
    return updatedSeriesData;
  });

  updatedSeries.forEach((singleSeries: any, seriesIndex: number) => {
    const seriesdata: any = singleSeries.data;
    //bubble sort
    for (let i = 0; i < seriesdata.length; i++) {
      const significantArry = [];
      for (let j = 0; j < seriesdata.length; j++) {
        const SignificantObject1: SignificantObject = {
          value: seriesdata[i]["percentageValue"],
          baseCount: seriesdata[i]["baseCount"],
        };
        const SignificantObject2: SignificantObject = {
          value: seriesdata[j]["percentageValue"],
          baseCount: seriesdata[j]["baseCount"],
        };
        if (i != j) {
          const isSignificant = significant(
            SignificantObject1,
            SignificantObject2
          );

          // console.log(isSignificant);

          if (isSignificant) {
            //console.log(i);
            //console.log(j);
            significantArry.push(indexToChar(j));
          }
        }
      }
      // console.log(significantArry);
      if (significantArry.length) {
        singleSeries.data[i]["significantDiffernce"] =
          "(" + significantArry.join("") + ")";
      }
    }
  });
  return updatedSeries;
};

interface SignificantObject {
  value: any;
  baseCount: any;
}

const significant = (
  SignificantObject1: SignificantObject,
  SignificantObject2: SignificantObject
) => {
  const B1 = SignificantObject1.value / 100;
  const B2 = SignificantObject1.baseCount;
  const B4 = SignificantObject2.value / 100;
  const B5 = SignificantObject2.baseCount;

  const poledSampleData = (B1 * B2 + B4 * B5) / (B2 + B5);
  const testStatistic =
    (B1 - B4) /
    Math.sqrt(poledSampleData * (1 - poledSampleData) * (1 / B2 + 1 / B5));

  const result = 2 * (1 - cumulativeStdNormalProbability(testStatistic));

  if (result < 0.05) {
    return true;
  }

  return false;
};
