import ApiUrl from "../../enums/ApiUrl";
import TableDataProvider from "../../contexts/TableDataContext";
import Breadcrum from "../widgets/Breadcrum";
import UserTable from "../UserTable";
import { Grid } from "@material-ui/core";

export interface UserDetailsProps {}

const UserDetails: React.FC<UserDetailsProps> = (props) => {
  return (
    <div className="user-details">
      <div className="contant-shape">
        <Breadcrum pageTitle="Admin" />
      </div>
      <TableDataProvider fetchUrl={ApiUrl.USER}>
        <div className="admin-panel__page-title">User details</div>
        <UserTable />
      </TableDataProvider>
    </div>
  );
};

export default UserDetails;
