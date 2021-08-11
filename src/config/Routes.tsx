import ForgotPassword from "../components/public-forms/ForgotPassword";
import Login from "../components/public-forms/Login";
import SetPassword from "../components/public-forms/SetPassword";
import PublicFormScreen from "../screens/PublicFormScreen";
import IRoute from "../types/IRoute";

const Routes: IRoute[] = [
  {
    path: ["/login", "/forgot-password", "set-password"],
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
        component: SetPassword,
      },
      {
        path: "/reset-password",
        component: SetPassword,
      },
    ],
  },
];
export default Routes;
