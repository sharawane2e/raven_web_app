import { Route, Switch, useRouteMatch } from "react-router";
import PrivateRoute from "./PrivateRoute";
import IRoute from "./types/IRoute";

export interface AppRoutingProps {
  routes: IRoute[];
  isSubRoutes?: boolean;
}

const AppRouting: React.FC<AppRoutingProps> = (props) => {
  const { routes } = props;
  const match = useRouteMatch();

  return (
    <Switch>
      {routes.map((route, index) => (
        <Route
          key={index}
          path={props.isSubRoutes ? `${match.path}${route.path}` : route.path}
          exact={route.exact}
          render={(props) =>
            route.isPrivate ? (
              <PrivateRoute
                component={route.component}
                {...props}
                route={route}
                //@ts-ignore
                routes={route.routes}
              />
            ) : (
              //@ts-ignore
              <route.component {...props} routes={route.routes} />
            )
          }
        />
      ))}
    </Switch>
  );
};

export default AppRouting;
