import {
  Box,
  Button,
  Drawer,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@material-ui/core";
import { memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setChartData,
  setChartTranspose,
} from "../../../../redux/actions/chartActions";
import {
  resetFilters,
  setAppliedFilters,
  setFilterQuestionList,
  setFilters,
} from "../../../../redux/actions/filterActions";
import store, { RootState } from "../../../../redux/store";
import {
  fetchChartData,
  transposeChart,
} from "../../../../services/ChartService";
import { IQuestionOption } from "../../../../types/IBaseQuestion";
import CustomScrollbar from "../../../CustomScrollbar";
import MultiSelect from "../../../widgets/MultiSelect";
import { IFilter } from "../../../../types/IFilter";
import Divider from "@mui/material/Divider";

import List from "@mui/material/List/List";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import CloseIcon from "@mui/icons-material/Close";

import {
  toggleSidebar,
  toggleSidebarMobile,
  toggleSidebarUserCache,
} from "../../../../redux/actions/sidebarAction";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";

type Anchor = "top" | "left" | "bottom" | "right";

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
        <CustomScrollbar>
          <Box
            // sx={{ width: anchor === "top" || anchor === "bottom" ? "auto" : 250 }}
            role="presentation"
            //onClick={toggleDrawer(anchor, false)}
            //onKeyDown={toggleDrawer(anchor, false)}
          >
            <List>
              {[
                "Inbox",
                "Starred",
                "Send email",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
                "Drafts",
              ].map((text, index) => (
                <ListItem button key={text}>
                  {/* <ListItemIcon></ListItemIcon> */}
                  <ListItemText primary={text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </CustomScrollbar>

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
              className="button--primary"
              onClick={() => {
                // removeFilter(appliedFilters);
                //dispatch(resetFilters());
              }}
            >
              <Typography variant="body1" component="div">
                Export
                <KeyboardArrowDownIcon />
              </Typography>
            </Button>
          </div>
        </div>
      </Drawer>
    </div>
  );
};

export default memo(UserCache);
