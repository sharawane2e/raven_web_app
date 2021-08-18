import ApiUrl from "../../config/ApiUrl";
import TableDataProvider from "../../contexts/TableDataContext";
import UserTable from "../UserTable";

export interface UserDetailsProps {}

const UserDetails: React.FC<UserDetailsProps> = (props) => {
  return (
    <div className="user-details">
      <TableDataProvider fetchUrl={ApiUrl.USER}>
        <div className="user-details__page-title">User details</div>
        <UserTable />
      </TableDataProvider>
    </div>
  );
};

export default UserDetails;
