import { createReducer } from "@reduxjs/toolkit";
import { IBannerQuestion } from "../../types/IBannerQuestion";
import { IQuestion } from "../../types/IQuestion";
import {
  setBannerQuestionList,
  setQuestionList,
  setSelectedBannerQuestionId,
  setSelectedQuestionId,
} from "../actions/questionAction";

export interface IQuestionState {
  questionList: IQuestion[];
  bannerQuestionList: IBannerQuestion[];
  selectedQuestionId: string;
  selectedBannerQuestionId: string;
}

const initialState: IQuestionState = {
  questionList: [],
  bannerQuestionList: [],
  selectedQuestionId: "",
  selectedBannerQuestionId: "",
};

const questionReducer = createReducer(initialState, (builder) => {
  builder.addCase(setSelectedQuestionId, (state, action) => ({
    ...state,
    selectedQuestionId: action.payload,
  }));

  builder.addCase(setSelectedBannerQuestionId, (state, action) => ({
    ...state,
    selectedBannerQuestionId: action.payload,
  }));

  builder.addCase(setQuestionList, (state, action) => ({
    ...state,
    questionList: action.payload,
  }));

  builder.addCase(setBannerQuestionList, (state, action) => ({
    ...state,
    bannerQuestionList: action.payload,
  }));
});

export default questionReducer;
