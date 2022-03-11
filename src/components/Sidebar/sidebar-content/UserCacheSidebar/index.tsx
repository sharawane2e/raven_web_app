import { Box, Button, Drawer, Typography } from "@material-ui/core";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import store, { RootState } from "../../../../redux/store";
import CustomScrollbar from "../../../CustomScrollbar";
// import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CloseIcon from "@mui/icons-material/Close";
// import Radio from "@mui/material/Radio";
import { toggleSidebarUserCache } from "../../../../redux/actions/sidebarAction";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
// import {
//   fetchuserCache,
//   setChartData,
//   setChartTranspose,
//   setUserCache,
// } from "../../../../redux/actions/chartActions";
// import Toaster from "../../../../utils/Toaster";
// import ApiUrl from "../../../../enums/ApiUrl";
// import ApiRequest from "../../../../utils/ApiRequest";
import { ReactComponent as ColumnChartIcon } from "../../../../assets/svg/column-chart-icon.svg";
import { ReactComponent as StackChartIcon } from "../../../../assets/svg/stack-chart-icon.svg";
import { ReactComponent as TableIcon } from "../../../../assets/svg/table-icon.svg";
import { ReactComponent as PieChartIcon } from "../../../../assets/svg/pie-chart.svg";
import { ReactComponent as LineChartIcon } from "../../../../assets/svg/line_chart.svg";
// import { AnyAsyncThunk } from "@reduxjs/toolkit/dist/matchers";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import {
//   fetchChartData,
//   transposeChart,
// } from "../../../../services/ChartService";
// import {
//   setSelectedBannerQuestionId,
//   setSelectedQuestionId,
// } from "../../../../redux/actions/questionAction";
// import { setChartOrientation } from "../../../../redux/actions/chartActions";
// import {
//   removeAppliedFilter,
//   setAppliedFilters,
//   setFilterQuestionList,
//   setFilters,
// } from "../../../../redux/actions/filterActions";
// import { ChartType } from "../../../../enums/ChartType";
// import { changeChartType } from "../../../../services/ChartService";
import { ReactComponent as NumberIcon } from "../../../../assets/svg/Number.svg";
import { ReactComponent as PercentageIcon } from "../../../../assets/svg/Percentage.svg";
import { ReactComponent as TransposeIcon } from "../../../../assets/svg/Transpose.svg";
import { ReactComponent as TransferdataIcon } from "../../../../assets/svg/transfer_data.svg";
import CircleCheckedFilled from "@material-ui/icons/CheckCircle";
import CircleUnchecked from "@material-ui/icons/RadioButtonUnchecked";
import { Tooltip } from "@material-ui/core";
import Animation from "../../../Skeleton"

const UserCache: React.FC = () => {
  const { sidebar } = useSelector((state: RootState) => state);
  const { savedChart } = useSelector((state: RootState) => state?.userCache);
  const [getUserCache, setUsersCache] = useState<any[]>([]);
  const [butttonshow, setButtonShow] = useState(true);
  const [activeSection, setActiveSection] = useState(false);
  const [userCacheId, setUserCacheId] = useState<any[]>([]);

  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(toggleSidebarUserCache(false));
  };

  const chartIcons = (index: any) => {
    if (savedChart[index]?.chartType == 1) {
      return <ColumnChartIcon className="chart-hover-filed" />;
    } else if (savedChart[index]?.chartType == 2) {
      return <StackChartIcon className="chart-hover-filed" />;
    } else if (savedChart[index]?.chartType == 3) {
      return <TableIcon className="chart-hover-filed" />;
    } else if (savedChart[index]?.chartType == 4) {
      return <PieChartIcon className="chart-hover-filed" />;
    } else if (savedChart[index]?.chartType == 5) {
      return <LineChartIcon className="chart-hover-filed" />;
    }
  };
  useEffect(() => {
    return setUsersCache(savedChart);
  }, [savedChart]);

  const handleChange = (userId: any, event: any) => {
    const { value, name, checked } = event.target;
    if (name === "allSelect") {
      const userMultiId = userId.map((element: any, index: any) => {
        return element?._id;
      });
      setUserCacheId(userMultiId);
      const tempUser: any = getUserCache.map((user: any, index: any) => {
        return { ...user, isChecked: checked };
      });
      setUsersCache(tempUser);
    } else {
      const tempUser: any = getUserCache.map((user: any, index: number) =>
        index === parseInt(name) ? { ...user, isChecked: checked } : user
      );
      setUsersCache(tempUser);
      if (checked) {
        setButtonShow(false);
        setUserCacheId([...userCacheId, userId]);
      } else {
        setButtonShow(true);
        setUserCacheId(
          userCacheId.filter((el: any) => el !== event.target.value)
        );
      }
    }
    if (checked) {
      setButtonShow(false);
    } else {
      setButtonShow(true);
    }
  };

  const cacheShow = (cacheId: any, event: any) => {
    // dispatch(setSelectedQuestionId(cacheId));
    // chart?.userCache.forEach((userCacheinfo: any, index: string | number) => {
    //   if (userCacheinfo?.qId === cacheId) {
    //     changeChartType(chart?.userCache[index]?.chartType);
    //     dispatch(setFilters(userCacheinfo.filter));
    //     dispatch(setAppliedFilters(userCacheinfo.filter));
    //     dispatch(removeAppliedFilter(userCacheinfo.filter));
    //     dispatch(setSelectedBannerQuestionId(userCacheinfo.bannerQuestion));
    //     if (userCacheinfo.chartTranspose) {
    //       fetchChartData()
    //         .then((chartData) => {
    //           dispatch(setChartData(chartData));
    //           transposeChart();
    //           dispatch(setChartTranspose(userCacheinfo.chartTranspose));
    //         })
    //         .catch((error) => console.log(error));
    //     } else {
    //       dispatch(setChartTranspose(false));
    //     }
    //     fetchChartData(cacheId)
    //       .then((chartData) => {
    //         dispatch(setChartData(chartData));
    //         // dispatch(setChartOrientation(userCacheinfo?.chartOrientation));
    //       })
    //       .catch((error) => console.log(error));
    //   }
    // });
  };

  const userDeletebody = {
    _ids: userCacheId,
  };

  const userCacheDelete = () => {
    // ApiRequest.request(ApiUrl.DELETE_CHART, "DELETE", userDeletebody)
    //   .then((res) => {
    //     if (res.success) {
    //       Toaster.success(res.message);
    //     } else {
    //       Toaster.error(res.message);
    //     }
    //   })
    //   .catch((error) => console.log(error));
  };

  const skeletonShow =()=>{
    return   ["1","2","3","4","5"].map((el,index:number)=>{
        return  <Animation key={index}/>
      })
  }

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
            {getUserCache === undefined ? (
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
                    onChange={(event) => handleChange(getUserCache, event)}
                    sx={{ color: "#fff" }}
                    checked={
                      !getUserCache.some(
                        (checkedAll: any) => checkedAll?.isChecked !== true
                      )
                    }
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
          {/* <Divider className="border-first-line" /> */}
          {/* <Divider className="border-second-line" /> */}
        </Box>
      {skeletonShow}
        <CustomScrollbar>
          {getUserCache.length === 0 ? (
            <div className="user-cache__no-data">no data exists</div>
          ) : (
            getUserCache.map((savedata: any, index: any) => {
              let cacheDate = new Date(savedata?.date);
              const curentDate = cacheDate.toLocaleString("en-us");

              return (
                <div className="user-cache__sidebar" key={index}>
                  <div className="user-cache__cache-data">
                    <div
                      id={savedata?.qId}
                      className={`user-cache__cache-data--cache-section ${
                        activeSection ? "active-section" : ""
                      }`}
                      onClick={(event) => cacheShow(savedata?.qId, event)}
                    >
                      <Typography
                        id={savedata?.qId}
                        variant="body1"
                        component="div"
                        className="user-cache__chart-icon-sec"
                      >
                        <Typography
                          id={savedata?.qId}
                          variant="body1"
                          component="div"
                          className="user-cache__chart-icon"
                        >
                          {chartIcons(index)}
                        </Typography>
                      </Typography>
                      <Typography
                        id={savedata?.qId}
                        variant="body1"
                        component="div"
                        className="user-cache__chart-question"
                      >
                        <Typography
                          id={savedata?.qId}
                          variant="h6"
                          component="h6"
                          className="user-cache__chart-headding"
                        >
                          {savedata?.qText}
                        </Typography>
                        <Typography
                          id={savedata?.qId}
                          variant="body1"
                          component="div"
                          className="user-cache__collectdata"
                        >
                          <Typography
                            id={savedata?.qId}
                            variant="body1"
                            component="div"
                            className="user-cache__date"
                          >
                            {curentDate.split(",")[0]}
                          </Typography>
                          <Typography
                            //   id={savedata?.qId}
                            variant="body1"
                            component="div"
                            className="user-cache__colection-icon"
                          >
                            {savedChart[index]?.filter.length > 0 ? (
                              <Tooltip title={"Filters"} arrow placement="top">
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
                              <Tooltip title={"Number"} arrow placement="top">
                                <NumberIcon id={savedata?.qId} />
                              </Tooltip>
                            ) : (
                              <Tooltip
                                title={"Percentage"}
                                arrow
                                placement="top"
                              >
                                <PercentageIcon />
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
                              <TransferdataIcon />
                            ) : (
                              ""
                            )}
                          </Typography>
                        </Typography>
                      </Typography>
                    </div>
                    <Typography
                      variant="body1"
                      component="div"
                      className="multi-select-btn"
                    >
                      <Checkbox
                        icon={<CircleUnchecked />}
                        checkedIcon={
                          <CircleCheckedFilled className="checked-color" />
                        }
                        name={index}
                        value={savedata?._id}
                        className="user-cache-checkbox"
                        sx={{ p: 0, ml: "-4px" }}
                        checked={
                          savedata?.isChecked == undefined
                            ? ""
                            : savedata?.isChecked
                        }
                        onChange={(event) => handleChange(savedata?._id, event)}
                      />
                    </Typography>
                  </div>
                  <div className="user-cache__bottom-line"></div>
                  {/* <Divider className="border-first-line" /> */}
                  {/* <Divider className="border-second-line" /> */}
                </div>
              );
            })
          )}
        </CustomScrollbar>
        <div className="user-cache__footer">
          <div className="user-cache__bottom-line"></div>
          {/* <Divider className="border-first-line" /> */}
          {/* <Divider className="border-second-line" /> */}
          <div className="user-cache__footer-inr">
            <Button
              disabled={butttonshow}
              className="button--secondary user-cache__delete-btn"
              onClick={() => {
                userCacheDelete();
              }}
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
              {/* <Typography variant="body1" component="div"> */}
              Export
              <KeyboardArrowDownIcon sx={{ fill: "#fff" }} />
              {/* </Typography> */}
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default memo(UserCache);
