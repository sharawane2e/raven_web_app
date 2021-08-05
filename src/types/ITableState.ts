import { SortOrder } from "./UtilityTypes";

interface ITableState {
  data: any[];
  currentPage: number;
  recordsPerPage: number;
  totalRecords: number;
  sortBy: string;
  sortOrder: SortOrder;
}

export default ITableState;
