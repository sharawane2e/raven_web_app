import { createAction } from "@reduxjs/toolkit";
import { IChartState } from "../reducers/chartReducer";

export const setChartData = createAction<IChartState>("SET_CHART_DATA");
