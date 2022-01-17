import store, { RootState } from "../../redux/store";
import { StaticText } from "../../constants/StaticText";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { decimalPrecision } from "../../constants/Variables";
import { round } from "../Utility";

const {
  chart:{chartLabelType} 
}= store.getState();

export function appliedFiltersText() {
  const {
    filters: { appliedFilters },
  } = store.getState();

  let filters: string = "Filters: ";

  if (appliedFilters.length > 0) {
    appliedFilters.forEach((f) => {
      filters += f.label + " | ";
    });
  } else {
    filters += StaticText.NO_FILTER_APPLIED;
  }
  return filters;
}

export function DataCal(data:any,baseCount:number){
  if(chartLabelType===ChartLabelType.PERCENTAGE){
    return round((data.count / baseCount) * 100, decimalPrecision);
  }else{
    return data.count;
  }
}