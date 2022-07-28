import store, { RootState } from "../../redux/store";
import { StaticText } from "../../constants/StaticText";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { decimalPrecision } from "../../constants/Variables";
import { getMeanStandardDeviation, round } from "../Utility";
import { QuestionType } from "../../enums/QuestionType";
import StandardText from "../../enums/StandardType";
import { IFilter } from "../../types/IFilter";
import { IchartOptionsDto } from "../../types/IChartOptionsDto";

const {
  chart: { chartLabelType },
} = store.getState();

export function appliedFiltersText(appliedFilters: IFilter[]) {
  //console.log("appliedFilters", appliedFilters);
  let filters: string = "Filters: ";

  if (appliedFilters.length > 0) {
    appliedFilters.forEach((f) => {
      filters += f.label + " | ";
    });
  } else {
    filters += StaticText.NO_FILTER_APPLIED;
  }
  //console.log("filters", filters);
  return filters;
}

export function DataCal(data: any, baseCount: number) {
  if (chartLabelType === ChartLabelType.PERCENTAGE) {
    return round((data.count / baseCount) * 100, decimalPrecision);
  } else {
    return data.count;
  }
}

export function meanStandardDeviation(chart: IchartOptionsDto) {
  const {
    questionData,
    bannerQuestionData,
    chartType,
    baseCount,
    showMean,
    significant,
    chartLabelType,
    chartData,
  } = chart;
  // const {
  //   standard: { isMean, standardDeviation, standardError },
  //   chart: { questionData },
  // } = store.getState();
  let standardDeviationMean: any;
  let updatedMeanStandarad: number = 0;
  let updatedStandardDeviation: number = 0;
  let updatedStandardError: number = 0;
  if (questionData?.type === QuestionType.SINGLE && questionData?.isMean) {
    if (bannerQuestionData) {
      let optionData = chartData[0];
      let chartOptionsData: any = [];

      Object.keys(optionData).forEach(function (key) {
        chartOptionsData.push(optionData[key]);
      });
      const { meanStandarad, standardDeviation, standardError } =
        getMeanStandardDeviation(chartOptionsData, baseCount);
      updatedMeanStandarad = meanStandarad;
      updatedStandardDeviation = standardDeviation;
      updatedStandardError = standardError;
    } else {
      const { meanStandarad, standardDeviation, standardError } =
        getMeanStandardDeviation(chartData, baseCount);
      updatedMeanStandarad = meanStandarad;
      updatedStandardDeviation = standardDeviation;
      updatedStandardError = standardError;
    }
    standardDeviationMean =
      StandardText.MEAN +
      ":" +
      " " +
      updatedMeanStandarad +
      " " +
      StandardText.SD +
      ":" +
      " " +
      updatedStandardDeviation +
      " " +
      StandardText.SE +
      ":" +
      " " +
      updatedStandardError;
  }

  return standardDeviationMean;
}
