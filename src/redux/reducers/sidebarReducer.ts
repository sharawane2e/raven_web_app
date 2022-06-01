import { createReducer } from '@reduxjs/toolkit';
import { toggleSidebarMobile, toggleSidebar } from '../actions/sidebarAction';
import { hideTourGuide, showTourGuide } from '../actions/tourAction';

const initialState = {
  open: true,
  openMobileDrawer: false,
};

const sidebarReducer = createReducer(initialState, (builder) => {
  builder.addCase(toggleSidebar, (state, action) => {
    return {
      ...state,
      open: action.payload === undefined ? !state.open : !!action.payload,
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
