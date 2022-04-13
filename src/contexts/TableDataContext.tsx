import { createContext, useState } from 'react';
import ITableState from '../types/ITableState';
import { SortOrder } from '../types/UtilityTypes';
import ApiRequest from '../utils/ApiRequest';
// import { v1 as uuid } from "uuid";

interface TableDataContextProps {
  fetchData: (
    currentPage?: number,
    recordsPerPage?: number,
    searchText?: string,
    sortBy?: string,
    sortOrder?: SortOrder,
    stopLoading?: boolean,
  ) => void;
  tableState: ITableState;
  searchText: string;
  handleSearch: (e: any) => void;
  setRecordsPerPage: (e: any) => void;
  loadingData: boolean;
  setLoadingData: (loadingData: boolean) => void;
}

const tableStateDefaultValue: ITableState = {
  data: [],
  currentPage: 1,
  recordsPerPage: 10,
  totalRecords: 0,
  sortBy: '',
  sortOrder: undefined,
};

const defaultValues: TableDataContextProps = {
  fetchData: () => {},
  searchText: '',
  tableState: tableStateDefaultValue,
  handleSearch: (e: any) => {},
  setRecordsPerPage: (recordsPerPage: number) => {},
  loadingData: false,
  setLoadingData: (loadingData: boolean) => {},
};

export const TableDataContext =
  createContext<TableDataContextProps>(defaultValues);

export interface TableDataProviderProps {
  fetchUrl: string;
}

const TableDataProvider: React.FC<TableDataProviderProps> = (props) => {
  const { fetchUrl } = props;
  const [tableState, setTableState] = useState<ITableState>(
    tableStateDefaultValue,
  );
  const [searchText, setSearchText] = useState('');
  const [loadingData, setLoadingData] = useState<boolean>(false);

  //   let requestId: string;

  const handleSearch = (e: any) => {
    const value = e.target.value;
    setSearchText(value);
    fetchData(1, 10, value, undefined, undefined, true);
  };

  const setRecordsPerPage = (recordsPerPage: number) => {
    setTableState((prevState) => ({ ...prevState, recordsPerPage }));
  };

  const fetchData = (
    currentPage = tableState.currentPage,
    recordsPerPage = tableState.recordsPerPage,
    search = searchText,
    sortBy?: string,
    sortOrder?: SortOrder,
    stopLoading?: boolean,
  ) => {
    let sortByField;
    let sortByOrder;

    // const localRequestId = uuid();
    // requestId = localRequestId;

    if (sortBy) {
      sortByField = sortBy;
      if (sortOrder) {
        sortByOrder = sortOrder;
      } else {
        if (sortBy === tableState.sortBy) {
          sortByOrder = tableState.sortOrder === 'asc' ? 'desc' : 'asc';
        } else {
          sortByOrder = 'asc';
        }
      }
    } else {
      sortByField = tableState.sortBy;
      sortByOrder = tableState.sortOrder;
    }
    if (!stopLoading) setLoadingData(true);
    ApiRequest.request(fetchUrl, 'GET', null, {
      params: {
        currentPage,
        recordsPerPage,
        searchText: search.trim(),
        sortBy: sortByField,
        sortOrder: sortByOrder,
      },
    })
      .then((res) => {
        if (res.success /* && localRequestId === requestId */) {
          setTableState((prevState) => ({ ...prevState, ...res.data }));
        }
      })
      .catch((error) => console.log(error))
      .finally(() => setLoadingData(false));
  };

  return (
    //   @ts-ignore
    <TableDataContext.Provider
      value={{
        fetchData,
        tableState,
        handleSearch,
        searchText,
        setRecordsPerPage,
        loadingData,
        setLoadingData,
      }}
    >
      {props.children}
    </TableDataContext.Provider>
  );
};

export default TableDataProvider;
