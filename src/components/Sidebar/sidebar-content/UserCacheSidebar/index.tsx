import { Box, Button, Drawer, Typography } from "@material-ui/core";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import React, { ComponentType, useContext, useState, useEffect } from "react";
import store, { RootState } from "../../../../redux/store";
import CustomScrollbar from "../../../CustomScrollbar";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CloseIcon from "@mui/icons-material/Close";
import { toggleSidebarUserCache } from "../../../../redux/actions/sidebarAction";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ReactComponent as ColumnChartIcon } from "../../../../assets/svg/column-chart-icon.svg";
import { ReactComponent as StackChartIcon } from "../../../../assets/svg/stack-chart-icon.svg";
import { ReactComponent as TableIcon } from "../../../../assets/svg/table-icon.svg";
import { ReactComponent as PieChartIcon } from "../../../../assets/svg/pie-chart.svg";
import { ReactComponent as LineChartIcon } from "../../../../assets/svg/line_chart.svg";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { ReactComponent as NumberIcon } from "../../../../assets/svg/Number.svg";
import { ReactComponent as PercentageIcon } from "../../../../assets/svg/Percentage.svg";
import { ReactComponent as TransposeIcon } from "../../../../assets/svg/Transpose.svg";
import { ReactComponent as TransferdataIcon } from "../../../../assets/svg/transfer_data.svg";
import CircleCheckedFilled from "@material-ui/icons/CheckCircle";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import { Tooltip } from "@material-ui/core";
import CustomSkeleton from "../../../../skeletons/CustomSkeleton";
import UserCacheSekeleton from "../../../../skeletons/UserCacheSekeleton";
import { resetUserCache } from "../../../../redux/actions/userCacheActions";
import _ from "lodash";
import {
  handleDeleteChartCache,
  isChartInCache,
} from "../../../../services/userCacheService";
import {
  setSelectedBannerQuestionId,
  setSelectedQuestionId,
} from "../../../../redux/actions/questionAction";

import {
  setChartData,
  setChartLabel,
  setChartOrientation,
  setChartTranspose,
} from "../../../../redux/actions/chartActions";

import {
  changeChartType,
  fetchChartData,
  transposeChart,
} from "../../../../services/ChartService";
import {
  setAppliedFilters,
  setFilterQuestionList,
  setFilters,
} from "../../../../redux/actions/filterActions";
import { ChartType } from "../../../../enums/ChartType";

export interface UserCacheProps {
  loaderSkeleton?: ComponentType;
}

const UserCache: React.FC<UserCacheProps> = (props) => {
  const { sidebar } = useSelector((state: RootState) => state);
  // const { savedChart } = useSelector((state: RootState) => state?.userCache);
  const [selectAll, setSelectAll] = useState<boolean>(false);
  const [selectAllSelf, setSelectAllSelf] = useState<number>(0);
  const [butttonshow, setButtonShow] = useState(true);
  const [activeCacheId, setActiveCacheId] = useState<any>("");
  const { userCache } = store.getState();
  const { savedChart } = userCache;

  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(toggleSidebarUserCache(false));
    setSelectAll(false);
  };

  const chartIcons = (index: any) => {
    if (savedChart[index]?.chartType == ChartType.COLUMN) {
      return <ColumnChartIcon className="chart-hover-filed" />;
    } else if (savedChart[index]?.chartType == ChartType.STACK) {
      return <StackChartIcon className="chart-hover-filed" />;
    } else if (savedChart[index]?.chartType == ChartType.TABLE) {
      return <TableIcon className="chart-hover-filed" />;
    } else if (savedChart[index]?.chartType == ChartType.PIE) {
      return <PieChartIcon className="chart-hover-filed" />;
    } else if (savedChart[index]?.chartType == ChartType.LINE) {
      return <LineChartIcon className="chart-hover-filed" />;
    }
  };

  useEffect(() => {
    savedChart.map(function (chartElement) {
      if (chartElement.isSelected == false) {
        setSelectAll(false);
      }
    });

    if (isChartInCache().isChartDuplicate) {
      setActiveCacheId(isChartInCache().duplicateCacheId);
      // console.log(isChartInCache().duplicateCacheId)
    }
  });

  useEffect(() => {
    const updateCacheChart: any[] = [];
    savedChart.map(function (chartElement) {
      const updateSingleChartContent = { ...chartElement };
      updateSingleChartContent.isSelected = selectAll;
      updateCacheChart.push(updateSingleChartContent);
    });
    dispatch(resetUserCache(updateCacheChart));
  }, [selectAllSelf]);

  useEffect(() => {
    const savedChartLength = savedChart.length;
    let selectAll = false;
    let selectedCount = 0;
    const _savedChart = JSON.parse(JSON.stringify(savedChart));

    _savedChart.map(function (chartElement: any) {
      if (chartElement.isSelected) {
        selectedCount++;
      }
    });

    if (selectedCount === savedChartLength && selectedCount != 0) {
      setSelectAll(true);
      setButtonShow(false);
    } else if (selectedCount < savedChartLength && selectedCount != 0) {
      setSelectAll(false);
      setButtonShow(false);
    } else {
      setButtonShow(true);
    }
  }, [JSON.stringify(savedChart)]);

  const handleSelectAll = (selectAllValue: boolean, e: any) => {
    setSelectAll(selectAllValue);
    if (e != undefined) {
      setSelectAllSelf(selectAllSelf + 1);
    }
  };

  const handleSingleSelect = (savedChartId: string, selectValue: boolean) => {
    setActiveCacheId(savedChartId)
    const _savedChart = JSON.parse(JSON.stringify(savedChart));
    _savedChart.forEach(function (singleCacheChart: any) {
      if (singleCacheChart._id === savedChartId) {
        singleCacheChart.isSelected = selectValue;
      }
    });
    dispatch(resetUserCache(_savedChart));
  };

  const cacheShow = (cacheId: any, event: any,selectValue: boolean) => {
   setActiveCacheId(selectValue);
  const _cacheQuestion: any = savedChart.filter((userCacheinfo: any) => {
      return userCacheinfo?._id === cacheId;
    });

    dispatch(setSelectedQuestionId(_cacheQuestion[0]["qId"]));
    dispatch(setSelectedBannerQuestionId(_cacheQuestion[0]["bannerQuestion"]));
    dispatch(setAppliedFilters(_cacheQuestion[0]["filter"]));
    dispatch(setFilters(_cacheQuestion[0]["filter"]));

    fetchChartData()
      .then((chartData) => {
        dispatch(setChartData(chartData));
        changeChartType(_cacheQuestion[0]["chartType"]);
        dispatch(setChartOrientation(_cacheQuestion[0]["chartOrientation"]))
        dispatch(setChartLabel(_cacheQuestion[0]["chartLabelType"]))
        dispatch(setChartTranspose(false));
        if(_cacheQuestion[0]["chartTranspose"]){
            transposeChart();
        }
      })
      .catch((error) => console.log(error));
    
  };

  const userCacheDelete = () => {
    const deleteSavedCharts = savedChart.filter(
      (chartElement) => chartElement.isSelected == true
    );
    const deleteSavedChartsIds = deleteSavedCharts.map(
        (chartElement) => chartElement._id
    );
     handleDeleteChartCache(deleteSavedChartsIds);
  };

  return (
    <div className="sidebar user-cache">
      <Drawer
        anchor="right"
        open={sidebar?.userCache}
        variant="persistent"
        className="drawer drawer--desktop"
      >
        <Box role="presentation">
          <Typography
            variant="body1"
            component="div"
            className="user-cache__select-all"
          >
            {savedChart.length === 0 ? (
              ""
            ) : (
              <FormControlLabel
                control={
                  <Checkbox
                    className="default-checkbox-color"
                    icon={<CircleUnchecked />}
                    checkedIcon={
                      <CircleCheckedFilled className="checked-color" />
                    }
                    name="allSelect"
                    onChange={(e) => {
                      handleSelectAll(!selectAll, e);
                    }}
                    sx={{ color: "#fff" }}
                    checked={selectAll}
                  />
                }
                label="Select All"
              />
            )}

            <CloseIcon
              onClick={closeSidebar}
              sx={{ color: "#fff", cursor: "pointer" }}
            />
          </Typography>
          <div className="user-cache__bottom-line"></div>
        </Box>

        <CustomScrollbar>
          <CustomSkeleton
            loading={userCache.cacheLoading}
            loaderSkeleton={UserCacheSekeleton}
            skeletonCount={8}
          >
            {savedChart.length === 0 ? (
              <>
                <div className="user-cache__no-data">
                  No questions exists <br />
                  Click icon to add in cache
                </div>
              </>
            ) : (
              savedChart.map((savedata: any, index: any) => {
                let cacheDate = new Date(savedata?.date);
                const curentDate = cacheDate.toLocaleString("en-us");
              
                return (
                  <div className="user-cache__sidebar" key={index}>
                    <div className="user-cache__cache-data">
                      <div
                        id={savedata?._id}
                        className={`user-cache__cache-data--cache-section ${
                          activeCacheId == savedata?._id || savedata?.isSelected
                            ? "user-cache__cache-data--active-section"
                            : ""
                        }`}
                        onClick={(event) => cacheShow(savedata?._id, event,savedata?.isSelected)}
                      >
                        <div className="user-cache__chart-icon-sec">
                          <div className="user-cache__chart-icon">
                            {chartIcons(index)}
                          </div>
                        </div>
                      
                        <div className="user-cache__chart-question">
                          <div className="user-cache__chart-headding">
                            {savedata?.qText}
                          </div>
                          <div className="user-cache__collectdata">
                            <div className="user-cache__date">
                              {curentDate.split(",")[0]}
                            </div>
                            <div className="user-cache__colection-icon">
                              {savedChart[index]?.filter.length > 0 ? (
                                <Tooltip
                                  title={"Filters"}
                                  arrow
                                  placement="top"
                                >
                                  <FilterAltIcon
                                    id={savedata?.qId}
                                    className="filter-icons"
                                  />
                                </Tooltip>
                              ) : (
                                ""
                              )}
                              {savedChart[index]?.chartLabelType ===
                              "percentage" ? (
                                <Tooltip
                                  title={"Percentage"}
                                  arrow
                                  placement="top"
                                >
                                  <PercentageIcon />
                                </Tooltip>
                              ) : (
                                <Tooltip title={"Number"} arrow placement="top">
                                <NumberIcon id={savedata?.qId} />
                              </Tooltip>
                               
                              )}
                              {savedChart[index]?.chartTranspose ? (
                                <Tooltip
                                  title={"Transpose"}
                                  arrow
                                  placement="top"
                                >
                                  <TransposeIcon id={savedata?.qId} />
                                </Tooltip>
                              ) : (
                                ""
                              )}
                              {savedChart[index]?.qId !== "" &&
                              savedChart[index]?.bannerQuestion !== "" ? (
                                <Tooltip
                                title={"Transfer data"}
                                arrow
                                placement="top"
                              >
                                <TransferdataIcon className="transferdata-icon"/>
                                </Tooltip>
                              ) : (
                                ""
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="multi-select-btn">
                        <Checkbox
                          icon={<CircleUnchecked />}
                          checkedIcon={
                            <CircleCheckedFilled className="checked-color" />
                          }
                          name={index}
                          value={savedata?._id}
                          className="user-cache-checkbox"
                          sx={{ p: 0, ml: "-4px" }}
                          checked={savedata?.isSelected}
                          onChange={() => {
                            handleSingleSelect(
                              savedata?._id,
                              !savedata?.isSelected
                            );
                          }}
                        />
                      </div>
                    </div>
                    <div className="user-cache__bottom-line"></div>
                  </div>
                );
              })
            )}
          </CustomSkeleton>
        </CustomScrollbar>
        <div className="user-cache__footer">
          <div className="user-cache__bottom-line"></div>
          <div className="user-cache__footer-inr">
            <Button
              disabled={butttonshow}
              className="button--secondary user-cache__delete-btn"
              onClick={userCacheDelete}
            >
              Delete
            </Button>
            <Button
              disabled
              className="button--primary btn-line"
              onClick={() => {
                // removeFilter(appliedFilters);
                //dispatch(resetFilters());
              }}
            >
              Export
              <KeyboardArrowDownIcon sx={{ fill: "#fff" }} />
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default memo(UserCache);
