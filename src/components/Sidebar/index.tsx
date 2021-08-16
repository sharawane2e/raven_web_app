import { Drawer, Hidden, SwipeableDrawer } from "@material-ui/core";
import clsx from "clsx";
import { useContext } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";
import BrandLogo from "../BrandLogo";

export interface SidebarProps {
  title?: string;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { title } = props;
  const { open, toggleSidebarOpen } = useContext(SidebarContext);

  return (
    <div className="">
      {/* <Hidden smUp>
        <SwipeableDrawer
          // className={clsx({
          //   sidebar: open,
          //   sidebar: !open,
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
          <div className="sidebar__header">Header Logo</div>
        </SwipeableDrawer>
      </Hidden> */}
      <Hidden smDown>
        <Drawer
          className={clsx("sidebar", {
            "sidebar--open": open,
            "sidebar--close": !open,
          })}
          variant="permanent"
          classes={{
            paper: "sidebar__drawer-paper",
          }}
        >
          <div className="sidebar__header">
            <BrandLogo />
          </div>
        </Drawer>
      </Hidden>
    </div>
  );
};

export default Sidebar;
