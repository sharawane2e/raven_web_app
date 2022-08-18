import { createAction } from '@reduxjs/toolkit';
import { IChapter } from '../../types/IChapter';

export const setChapters = createAction<IChapter[] | null>('SET_CHAPTERS');

export const setSelectedChapterId = createAction<string>(
  'SET_SELECTED_CHAPTER_ID',
);

export const setSelectedQuestion = createAction<any>('SET_SELECTED_QUESTION');
export const setSelectedQuestionID = createAction<any>(
  'SET_SELECTED_QUESTION_ID',
);
export const setSelectedBannerID = createAction<any>('SET_SELECTED_BANNERID');
