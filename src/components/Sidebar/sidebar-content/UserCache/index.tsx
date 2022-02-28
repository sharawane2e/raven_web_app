import { Box, Button, Drawer, Typography } from "@material-ui/core";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";

import store, { RootState } from "../../../../redux/store";
import CustomScrollbar from "../../../CustomScrollbar";
import Divider from "@mui/material/Divider";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CloseIcon from "@mui/icons-material/Close";
import Radio from "@mui/material/Radio";
import { toggleSidebarUserCache } from "../../../../redux/actions/sidebarAction";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { ReactComponent as ColumnChartIcon } from "../../../../assets/svg/column-chart-icon.svg";

// type Anchor = "top" | "left" | "bottom" | "right";

const UserCache: React.FC = () => {
  const { userCache } = useSelector((state: RootState) => state?.sidebar);
  console.log("userCache", userCache);
  const dispatch = useDispatch();

  const closeSidebar = () => {
    dispatch(toggleSidebarUserCache(false));
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
              control={<Checkbox sx={{ color: "#fff" }} />}
              label="Select All"
            />
            <CloseIcon
              onClick={closeSidebar}
              sx={{ color: "#fff", cursor: "pointer" }}
            />
          </Typography>

          <Divider sx={{ borderColor: "#fff" }} />
        </Box>
        <div className="user-cache__sidebar">
          <CustomScrollbar>
            <Typography
              variant="body1"
              component="div"
              className="user-cache__cache-data"
            >
              <Typography
                variant="body1"
                component="div"
                className="user-cache__chart-icon"
              >
                <ColumnChartIcon />
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
                  Question Data
                </Typography>
                <Typography variant="body1" component="div">
                  <Typography variant="body1" component="div">
                    demo data
                  </Typography>
                </Typography>
              </Typography>
              <FormControlLabel
                value="male"
                control={<Radio sx={{ p: 0 }} />}
                label=""
                sx={{ mr: 0 }}
              />
            </Typography>
            <Divider sx={{ borderColor: "#fff" }} />
          </CustomScrollbar>
        </div>

        <div className="user-cache__footer">
          <Divider sx={{ borderColor: "#fff" }} />
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
