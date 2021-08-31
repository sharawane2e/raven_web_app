interface IRoute {
  /**
   * path of the route
   */
  path: string | string[];

  /**
   * component to render if the given path matches the url
   */
  component: React.ComponentType<any>;
  /**
   * flag to match the url exactly
   */
  exact?: boolean;

  /**
   * tells whether the route should be protected or not
   */
  isPrivate?: boolean;

  /**
   * array of nested routes
   */
  routes?: IRoute[];

  /**
   * tells whether the route is accessible only to admin or public
   */
  isAdmin?: boolean;
}

export default IRoute;
