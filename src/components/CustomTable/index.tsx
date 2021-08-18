import React, { ComponentType, useContext, useEffect, useState } from "react";
import Paper from "@material-ui/core/Paper";

import { TableDataContext } from "../../contexts/TableDataContext";
import clsx from "clsx";
import ITableColumn from "../../types/ITableColumn";
import { Input, Menu, MenuItem, TableSortLabel } from "@material-ui/core";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import SearchIcon from "@material-ui/icons/Search";
import CustomScrollbar from "../CustomScrollbar";
import CustomSkeleton from "../../skeletons/CustomSkeleton";
import { SortOrder } from "../../types/UtilityTypes";

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
  loaderSkeleton?: ComponentType;
}

const CustomTable: React.FC<CustomTableProps> = (props) => {
  const { classes, tableConfig, loaderSkeleton } = props;
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
        className={clsx("rc__body" /* , { [bodyClassName]: classes?.body } */)}
      >
        <CustomScrollbar>
          {/* <CustomSkeleton
            // loading={loadingData}
            loading={false}
            loaderSkeleton={loaderSkeleton}
            skeletonCount={10}
          > */}
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
                      {/* {!col.format && col.key
                          ? row[col.key]
                          : col?.format(row)} */}
                      {col.format
                        ? col.format(row[col.key], row)
                        : row[col.key]}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
          {/* </CustomSkeleton> */}
        </CustomScrollbar>
      </div>
      {/* {!props.disablePagination ? Paginate : null} */}
    </div>
  );
};

export default CustomTable;

// <Paper className={clsx("custom-table", classes?.root)} elevation={3}>
//   <div className="custom-table__header">
//     {props.title && (
//       <div className="custom-table__title">{props.title}</div>
//     )}
//     {props.hasSearch && (
//       <Input
//         className="custom-table__search-input"
//         endAdornment={<SearchIcon />}
//         value={searchText}
//         onChange={handleSearch}
//         placeholder={
//           props.searchPlaceholder ? props.searchPlaceholder : "Search..."
//         }
//       />
//     )}
//   </div>
//   <TableContainer
//     className={clsx(classes?.container)}
//     style={{ width: tableWidth }}
//   >
//     <Table stickyHeader aria-label="sticky table">
//       <TableHead className={clsx(classes?.head)}>
//         <TableRow>
//           {tableConfig.map((column) => (
//             <TableCell
//               key={column.key}
//               //   @ts-ignore
//               align={column.align}
//               style={{ minWidth: column.minWidth }}
//             >
//               <TableSortLabel
//                 active={tableState.sortBy === column.key}
//                 direction={
//                   tableState.sortBy === column.key
//                     ? tableState.sortOrder
//                     : "asc"
//                 }
//                 disabled={!column.hasSorting}
//                 onClick={() => sortTable(column.key)}
//               >
//                 {column.label}
//               </TableSortLabel>
//             </TableCell>
//           ))}
//           {props.menuConfig && <TableCell></TableCell>}
//         </TableRow>
//       </TableHead>

//       <TableBody className="custom-table__body">
//         {tableState.data.map((row, index) => {
//           return (
//             <TableRow tabIndex={-1} key={row.code}>
//               {tableConfig.map((column) => {
//                 //   @ts-ignore
//                 const value = row[column.key];
//                 return (
//                   //   @ts-ignore
//                   <TableCell key={column.key} align={column.align}>
//                     {column.format ? column.format(value, row) : value}
//                   </TableCell>
//                 );
//               })}
//               {props.menuConfig && (
//                 <TableCell>
//                   <div className="move-doted">
//                     <MoreVertIcon
//                       aria-haspopup="true"
//                       onClick={(e) =>
//                         setMenu({
//                           // @ts-ignore
//                           anchor: e.target,
//                           index,
//                         })
//                       }
//                     />
//                   </div>
//                   <Menu
//                     id="simple-menu"
//                     anchorEl={menu.anchor}
//                     keepMounted
//                     open={Boolean(menu.anchor) && menu.index === index}
//                     onClose={() => setMenu({ index: -1, anchor: null })}
//                     transformOrigin={{
//                       vertical: "top",
//                       horizontal: "right",
//                     }}
//                   >
//                     {props.menuConfig.map((menuItem, index) => (
//                       <MenuItem
//                         key={index}
//                         className="image-list__menu-item"
//                         // @ts-ignore
//                         onClick={() => {
//                           menuItem.action(row);
//                           setMenu({ index: -1, anchor: null });
//                         }}
//                       >
//                         {menuItem.label}
//                       </MenuItem>
//                     ))}
//                   </Menu>
//                 </TableCell>
//               )}
//             </TableRow>
//           );
//         })}
//       </TableBody>
//     </Table>
//   </TableContainer>
//   {/* <TablePagination
//     rowsPerPageOptions={[2, 5, 10]}
//     component="div"
//     count={tableState.totalRecords}
//     rowsPerPage={tableState.recordsPerPage}
//     // page={1}
//     page={Math.floor(tableState.recordsPerPage * tableState.currentPage)}
//     onPageChange={(d) => console.log(d)}
//     onChangeRowsPerPage={(e) => {
//       fetchData(undefined, Number(e.target.value));
//     }}
//   /> */}
// </Paper>
