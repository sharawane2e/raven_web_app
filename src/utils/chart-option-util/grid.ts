import store from "../../redux/store";
import { IQuestion } from "../../types/IQuestion";
import _, { find } from "lodash";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { getMatchedfilter, getmatchedFind, round } from "../Utility";
import {
  colorArr,
  decimalPrecision,
  decimalPrecision2,
} from "../../constants/Variables";
import { dataLabels } from "../../redux/reducers/chartReducer";
import { ChartType } from "../../enums/ChartType";
import { StaticText } from "../../constants/StaticText";
import {
  getsampleStandardDeviation,
  getStandarderrorFunction,
} from "../simplestatistics";

export const getGridChartoptionSeries = (
  questionData: any,
  chartData: any,
  baseCount: any
) => {
  debugger;
  const categories = [];
  const series = [];
  const {
    chart: { chartLabelType, chartType, chartTranspose },
  } = store.getState();

  if (chartTranspose) {
    series.length = 0;
    series.push(...getGridTransposeChartOptions(questionData, chartData));
    return series;
  }

  const subGroups = questionData.subGroups.filter((subGroup: any) => {
    const subGroupData = getmatchedFind(chartData, "_id", subGroup.qId);
    if (subGroupData && subGroupData.options.length) return true;
    return false;
  });

  const scales = [...questionData.scale];

  for (let scaleIndex = 0; scaleIndex < scales.length; scaleIndex++) {
    const scale = scales[scaleIndex];

    const data: any[] = [];
    for (
      let subGroupIndex = 0;
      subGroupIndex < subGroups.length;
      subGroupIndex++
    ) {
      const subGroup = subGroups[subGroupIndex];
      categories.push(subGroup.labelText);

      const optionData = getmatchedFind(chartData, "_id", subGroup.qId);
      const labels = getMatchedfilter(
        optionData.options,
        "option",
        scale.labelCode
      );

      const count = _.sumBy(labels, function (o) {
        return o.count;
      });

      const base = optionData?.baseCount || baseCount;
      let plotValue;
      let percentageValue = (count / base) * 100;
      let numberValue = count;

      if (chartLabelType === ChartLabelType.PERCENTAGE) {
        plotValue = (count / base) * 100;
      } else {
        plotValue = count;
      }

      if (chartType == ChartType.LINE) {
        data.push({
          name: subGroup.labelText,
          y: plotValue !== null ? round(plotValue, decimalPrecision) : 0,
          percentageValue,
          numberValue,
          baseCount: base,
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
    series.push({
      name: scale.labelText,
      color: colorArr[scaleIndex < colorArr.length ? scaleIndex : 0],
      data,
      dataLabels,
    });
  }
  return series;
};

const getGridTransposeChartOptions = (questiondata: any, chartData: any) => {
  const {
    chart: { chartLabelType },
  } = store.getState();
  const series = [];
  for (let i = 0; i < questiondata.subGroups.length; i++) {
    const currentSubGroup = questiondata.subGroups[i];
    const data = [];
    const scales = questiondata.scale;
    for (let j = 0; j < scales.length; j++) {
      const scale = scales[j];
      let baseCount: number = 0;
      let count: number = 0;
      chartData.forEach((chartDataObject: any, index: number) => {
        chartDataObject.options.forEach(
          (chartOption: any, chartindex: number) => {
            if (
              _.isArray(scale.labelCode) &&
              scale.labelCode.indexOf(chartOption.option) != -1
            ) {
              baseCount += chartOption.count;
            }
            if (chartOption.option == scale.labelCode) {
              baseCount += chartOption.count;
            }
          }
        );

        if (chartDataObject._id == questiondata.subGroups[i].qId) {
          const countObject = getMatchedfilter(
            chartDataObject.options,
            "option",
            scale.labelCode
          );

          count = _.sumBy(countObject, function (o) {
            return o.count;
          });
        }
      });

      let plotValue;
      if (chartLabelType === ChartLabelType.PERCENTAGE) {
        plotValue = (count / baseCount) * 100;
      } else {
        plotValue = count;
      }

      data.push({
        name: scale.labelText,
        y: plotValue !== null ? round(plotValue, decimalPrecision) : 0,
        percentageValue: (count / baseCount) * 100,
        numberValue: count,
        baseCount,
      });
    }

    series.push({
      name: currentSubGroup.labelText,
      data,
      dataLabels,
    });
  }

  return series;
};

export const getGridMeanChartOptions = (
  questionData: IQuestion,
  chartData: any,
  baseCount: number
): any => {
  const {
    chart: { chartTranspose },
  } = store.getState();

  const data: any[] = [];
  const standardDeviation: any[] = [];
  const standardError: any[] = [];

  for (
    let optionIndex = 0;
    optionIndex < questionData.subGroups.length;
    optionIndex++
  ) {
    const option = questionData.subGroups[optionIndex];
    const optionData = getmatchedFind(chartData, "_id", option.qId);

    const filteredOptions = _.remove(
      [...optionData.options],
      function (n: any) {
        return !Array.isArray(n.option);
      }
    ); //removing array options which come with subgroups

    const totalSelections = _.sumBy(filteredOptions, function (o: any) {
      return parseInt(o.option) * parseInt(o.count);
    });

    let valuesArr: any = [];

    filteredOptions.forEach((filteredOption: any) => {
      valuesArr = _.concat(valuesArr, filteredOption?.values);
    });

    const getSampleDeviationValues = getsampleStandardDeviation(
      valuesArr,
      decimalPrecision2
    );

    const getStandarderror = getStandarderrorFunction(
      Number(getSampleDeviationValues),
      baseCount,
      decimalPrecision2
    );

    const plotValue = totalSelections / baseCount;

    if (plotValue > 0) {
      data.push({
        name: option.labelText,
        y: plotValue,
        baseCount: baseCount,
      });
    }

    standardDeviation.push({
      name: option.labelText,
      y: Number(getSampleDeviationValues),
      baseCount: baseCount,
    });

    standardError.push({
      name: option.labelText,
      y: Number(getStandarderror),
      baseCount: baseCount,
    });
  }

  const series: any[] = [];
  const seriesLabels = StaticText.GRID_MEAN_SD_SE.split(",");
  const seriesData = [data, standardDeviation, standardError];

  for (let i = 0; i < 3; i++) {
    series.push({
      name: seriesLabels[i],
      color: colorArr[i],
      data: seriesData[i],
      dataLabels,
    });
  }

  if (chartTranspose) {
    const transposeSeries = [];
    for (
      let optionIndex = 0;
      optionIndex < questionData.subGroups.length;
      optionIndex++
    ) {
      transposeSeries.push({
        name: questionData.subGroups[optionIndex].labelText,
        color: colorArr[optionIndex],
        data: [
          {
            name: seriesLabels[0],
            y: series[0].data[optionIndex].y,
            baseCount: series[0].data[optionIndex].baseCount,
          },
          {
            name: seriesLabels[1],
            y: series[1].data[optionIndex].y,
            baseCount: series[1].data[optionIndex].baseCount,
          },
          {
            name: seriesLabels[2],
            y: series[2].data[optionIndex].y,
            baseCount: series[2].data[optionIndex].baseCount,
          },
        ],
        dataLabels,
      });
    }

    series.length = 0;

    series.push(...transposeSeries);
  }

  return series;
};
