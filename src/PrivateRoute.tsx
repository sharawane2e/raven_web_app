import { Redirect } from "react-router";
import IRoute from "./types/IRoute";
import LocalStorageUtils from "./utils/LocalStorageUtils";

export interface PrivateRouteProps {
  component: React.ComponentType;
  route: IRoute;
}

const PrivateRoute: React.FC<PrivateRouteProps> = (props) => {
  const Component = props.component;

  return LocalStorageUtils.isUserLoggedIn() ? (
    <Component {...props} />
  ) : (
    <Redirect to="/login" />
  );
};

export default PrivateRoute;
