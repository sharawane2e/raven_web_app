import { createAction } from '@reduxjs/toolkit';

export const resetUserCache = createAction<any>('RESET_USER_CACHE');

export const setCacheLoading = createAction<any>('SET_CACHE_LOADING');

export const setUserCacheId = createAction<any>('SET_USER_CACHE_ID');

export const setInCache = createAction<any>('SET_IN_CACHE');

export const setDialog = createAction<any>('SET_DIALOG');

export const setuserCacheActive = createAction<any>('USER_CACHE_ACTIVE');

export const updateSingleCacheChart = createAction<any>(
  'UPDATE_SINGLE_CACHE_CHART',
);
