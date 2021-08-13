import { Drawer, Hidden, SwipeableDrawer } from "@material-ui/core";
import clsx from "clsx";
import { useContext } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";
import BrandLogo from "../BrandLogo";

export interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { open, toggleSidebarOpen } = useContext(SidebarContext);

  return (
    <div className="sidebar">
      <Hidden smUp>
        <SwipeableDrawer
          // className={clsx({
          //   sidenav: open,
          //   sidenav: !open,
          // })}
          variant="temporary"
          anchor="left"
          classes={{
            paper: "drawerPaper",
          }}
          ModalProps={{
            keepMounted: true,
          }}
          open={open}
          onClose={() => toggleSidebarOpen(false)}
          onOpen={() => toggleSidebarOpen(true)}
        >
          <div className="sidenav__header">Header Logo</div>
        </SwipeableDrawer>
      </Hidden>
      <Hidden smDown>
        <Drawer
          className={clsx({
            "sidenav--open": open,
            "sidenav--close": !open,
          })}
          variant="permanent"
          classes={{
            paper: "sidenav__drawer-paper",
          }}
        >
          <div className="sidenav__header">Header</div>
        </Drawer>
      </Hidden>
    </div>
  );
};

export default Sidebar;
