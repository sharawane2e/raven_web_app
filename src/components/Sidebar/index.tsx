import { SwipeableDrawer } from "@material-ui/core";
import clsx from "clsx";
import BrandLogo from "../BrandLogo";

export interface SidebarProps {}

const Sidebar: React.FC<SidebarProps> = (props) => {
  const mobileOpen = true;

  return (
    <div className="sidebar">
      {/* 
<SwipeableDrawer
        // className="drawer"
        className={clsx({
          "sidenav mobile-sidenav sidenav--open": mobileOpen,
          "sidenav  mobile-sidenav sidenav--close": !mobileOpen,
        })}
        variant="temporary"
        anchor="left"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        classes={{
          paper: "drawerPaper",
        }}
        ModalProps={{
          keepMounted: true,
        }}
      >
        <div className="sidenav__header">
          <span>
            <img src={LogoLarge} alt="" />
          </span>
          <span className="sidenav__close-icon" onClick={handleDrawerToggle}>
            <CloseIcon />
          </span>
        </div>
 Hello
      </SwipeableDrawer> */}
    </div>
  );
};

export default Sidebar;
