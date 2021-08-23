import React, { ComponentType, useContext, useEffect, useState } from "react";
import { TableDataContext } from "../../contexts/TableDataContext";
import clsx from "clsx";
import ITableColumn from "../../types/ITableColumn";
import CustomScrollbar from "../CustomScrollbar";
import CustomSkeleton from "../../skeletons/CustomSkeleton";
import { SortOrder } from "../../types/UtilityTypes";
import ReactPaginate from "react-paginate";
import { MenuItem, Select } from "@material-ui/core";
import InputField from "../widgets/InputFields";
import SwapVertIcon from "@material-ui/icons/SwapVert";
import ArrowUpwardIcon from "@material-ui/icons/ArrowUpward";
import ArrowDownwardIcon from "@material-ui/icons/ArrowDownward";

export interface CustomTableProps {
  classes?: {
    root?: string;
    head?: string;
    body?: string;
    container?: string;
  };
  tableConfig: ITableColumn[];
  title?: string;
  hasSearch?: boolean;
  menuConfig?: {
    label: string;
    action: Function;
  }[];
  searchPlaceholder?: string;
  disablePagination?: boolean;
  loaderSkeleton?: ComponentType;
}

const CustomTable: React.FC<CustomTableProps> = (props) => {
  const { classes, tableConfig, loaderSkeleton, disablePagination } = props;
  const {
    tableState: {
      currentPage,
      recordsPerPage,
      totalRecords,
      sortBy,
      sortOrder,
      data,
    },
    fetchData,
    searchText,
    handleSearch,
    setRecordsPerPage,
    loadingData,
  } = useContext(TableDataContext);

  const [menu, setMenu] = useState<{ index: number; anchor: any }>({
    index: -1,
    anchor: null,
  });
  const [anchorEl, setAnchorEl] = useState<
    Element | ((element: Element) => Element) | null | undefined
  >(null);

  useEffect(() => {
    fetchData(1, 10);
  }, []);

  const minRecordsRange = (currentPage - 1) * recordsPerPage + 1;
  let maxRecordsRange = currentPage * recordsPerPage;
  maxRecordsRange =
    maxRecordsRange > totalRecords ? totalRecords : maxRecordsRange;

  const sortTable = (key: string) => {
    fetchData(undefined, undefined, undefined, key);
  };

  const handlePageLimitChange = (e: any) => {
    fetchData(undefined, e.target.value);
  };
  return (
    <div className="custom-table">
      <div className="custom-table__header">
        <div className="custom-table__page-limiter">
          <span className="limiter-label">Show</span>
          <span>
            <Select
              labelId="demo-simple-select-outlined-label"
              id="demo-simple-select-outlined"
              value={recordsPerPage}
              onChange={handlePageLimitChange}
              disableUnderline
            >
              <MenuItem value={10}>10</MenuItem>
              <MenuItem value={20}>20</MenuItem>
              <MenuItem value={30}>30</MenuItem>
            </Select>
          </span>
        </div>
        <div className="custom-table__search-wrapper">
          <span>Search:</span>
          <span>
            <InputField onChange={handleSearch} value={searchText} />
          </span>
        </div>
      </div>
      <div className="rc-table">
        <div className="rc__header">
          {tableConfig.map((col, index) => {
            const headClassName = col?.classes?.head || "";

            return (
              <div
                key={index}
                style={{ width: col.minWidth }}
                className={clsx({
                  flex_auto: col.minWidth,
                  [headClassName]: headClassName,
                })}
              >
                <span>{col.label}</span>
                {col.hasSorting && (
                  <span
                    onClick={() => sortTable(col.key)}
                    className="sort-icon-wrapper"
                  >
                    {sortBy === col.key ? (
                      sortOrder === "asc" ? (
                        <ArrowDownwardIcon className="asc-icon" />
                      ) : (
                        <ArrowUpwardIcon className="desc-icon" />
                      )
                    ) : (
                      <SwapVertIcon className="sort-icon" />
                    )}
                  </span>
                )}
              </div>
            );
          })}
        </div>

        <div
          className={clsx("rc__body", {
            [classes?.body || ""]: classes?.body,
          })}
        >
          <CustomScrollbar>
            <CustomSkeleton
              loading={loadingData}
              // loading={true}
              loaderSkeleton={loaderSkeleton}
              skeletonCount={10}
            >
              <div className="margin-remove">
                {data.map((row, index) => (
                  <div key={index} className="rc__body-row">
                    {tableConfig.map((col, colIndex) => {
                      const bodyClassName = col?.classes?.body || "";
                      return (
                        <div
                          key={colIndex}
                          style={{ width: col.minWidth }}
                          className={clsx("rc__body-cell", {
                            flex_auto: col.minWidth,
                            [bodyClassName]: bodyClassName,
                          })}
                        >
                          {col.format
                            ? col.format(row[col.key], row)
                            : row[col.key]}
                        </div>
                      );
                    })}
                  </div>
                ))}
              </div>
            </CustomSkeleton>
          </CustomScrollbar>
        </div>
      </div>
      {!disablePagination ? (
        <div className="custom-table__paginate-wrapper">
          <div>
            Showing {minRecordsRange} to {maxRecordsRange} of {totalRecords}{" "}
            entries
          </div>
          <ReactPaginate
            pageCount={Math.ceil(totalRecords / recordsPerPage)}
            pageRangeDisplayed={5}
            marginPagesDisplayed={3}
            onPageChange={({ selected }) => {
              fetchData(selected + 1);
            }}
            pageClassName="custom-table__paginate-link"
            containerClassName="custom-table__link-container"
          />
        </div>
      ) : null}
    </div>
  );
};

export default CustomTable;
