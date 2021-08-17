import { List, ListItem } from "@material-ui/core";
import { Link } from "react-router-dom";
import { ReactComponent as AddUserIcon } from "../../../../assets/svg/user-plus.svg";
import { ReactComponent as UserList } from "../../../../assets/svg/users-alt.svg";

const AdminSidebarContent: React.FC = () => {
  return (
    <List disablePadding className="admin-sidebar">
      <Link to="/admin/add-user">
        <ListItem>
          <span>
            <AddUserIcon />
          </span>
          <span>Add User</span>
        </ListItem>
      </Link>
      <Link to="/admin/user-details">
        <ListItem>
          <span>
            <UserList />
          </span>
          <span>User details</span>
        </ListItem>
      </Link>
    </List>
  );
};

export default AdminSidebarContent;
