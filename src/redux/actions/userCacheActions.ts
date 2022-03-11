import { createAction } from "@reduxjs/toolkit";

export const setCurrentCacheId = createAction<any>("SET_CURRENT_CACHE_ID");

export const resetUserCache = createAction<any>("RESET_USER_CACHE");