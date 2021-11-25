import { Redirect } from "react-router";
import AddUser from "../components/AddUser";
import ChartContent from "../components/ChartContent";
import ForgotPassword from "../components/public-forms/ForgotPassword";
import SetPassword from "../components/public-forms/SetPassword";
import Login from "../components/public-forms/Login";
import WebUrl from "../enums/WebUrl";
import AdminPanelScreen from "../screens/AdminPanelScreen";
import ChartScreen from "../screens/ChartScreen";
import PageNotFoundScreen from "../screens/PageNotFoundScreen";
import PublicFormScreen from "../screens/PublicFormScreen";
import IRoute from "../types/IRoute";
import UserDetails from "../components/UserDetails";
import EditUser from "../components/EditUser";

const Routes: IRoute[] = [
  {
    path: [WebUrl.HOME],
    component: ChartScreen,
    exact: true,
    isPrivate: true,
    routes: [
      {
        path: WebUrl.HOME,
        component: ChartContent,
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
