import { createAction } from "@reduxjs/toolkit";
import ApiUrl from "../../enums/ApiUrl";
import { ChartLabelType } from "../../enums/ChartLabelType";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { ChartType } from "../../enums/ChartType";
import ApiRequest from "../../utils/ApiRequest";
import { IChartState } from "../reducers/chartReducer";
import { AppDispatch } from "../store";
// import { getUserCache } from "../../redux/actions/chartActions";

export const setChartData = createAction<IChartState>("SET_CHART_DATA");

export const setChartOrientation = createAction<ChartOrientation>(
  "SET_CHART_ORIENTATION"
);

export const setChartType = createAction<ChartType>("SET_CHART_TYPE");

export const resetChartData = createAction("RESET_CHART_DATA");

// export const setDataLabelFormat = createAction<any>("SET_CHART_DATA_LABEL");

export const setChartLabel = createAction<any>("SET_CHART_Label");

export const setChartTranspose = createAction<any>("SET_CHART_Transpose");

export const setChartFullScreen = createAction<boolean>("SET_CHART_FULLSCREEN");

export const setChartLoading = createAction<boolean>("SET_CHART_SCREEN");

export const setUserCache = createAction<any>("SET_USER_CACHE");

// export const getUserCache = createAction<any>("GET_USER_CACHE");

export const fetchuserCache = () => async (dispatch: AppDispatch) => {
  try {
    const res = await ApiRequest.request(ApiUrl.SAVECHART, "GET");
    if (res.success) {
      dispatch(setUserCache(res?.data));
    }
  } catch (error) {
    console.log(error);
  }
};
