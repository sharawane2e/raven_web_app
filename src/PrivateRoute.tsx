import { useSelector } from "react-redux";
import { Redirect } from "react-router";
import WebUrl from "./enums/WebUrl";
import { RootState } from "./redux/store";
import IRoute from "./types/IRoute";

export interface PrivateRouteProps {
  component: React.ComponentType;
  route: IRoute;
}

const PrivateRoute: React.FC<PrivateRouteProps> = (props) => {
  const Component = props.component;
  const { profile } = useSelector((state: RootState) => state.user);

  const isUserAdmin = profile && profile.isAdmin ? true : false;

  // @ts-ignore
  // return <Component {...props} />;
  return profile &&  profile.accessToken ? (
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
