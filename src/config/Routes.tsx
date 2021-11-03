import { Redirect } from "react-router";
import AddUser from "../components/AddUser";
import ChartContent from "../components/ChartContent";
import WebUrl from "../enums/WebUrl";
import AdminPanelScreen from "../screens/AdminPanelScreen";
import ChartScreen from "../screens/ChartScreen";
import PageNotFoundScreen from "../screens/PageNotFoundScreen";
import IRoute from "../types/IRoute";

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
    path: WebUrl.BASE,
    component: () => <Redirect to={WebUrl.HOME} />,
    exact: true,
  },
  {
    path: "*",
    component: PageNotFoundScreen,
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
    ],
  },
];
export default Routes;
