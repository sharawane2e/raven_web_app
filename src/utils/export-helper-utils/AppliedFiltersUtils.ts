import store, { RootState } from "../../redux/store";
import { StaticText } from "../../constants/StaticText";
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
