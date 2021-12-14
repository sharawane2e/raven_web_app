import { createAction } from "@reduxjs/toolkit";
import { ChartDataLabels } from "../../enums/ChartDataLabels";
import { ChartOrientation } from "../../enums/ChartOrientation";
import { ChartType } from "../../enums/ChartType";
import { IChartState } from "../reducers/chartReducer";

export const setChartData = createAction<IChartState>("SET_CHART_DATA");

export const setChartOrientation = createAction<ChartOrientation>(
  "SET_CHART_ORIENTATION"
);

export const setChartType = createAction<ChartType>("SET_CHART_TYPE");

export const resetChartData = createAction("RESET_CHART_DATA");

// export const setDataLabelFormat = createAction<any>("SET_CHART_DATA_LABEL");

export const setChartOperations = createAction<any>("SET_CHART_OPERATIONS");
