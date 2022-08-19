import { createReducer } from "@reduxjs/toolkit";
import {
  deletePdfExport,
  deletePptExport,
  setPdfExport,
  setPptExport,
} from "../actions/exportActions";

export interface IExportState {
  pptExport: any[];
  pdfExport: any[];
}

let initialState: IExportState = {
  pptExport: [],
  pdfExport: [],
};

const exportReducer = createReducer(initialState, (builder) => {
  builder.addCase(setPptExport, (state, action) => ({
    ...state,
    pptExport: [...action.payload],
  }));
  builder.addCase(deletePptExport, (state, action) => ({
    ...state,
    pptExport: [],
  }));
  builder.addCase(setPdfExport, (state, action) => ({
    ...state,
    pdfExport: [...action.payload],
  }));
  builder.addCase(deletePdfExport, (state, action) => ({
    ...state,
    pdfExport: [],
  }));
});

export default exportReducer;
