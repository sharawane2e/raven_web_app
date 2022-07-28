import { IQuestion } from '../../types/IQuestion';
import { ChartLabelType } from '../../enums/ChartLabelType';
import { ChartType } from '../../enums/ChartType';
import { round } from '../Utility';
import {
  colorArr,
  dataLabelsFormate,
  dataLabelsNumberFormate,
  decimalPrecision,
} from '../../constants/Variables';
import { IchartOptionsDto } from '../../types/IChartOptionsDto';

export const getMultiGridChartOptionsData = (chart: IchartOptionsDto) => {
  const {
    questionData,
    chartData,
    baseCount,
    bannerQuestionData,
    chartOptionsData,
    questionChartData,
    bannerChartData,
    transposed,
    significant,
    chartLabelType,
    chartType,
  } = chart;

  const series: any[] = [];

  if (transposed) {
    series.push(
      ...multiGridChartTransposeOptionData(
        questionData,
        chartData,
        baseCount,
        chartLabelType,
        chartType,
      ),
    );
  } else {
    series.push(
      ...multiGridChartOptionData(
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

const multiGridChartOptionData = (
  questionData: IQuestion,
  chartData: any,
  baseCount: number,
  chartLabelType: any,
  chartType: any,
) => {
  const categories = [];
  const series: any[] = [];
  const subGroups = questionData.subGroups.filter((subGroup: any) => {
    const subGroupData = chartData.find(
      (data: any) => data._id === subGroup.qId,
    );
    if (subGroupData && subGroupData.options.length) return true;
    return false;
  });

  for (
    let scaleIndex = 0;
    scaleIndex < questionData.scale.length;
    scaleIndex++
  ) {
    const scale = questionData.scale[scaleIndex];
    const data: any[] = [];
    for (
      let subGroupIndex = 0;
      subGroupIndex < subGroups.length;
      subGroupIndex++
    ) {
      const subGroup = subGroups[subGroupIndex];
      categories.push(subGroup.labelText);
      const optionData = chartData.find((c: any) => c._id === subGroup.qId);

      let count = 0;
      let label;
      if (optionData) {
        label = optionData.options.find(
          (option: any) => option.option === scale.labelCode,
        );

        if (label) {
          count = label.count;
        }
      }
      const base = label.baseCount ? label.baseCount : optionData?.baseCount;
      let plotValue;
      let percentageValue = (count / base) * 100;
      let numberValue = count;
      if (chartLabelType === ChartLabelType.PERCENTAGE) {
        plotValue = (count / base) * 100;
      } else {
        plotValue = count;
      }

      if (chartType === ChartType.LINE) {
        data.push({
          name: subGroup.labelText,
          y: plotValue !== null ? round(plotValue, decimalPrecision) : 0,
          baseCount: base,
          percentageValue,
          numberValue,
        });
      } else {
        data.push({
          name: subGroup.labelText,
          y: plotValue > 0 ? round(plotValue, decimalPrecision) : null,
          percentageValue,
          numberValue,
          baseCount: base,
        });
      }
    }
    let newDataLabels: any;
    if (chartLabelType == ChartLabelType.PERCENTAGE) {
      newDataLabels = dataLabelsFormate;
    } else {
      newDataLabels = dataLabelsNumberFormate;
    }
    if (data.length)
      series.push({
        name: scale.labelText,
        color: colorArr[scaleIndex < colorArr.length ? scaleIndex : 0],
        data,
        dataLabels: {
          ...newDataLabels,
        },
      });
  }
  return series;
};

const multiGridChartTransposeOptionData = (
  questionData: IQuestion,
  chartData: any,
  baseCount: number,
  chartLabelType: any,
  chartType: any,
) => {
  debugger;
  const series: any[] = [];
  const subGroups = questionData.subGroups.filter((subGroup: any) => {
    const subGroupData = chartData.find(
      (data: any) => data._id === subGroup.qId,
    );
    if (subGroupData && subGroupData.options.length) return true;
    return false;
  });

  subGroups.forEach((subGroupLabel: any, subIndex: number) => {
    const data: any[] = [];
    questionData.scale.forEach((scale: any, scaleIndex: number) => {
      const optionData = chartData.find(
        (c: any) => c._id === subGroupLabel.qId,
      );
      let count = 0;
      let label: any;
      if (optionData) {
        label = optionData.options.find(
          (option: any) => option?.option === scale?.labelCode,
        );
      }
      if (label) {
        count = label.count;
      }

      const base = optionData?.baseCount || baseCount;
      let newBaseCount = base;

      let plotValue;
      let percentageValue = (count / newBaseCount) * 100;
      let numberValue = count;
      if (chartLabelType === ChartLabelType.PERCENTAGE) {
        plotValue = (count / newBaseCount) * 100;
      } else {
        plotValue = count;
      }
      data.push({
        name: scale.labelText,
        y: plotValue > 0 ? round(plotValue, decimalPrecision) : null,
        percentageValue,
        numberValue,
        baseCount: newBaseCount,
      });
    });
    let newDataLabels: any;
    if (chartLabelType == ChartLabelType.PERCENTAGE) {
      newDataLabels = dataLabelsFormate;
    } else {
      newDataLabels = dataLabelsNumberFormate;
    }
    if (data.length) {
      series.push({
        name: subGroupLabel.labelText,
        color: colorArr[subIndex < colorArr.length ? subIndex : 0],
        data,
        dataLabels: {
          ...newDataLabels,
        },
      });
    }
  });

  return series;
};
