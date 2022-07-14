import _ from 'lodash';
import { find, round } from 'lodash';
import {
  colorArr,
  dataLabelsFormate,
  dataLabelsNumberFormate,
  dataUpdatedFormate,
  decimalPrecision,
  primaryBarColor,
} from '../../constants/Variables';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { ChartType } from '../../enums/ChartType';
import { QuestionType } from '../../enums/QuestionType';
import store from '../../redux/store';
import { IQuestionOption } from '../../types/IBaseQuestion';
import {
  getMatchedfilter,
  getSum,
  indexToChar,
  significantDifference,
} from '../Utility';

export const getMultiChartOptionsSeries = (
  questionData: any,
  chartData: any,
  baseCount: any,
  bannerQuestionData: any,
  chartOptionsData: any,
  questionChartData: any,
  bannerChartData: any,
  transposed: any,
) => {
  const {
    chart: { significant },
    questions: { bannerQuestionList },
  } = store.getState();
  const selectedBannerQuestionId = bannerQuestionData?.qId;
  const series: any[] = [];

  const {
    chart: { chartLabelType },
  } = store.getState();

  const {
    chart: { chartType },
  } = store.getState();

  if (selectedBannerQuestionId) {
    if (transposed) {
      if (bannerQuestionData?.type == QuestionType.SINGLE) {
        series.length = 0;
        series.push(
          ...getSingleTransposeChartOptions(
            questionData,
            chartData,
            baseCount,
            bannerQuestionData,
            chartOptionsData,
            questionChartData,
            bannerChartData,
            transposed,
          ),
        );
      }
      if (bannerQuestionData?.type == QuestionType.MULTI) {
      }
    } else {
      series.length = 0;
      series.push(
        ...multiSingleBannerChart(
          questionData,
          chartData,
          bannerQuestionData,
          bannerQuestionList,
          chartLabelType,
        ),
      );
    }
  } else {
    series.length = 0;
    series.push(
      ...getMultiChartSeries(
        questionData,
        chartData,
        baseCount,
        chartLabelType,
        chartType,
      ),
    );
  }
  return series;
};

const getMultiChartSeries = (
  questionData: any,
  chartData: any,
  baseCount: any,
  chartLabelType: any,
  chartType: any,
) => {
  const data: any[] = [];
  const series: any[] = [];
  for (
    let optionIndex = 0;
    optionIndex < questionData.options.length;
    optionIndex++
  ) {
    const option = questionData.options[optionIndex];
    const label = chartData.find(
      (record: { labelCode: string; count: number }) =>
        record.labelCode === option.labelCode,
    );
    let count = 0;
    if (label) {
      count = label.count;
    }
    // const plotValue = +((count / baseCount) * 100).toFixed(decimalPrecision);
    let plotValue;
    // plotValue = (count / baseCount) * 100;
    let percentageValue = (count / baseCount) * 100;
    let numberValue = count;
    if (chartLabelType === ChartLabelType.PERCENTAGE) {
      plotValue = (count / baseCount) * 100;
    } else {
      plotValue = count;
    }

    if (plotValue > 0) {
      const seriesObject = _.find(questionData.options, function (o) {
        return o.labelCode === option.labelCode;
      });
      if (seriesObject?.labelCode.split('_')[0] == 'N') {
        data.push({
          name: option.labelText,
          y: plotValue,
          percentageValue,
          numberValue,
          baseCount: baseCount,
          color: '#f1ad0f',
        });
      } else {
        data.push({
          name: option.labelText,
          y: plotValue,
          percentageValue,
          numberValue,
          baseCount: baseCount,
        });
      }
    }
  }

  let newDataLabels: any;
  if (chartLabelType == ChartLabelType.PERCENTAGE) {
    newDataLabels = dataLabelsFormate;
  } else {
    newDataLabels = dataLabelsNumberFormate;
  }

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
          baseCount: baseCount,
        },
      ];
      series.push({
        name,
        color,
        data,
        dataLabels: {
          ...newDataLabels,
        },
      });
    });
  } else {
    series.push({
      color: primaryBarColor,
      name: questionData.labelText,
      data,
      dataLabels: {
        ...newDataLabels,
      },
    });
  }
  return series;
};

const multiSingleBannerChart = (
  questionData: any,
  chartData: any,
  bannerQuestionData: any,
  bannerQuestionList: any,
  chartLabelType: any,
) => {
  // debugger;
  const {
    chart: { significant },
  } = store.getState();
  const selectedBannerQuestionId = bannerQuestionData?.qId;
  const categories: string[] = [];
  const series: any = [];

  questionData.options.forEach((option: any) => {
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
          (option: any) => option.labelCode === bannerQuesOption.labelCode,
        );

        let localBase = optionData?.reduce(
          (sum: number, option: any) => sum + option.count,
          0,
        );

        const bannerQuestion: any = find(bannerQuestionList, function (o) {
          return o.qId === selectedBannerQuestionId;
        });
        const bannerQuestionType = bannerQuestion.type;

        if (bannerQuestionType == QuestionType.MULTI) {
          //this is working in multi 2 multi
          localBase = find(chartData[0], function (o) {
            return o.labelCode === quesOption.labelCode;
          })?.count;
        }

        if (chartLabelType === ChartLabelType.PERCENTAGE && label) {
          count = (label.count / localBase) * 100;
        } else if (chartLabelType === ChartLabelType.NUMBER && label) {
          count = label.count;
        }

        if (label) {
          let percentageValue = (label.count / localBase) * 100;
          let numberValue = label.count;
          if (count)
            data.push({
              name: quesOption.labelText,
              // y: +count.toFixed(decimalPrecision),
              y: count !== null ? round(count, decimalPrecision) : 0,
              percentageValue,
              numberValue,
              baseCount: localBase,
            });
        }
      }
    }
    let newDataLabels;
    if (significant) {
      newDataLabels = dataUpdatedFormate;
    } else {
      if (chartLabelType == ChartLabelType.PERCENTAGE) {
        newDataLabels = dataLabelsFormate;
      } else {
        newDataLabels = dataLabelsNumberFormate;
      }
    }

    if (data.length)
      series.push({
        name: bannerQuesOption?.labelText,
        color: index < colorArr.length ? colorArr[index] : undefined,
        data,
        dataLabels: {
          ...newDataLabels,
        },
      });
  }

  if (significant) {
    const updatedSeries = getsignificantdifference(series, chartLabelType);
    series.length = 0;
    series.push(...updatedSeries);
  }
  // console.log('updatedSeries', series);
  return series;
};

const getSingleTransposeChartOptions = (
  questionData: any,
  chartData: any,
  baseCount: any,
  bannerQuestionData: any,
  chartOptionsData: any,
  questionChartData: any,
  bannerChartData: any,
  transposed: any,
) => {
  const {
    chart: { chartLabelType, significant },
  } = store.getState();

  const series: any[] = [];
  const labelCodeArr: string[] = [];
  const baseCountArr: number[] = [];

  for (const singleSeriesArr in chartData[0]) {
    chartData[0][singleSeriesArr].forEach((serieObject: any) => {
      if (labelCodeArr.indexOf(serieObject.labelCode) == -1) {
        labelCodeArr.push(serieObject.labelCode);
        baseCountArr.push(0);
      }
    });
  }

  labelCodeArr.forEach((labelCode: string, labelCodeIndex: number) => {
    for (const singleSeriesArr in chartData[0]) {
      const serieObject: any = getMatchedfilter(
        chartData[0][singleSeriesArr],
        'labelCode',
        labelCode,
      );
      baseCountArr[labelCodeIndex] += serieObject[0]?.count
        ? serieObject[0]?.count
        : 0;
    }
  });

  const NettedBannerQuestionData = JSON.parse(
    JSON.stringify(bannerQuestionData),
  );
  if (NettedBannerQuestionData.isGroupNet) {
    NettedBannerQuestionData.options.push(
      ...NettedBannerQuestionData.groupNetData,
    );
  }
  questionData.options.forEach(
    (questionOption: any, questionOptionIndex: number) => {
      const data: any[] = [];
      const name = questionOption.labelText;
      NettedBannerQuestionData.options.forEach(
        (bannerOption: any, bannerOptionIndex: number) => {
          const name = bannerOption.labelText;
          const chartDataArr = chartData[0][questionOption.labelCode];
          const chartObjectArr: any = getMatchedfilter(
            chartDataArr,
            'labelCode',
            bannerOption.labelCode,
          );

          const numberValue = getSum(chartObjectArr, 'count');

          let baseCount: number = 0;

          if (_.isArray(bannerOption.labelCode)) {
            const baseCountIndexArr: number[] = [];
            labelCodeArr.map((labelCode) => {
              if (bannerOption.labelCode.indexOf(labelCode) != -1) {
                baseCountIndexArr.push(labelCodeArr.indexOf(labelCode));
              }
            });

            baseCountIndexArr.forEach((baseCountIndex: number) => {
              baseCount += baseCountArr[baseCountIndex];
            });
          } else {
            const baseCountIndex = labelCodeArr.indexOf(bannerOption.labelCode);
            baseCount = baseCountArr[baseCountIndex];
          }

          const percentageValue = (numberValue / baseCount) * 100;

          data.push({
            name,
            y:
              chartLabelType === ChartLabelType.PERCENTAGE
                ? percentageValue
                : numberValue,
            percentageValue,
            numberValue,
            baseCount,
          });
        },
      );

      let newDataLabels;
      if (significant) {
        newDataLabels = dataUpdatedFormate;
      } else {
        if (chartLabelType == ChartLabelType.PERCENTAGE) {
          newDataLabels = dataLabelsFormate;
        } else {
          newDataLabels = dataLabelsNumberFormate;
        }
      }
      series.push({
        name,
        color: colorArr[questionOptionIndex],
        data,
        dataLabels: {
          ...newDataLabels,
        },
      });
    },
  );
  if (significant) {
    const updatedSeries = getsignificantdifference(series, chartLabelType);
    series.length = 0;
    series.push(...updatedSeries);
  }
  return series;
};

const getsignificantdifference = (series: any, chartLabelType: any) => {
  const updatedSeries = series.map((singleSeries: any) => {
    const updatedSeriesData = {
      ...singleSeries,
      data: singleSeries.data.map((data: any, index: number) => {
        //    const indearr = index > 12 ? index : 0;
        const dataName = data?.name + `(${indexToChar(index)})`;
        return {
          ...data,
          name: dataName,
          //name,
          // name:
          //   data?.name +
          //   `<div className="significante--icon">(${indexToChar(index)})</div>`,
          significance: indexToChar(index),
          significantDiffernce: '',
        };
      }),
      dataLabels: {
        ...singleSeries.dataLabels,
        formatter: function (this: any, options: any) {
          return ` ${parseFloat(this.y.toFixed(2))}${
            chartLabelType == ChartLabelType.PERCENTAGE ? '%' : ''
          } <span class="significante-color">${
            this.point.significantDiffernce
          } </span>`;
        },
      },
    };

    return updatedSeriesData;
  });

  updatedSeries.forEach((singleSeries: any, seriesIndex: number) => {
    const seriesdata: any = singleSeries.data;
    //bubble sort
    for (let i = 0; i < seriesdata.length; i++) {
      const significantArry: any = [];
      const name = [];

      //console.log(seriesdata[i].name);
      for (let j = 0; j < seriesdata.length; j++) {
        // debugger;
        name.push(seriesdata[i].name + indexToChar(j));
        const SignificantObject1: SignificantObject = {
          value: seriesdata[i]['percentageValue'],
          baseCount: seriesdata[i]['baseCount'],
        };
        const SignificantObject2: SignificantObject = {
          value: seriesdata[j]['percentageValue'],
          baseCount: seriesdata[j]['baseCount'],
        };

        if (i != j) {
          const isSignificant = significantDifference(
            SignificantObject1,
            SignificantObject2,
          );

          if (isSignificant) {
            significantArry.push(indexToChar(j));
          }
        }
        //return name;
      }
      if (significantArry.length) {
        singleSeries.data[i]['significantDiffernce'] =
          '(' + significantArry.join('') + ')';
      }
      // console.log('seriesdata', name);
    }
  });

  return updatedSeries;
};

export interface SignificantObject {
  value: any;
  baseCount: any;
}
