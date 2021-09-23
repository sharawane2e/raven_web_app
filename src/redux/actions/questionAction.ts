import { createAction } from "@reduxjs/toolkit";
import ApiUrl from "../../enums/ApiUrl";
import { IBannerQuestion } from "../../types/IBannerQuestion";
import { IQuestion } from "../../types/IQuestion";
import ApiRequest from "../../utils/ApiRequest";
import { AppDispatch } from "../store";

export const setSelectedQuestionId = createAction<string>(
  "SET_SELECTED_QUESTION_ID"
);

export const setSelectedBannerQuestionId = createAction<string>(
  "SET_SELECTED_BANNER_QUESTION_ID"
);

export const setQuestionList = createAction<IQuestion[]>("SET_QUESTION_LIST");

export const setBannerQuestionList = createAction<IBannerQuestion[]>(
  "SET_BANNER_QUESTION_LIST"
);

export const fetchQuestionList = () => async (dispatch: AppDispatch) => {
  try {
    const res = await ApiRequest.request(ApiUrl.QUESTION, "GET");
    if (res.success) {
      const questionList: IQuestion[] = res.data;

      questionList.sort((a, b) => {
        if (a.order > b.order) return 1;
        else if (a.order < b.order) return -1;
        else return 0;
      });

      dispatch(setQuestionList(questionList));
    }
  } catch (error) {
    console.log(error);
  }
};

export const fetchBannerQuestionList = () => async (dispatch: AppDispatch) => {
  try {
    const res = await ApiRequest.request(ApiUrl.BANNER_QUESTION, "GET");
    if (res.success) {
      const questionList: IBannerQuestion[] = res.data;

      questionList.sort((a, b) => {
        if (a.order > b.order) return 1;
        else if (a.order < b.order) return -1;
        else return 0;
      });

      dispatch(setBannerQuestionList(questionList));
    }
  } catch (error) {
    console.log(error);
  }
};
