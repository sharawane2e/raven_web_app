import { createReducer } from "@reduxjs/toolkit";
import { IBannerQuestion } from "../../types/IBannerQuestion";
import { IQuestion } from "../../types/IQuestion";
import {
  setBannerQuestionList,
  setQuestionList,
  setSelectedQuestionId,
} from "../actions/questionAction";

export interface IQuestionState {
  questionList: IQuestion[];
  bannerQuestionList: IBannerQuestion[];
  selectedQuestionId: string;
}

const initialState: IQuestionState = {
  questionList: [],
  bannerQuestionList: [],
  selectedQuestionId: "",
};

const questionReducer = createReducer(initialState, (builder) => {
  builder.addCase(setSelectedQuestionId, (state, action) => ({
    ...state,
    selectedQuestionId: action.payload,
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
