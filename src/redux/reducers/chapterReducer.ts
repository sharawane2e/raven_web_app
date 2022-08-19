import { createReducer } from '@reduxjs/toolkit';
import { IChapter } from '../../types/IChapter';
import {
  setChapters,
  setSelectedChapterId,
  setSelectedQuestion,
  setSelectedChapterQuestionID,
  setSelectedBannerID,
} from '../actions/chapterActions';

export interface IChapterState {
  selectedChapterId: string;
  allChapters: IChapter[] | null;
  selectedQuestion: any;
  selectedQuestionChaID: any;
  selectedBannerID: any;
}

let initialState: IChapterState = {
  selectedChapterId: '',
  allChapters: null,
  selectedQuestion: null,
  selectedQuestionChaID: null,
  selectedBannerID: null,
};

const chapterReducer = createReducer(initialState, (builder) => {
  builder.addCase(setChapters, (state, action) => ({
    ...state,
    allChapters: action.payload,
  }));

  builder.addCase(setSelectedChapterId, (state, action) => ({
    ...state,
    selectedChapterId: action.payload,
  }));
  builder.addCase(setSelectedQuestion, (state, action) => ({
    ...state,
    selectedQuestion: action.payload,
  }));
  builder.addCase(setSelectedBannerID, (state, action) => ({
    ...state,
    selectedBannerID: action.payload,
  }));
  builder.addCase(setSelectedChapterQuestionID, (state, action) => ({
    ...state,
    selectedQuestionChaID: action.payload,
  }));
});

export default chapterReducer;
