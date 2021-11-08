import { createAction } from "@reduxjs/toolkit";

export const toggleSidebar = createAction<boolean | undefined>(
  "TOGGLE_SIDEBAR"
);
export const toggleSidebarMobile = createAction<boolean | undefined>(
  "TOGGLE_MOBILE_SIDEBAR"
);
