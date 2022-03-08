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
// import { QuestionType } from "../../../../enums/QuestionType";
import {
  removeAppliedFilter,
  setAppliedFilters,
  setFilterQuestionList,
  setFilters,
} from "../../../../redux/actions/filterActions";
import { ChartType } from "../../../../enums/ChartType";
import { changeChartType } from "../../../../services/ChartService";
import { ReactComponent as NumberIcon } from "../../assets/svg/Number.svg";
import { ReactComponent as PercentageIcon } from "../../assets/svg/Percentage.svg";

const UserCache: React.FC = () => {
  const { userCache } = useSelector((state: RootState) => state?.sidebar);
  const { chart } = useSelector((state: RootState) => state);
  const [users, setUsers] = useState([]);
  const [check, setschecked] = useState();

  const dispatch = useDispatch();

  useEffect(() => {
    ApiRequest.request(ApiUrl.SAVECHART, "GET")
      .then((res) => {
        if (res.success) {
          //Toaster.success(res.message);
          dispatch(setUserCache(res?.data));
        } else {
          Toaster.error(res.message);
        }
      })
      .catch((error) => console.log(error))
      .finally(() => console.log("Sucess"));
  }, []);

  const closeSidebar = () => {
    dispatch(toggleSidebarUserCache(false));
  };
  const chartIcons = (index: any) => {
    if (chart?.userCache[index]?.chartType == 1) {
      return <ColumnChartIcon />;
    } else if (chart?.userCache[index]?.chartType == 2) {
      return <StackChartIcon />;
    } else if (chart?.userCache[index]?.chartType == 3) {
      return <TableIcon />;
    } else if (chart?.userCache[index]?.chartType == 4) {
      return <PieChartIcon />;
    } else if (chart?.userCache[index]?.chartType == 5) {
      return <LineChartIcon />;
    }
  };
  useEffect(() => {
    setUsers(chart?.userCache);
  }, [chart?.userCache]);

  const handleChange = (event: any) => {
    const { value, name, checked } = event.target;
    if (name === "allSelect") {
      const tempUser: any = users.map((user: any) => {
        return { ...user, isChecked: checked };
      });
      setUsers(tempUser);
      users.map((userChecked: any, index: any) => {
        setschecked(userChecked?.isChecked);
      });
    } else {
      const tempUser: any = users.map((user: any, index: number) =>
        index === parseInt(name) ? { ...user, isChecked: checked } : user
      );
      setUsers(tempUser);
    }
  };

  const cacheShow = (cacheId: any) => {
    dispatch(setSelectedQuestionId(cacheId));
    chart?.userCache.forEach((userCacheinfo: any, index: string | number) => {
      console.log("userCacheinfo", userCacheinfo?.chartOrientation);
      if (userCacheinfo?.qId === cacheId) {
        if (chart?.userCache[index]?.chartType == 1) {
          changeChartType(ChartType.COLUMN);
        } else if (chart?.userCache[index]?.chartType == 2) {
          changeChartType(ChartType.STACK);
        } else if (chart?.userCache[index]?.chartType == 3) {
          changeChartType(ChartType.TABLE);
        } else if (chart?.userCache[index]?.chartType == 4) {
          changeChartType(ChartType.PIE);
        } else if (chart?.userCache[index]?.chartType == 5) {
          changeChartType(ChartType.LINE);
        }
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
            dispatch(setChartOperations(userCacheinfo?.chartOrientation));
            // if (
            //   chartData.questionData?.type !== QuestionType.SINGLE &&
            //   chartType === ChartType.PIE
            // ) {
            //   changeChartType(ChartType.COLUMN);
            // }
          })
          .catch((error) => console.log(error));

        // else {
        //   console.log("chart?.userCache?.filter", userCacheinfo.filter);
        //   fetchChartData()
        //     .then((chartData) => {
        //       dispatch(setChartData(chartData));
        //     })
        //     .catch((error) => console.log(error));
        // }
      }
    });
  };

  const applyOptions = (index: any) => {
    console.log("chart?.userCache[index]?", chart?.userCache[index]);
    if (chart?.userCache[index]?.filter.length > 0) {
      return <FilterAltIcon />;
    }
    // else if(){

    // }
  };

  return (
    <div className="sidebar user-cache">
      <Drawer
        anchor="right"
        open={userCache}
        //onClose={toggleDrawer(anchor, false)}
        // sx={{ top: 10 }}
        variant="persistent"
        className="drawer drawer--desktop"
      >
        <Box
          // sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
          role="presentation"
          //onClick={toggleDrawer(anchor, false)}
          //onKeyDown={toggleDrawer(anchor, false)}
        >
          <Typography
            variant="body1"
            component="div"
            className="user-cache__select-all"
          >
            <FormControlLabel
              control={
                <Checkbox
                  name="allSelect"
                  onChange={handleChange}
                  sx={{ color: "#fff" }}
                  // checked={savedata?.isChecked}
                  checked={users.some(
                    (userDat: any, index: any) => userDat?.isChecked !== true
                  )}
                  // onClick={selectAll}
                  // checked={!users.some((user) => user?.isChecked !== true)}
                />
              }
              label="Select All"
            />
            <CloseIcon
              onClick={closeSidebar}
              sx={{ color: "#fff", cursor: "pointer" }}
            />
          </Typography>

          <Divider sx={{ borderColor: "#272424" }} />
          <Divider sx={{ borderColor: "#6b6868" }} />
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
                      <Typography
                        variant="body1"
                        component="div"
                        className="user-cache__chart-icon-sec"
                      >
                        <Typography
                          variant="body1"
                          component="div"
                          className="user-cache__chart-icon"
                        >
                          {/* <ColumnChartIcon /> */}
                          {chartIcons(index)}
                        </Typography>
                      </Typography>
                      <Typography
                        variant="body1"
                        component="div"
                        className="user-cache__chart-question"
                        onClick={() => cacheShow(savedata?.qId)}
                      >
                        <Typography
                          variant="h6"
                          component="h6"
                          className="user-cache__chart-headding"
                        >
                          {savedata?.qText}
                        </Typography>
                        <Typography
                          variant="body1"
                          component="div"
                          className="user-cache__collectdata"
                        >
                          <Typography
                            variant="body1"
                            component="div"
                            className="user-cache__date"
                          >
                            {curentDate.split(",")[0]}
                          </Typography>
                          <Typography
                            variant="body1"
                            component="div"
                            className="user-cache__colection-icon"
                          >
                            {applyOptions(index)}
                          </Typography>
                        </Typography>
                      </Typography>
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
                          onChange={handleChange}
                        />
                      </Typography>
                    </div>
                    <Divider sx={{ borderColor: "#272424" }} />
                    <Divider sx={{ borderColor: "#6b6868" }} />
                  </div>
                );
              })}
        </CustomScrollbar>
        <div className="user-cache__footer">
          <div className="user-cache__footer-inr">
            <Button className="button--secondary user-cache__delete-btn">
              Delete
            </Button>
            <Button
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
function setChartOperations(defaultChartOperations: any): any {
  throw new Error("Function not implemented.");
}
