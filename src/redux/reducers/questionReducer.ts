import { createReducer } from "@reduxjs/toolkit";
import { IQuestion } from "../../types/IQuestion";
import {
  setQuestionList,
  setSelectedQuestionId,
} from "../actions/questionAction";

export interface IQuestionState {
  questionList: IQuestion[];
  bannerQuestionList: IQuestion[];
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
});

export default questionReducer;
