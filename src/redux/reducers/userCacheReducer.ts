import { createReducer } from "@reduxjs/toolkit";
import {
    resetUserCache, setCurrentCacheId,
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
  currentCacheId:string,
  savedChart:ISavedChart[]
}

const initialState: IUserCache = {
  currentCacheId:"",
  savedChart:[]
};

const userCacheReducer = createReducer(initialState, (builder) => {

  builder.addCase(setCurrentCacheId, (state, action) => (
    {
      ...state,
      currentCacheId:action.payload
    }
  ));

  builder.addCase(resetUserCache, (state, action) => (
    {
      ...state,
      savedChart:[...action.payload]
    }
  ));


});

export default userCacheReducer;
