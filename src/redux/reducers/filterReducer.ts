import { createReducer } from "@reduxjs/toolkit";
import { IFilter } from "../../types/IFilter";
import { IFilterQuestion } from "../../types/IFilterQuestion";
import {
  resetAppliedFilters,
  setAppliedFilters,
  setFilterQuestionList,
} from "../actions/filterActions";

const initialState: {
  appliedFilters: IFilter[];
  filterQuestionList: IFilterQuestion[];
} = {
  appliedFilters: [],
  filterQuestionList: [],
};

const filterReducer = createReducer(initialState, (builder) => {
  builder.addCase(setFilterQuestionList, (state, action) => ({
    ...state,
    filterQuestionList: action.payload,
  }));

  builder.addCase(setAppliedFilters, (state, action) => {
    if (action.type === setAppliedFilters.type) {
    }
    return {
      ...state,
      appliedFilters: action.payload,
    };
  });

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
});

export default filterReducer;
