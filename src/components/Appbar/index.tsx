import { useState, useContext, MouseEvent } from "react";
import { Menu, MenuItem } from "@material-ui/core";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import clsx from "clsx";
import { SidebarContext } from "../../contexts/SidebarContext";
import BrandLogo from "../BrandLogo";
import ProfileAvatar from "../ProfileAvatar";
import { logOutUser } from "../../services/AuthService";

export interface AppbarProps {
  removeToggleButton?: boolean;
}

const Appbar: React.FC<AppbarProps> = (props) => {
  const { removeToggleButton } = props;
  const { open: sidebarOpen, toggleSidebarOpen } = useContext(SidebarContext);
  const [anchorEl, setAnchorEl] = useState<
    Element | ((element: Element) => Element) | null | undefined
  >(null);

  const closeMenu = () => {
    setAnchorEl(null);
  };

  const opneMenu = (e: MouseEvent<Element>) => {
    setAnchorEl(e.currentTarget);
  };

  return (
    <div className="appbar">
      <BrandLogo className="appbar__brand-logo" />
      <div className="appbar__left-panel">
        {!removeToggleButton && (
          <div
            className={clsx("menu-icon", { "sidebar-open": sidebarOpen })}
            onClick={() => toggleSidebarOpen()}
          >
            <div></div>
          </div>
        )}

        <div className="appbar__heading">HFS OneOffice Pulse</div>
      </div>
      <div className="appbar__right-panel">
        <div className="appbar__profile-menu-wrapper">
          <ProfileAvatar text="AB" onClick={opneMenu} />
          <ExpandMoreIcon className="down-arrow-icon" onClick={opneMenu} />
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        id="menu"
        keepMounted
        transformOrigin={{ vertical: "top", horizontal: "right" }}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
      >
        <MenuItem>
          <span></span>
          <span>Admin</span>
        </MenuItem>
        <MenuItem>
          <span></span>
          <span>Edit Profile</span>
        </MenuItem>
        <MenuItem>
          <span></span>
          <span>Change password</span>
        </MenuItem>
        <MenuItem onClick={logOutUser}>
          <span></span>
          <span>Log out</span>
        </MenuItem>
      </Menu>
    </div>
  );
};

export default Appbar;
