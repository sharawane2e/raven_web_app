import { createAction } from '@reduxjs/toolkit';

export const setMean = createAction<any | null>('SET_MEAN');

export const setStandardDeviation = createAction<any | null>(
  'SET_STANDARD_DEVIATION',
);

export const setStandardError = createAction<any | null>('SET_STANDARD_ERROR');
