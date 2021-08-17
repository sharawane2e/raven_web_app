import ApiUrl from "../../config/ApiUrl";
import UserTableConfig from "../../config/table-config/UserTableConfig";
import TableDataProvider from "../../contexts/TableDataContext";
import CustomTable from "../CustomTable";

export interface UserDetailsProps {}

const UserDetails: React.FC<UserDetailsProps> = (props) => {
  return (
    <div className="user-details">
      <TableDataProvider fetchUrl={ApiUrl.USER}>
        <div className="user-details__page-title">User details</div>
        <CustomTable tableConfig={UserTableConfig} hasSearch />
      </TableDataProvider>
    </div>
  );
};

export default UserDetails;
