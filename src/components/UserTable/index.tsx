import { Switch } from "@material-ui/core";
import { useContext } from "react";
import { useHistory } from "react-router";
import ApiUrl from "../../config/ApiUrl";
import { TableDataContext } from "../../contexts/TableDataContext";
import { UserDetailsContext } from "../../contexts/UserDetailsContext";
import withLoader, { WithLoaderProps } from "../../hoc/withLoader";
import UserTableSkeleton from "../../skeletons/UserTableSekeleton";
import ITableColumn from "../../types/ITableColumn";
import ApiRequest from "../../utils/ApiRequest";
import Toaster from "../../utils/Toaster";
import CustomTable from "../CustomTable";

export interface UserTableProps extends WithLoaderProps {}

const UserTable: React.FC<UserTableProps> = (props) => {
  const { fetchData } = useContext(TableDataContext);
  const { setSelectedUserId } = useContext(UserDetailsContext);
  const history = useHistory();

  const tableConfig: ITableColumn[] = [
    {
      key: "name",
      label: "NAME",
      hasSorting: true,
      classes: {
        body: "name",
        head: "name",
      },
    },
    {
      key: "email",
      label: "EMAIL",
      hasSorting: true,
      classes: {
        body: "email",
        head: "email",
      },
    },
    {
      key: "createdBy",
      label: "CREATED BY",
      hasSorting: true,
      classes: {
        body: "created-by",
        head: "created-by",
      },
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
      classes: {
        body: "is-admin center-align",
        head: "is-admin center-align",
      },
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
      classes: {
        body: "active-status center-align",
        head: "active-status center-align",
      },
    },
    {
      key: "",
      label: "ACTION",
      format: (value, row) => <div onClick={() => editUser(row._id)}>Edit</div>,
      classes: {
        body: "action center-align",
        head: "action center-align",
      },
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

  const editUser = (id: string) => {
    setSelectedUserId(id);
    history.push("/admin/edit-user");
  };

  return (
    <div className="user-table">
      <CustomTable
        tableConfig={tableConfig}
        classes={{ body: "user-table__body" }}
        loaderSkeleton={UserTableSkeleton}
      />
    </div>
  );
};

export default withLoader(UserTable);
