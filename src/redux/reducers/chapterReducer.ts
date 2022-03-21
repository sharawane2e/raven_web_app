import { createReducer } from "@reduxjs/toolkit";
import { IChapter } from "../../types/IChapter";
import { setChapters, setSelectedChapterId } from "../actions/chapterActions";

export interface IChapterState {
    selectedChapterId: string;
    allChapters: IChapter[] | null;
}

let initialState: IChapterState = {
  selectedChapterId: "",
  allChapters: null,
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
});

export default chapterReducer;
