import { createAction } from "@reduxjs/toolkit";
import { IChapter } from "../../types/IChapter";

export const setChapters = createAction<IChapter[] | null>("SET_CHAPTERS");

export const setSelectedChapterId = createAction<string>("SET_SELECTED_CHAPTER_ID");

