// import { Drawer, Hidden, SwipeableDrawer } from "@material-ui/core";
// import clsx from "clsx";
// import { ComponentType, useContext } from "react";
// import { SidebarContext } from "../../contexts/SidebarContext";
// import BrandLogo from "../BrandLogo";

// export interface SidebarProps {
//   /**
//    * title of the sidebar rendered after brand logo
//    */
//   title?: string;
//   /**
//    * content of the sidebar
//    */
//   content?: ComponentType<any>;
// }

// const Sidebar: React.FC<SidebarProps> = (props) => {
//   const { title, content: SidebarContent } = props;
//   const { open, toggleSidebarOpen } = useContext(SidebarContext);

//   const sidebarContent = (
//     <>
//       <div className="sidebar__label">{title}</div>
//       {SidebarContent ? <SidebarContent /> : null}
//     </>
//   );

//   return (
//     <>
//       {/* <Hidden smUp>
//         <SwipeableDrawer
//           // className={clsx({
//           //   sidebar: open,
//           //   sidebar: !open,
//           // })}
//           variant="temporary"
//           anchor="left"
//           classes={{
//             paper: "drawerPaper",
//           }}
//           ModalProps={{
//             keepMounted: true,
//           }}
//           open={open}
//           onClose={() => toggleSidebarOpen(false)}
//           onOpen={() => toggleSidebarOpen(true)}
//         >
//           <div className="sidebar__header">Header Logo</div>
//         </SwipeableDrawer>
//       </Hidden> */}
//       <Hidden smDown>
//         <Drawer
//           className={clsx(
//             "sidebar" /* , {
//             "sidebar--open": open,
//             "sidebar--close": !open,
//           } */
//           )}
//           open={open}
//           variant="persistent"
//           classes={{
//             paper: "sidebar__drawer-paper",
//           }}
//         >
//           {sidebarContent}
//         </Drawer>
//       </Hidden>
//     </>
//   );
// };

// export default Sidebar;

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

  // const getMenu = () => {
  //   return (
  //     <List className="sidebar-menu">
  //       {menuList.map((menuItem, index) => {
  //         const Icon = menuItem.iconComponent;
  //         return (
  //           <Link to={menuItem.link} className="sidebar-menu__link">
  //             <ListItem
  //               button
  //               key={index}
  //               className={clsx("sidebar-menu__item", menuItem.classes, {
  //                 active: location.pathname.startsWith(menuItem.link),
  //               })}
  //               disableRipple
  //             >
  //               <Icon />
  //               <span>{menuItem.label}</span>
  //             </ListItem>
  //           </Link>
  //         );
  //       })}
  //     </List>
  //   );
  // };

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
          paper: clsx("drawer", {
            // "drawer--close": !openMobileDrawer,
          }),
        }}
      >
        {sidebarContent}
      </SwipeableDrawer>
    </div>
  );
};

export default Sidebar;
