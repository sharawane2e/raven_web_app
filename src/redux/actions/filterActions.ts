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

export const resetAppliedFilters = createAction("RESET_APPLIED_FILTERS");

export const fetchFilterList = () => async (dispatch: AppDispatch) => {
  try {
    const res = await ApiRequest.request(ApiUrl.FILTER, "GET");
    if (res.success) {
      dispatch(setFilterQuestionList(res.data));
    }
  } catch (error) {
    console.log(error);
  }
};
