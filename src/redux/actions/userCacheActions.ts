import { createAction } from "@reduxjs/toolkit";

export const resetUserCache = createAction<any>("RESET_USER_CACHE");

export const setCacheLoading = createAction<any>("SET_CACHE_LOADING");


export const updateSingleCacheChart = createAction<any>("UPDATE_SINGLE_CACHE_CHART");