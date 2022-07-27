import store, { RootState } from "../../redux/store";
import { StaticText } from "../../constants/StaticText";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { decimalPrecision } from "../../constants/Variables";
import { round } from "../Utility";
import { QuestionType } from "../../enums/QuestionType";
import StandardText from "../../enums/StandardType";
import { IFilter } from "../../types/IFilter";

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

export function meanStandardDeviation() {
  const {
    standard: { isMean, standardDeviation, standardError },
    chart: { questionData },
  } = store.getState();
  let standardDeviationMean: any;

  if (questionData?.type === QuestionType.SINGLE && questionData?.isMean) {
    standardDeviationMean =
      StandardText.MEAN +
      ":" +
      " " +
      isMean +
      " " +
      StandardText.SD +
      ":" +
      " " +
      standardDeviation +
      " " +
      StandardText.SE +
      ":" +
      " " +
      standardError;
  }

  return standardDeviationMean;
}
