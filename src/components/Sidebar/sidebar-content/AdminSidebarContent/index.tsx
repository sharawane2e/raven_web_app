import { List, ListItem } from "@material-ui/core";
import clsx from "clsx";
import { Link, useLocation, useRouteMatch } from "react-router-dom";
import { ReactComponent as AddUserIcon } from "../../../../assets/svg/user-plus.svg";
import { ReactComponent as UserList } from "../../../../assets/svg/users-alt.svg";

const AdminSidebarContent: React.FC = () => {
  const { pathname } = useLocation();

  return (
    <List disablePadding className="admin-sidebar">
      <Link to="/admin/add-user">
        <ListItem
          className={clsx("admin-sidebar__nav-item", {
            "active-link": pathname.startsWith("/admin/add-user"),
          })}
        >
          <span>
            <AddUserIcon className="admin-sidebar__link-icons" />
          </span>
          <span>Add User</span>
        </ListItem>
      </Link>
      <Link to="/admin/user-details">
        <ListItem
          className={clsx("admin-sidebar__nav-item", {
            "active-link": pathname.startsWith("/admin/user-details"),
          })}
        >
          <span>
            <UserList className="admin-sidebar__link-icons" />
          </span>
          <span>User details</span>
        </ListItem>
      </Link>
    </List>
  );
};

export default AdminSidebarContent;
