import AddUser from "../components/AddUser";
import ForgotPassword from "../components/public-forms/ForgotPassword";
import Login from "../components/public-forms/Login";
import SetPassword from "../components/public-forms/SetPassword";
import UserDetails from "../components/UserDetails";
import AdminPanelScreen from "../screens/AdminPanelScreen";
import PublicFormScreen from "../screens/PublicFormScreen";
import IRoute from "../types/IRoute";

const Routes: IRoute[] = [
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
    path: ["/admin/add-user", "/admin/user-details"],
    component: AdminPanelScreen,
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
    ],
  },
];
export default Routes;
