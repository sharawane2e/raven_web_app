import { createReducer } from "@reduxjs/toolkit";
import {
    resetUserCache, setCacheLoading,
} from "../actions/userCacheActions";

export interface ISavedChart {
    _id?:string,
    qText: string,
    qId: string,
    type: string,
    date?: Date,
    filter: string[],
    bannerQuestion:string,
    chartType: number,
    chartLabelType: string,
    chartOrientation: string,
    chartTranspose: boolean,
}

export interface IUserCache{
  cacheLoading:boolean,
  savedChart:ISavedChart[]
}

const initialState: IUserCache = {
  cacheLoading:false,
  savedChart:[]
};

const userCacheReducer = createReducer(initialState, (builder) => {

  builder.addCase(resetUserCache, (state, action) => (
    {
      ...state,
      savedChart:[...action.payload]
    }
  ));

  builder.addCase(setCacheLoading, (state, action) => (
    {
      ...state,
      cacheLoading:action.payload
    }
  ));




});

export default userCacheReducer;
