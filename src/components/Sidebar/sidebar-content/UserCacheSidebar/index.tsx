import { Box, Button, Drawer, Typography } from "@material-ui/core";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import React, { useState, useEffect } from "react";
import store, { RootState } from "../../../../redux/store";
import CustomScrollbar from "../../../CustomScrollbar";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CloseIcon from "@mui/icons-material/Close";
// import Radio from "@mui/material/Radio";
import { toggleSidebarUserCache } from "../../../../redux/actions/sidebarAction";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
  setChartData,
  setChartTranspose,
  setUserCache,
} from "../../../../redux/actions/chartActions";
import Toaster from "../../../../utils/Toaster";
import ApiUrl from "../../../../enums/ApiUrl";
import ApiRequest from "../../../../utils/ApiRequest";
import { ReactComponent as ColumnChartIcon } from "../../../../assets/svg/column-chart-icon.svg";
import { ReactComponent as StackChartIcon } from "../../../../assets/svg/stack-chart-icon.svg";
import { ReactComponent as TableIcon } from "../../../../assets/svg/table-icon.svg";
import { ReactComponent as PieChartIcon } from "../../../../assets/svg/pie-chart.svg";
import { ReactComponent as LineChartIcon } from "../../../../assets/svg/line_chart.svg";
// import { AnyAsyncThunk } from "@reduxjs/toolkit/dist/matchers";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import {
  fetchChartData,
  transposeChart,
} from "../../../../services/ChartService";
import { setSelectedQuestionId } from "../../../../redux/actions/questionAction";
import { setChartOrientation } from "../../../../redux/actions/chartActions";
import {
  removeAppliedFilter,
  setAppliedFilters,
  setFilterQuestionList,
  setFilters,
} from "../../../../redux/actions/filterActions";
// import { ChartType } from "../../../../enums/ChartType";
import { changeChartType } from "../../../../services/ChartService";
import { ReactComponent as NumberIcon } from "../../../../assets/svg/Number.svg";
import { ReactComponent as PercentageIcon } from "../../../../assets/svg/Percentage.svg";
import { ReactComponent as TransposeIcon } from "../../../../assets/svg/Transpose.svg";

const UserCache: React.FC = () => {
  const { userCache } = useSelector((state: RootState) => state?.sidebar);
  const { chart } = useSelector((state: RootState) => state);
  const [users, setUsers] = useState([]);
  const [check, setschecked] = useState();
  const [butttonshow, setButtonShow] = useState(true);
  const [activeSection, setActiveSection] = useState(false);
  const [userCacheId, serUserCacheId] = useState([]);

  const dispatch = useDispatch();

  useEffect(() => {
    // ApiRequest.request(ApiUrl.SAVECHART, "GET")
    //   .then((res) => {
    //     if (res.success) {
    //       //Toaster.success(res.message);
    //       dispatch(setUserCache(res?.data));
    //     } else {
    //       Toaster.error(res.message);
    //     }
    //   })
    //   .catch((error) => console.log(error));
  }, []);

  const closeSidebar = () => {
    dispatch(toggleSidebarUserCache(false));
  };

  const chartIcons = (index: any) => {
    if (chart?.userCache[index]?.chartType == 1) {
      return <ColumnChartIcon className="chart-hover-filed" />;
    } else if (chart?.userCache[index]?.chartType == 2) {
      return <StackChartIcon className="chart-hover-filed" />;
    } else if (chart?.userCache[index]?.chartType == 3) {
      return <TableIcon className="chart-hover-filed" />;
    } else if (chart?.userCache[index]?.chartType == 4) {
      return <PieChartIcon className="chart-hover-filed" />;
    } else if (chart?.userCache[index]?.chartType == 5) {
      return <LineChartIcon className="chart-hover-filed" />;
    }
  };
  useEffect(() => {
    setUsers(chart?.userCache);
  }, [chart?.userCache]);

  let userDataArr: any[] = [];

  const handleChange = (userId: any, event: any) => {
    const { value, name, checked } = event.target;

    if (name === "allSelect") {
      const tempUser: any = users.map((user: any) => {
        return { ...user, isChecked: checked };
      });
      setUsers(tempUser);
    } else {
      const tempUser: any = users.map((user: any, index: number) =>
        index === parseInt(name) ? { ...user, isChecked: checked } : user
      );
      setUsers(tempUser);
      serUserCacheId(userId);
    }
    if (event.target.checked) {
      setButtonShow(false);
    } else {
      setButtonShow(true);
    }
  };

  const cacheShow = (cacheId: any, event: any) => {
    const getid = event.target.getAttribute("id");

    if (getid === cacheId) {
      setActiveSection(true);
    } else {
      setActiveSection(false);
    }

    dispatch(setSelectedQuestionId(cacheId));
    chart?.userCache.forEach((userCacheinfo: any, index: string | number) => {
      if (userCacheinfo?.qId === cacheId) {
        changeChartType(chart?.userCache[index]?.chartType);
        dispatch(setFilters(userCacheinfo.filter));
        dispatch(setAppliedFilters(userCacheinfo.filter));
        dispatch(removeAppliedFilter(userCacheinfo.filter));
        if (userCacheinfo.chartTranspose) {
          fetchChartData()
            .then((chartData) => {
              dispatch(setChartData(chartData));
              transposeChart();
              dispatch(setChartTranspose(userCacheinfo.chartTranspose));
            })
            .catch((error) => console.log(error));
        } else {
          dispatch(setChartTranspose(false));
        }

        fetchChartData(cacheId)
          .then((chartData) => {
            dispatch(setChartData(chartData));
            dispatch(setChartOrientation(userCacheinfo?.chartOrientation));
            // if (
            //   chartData.questionData?.type !== QuestionType.SINGLE &&
            //   chartType === ChartType.PIE
            // ) {
            //   changeChartType(ChartType.COLUMN);
            // }
          })
          .catch((error) => console.log(error));
      }
    });
  };

  const userDeletebody = {
    _ids: [userCacheId],
  };

  const userCacheDelete = () => {
    ApiRequest.request(ApiUrl.DELETECHART, "DELETE", userDeletebody)
      .then((res) => {
        if (res.success) {
          Toaster.success(res.message);
          //dispatch(setUserCache(res?.data));
        } else {
          Toaster.error(res.message);
        }
      })
      .catch((error) => console.log(error));
  };

  return (
    <div className="sidebar user-cache">
      <Drawer
        anchor="right"
        open={userCache}
        variant="persistent"
        className="drawer drawer--desktop"
      >
        <Box role="presentation">
          <Typography
            variant="body1"
            component="div"
            className="user-cache__select-all"
          >
            <FormControlLabel
              control={
                <Checkbox
                  name="allSelect"
                  onChange={(event) => handleChange("", event)}
                  sx={{ color: "#fff" }}
                  checked={
                    !users.some(
                      (userDat: any, index: any) => userDat?.isChecked !== true
                    )
                  }
                />
              }
              label="Select All"
            />
            <CloseIcon
              onClick={closeSidebar}
              sx={{ color: "#fff", cursor: "pointer" }}
            />
          </Typography>

          <Divider className="border-first-line" />
          <Divider className="border-second-line" />
        </Box>
        <CustomScrollbar>
          {users === undefined
            ? ""
            : users.map((savedata: any, index: any) => {
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
                              id={savedata?.qId}
                              variant="body1"
                              component="div"
                              className="user-cache__colection-icon"
                            >
                              {chart?.userCache[index]?.filter.length > 0 ? (
                                <FilterAltIcon
                                  id={savedata?.qId}
                                  className="filter-icons"
                                />
                              ) : (
                                ""
                              )}
                              {chart?.userCache[index]?.chartLabelType ===
                              "percentage" ? (
                                <NumberIcon id={savedata?.qId} />
                              ) : (
                                <PercentageIcon />
                              )}
                              {chart?.userCache[index]?.chartTranspose ? (
                                <TransposeIcon id={savedata?.qId} />
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
                          name={index}
                          value={savedata?.qId}
                          className="user-cache-checkbox"
                          sx={{ p: 0, ml: "-4px" }}
                          checked={
                            savedata?.isChecked == undefined
                              ? ""
                              : savedata?.isChecked
                          }
                          onChange={(event) =>
                            handleChange(savedata?._id, event)
                          }
                        />
                      </Typography>
                    </div>
                    <Divider className="border-first-line" />
                    <Divider className="border-second-line" />
                  </div>
                );
              })}
        </CustomScrollbar>
        <div className="user-cache__footer">
          <Divider className="border-first-line" />
          <Divider className="border-second-line" />
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
