import { createContext, useEffect, useState } from "react";
import ApiUrl from "../enums/ApiUrl";
import ApiRequest from "../utils/ApiRequest";

interface FilterContextProviderProps {}
export interface IFilterList {
  label: string;
  order: number;
  qId: string;
  options: { labelText: string; labelCode: string; order: number }[];
}

export interface IFilter {
  label: string;
  code: string;
  qId: string;
}
export interface IFilterContext {
  filterList: IFilterList[];
  filters: IFilter[];
  setFilterList: (filterList: IFilterList[]) => void;
  setFilters: (filters: IFilter[]) => void;
}

const defaultValues: IFilterContext = {
  filterList: [],
  filters: [],
  setFilterList: (filterList: IFilterList[]) => {},
  setFilters: (filter: IFilter[]) => {},
};

export const FilterContext = createContext<IFilterContext>(defaultValues);

const FilterContextProvider: React.FC<FilterContextProviderProps> = (props) => {
  const [filterList, setFilterList] = useState<any[]>([]);
  const [filters, setFilters] = useState<IFilter[]>([]);

  useEffect(() => {
    ApiRequest.request(ApiUrl.FILTER, "GET").then((res) => {
      if (res.success) {
        const filterList: IFilterList[] = [];
        res.data?.forEach((filter: any) => {
          const { question: questionData } = filter;
          filterList.push({
            label: questionData?.labelText,
            order: questionData?.order,
            options: questionData?.options,
            qId: questionData?.qId,
          });
        });

        setFilterList(filterList);
      }
    });
  }, []);

  return (
    <FilterContext.Provider
      value={{ filterList, setFilterList, filters, setFilters }}
    >
      {props.children}
    </FilterContext.Provider>
  );
};

export default FilterContextProvider;
