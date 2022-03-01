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
import { setUserCache } from "../../../../redux/actions/chartActions";
import Toaster from "../../../../utils/Toaster";
import ApiUrl from "../../../../enums/ApiUrl";
import ApiRequest from "../../../../utils/ApiRequest";
import { ReactComponent as ColumnChartIcon } from "../../../../assets/svg/column-chart-icon.svg";
import { ReactComponent as StackChartIcon } from "../../../../assets/svg/stack-chart-icon.svg";
import { ReactComponent as TableIcon } from "../../../../assets/svg/table-icon.svg";
import { ReactComponent as PieChartIcon } from "../../../../assets/svg/pie-chart.svg";
import { ReactComponent as LineChartIcon } from "../../../../assets/svg/line_chart.svg";
import { AnyAsyncThunk } from "@reduxjs/toolkit/dist/matchers";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
// import { Grid } from "@mui/material";

const UserCache: React.FC = () => {
  const { userCache } = useSelector((state: RootState) => state?.sidebar);
  const { chart } = useSelector((state: RootState) => state);
  const [selctAll, setSelectAll] = useState(false);

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

  const selectAll = (event: any) => {
    const curentEvent = event.target.checked;
    setSelectAll(curentEvent);
  };
  console.log("event", selctAll);

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
              control={<Checkbox sx={{ color: "#fff" }} onClick={selectAll} />}
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
          {chart?.userCache.map((savedata: any, index: any) => {
            let cacheDate = new Date(savedata?.date);
            const curentDate = cacheDate.toLocaleString("en-us");

            return (
              <div className="user-cache__sidebar" key={index}>
                <Typography
                  variant="body1"
                  component="div"
                  className="user-cache__cache-data"
                >
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
                        {chart?.userCache[index]?.filter ? (
                          <FilterAltIcon />
                        ) : (
                          ""
                        )}
                      </Typography>
                    </Typography>
                  </Typography>
                  <Typography
                    variant="body1"
                    component="div"
                    className="multi-select-btn"
                  >
                    {/* <FormControlLabel
                     value="male"
                     control={<Radio sx={{ p: 0 }} />}
                     label=""
                     sx={{ mr: 0 }}
                   /> */}
                    <Checkbox
                      className="user-cache-checkbox"
                      sx={{ p: 0, ml: "-4px" }}
                      defaultChecked={selctAll}
                      // isChecked={selctAll}
                    />
                    {/* <Checkbox sx={{ p: 0, ml: "-4px" }} defaultChecked /> */}
                  </Typography>
                </Typography>
                <Divider sx={{ borderColor: "#272424" }} />
                <Divider sx={{ borderColor: "#6b6868" }} />
              </div>
            );
          })}
        </CustomScrollbar>
        <div className="user-cache__footer">
          <Divider sx={{ borderColor: "#272424" }} />
          <Divider sx={{ borderColor: "#6b6868" }} />
          <div className="user-cache__footer-inr">
            <Button
              className="button--secondary user-cache__delete-btn"
              //  onClick={applyFilters}
              //disabled={questionData === null}
            >
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
