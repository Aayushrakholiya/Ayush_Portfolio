import {
  useCallback,
  createContext,
  useEffect,
  useState,
} from "react";

import { useLocation } from "react-router-dom";

export const NavbarContext = createContext(null);

const NavContext = ({ children }) => {
  const { pathname } = useLocation();

  const [navOpen, setNavOpen] = useState(false);

  const [activeProject, setActiveProject] =
    useState(null);

  /*
   * Incremented whenever the full navbar should
   * replay its Menu -> Agency -> Work entrance.
   */
  const [navbarEntranceReplayKey, setNavbarEntranceReplayKey] =
    useState(0);

  const replayNavbarEntrance = useCallback(() => {
    if (typeof window === "undefined" || window.scrollY > 8) {
      return;
    }

    setNavbarEntranceReplayKey((key) => key + 1);
  }, []);

  /*
   * Tells global components when the route
   * transition stairs have completely finished.
   */
  const [
    isPageTransitionComplete,
    setIsPageTransitionComplete,
  ] = useState(false);

  /*
   * Reset route-specific interface state whenever
   * the pathname changes.
   */
  useEffect(() => {
    setActiveProject(null);
    setNavOpen(false);
    setIsPageTransitionComplete(false);
  }, [pathname]);

  return (
    <NavbarContext.Provider
      value={{
        navOpen,
        setNavOpen,

        activeProject,
        setActiveProject,

        navbarEntranceReplayKey,
        replayNavbarEntrance,

        isPageTransitionComplete,
        setIsPageTransitionComplete,
      }}
    >
      {children}
    </NavbarContext.Provider>
  );
};

export default NavContext;
