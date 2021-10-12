import { createReducer } from "@reduxjs/toolkit";
import { IBannerQuestion } from "../../types/IBannerQuestion";
import { IQuestion } from "../../types/IQuestion";
import {
  setBannerQuestionList,
  setQuestionList,
  setSelectedBannerQuestionId,
  setSelectedQuestionId,
  toggleBannerQuestionDisablity,
} from "../actions/questionAction";

export interface IQuestionState {
  questionList: IQuestion[];
  bannerQuestionList: IBannerQuestion[];
  selectedQuestionId: string;
  selectedBannerQuestionId: string;
  disableBannerQuestion: boolean;
}

const initialState: IQuestionState = {
  questionList: [],
  bannerQuestionList: [],
  selectedQuestionId: "",
  selectedBannerQuestionId: "",
  disableBannerQuestion: true,
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

  builder.addCase(toggleBannerQuestionDisablity, (state, action) => ({
    ...state,
    disableBannerQuestion:
      action.payload !== undefined
        ? action.payload
        : !state.disableBannerQuestion,
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
