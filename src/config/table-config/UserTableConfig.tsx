import ITableColumn from "../../types/ITableColumn";

const UserTableConfig: ITableColumn[] = [
  {
    key: "firstName",
    label: "Name",
    format: (value, row) => `${row.firstName} ${row.lastName}`,
    hasSorting: true,
  },
  {
    key: "email",
    label: "Email",
    hasSorting: true,
  },
  {
    key: "createdBy",
    label: "Created By",
    format: (value, row) => "Tony Stark",
  },
];

export default UserTableConfig;
