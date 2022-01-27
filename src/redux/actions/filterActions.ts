import { createAction } from "@reduxjs/toolkit";
import ApiUrl from "../../enums/ApiUrl";
import { IFilter } from "../../types/IFilter";
import { IFilterQuestion } from "../../types/IFilterQuestion";
import ApiRequest from "../../utils/ApiRequest";
import { AppDispatch } from "../store";

export const setFilterQuestionList = createAction<IFilterQuestion[]>(
  "SET_FILTER_QUESTION_LIST"
);

export const setAppliedFilters = createAction<IFilter[]>("SET_APPLIED_FILTERS");

export const setFilters = createAction<IFilter[]>("SET_FILTERS");

export const resetFilters = createAction("RESET_FILTERS");

export const removeAppliedFilter = createAction<IFilter>(
  "REMOVE_APPLIED_FILTER"
);

export const fetchFilterList = () => async (dispatch: AppDispatch) => {
  try {
    const res = await ApiRequest.request(ApiUrl.FILTER, "GET");
  
    if (res.success) {
      
      const filterQuestionList: IFilterQuestion[] = res.data;
      filterQuestionList.sort((a, b) => {
        if (a.order > b.order) return 1;
        else if (a.order < b.order) return -1;
        else return 0;
      });

      dispatch(setFilterQuestionList(filterQuestionList));
    }
  } catch (error) {
    console.log(error);
  }
};
