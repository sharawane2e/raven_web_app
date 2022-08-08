import { createAction } from '@reduxjs/toolkit';

export const toggleSidebar = createAction<boolean | undefined>(
  'TOGGLE_SIDEBAR',
);
export const toggleSidebarMobile = createAction<boolean | undefined>(
  'TOGGLE_MOBILE_SIDEBAR',
);

export const toggleSidebarUserCache = createAction<boolean | undefined>(
  'TOGGLE_USER_CACHE',
);
export const noDataFound = createAction<any>('NO_DATA_FOUND');
