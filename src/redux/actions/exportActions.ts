import { createAction } from "@reduxjs/toolkit";

export const setPptExport = createAction<any[]>("SET_PPT_EXPORT");
export const deletePptExport = createAction<any[]>("DELETE_PPT_EXPORT");
export const setPdfExport = createAction<any[]>("SET_PDF_EXPORT");
export const deletePdfExport = createAction<any[]>("DELETE_PDF_EXPORT");
