import { createReducer } from '@reduxjs/toolkit';
import {
  resetUserCache,
  setCacheLoading,
  updateSingleCacheChart,
  setUserCacheId,
  setInCache,
  setDialog,
  setuserCacheActive,
} from '../actions/userCacheActions';

export interface ISavedChart {
  _id?: string;
  qText: string;
  qId: string;
  type: string;
  date?: Date;
  filter: string[];
  bannerQuestion: string;
  chartType: number;
  chartLabelType: string;
  chartOrientation: string;
  chartTranspose: boolean;
  isSelected: boolean;
  isActive: boolean;
}

export interface IUserCache {
  cacheLoading: boolean;
  savedChart: ISavedChart[];
  cacheId: any;
  inCache: boolean;
  open: boolean;
  active: boolean;
}

const initialState: IUserCache = {
  cacheLoading: false,
  savedChart: [],
  cacheId: [],
  inCache: false,
  open: false,
  active: false,
};

const userCacheReducer = createReducer(initialState, (builder) => {
  builder.addCase(resetUserCache, (state, action) => ({
    ...state,
    savedChart: [...action.payload],
  }));

  builder.addCase(updateSingleCacheChart, (state, action) => ({
    ...state,
    savedChart: [...state.savedChart, ...action.payload],
  }));
  builder.addCase(setUserCacheId, (state, action) => ({
    ...state,
    cacheId: action.payload,
  }));

  builder.addCase(setCacheLoading, (state, action) => ({
    ...state,
    cacheLoading: action.payload,
  }));
  builder.addCase(setInCache, (state, action) => ({
    ...state,
    inCache: action.payload,
  }));

  builder.addCase(setDialog, (state, action) => ({
    ...state,
    open: action.payload,
  }));
  builder.addCase(setuserCacheActive, (state, action) => ({
    ...state,
    active: action.payload,
  }));
});

export default userCacheReducer;
