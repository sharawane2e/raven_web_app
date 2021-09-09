import { createReducer } from "@reduxjs/toolkit";
import { IFilter } from "../../types/IFilter";
import { IFilterQuestion } from "../../types/IFilterQuestion";
import {
  resetAppliedFilters,
  setAppliedFilters,
  setFilterQuestionList,
  setFilters,
} from "../actions/filterActions";

const initialState: {
  appliedFilters: IFilter[];
  filters: IFilter[];
  filterQuestionList: IFilterQuestion[];
} = {
  appliedFilters: [],
  filters: [],
  filterQuestionList: [],
};

const filterReducer = createReducer(initialState, (builder) => {
  builder.addCase(setFilterQuestionList, (state, action) => ({
    ...state,
    filterQuestionList: action.payload,
  }));

  builder.addCase(setFilters, (state, action) => ({
    ...state,
    filters: action.payload,
  }));

  builder.addCase(resetAppliedFilters, (state) => {
    let filterQuestionList = JSON.parse(
      JSON.stringify(state.filterQuestionList)
    ) as IFilterQuestion[];
    filterQuestionList = filterQuestionList.map((filterQuestion) => {
      filterQuestion.value = [];
      return filterQuestion;
    });

    return {
      ...state,
      filterQuestionList,
      appliedFilters: [],
    };
  });

  builder.addCase(setAppliedFilters, (state, action) => ({
    ...state,
    appliedFilters: action.payload,
  }));
});

export default filterReducer;
