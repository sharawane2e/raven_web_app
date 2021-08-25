import { Switch } from "@material-ui/core";
import { useState } from "react";
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
import ConfirmationDialog, {
  IConfirmationActionConfig,
} from "../widgets/ConfirmationDialog";
import { ReactComponent as EditUserIcon } from "../../assets/svg/edit-user-icon.svg";

export interface UserTableProps extends WithLoaderProps {}

const UserTable: React.FC<UserTableProps> = (props) => {
  const { fetchData } = useContext(TableDataContext);
  const { setSelectedUserId } = useContext(UserDetailsContext);
  const [confirmationText, setConfirmationText] = useState<any>(null);
  const [openConfirmation, setOpenConfirmation] = useState<boolean>(false);
  const [confirmActionConfig, setConfirmActionConfig] =
    useState<IConfirmationActionConfig>([]);
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
      format: (value) => value || "-",
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
          onChange={() => handleAdminAccessChange(row)}
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
          onChange={() => handleUserActivateClick(row)}
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
      format: (value, row) => (
        <div onClick={() => editUser(row._id)}>
          <EditUserIcon />
        </div>
      ),
      classes: {
        body: "action center-align",
        head: "action center-align",
      },
    },
  ];

  const changeActiveStatus = (row: any) => {
    closeConfirmation();
    const baseUrl =
      row.active === true
        ? ApiUrl.DEACTIVATE_USER
        : row.active === false
        ? ApiUrl.ACTIVATE_USER
        : undefined;

    const url = `${baseUrl}/${row._id}`;

    if (url && !row.isKeyAdmin) {
      props.startLoading(undefined, true);
      ApiRequest.request(url, "PATCH")
        .then((res) => {
          if (res.success) {
            Toaster.success(res.message);
            fetchData(
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              true
            );
          } else {
            Toaster.error(res.message);
          }
        })
        .catch((error) => console.log(error))
        .finally(() => props.stopLoading());
    }
  };

  const changeAdminAccess = (row: any) => {
    closeConfirmation();
    const baseUrl =
      row.isAdmin === true
        ? ApiUrl.REMOVE_ADMIN_ACCESS
        : row.isAdmin === false
        ? ApiUrl.GRANT_ADMIN_ACCESS
        : undefined;

    const url = `${baseUrl}/${row._id}`;

    if (url && !row.isKeyAdmin) {
      props.startLoading(undefined, true);
      ApiRequest.request(url, "PATCH")
        .then((res) => {
          if (res.success) {
            Toaster.success(res.message);
            fetchData(
              undefined,
              undefined,
              undefined,
              undefined,
              undefined,
              true
            );
          } else {
            Toaster.error(res.message);
          }
        })
        .catch((error) => console.log(error))
        .finally(() => props.stopLoading());
    }
  };

  const closeConfirmation = () => {
    setConfirmationText("");
    setConfirmActionConfig([]);
    setOpenConfirmation(false);
  };

  const activateActionConfig: IConfirmationActionConfig = [
    {
      label: "Cancle",
      className: "button--secondary",
      onClick: closeConfirmation,
    },
    {
      label: "Confirm",
      className: "button--primary",
      onClick: () => {},
    },
  ];
  const adminAccessActionConfig: IConfirmationActionConfig = [
    {
      label: "Cancle",
      className: "button--secondary",
      onClick: closeConfirmation,
    },
    {
      label: "Confirm",
      className: "button--primary",
      onClick: () => {},
    },
  ];

  const handleAdminAccessChange = (row: any) => {
    const confirmationText = row.isAdmin
      ? `Are you sure, you want to revoke admin access for ${row.name}`
      : `Are you sure, you want to grant admin access to ${row.name}`;
    adminAccessActionConfig[1].onClick = () => changeAdminAccess(row);

    setConfirmationText(confirmationText);
    setConfirmActionConfig(adminAccessActionConfig);
    setOpenConfirmation(true);
  };
  const handleUserActivateClick = (row: any) => {
    const confirmationText = row.active
      ? `Are you sure, you want to de-activate ${row.name}`
      : `Are you sure, you want to activate ${row.name}`;
    activateActionConfig[1].onClick = () => changeActiveStatus(row);
    setConfirmationText(confirmationText);
    setConfirmActionConfig(activateActionConfig);
    setOpenConfirmation(true);
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
      <ConfirmationDialog
        open={openConfirmation}
        confirmationText={confirmationText}
        actionConfig={confirmActionConfig}
      />
    </div>
  );
};

export default withLoader(UserTable);
