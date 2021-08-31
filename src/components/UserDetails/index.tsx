import ApiUrl from "../../enums/ApiUrl";
import TableDataProvider from "../../contexts/TableDataContext";
import Breadcrum from "../widgets/Breadcrum";
import UserTable from "../UserTable";

export interface UserDetailsProps {}

const UserDetails: React.FC<UserDetailsProps> = (props) => {
  return (
    <div className="user-details">
      <Breadcrum pageTitle="Admin" />
      <TableDataProvider fetchUrl={ApiUrl.USER}>
        <div className="admin-panel__page-title">User details</div>
        <UserTable />
      </TableDataProvider>
    </div>
  );
};

export default UserDetails;
