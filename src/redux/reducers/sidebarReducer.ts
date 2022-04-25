import { createReducer } from "@reduxjs/toolkit";
import {
  toggleSidebarMobile,
  toggleSidebar,
  toggleSidebarUserCache,
} from "../actions/sidebarAction";
// import { hideTourGuide, showTourGuide } from "../actions/tourAction";

const initialState = {
  open: true,
  openMobileDrawer: false,
  userCache: false,
};

const sidebarReducer = createReducer(initialState, (builder) => {
  builder.addCase(toggleSidebar, (state, action) => {
    return {
      ...state,
      open: action.payload === undefined ? !state.open : !!action.payload,
    };
  });
  // builder.addCase(toggleSidebarUserCache, (state, action) => {
  //   // debugger;
  //   return {
  //     ...state,
  //     userCache: action.payload === undefined ? !state.open : !!action.payload,
  //     //   open: !state.open,
  //   };
  // });
  builder.addCase(toggleSidebarUserCache, (state, action) => {
    return {
      ...state,
      userCache:
        action.payload === undefined ? !state.userCache : !!action.payload,
    };
  });
  builder.addCase(toggleSidebarMobile, (state, action) => {
    return {
      ...state,
      openMobileDrawer:
        action.payload === undefined
          ? !state.openMobileDrawer
          : !!action.payload,
    };
  });
});

export default sidebarReducer;
