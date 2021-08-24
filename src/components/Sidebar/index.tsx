import { ComponentType, useContext } from "react";
import Drawer from "@material-ui/core/Drawer";
import clsx from "clsx";
import { SwipeableDrawer } from "@material-ui/core";
import BrandLogo from "../BrandLogo";
import { SidebarContext } from "../../contexts/SidebarContext";

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
  const { open, openMobileDrawer, toggleMobileSidebar } =
    useContext(SidebarContext);

  const sidebarContent = (
    <>
      <div className="sidebar__brand">
        <BrandLogo className="sidebar__brand-logo" />
      </div>
      <div className="sidebar__label">{title}</div>
      {SidebarContent ? <SidebarContent /> : null}
    </>
  );

  return (
    <div className="sidebar">
      <Drawer
        variant="permanent"
        className={clsx("drawer drawer--desktop", {
          "drawer--close": !open,
        })}
        classes={{
          paper: clsx("drawer", {
            "drawer--close": !open,
          }),
        }}
      >
        {sidebarContent}
      </Drawer>
      <SwipeableDrawer
        anchor="left"
        className="drawer drawer--mobile"
        open={openMobileDrawer}
        onClose={() => toggleMobileSidebar(false)}
        onOpen={() => toggleMobileSidebar(true)}
        classes={{
          paper: "drawer",
        }}
      >
        {sidebarContent}
      </SwipeableDrawer>
    </div>
  );
};

export default Sidebar;
