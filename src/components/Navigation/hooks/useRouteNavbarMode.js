import { useLocation } from "react-router-dom";

import { defaultNavbarRoute, navbarRoutes } from "../config/navbarRoutes";

const useRouteNavbarMode = () => {
  const { pathname } = useLocation();

  return navbarRoutes[pathname] ?? defaultNavbarRoute;
};

export default useRouteNavbarMode;
