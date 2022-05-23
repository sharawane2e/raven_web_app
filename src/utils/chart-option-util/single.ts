import { QuestionType } from "../../enums/QuestionType";
import store from "../../redux/store";
import { IQuestionOption } from "../../types/IBaseQuestion";
import { IQuestion } from "../../types/IQuestion";
import _, { find } from "lodash";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { round } from "../Utility";
import {
  colorArr,
  decimalPrecision,
  primaryBarColor,
} from "../../constants/Variables";
import { dataLabels } from "../../redux/reducers/chartReducer";
import { ChartType } from "../../enums/ChartType";

export const getSingleChartOptionsSeries = (
  questionData: IQuestion,
  chartData: any,
  baseCount: number,
  bannerQuestionData: IQuestion | null,
  chartOptionsData: any
) => {
  const {
    questions: { selectedBannerQuestionId, questionList },
  } = store.getState();

  const {
    chart: { chartLabelType, chartOptions },
  } = store.getState();

  const {
    chart: { chartType },
  } = store.getState();

  const {
    plotOptions: {
      series: {
        dataLabels: { format },
      },
    },
  } = chartOptionsData;

  if (selectedBannerQuestionId) {
    const categories: string[] = [];
    const series: any[] = [];

    questionData.options.forEach((option) => {
      categories.push(option.labelText);
    });

    const subGroups = questionData.options.filter((option: IQuestionOption) => {
      const subGroup = chartData[0][option.labelCode];
      if (subGroup && subGroup?.length) return true;
      return false;
    });

    // @ts-ignore
    for (let index = 0; index < bannerQuestionData?.options.length; index++) {
      const bannerQuesOption = bannerQuestionData?.options[index];
      const data: any[] = [];

      for (let quesIndex = 0; quesIndex < subGroups.length; quesIndex++) {
        const quesOption = subGroups[quesIndex];

        let optionData = chartData[0][quesOption.labelCode];

        let count = 0;
        if (optionData) {
          const label = optionData.find(
            // @ts-ignore
            (option: any) => option.labelCode === bannerQuesOption.labelCode
          );

          let localBase = optionData?.reduce(
            (sum: number, option: any) => sum + option.count,
            0
          );

          if (bannerQuestionData?.type == QuestionType.MULTI) {
            localBase = find(chartData[1], {
              labelCode: quesOption.labelCode,
            })?.count;
          }

          if (chartLabelType === ChartLabelType.PERCENTAGE && label) {
            count = (label.count / localBase) * 100;
          } else if (chartLabelType === ChartLabelType.NUMBER && label) {
            count = label.count;
          }
          //console.log("baseCount", baseCount);
          if (label) {
            let percentageValue =
              label.count == 0 ? label.count : (label.count / localBase) * 100;
            let numberValue = label.count;

            data.push({
              name: quesOption.labelText,
              // y: +count.toFixed(decimalPrecision),
              y:
                count !== null
                  ? label.count == 0
                    ? label.count
                    : round(count, decimalPrecision)
                  : 0,
              percentageValue,
              numberValue,
              baseCount: localBase,
            });
          }
        }
      }

      if (data.length)
        series.push({
          name: bannerQuesOption?.labelText,
          color: index > colorArr.length ? colorArr[index] : undefined,
          data,
          dataLabels,
        });
    }
    return series;
  } else {
    debugger;
    const data: any[] = [];
    for (
      let optionIndex = 0;
      optionIndex < questionData.options.length;
      optionIndex++
    ) {
      const option = questionData.options[optionIndex];
      const label = chartData.find(
        (record: { labelCode: string; count: number }) =>
          record.labelCode === option.labelCode
      );
      let count = 0;
      if (label) {
        count = label.count;
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
          // y: round(plotValue, decimalPrecision),
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
