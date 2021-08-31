import { Redirect } from "react-router";
import AddUser from "../components/AddUser";
import ChangePassword from "../components/ChangePassword";
import EditUser from "../components/EditUser";
import ForgotPassword from "../components/public-forms/ForgotPassword";
import Login from "../components/public-forms/Login";
import SetPassword from "../components/public-forms/SetPassword";
import UserDetails from "../components/UserDetails";
import WebUrl from "../enums/WebUrl";
import AdminPanelScreen from "../screens/AdminPanelScreen";
import PageNotFoundScreen from "../screens/PageNotFoundScreen";
import PublicFormScreen from "../screens/PublicFormScreen";
import StaticHomeScreen from "../screens/StaticHomeScreen";
import UserPanelScreen from "../screens/UserPanelScreen";
import IRoute from "../types/IRoute";

const Routes: IRoute[] = [
  {
    path: [WebUrl.CHANGE_PASSWORD],
    component: UserPanelScreen,
    isPrivate: true,
    exact: true,
    routes: [
      {
        path: WebUrl.CHANGE_PASSWORD,
        component: ChangePassword,
        exact: true,
      },
    ],
  },
  {
    path: [
      WebUrl.ADMIN,
      WebUrl.ADD_USER,
      WebUrl.USER_DETAILS,
      WebUrl.EDIT_USER,
    ],
    component: AdminPanelScreen,
    isPrivate: true,
    exact: true,
    isAdmin: true,
    routes: [
      {
        path: WebUrl.ADD_USER,
        component: AddUser,
        exact: true,
      },
      {
        path: WebUrl.USER_DETAILS,
        component: UserDetails,
        exact: true,
      },
      {
        path: WebUrl.EDIT_USER,
        component: EditUser,
        exact: true,
      },
      {
        path: WebUrl.ADMIN,
        component: () => <Redirect to={WebUrl.USER_DETAILS} />,
        exact: true,
      },
    ],
  },
  {
    path: [
      WebUrl.LOGIN,
      WebUrl.FORGOT_PASSWORD,
      WebUrl.SET_PASSWORD,
      WebUrl.RESET_PASSWORD,
    ],
    component: PublicFormScreen,
    exact: true,
    routes: [
      {
        path: WebUrl.LOGIN,
        component: Login,
      },
      {
        path: WebUrl.FORGOT_PASSWORD,
        component: ForgotPassword,
      },
      {
        path: WebUrl.SET_PASSWORD,
        component: () => <SetPassword variant="set" />,
      },
      {
        path: WebUrl.RESET_PASSWORD,
        component: () => <SetPassword variant="reset" />,
      },
    ],
  },

  {
    path: WebUrl.HOME,
    component: StaticHomeScreen,
    isPrivate: true,
    exact: true,
  },
  {
    path: WebUrl.BASE,
    component: () => <Redirect to={WebUrl.HOME} />,
    exact: true,
  },
  {
    path: "*",
    component: PageNotFoundScreen,
  },
];
export default Routes;
