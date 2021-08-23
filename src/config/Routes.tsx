import { Redirect } from "react-router";
import AddUser from "../components/AddUser";
import ChangePassword from "../components/ChangePassword";
import EditUser from "../components/EditUser";
import ForgotPassword from "../components/public-forms/ForgotPassword";
import Login from "../components/public-forms/Login";
import SetPassword from "../components/public-forms/SetPassword";
import UserDetails from "../components/UserDetails";
import AdminPanelScreen from "../screens/AdminPanelScreen";
import PublicFormScreen from "../screens/PublicFormScreen";
import StaticHomeScreen from "../screens/StaticHomeScreen";
import UserPanelScreen from "../screens/UserPanelScreen";
import IRoute from "../types/IRoute";

const Routes: IRoute[] = [
  {
    path: ["/change-password"],
    component: UserPanelScreen,
    isPrivate: true,
    routes: [
      {
        path: "/change-password",
        component: ChangePassword,
        exact: true,
      },
    ],
  },
  {
    path: [
      "/admin",
      "/admin/add-user",
      "/admin/user-details",
      "admin/edit-user",
    ],
    component: AdminPanelScreen,
    isPrivate: true,
    routes: [
      {
        path: "/admin/add-user",
        component: AddUser,
        exact: true,
      },
      {
        path: "/admin/user-details",
        component: UserDetails,
        exact: true,
      },
      {
        path: "/admin/edit-user",
        component: EditUser,
        exact: true,
      },
      {
        path: "/admin",
        component: () => <Redirect to="/admin/user-details" />,
        exact: true,
      },
    ],
  },
  {
    path: ["/login", "/forgot-password", "/set-password", "/reset-password"],
    component: PublicFormScreen,
    exact: true,
    routes: [
      {
        path: "/login",
        component: Login,
      },
      {
        path: "/forgot-password",
        component: ForgotPassword,
      },
      {
        path: "/set-password",
        component: () => <SetPassword variant="set" />,
      },
      {
        path: "/reset-password",
        component: () => <SetPassword variant="reset" />,
      },
    ],
  },

  {
    path: "/home",
    component: StaticHomeScreen,
    isPrivate: true,
  },
  {
    path: "/",
    component: () => <Redirect to="/home" />,
  },
];
export default Routes;
