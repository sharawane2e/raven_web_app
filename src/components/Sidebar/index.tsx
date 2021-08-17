import { Drawer, Hidden, SwipeableDrawer } from "@material-ui/core";
import clsx from "clsx";
import { ComponentType, useContext } from "react";
import { SidebarContext } from "../../contexts/SidebarContext";
import BrandLogo from "../BrandLogo";

export interface SidebarProps {
  /**
   * title of the sidebar rendered after brand logo
   */
  title?: string;
  /**
   * content of the sidebar
   */
  content?: ComponentType<any>;
}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const { title, content: SidebarContent } = props;
  const { open, toggleSidebarOpen } = useContext(SidebarContext);

  const sidebarContent = (
    <>
      <div className="sidebar__header">
        <BrandLogo />
      </div>
      <div className="sidebar__label">{title}</div>
      {SidebarContent ? <SidebarContent /> : null}
    </>
  );

  return (
    <>
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
          {sidebarContent}
        </Drawer>
      </Hidden>
    </>
  );
};

export default Sidebar;
