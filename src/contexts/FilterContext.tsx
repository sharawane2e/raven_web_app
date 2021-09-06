import { createContext, useEffect, useState } from "react";
import ApiUrl from "../enums/ApiUrl";
import ApiRequest from "../utils/ApiRequest";

interface FilterContextProviderProps {}
export interface IFilterList {
  label: string;
  order: number;
  options: { labelText: string; labelCode: string; order: number }[];
}

export interface IFilter {
  label: string;
  code: string;
  qId: string;
}
const defaultValues: {
  filterList: IFilterList[];
  filters: IFilter[];
  setFilterList: (filterList: IFilterList[]) => void;
  setFilters: (filters: IFilter[]) => void;
} = {
  filterList: [],
  filters: [],
  setFilterList: (filterList: IFilterList[]) => {},
  setFilters: (filter: IFilter[]) => {},
};

export const FilterContext = createContext(defaultValues);

const FilterContextProvider: React.FC<FilterContextProviderProps> = (props) => {
  const [filterList, setFilterList] = useState<IFilterList[]>([]);
  const [filters, setFilters] = useState<IFilter[]>([]);
  useEffect(() => {
    ApiRequest.request(ApiUrl.FILTER, "GET").then((res) => {
      if (res.success) {
        const filters: IFilterList[] = [];
        res.data?.forEach((filter: any) => {
          const { question: questionData } = filter;
          filters.push({
            label: questionData?.labelText,
            order: questionData?.order,
            options: questionData?.options,
          });
        });
        setFilterList(filters);
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
