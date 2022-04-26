import {
  setBannerQuestionList,
  setQuestionList,
  setSelectedBannerQuestionId,
  setSelectedQuestionId,
  toggleBannerQuestionDisablity,
  setSelectedQuestionText,
} from '../actions/questionAction';
import { createReducer } from '@reduxjs/toolkit';
import { IBannerQuestion } from '../../types/IBannerQuestion';
import { IQuestion } from '../../types/IQuestion';

export interface IQuestionState {
  questionList: IQuestion[];
  bannerQuestionList: IBannerQuestion[];
  selectedQuestionId: string;
  selectedBannerQuestionId: string;
  disableBannerQuestion: boolean;
  selectedQuestionText: string;
}

const initialState: IQuestionState = {
  questionList: [],
  bannerQuestionList: [],
  selectedQuestionId: '',
  selectedBannerQuestionId: '',
  selectedQuestionText: '',
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
  builder.addCase(setSelectedQuestionText, (state, action) => ({
    ...state,
    selectedQuestionText: action.payload,
  }));
});

export default questionReducer;
