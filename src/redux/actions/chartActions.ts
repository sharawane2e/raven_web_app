import { createAction } from "@reduxjs/toolkit";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { ChartType } from "../../enums/ChartType";
import { IChartState } from "../reducers/chartReducer";

export const setChartData = createAction<IChartState>("SET_CHART_DATA");

export const setChartOrientation = createAction<ChartOrientation>(
  "SET_CHART_ORIENTATION"
);

export const setChartType = createAction<ChartType>("SET_CHART_TYPE");

export const resetChartData = createAction("RESET_CHART_DATA");

export const setChartLabel = createAction<any>("SET_CHART_Label");

export const setChartTranspose = createAction<any>("SET_CHART_Transpose");

export const setChartFullScreen = createAction<boolean>("SET_CHART_FULLSCREEN");

export const setChartLoading = createAction<boolean>("SET_CHART_SCREEN");
