import { useState, useContext, MouseEvent } from "react";
import { Menu, MenuItem } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import TourPlayIcon from "@material-ui/icons/PlayArrow";
import clsx from "clsx";
import BrandLogo from "../BrandLogo";
import { SidebarContext } from "../../contexts/SidebarContext";
import ProfileAvatar from "../widgets/ProfileAvatar";
import { logOutUser } from "../../services/AuthService";
import { useHistory } from "react-router";
import { ReactComponent as LogOutIcon } from "../../assets/svg/logout-icon.svg";
import { ReactComponent as AdminIcon } from "../../assets/svg/admin-icon.svg";
import { ReactComponent as EditProfileIcon } from "../../assets/svg/edit-profile-icon.svg";
import { ReactComponent as PasswordIcon } from "../../assets/svg/password-icon.svg";
import { ReactComponent as Cache } from "../../assets/svg/my_cache.svg";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../redux/store";
import { showTourGuide } from "../../redux/actions/tourAction";
import {
  toggleSidebar,
  toggleSidebarMobile,
  toggleSidebarUserCache,
} from "../../redux/actions/sidebarAction";
import { Badge } from "@mui/material";

export interface AppbarProps {
  variant?: "fullWidth" | "partialWidth";
}

const Appbar: React.FC<AppbarProps> = (props) => {
  const { profile: user } = useSelector((state: RootState) => state.user);
  const { userCache } = useSelector((state: RootState) => state.chart);

  const { variant = "partialWidth" } = props;
  // const {
  //   open: sidebarOpen,
  //   toggleSidebarOpen,
  //   openMobileDrawer,
  //   toggleMobileSidebar,
  // } = useContext(SidebarContext);

  const { open: sidebarOpen, openMobileDrawer } = useSelector(
    (state: RootState) => state.sidebar
  );

  const toggleSidebarOpen = () => {
    dispatch(toggleSidebar());
  };
  const toggleMobileSidebar = () => {
    dispatch(toggleSidebarMobile());
  };
  const toggleUserSidebar = () => {
    dispatch(toggleSidebarUserCache());
  };

  const [anchorEl, setAnchorEl] = useState<
    Element | ((element: Element) => Element) | null | undefined
  >(null);
  const dispatch = useDispatch();
  const history = useHistory();

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const opneMenu = (e: MouseEvent<Element>) => {
    setAnchorEl(e.currentTarget);
  };
  const tourStart = (e: MouseEvent<Element>) => {
    // alert("sss")
    dispatch(showTourGuide());
  };

  return (
    <div
      className={clsx("appbar", {
        "full-width": variant === "fullWidth",
        "sidebar-open": !sidebarOpen,
        "mobile-sidebar-open": openMobileDrawer,
      })}
    >
      <div className="appbar__left-panel">
        <div className="appbar__logo-wrapper">
          <BrandLogo
            className="appbar__brand-logo"
            onClick={() => history.push("/home")}
          />
        </div>
        <div
          className="menu-icon"
          onClick={() => {
            toggleSidebarOpen();
            toggleMobileSidebar();
          }}
        >
          <div></div>
        </div>
        <div className="appbar__heading">Research on Research – 2021_10_29</div>
      </div>
      <div className="appbar__right-panel">
        <div className="appbar__tourGuide" onClick={tourStart}>
          <TourPlayIcon />
          <div className="tourText">Start tour</div>
        </div>
        <Badge
          badgeContent={userCache.length}
          color="primary"
          className="badge-icon"
        >
          <div
            className="appbar__tourGuide appbar__cache-btn"
            onClick={() => {
              toggleUserSidebar();
              // toggleMobileSidebar();
            }}
          >
            <Cache className="cache-icon" />
            <div className="tourText">My Cache</div>
          </div>
        </Badge>
        {/* <div className="appbar__profile-menu-wrapper" onClick={opneMenu}>
         
        </div> */}
        <div className="appbar__profile-menu-wrapper" onClick={opneMenu}>
          <ProfileAvatar text={user?.name || ""} />
          <ExpandMoreIcon className="down-arrow-icon" />
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        keepMounted
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        disableAutoFocusItem
        PaperProps={{ elevation: 0, className: "appbar__menu" }}
      >
        <MenuItem className="appbar__menu-item profile" disabled>
          {user?.name}
        </MenuItem>
        {user?.isAdmin || user?.isKeyAdmin ? (
          <MenuItem
            onClick={() => history.push("/admin")}
            className="appbar__menu-item"
          >
            <span>
              <AdminIcon />
            </span>
            <span>Admin</span>
          </MenuItem>
        ) : null}
        <MenuItem disabled className="appbar__menu-item">
          <span>
            <EditProfileIcon />
          </span>
          <span>Edit Profile</span>
        </MenuItem>
        <MenuItem
          onClick={() => history.push("/change-password")}
          className="appbar__menu-item"
        >
          <span>
            <PasswordIcon />
          </span>
          <span>Change password</span>
        </MenuItem>
        <MenuItem onClick={() => logOutUser()} className="appbar__menu-item">
          <span>
            <LogOutIcon />
          </span>
          <span>Log out</span>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Appbar;
