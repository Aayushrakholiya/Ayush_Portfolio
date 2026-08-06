import {
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

import { useNavigate } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { NavbarContext } from "../../context/NavContext";
import MenuButton from "./MenuButton";

import useRouteNavbarMode from "./hooks/useRouteNavbarMode";
import useNavbarEntrance from "./hooks/useNavbarEntrance";
import useNavbarScroll from "./hooks/useNavbarScroll";

const Navbar = () => {
  const navigate = useNavigate();
  const config = useRouteNavbarMode();

  const {
    setNavOpen,
    activeProject,
    navbarEntranceReplayKey,
    replayNavbarEntrance,
  } = useContext(NavbarContext);

  const [isMenuHovered, setIsMenuHovered] =
    useState(false);

  const navbarRef = useRef(null);

  // Moving navigation cards
  const workRef = useRef(null);
  const agencyRef = useRef(null);

  // Menu card
  const menuRef = useRef(null);
  const menuGreenRef = useRef(null);
  const menuTextRef = useRef(null);
  const menuButtonRef = useRef(null);

  // Work hover
  const workGreenRef = useRef(null);
  const workTextRef = useRef(null);

  // Agency hover
  const agencyGreenRef = useRef(null);
  const agencyTextRef = useRef(null);

  const menuTimelineRef = useRef(null);
  const projectResetTimeoutRef = useRef(null);
  const hasActiveProjectRef = useRef(false);

  const [isProjectNavbarActive, setIsProjectNavbarActive] =
    useState(false);

  /*
   * Project hover mode is enabled only on routes
   * that explicitly support project hover.
   *
   * Current route:
   * /project → enabled
   * /agence  → disabled
   * /        → disabled
   */
  const isProjectHoverActive =
    config.enableProjectHover &&
    isProjectNavbarActive;

  /*
   * Keep project mode alive for the hover bar's short
   * leave delay. This avoids flashing the default navbar
   * before its falling animation begins, and also prevents
   * a replay while moving between adjacent project cards.
   */
  useEffect(() => {
    clearTimeout(projectResetTimeoutRef.current);

    if (!config.enableProjectHover) {
      hasActiveProjectRef.current = false;
      setIsProjectNavbarActive(false);
      return undefined;
    }

    if (activeProject) {
      hasActiveProjectRef.current = true;
      setIsProjectNavbarActive(true);
      return undefined;
    }

    if (!hasActiveProjectRef.current) {
      return undefined;
    }

    projectResetTimeoutRef.current = setTimeout(() => {
      hasActiveProjectRef.current = false;
      setIsProjectNavbarActive(false);
      replayNavbarEntrance();
    }, 180);

    return () => {
      clearTimeout(projectResetTimeoutRef.current);
    };
  }, [
    activeProject,
    config.enableProjectHover,
    replayNavbarEntrance,
  ]);

  /*
   * Home uses the compact Menu card immediately.
   *
   * Full routes begin at 136px and collapse
   * to 56px through useNavbarScroll.
   */
  const menuHeightClass =
    config.mode === "compact"
      ? "h-14"
      : "h-[136px]";

  /*
   * Hamburger is black when:
   *
   * 1. Project hover mode is active.
   * 2. The Menu card is hovered.
   */
  const shouldUseBlackHamburger =
    isProjectHoverActive || isMenuHovered;

  /*
   * Navbar entrance animation.
   *
   * /project and /agence:
   * Menu → Agency → Work
   *
   * Home:
   * Disabled
   */
  useNavbarEntrance({
    scope: navbarRef,
    workRef,
    agencyRef,
    menuRef,
    enabled: config.enableEntranceAnimation,
  });

  /*
   * Navbar scroll animation.
   *
   * /project and /agence:
   * Enabled from 0px to 350px
   *
   * Home:
   * Disabled
   */
  useNavbarScroll({
    scope: navbarRef,
    workRef,
    agencyRef,
    menuRef,
    menuTextRef,
    enabled: config.enableScrollAnimation,
    onReturnToTop: replayNavbarEntrance,
  });

  /*
   * Initialize the green layers and create
   * the Menu hover animation.
   */
  useGSAP(
    () => {
      const greenElements = [
        workGreenRef.current,
        agencyGreenRef.current,
        menuGreenRef.current,
      ].filter(Boolean);

      if (greenElements.length > 0) {
        gsap.set(greenElements, {
          scaleY: 0,
          transformOrigin: "top center",
        });
      }

      const menuTimeline = gsap.timeline({
        paused: true,
        defaults: {
          overwrite: "auto",
        },
      });

      /*
       * Menu green background exists on every route.
       */
      if (menuGreenRef.current) {
        menuTimeline.to(
          menuGreenRef.current,
          {
            scaleY: 1,
            duration: 0.45,
            ease: "power3.out",
          },
          0
        );
      }

      /*
       * Menu text does not exist on Home,
       * so only animate it when it is rendered.
       */
      if (menuTextRef.current) {
        menuTimeline.to(
          menuTextRef.current,
          {
            color: "#000000",
            y: -4,
            duration: 0.3,
            ease: "power3.out",
          },
          0.08
        );
      }

      menuTimelineRef.current = menuTimeline;

      return () => {
        menuTimeline.kill();
        menuTimelineRef.current = null;
      };
    },
    {
      scope: navbarRef,
      dependencies: [
        config.mode,
        config.showWork,
        config.showAgency,
        config.showMenuText,
      ],
      revertOnUpdate: true,
    }
  );

  /*
   * Reset Menu hover when project-hover mode starts.
   */
  useEffect(() => {
    if (!isProjectHoverActive) {
      return;
    }

    setIsMenuHovered(false);

    menuTimelineRef.current?.pause(0);

    if (menuGreenRef.current) {
      gsap.set(menuGreenRef.current, {
        scaleY: 0,
      });
    }
  }, [isProjectHoverActive]);

  /* Restore a clean default hover state before each replay. */
  useEffect(() => {
    setIsMenuHovered(false);
    menuTimelineRef.current?.pause(0);

    if (menuGreenRef.current) {
      gsap.set(menuGreenRef.current, {
        scaleY: 0,
      });
    }
  }, [navbarEntranceReplayKey]);

  /*
   * Work and Agency hover-enter animation.
   */
  const animateEnter = (
    greenElement,
    textElement
  ) => {
    if (
      !greenElement ||
      !textElement ||
      isProjectHoverActive
    ) {
      return;
    }

    gsap.killTweensOf([
      greenElement,
      textElement,
    ]);

    gsap.to(greenElement, {
      scaleY: 1,
      duration: 0.45,
      ease: "power3.out",
      overwrite: true,
    });

    gsap.to(textElement, {
      color: "#000000",
      y: -4,
      duration: 0.3,
      ease: "power3.out",
      overwrite: true,
    });
  };

  /*
   * Work and Agency hover-leave animation.
   */
  const animateLeave = (
    greenElement,
    textElement
  ) => {
    if (
      !greenElement ||
      !textElement ||
      isProjectHoverActive
    ) {
      return;
    }

    gsap.killTweensOf([
      greenElement,
      textElement,
    ]);

    gsap.to(greenElement, {
      scaleY: 0,
      duration: 0.4,
      ease: "power3.inOut",
      overwrite: true,
    });

    gsap.to(textElement, {
      color: "#ffffff",
      y: 0,
      duration: 0.3,
      ease: "power3.out",
      overwrite: true,
    });
  };

  /*
   * Menu mouse enter.
   */
  const handleMenuEnter = () => {
    if (isProjectHoverActive) {
      return;
    }

    setIsMenuHovered(true);
    menuTimelineRef.current?.play();
  };

  /*
   * Menu mouse leave.
   */
  const handleMenuLeave = () => {
    if (isProjectHoverActive) {
      return;
    }

    setIsMenuHovered(false);
    menuTimelineRef.current?.reverse();
  };

  return (
    <nav
      ref={navbarRef}
      className={`
        fixed left-0 right-0 top-0 z-50
        flex h-[70px] items-start justify-end
        transition-colors duration-300
        ${
          isProjectHoverActive
            ? "bg-white"
            : "bg-transparent"
        }
      `}
    >
      {/* Work card */}
      {config.showWork && (
        <button
          ref={workRef}
          type="button"
          onClick={() => navigate("/project")}
          onMouseEnter={() =>
            animateEnter(
              workGreenRef.current,
              workTextRef.current
            )
          }
          onMouseLeave={() =>
            animateLeave(
              workGreenRef.current,
              workTextRef.current
            )
          }
          className={`
            relative h-14 w-60
            cursor-pointer overflow-hidden
            border-0 bg-black p-0 text-left
            transition-opacity duration-300
            ${
              isProjectHoverActive
                ? "pointer-events-none opacity-0"
                : "opacity-100"
            }
          `}
        >
          <div
            ref={workGreenRef}
            className="
              pointer-events-none
              absolute inset-0 z-0
              origin-top scale-y-0
              bg-[#d3fd51]
            "
          />

          <span
            ref={workTextRef}
            className="
              pointer-events-none
              absolute bottom-2 left-3 z-10
              text-xl uppercase text-white
            "
          >
            Work
          </span>
        </button>
      )}

      {/* Agency card */}
      {config.showAgency && (
        <button
          ref={agencyRef}
          type="button"
          onClick={() => navigate("/agence")}
          onMouseEnter={() =>
            animateEnter(
              agencyGreenRef.current,
              agencyTextRef.current
            )
          }
          onMouseLeave={() =>
            animateLeave(
              agencyGreenRef.current,
              agencyTextRef.current
            )
          }
          className={`
            relative h-24 w-72
            cursor-pointer overflow-hidden
            border-0 bg-black p-0 text-left
            transition-opacity duration-300
            ${
              isProjectHoverActive
                ? "pointer-events-none opacity-0"
                : "opacity-100"
            }
          `}
        >
          <div
            ref={agencyGreenRef}
            className="
              pointer-events-none
              absolute inset-0 z-0
              origin-top scale-y-0
              bg-[#d3fd51]
            "
          />

          <span
            ref={agencyTextRef}
            className="
              pointer-events-none
              absolute bottom-2 left-3 z-10
              text-xl uppercase text-white
            "
          >
            Agency
          </span>
        </button>
      )}

      {/* Menu card */}
      <button
        ref={menuRef}
        type="button"
        onClick={() => setNavOpen(true)}
        onMouseEnter={handleMenuEnter}
        onMouseLeave={handleMenuLeave}
        aria-label="Open navigation menu"
        className={`
          relative ${menuHeightClass} w-52
          cursor-pointer overflow-hidden
          border-0 p-0 text-left
          transition-colors duration-300
          ${
            isProjectHoverActive
              ? "bg-transparent"
              : "bg-black"
          }
        `}
      >
        {/* Menu green hover background */}
        <div
          ref={menuGreenRef}
          className={`
            pointer-events-none
            absolute inset-0 z-0
            origin-top scale-y-0
            bg-[#d3fd51]
            ${
              isProjectHoverActive
                ? "invisible"
                : "visible"
            }
          `}
        />

        {/* Hamburger */}
        {config.showHamburger && (
          <MenuButton
            ref={menuButtonRef}
            isBlack={shouldUseBlackHamburger}
          />
        )}

        {/* Menu text */}
        {config.showMenuText && (
          <span
            ref={menuTextRef}
            className={`
              pointer-events-none
              absolute bottom-2 left-3 z-20
              text-xl uppercase text-white
              ${
                isProjectHoverActive
                  ? "invisible"
                  : "visible"
              }
            `}
          >
            Menu
          </span>
        )}
      </button>
    </nav>
  );
};

export default Navbar;
