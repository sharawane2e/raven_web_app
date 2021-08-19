import React, { ComponentType, useContext, useEffect, useState } from "react";
import { TableDataContext } from "../../contexts/TableDataContext";
import clsx from "clsx";
import ITableColumn from "../../types/ITableColumn";
import CustomScrollbar from "../CustomScrollbar";
import CustomSkeleton from "../../skeletons/CustomSkeleton";
import { SortOrder } from "../../types/UtilityTypes";
import Pagination from "@material-ui/lab/Pagination";

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
    tableState,
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

  const tableWidth =
    document.body.offsetWidth <= 768 ? document.body.offsetWidth - 30 : "100%";

  useEffect(() => {
    fetchData(1, 10);
  }, []);

  const sortTable = (key: string) => {
    fetchData(undefined, undefined, undefined, key);
  };
  const handleSort = (sortBy: string, sortOrder: SortOrder) => {
    fetchData(1, 10, undefined, sortBy, sortOrder);
  };

  const getSortingActiveClass = (headerId: string, sortOrder: SortOrder) => {
    if (headerId === tableState.sortBy && sortOrder === tableState.sortOrder) {
      return "sorting-active";
    }
    return "";
  };

  return (
    <div className="custom-table">
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
                <div className="cst-sort ">
                  {col.hasSorting && (
                    <>
                      <div
                        className={
                          "icon-sort sort-asc " +
                          getSortingActiveClass(col.key, "asc")
                        }
                        onClick={() => {
                          return col.key == tableState.sortBy &&
                            tableState.sortOrder == "asc"
                            ? null
                            : handleSort(col.key, "asc");
                        }}
                      ></div>
                      <div
                        className={
                          "icon-sort sort-dsc " +
                          getSortingActiveClass(col.key, "desc")
                        }
                        onClick={() => {
                          return col.key == tableState.sortBy &&
                            tableState.sortOrder == "desc"
                            ? null
                            : handleSort(col.key, "desc");
                        }}
                      ></div>
                    </>
                  )}
                </div>
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
              loaderSkeleton={loaderSkeleton}
              skeletonCount={10}
            >
              <div className="margin-remove">
                {tableState.data.map((row, index) => (
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
        <Pagination
          getItemAriaLabel={(type, page) => {
            return type === "previous"
              ? "Previous"
              : type === "next"
              ? "Next"
              : String(page);
          }}
          count={Math.ceil(tableState.totalRecords / tableState.recordsPerPage)}
          page={tableState.currentPage}
          variant="outlined"
          shape="rounded"
          onChange={(_, nextPage: number) => {
            fetchData(nextPage);
          }}

          // renderItem={(params) => {
          //   const { type, page } = params;
          //   const text =
          //     type === "previous"
          //       ? "Previous"
          //       : type === "next"
          //       ? "Next"
          //       : String(page);
          //   return <span {...params}>{text}</span>;
          // }}
        />
      ) : null}
    </div>
  );
};

export default CustomTable;
