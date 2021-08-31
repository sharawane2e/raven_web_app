import { Redirect } from "react-router";
import WebUrl from "./enums/WebUrl";
import IRoute from "./types/IRoute";
import LocalStorageUtils from "./utils/LocalStorageUtils";

export interface PrivateRouteProps {
  component: React.ComponentType;
  route: IRoute;
}

const PrivateRoute: React.FC<PrivateRouteProps> = (props) => {
  const Component = props.component;
  const user = LocalStorageUtils.getUser();
  const isUserAdmin = user && user?.isAdmin ? true : false;
  return LocalStorageUtils.isUserLoggedIn() ? (
    props.route.isAdmin && !isUserAdmin ? (
      <Redirect to={WebUrl.NOT_FOUND} />
    ) : (
      <Component {...props} />
    )
  ) : (
    <Redirect to={WebUrl.LOGIN} />
  );
};

export default PrivateRoute;
