import { useState, useContext, MouseEvent } from 'react';
import { Menu, MenuItem } from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import TourPlayIcon from '@material-ui/icons/PlayArrow';
import clsx from 'clsx';
import BrandLogo from '../BrandLogo';
import { SidebarContext } from '../../contexts/SidebarContext';
import ProfileAvatar from '../widgets/ProfileAvatar';
import { logOutUser } from '../../services/AuthService';
import { useHistory } from 'react-router';
import { ReactComponent as LogOutIcon } from '../../assets/svg/logout-icon.svg';
import { ReactComponent as AdminIcon } from '../../assets/svg/admin-icon.svg';
import { ReactComponent as EditProfileIcon } from '../../assets/svg/edit-profile-icon.svg';
import { ReactComponent as PasswordIcon } from '../../assets/svg/password-icon.svg';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../redux/store';
import { showTourGuide } from '../../redux/actions/tourAction';
import {
  toggleSidebar,
  toggleSidebarMobile,
} from '../../redux/actions/sidebarAction';
import ClientsLogo from '../ClientsLogo';

import { ReactComponent as Boehringer } from '../../assets/svg/Boehringer-Lumanity-brand.svg';

export interface AppbarProps {
  variant?: 'fullWidth' | 'partialWidth';
}

const Appbar: React.FC<AppbarProps> = (props) => {
  const { profile: user } = useSelector((state: RootState) => state.user);

  const { variant = 'partialWidth' } = props;
  // const {
  //   open: sidebarOpen,
  //   toggleSidebarOpen,
  //   openMobileDrawer,
  //   toggleMobileSidebar,
  // } = useContext(SidebarContext);

  const { open: sidebarOpen, openMobileDrawer } = useSelector(
    (state: RootState) => state.sidebar,
  );

  const toggleSidebarOpen = () => {
    dispatch(toggleSidebar());
  };
  const toggleMobileSidebar = () => {
    dispatch(toggleSidebarMobile());
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
      className={clsx('appbar', {
        'full-width': variant === 'fullWidth',
        'sidebar-open': !sidebarOpen,
        'mobile-sidebar-open': openMobileDrawer,
      })}
    >
      <div className="appbar__left-panel">
        <div className="appbar__logo-wrapper client-logo">
          {/* <BrandLogo
            className="appbar__brand-logo"
            onClick={() => history.push('/home')}
          /> */}
          <div className="public-form__client-logo client-logo__icons">
            <Boehringer />
          </div>
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
        <div className="appbar__heading">210394 Dashboard</div>
      </div>
      <div className="appbar__right-panel">
        <div className="appbar__tourGuide" onClick={tourStart}>
          <TourPlayIcon />
          <div className="tourText">Start tour</div>
        </div>
        <div className="appbar__profile-menu-wrapper" onClick={opneMenu}>
          <div className="appbar__profile-menu-wrapper" onClick={opneMenu}>
            <ProfileAvatar text={user?.name || ''} />
            <ExpandMoreIcon className="down-arrow-icon" />
          </div>
        </div>
      </div>
      <Menu
        anchorEl={anchorEl}
        id="menu"
        keepMounted
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        getContentAnchorEl={null}
        open={Boolean(anchorEl)}
        onClose={closeMenu}
        disableAutoFocusItem
        PaperProps={{ elevation: 0, className: 'appbar__menu' }}
      >
        <MenuItem className="appbar__menu-item profile" disabled>
          {user?.name}
        </MenuItem>
        {user?.isAdmin || user?.isKeyAdmin ? (
          <MenuItem
            onClick={() => history.push('/admin')}
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
          onClick={() => history.push('/change-password')}
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
