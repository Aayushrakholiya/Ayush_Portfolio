export const NAVBAR_MODES = {
  COMPACT: "compact",
  FULL: "full",
};

export const navbarRoutes = {
  "/": {
    mode: NAVBAR_MODES.COMPACT,

    showLogo: true,
    logoColor: "white",

    showWork: false,
    showAgency: false,
    showMenuText: false,
    showHamburger: true,

    enableEntranceAnimation: false,
    enableScrollAnimation: false,
    enableProjectHover: false,
  },

  "/agence": {
    mode: NAVBAR_MODES.FULL,

    showLogo: true,
    logoColor: "black",

    showWork: true,
    showAgency: true,
    showMenuText: true,
    showHamburger: true,

    enableEntranceAnimation: true,
    enableScrollAnimation: true,
    enableProjectHover: false,
  },

  "/project": {
    mode: NAVBAR_MODES.FULL,

    showLogo: true,
    logoColor: "black",

    showWork: true,
    showAgency: true,
    showMenuText: true,
    showHamburger: true,

    enableEntranceAnimation: true,
    enableScrollAnimation: true,
    enableProjectHover: true,
  },

  "/contact": {
    mode: NAVBAR_MODES.COMPACT,

    showLogo: true,
    logoColor: "white",

    showWork: false,
    showAgency: false,
    showMenuText: false,
    showHamburger: true,

    enableEntranceAnimation: false,
    enableScrollAnimation: false,
    enableProjectHover: false,
  },

  "/blog": {
    mode: NAVBAR_MODES.COMPACT,

    showLogo: true,
    logoColor: "white",

    showWork: false,
    showAgency: false,
    showMenuText: false,
    showHamburger: true,

    enableEntranceAnimation: false,
    enableScrollAnimation: false,
    enableProjectHover: false,
  },
};

export const defaultNavbarRoute = navbarRoutes["/"];
