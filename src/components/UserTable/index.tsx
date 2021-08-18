import { Switch } from "@material-ui/core";
import { useContext } from "react";
import ApiUrl from "../../config/ApiUrl";
import { TableDataContext } from "../../contexts/TableDataContext";
import withLoader, { WithLoaderProps } from "../../hoc/withLoader";
import ITableColumn from "../../types/ITableColumn";
import ApiRequest from "../../utils/ApiRequest";
import Toaster from "../../utils/Toaster";
import CustomTable from "../CustomTable";

export interface UserTableProps extends WithLoaderProps {}

const UserTable: React.FC<UserTableProps> = (props) => {
  const { fetchData } = useContext(TableDataContext);

  const tableConfig: ITableColumn[] = [
    {
      key: "firstName",
      label: "NAME",
      format: (value, row) => `${row.firstName} ${row.lastName}`,
      hasSorting: true,
    },
    {
      key: "email",
      label: "EMAIL",
      hasSorting: true,
    },
    {
      key: "createdBy",
      label: "CREATED BY",
      format: (value, row) => "Tony Stark",
    },
    {
      key: "isAdmin",
      label: "ADMIN ACCESS",
      format: (value, row) => (
        <Switch
          checked={value}
          disabled={row.isKeyAdmin}
          onChange={() => changeAdminAccess(row)}
        />
      ),
    },
    {
      key: "active",
      label: "STATUS",
      format: (value, row) => (
        <Switch
          checked={value}
          onChange={() => changeActiveStatus(row)}
          disabled={row.isKeyAdmin}
        />
      ),
    },
    {
      key: "",
      label: "ACTION",
      format: (value, row) => "Tony Stark",
    },
  ];

  const changeActiveStatus = (row: any) => {
    const baseUrl =
      row.active === true
        ? ApiUrl.DEACTIVATE_USER
        : row.active === false
        ? ApiUrl.ACTIVATE_USER
        : undefined;

    const url = `${baseUrl}/${row._id}`;

    if (url && !row.isKeyAdmin) {
      props.startLoading();
      ApiRequest.request(url, "PATCH")
        .then((res) => {
          if (res.success) {
            Toaster.success(res.message);
            fetchData();
          } else {
            Toaster.error(res.message);
          }
        })
        .catch((error) => console.log(error))
        .finally(() => props.stopLoading());
    }
  };

  const changeAdminAccess = (row: any) => {
    const baseUrl =
      row.isAdmin === true
        ? ApiUrl.REMOVE_ADMIN_ACCESS
        : row.isAdmin === false
        ? ApiUrl.GRANT_ADMIN_ACCESS
        : undefined;

    const url = `${baseUrl}/${row._id}`;

    if (url && !row.isKeyAdmin) {
      props.startLoading();
      ApiRequest.request(url, "PATCH")
        .then((res) => {
          if (res.success) {
            Toaster.success(res.message);
            fetchData();
          } else {
            Toaster.error(res.message);
          }
        })
        .catch((error) => console.log(error))
        .finally(() => props.stopLoading());
    }
  };

  const removeAdminAccess = (row: any) => {};

  return (
    <div>
      <CustomTable tableConfig={tableConfig} />
    </div>
  );
};

export default withLoader(UserTable);
