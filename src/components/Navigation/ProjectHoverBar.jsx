import {
  useContext,
  useEffect,
  useRef,
} from "react";

import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { NavbarContext } from "../../context/NavContext";
import useRouteNavbarMode from "./hooks/useRouteNavbarMode";

const ProjectHoverBar = () => {
  const config = useRouteNavbarMode();

  const { activeProject } =
    useContext(NavbarContext);

  const barRef = useRef(null);
  const contentRef = useRef(null);

  const clientSwipeRef = useRef(null);
  const titleSwipeRef = useRef(null);
  const yearSwipeRef = useRef(null);

  const previousProjectRef = useRef(null);
  const swipeTimelineRef = useRef(null);
  const hideTimeoutRef = useRef(null);

  /*
   * Project-hover mode is allowed only on routes
   * that explicitly enable it.
   *
   * Current configuration:
   * /project → enabled
   * /agence  → disabled
   * /        → disabled
   */
  const isProjectHoverEnabled =
    config.enableProjectHover;

  /*
   * Ignore activeProject on routes that do not
   * support the project-hover navbar.
   */
  const displayedProject =
    isProjectHoverEnabled
      ? activeProject
      : null;

  /*
   * Initialize the hidden bar and marker layers.
   */
  useGSAP(
    () => {
      if (!isProjectHoverEnabled) {
        return;
      }

      if (barRef.current) {
        gsap.set(barRef.current, {
          yPercent: -100,
          autoAlpha: 0,
        });
      }

      const swipeElements = [
        clientSwipeRef.current,
        titleSwipeRef.current,
        yearSwipeRef.current,
      ].filter(Boolean);

      if (swipeElements.length > 0) {
        gsap.set(swipeElements, {
          scaleX: 0,
          transformOrigin: "left center",
        });
      }
    },
    {
      dependencies: [isProjectHoverEnabled],
      revertOnUpdate: true,
    }
  );

  /*
   * Open, update, and close the project information bar.
   */
  useEffect(() => {
    if (!isProjectHoverEnabled) {
      return;
    }

    clearTimeout(hideTimeoutRef.current);
    swipeTimelineRef.current?.kill();

    /*
     * Hide the project information bar after
     * leaving a project card.
     *
     * The delay prevents flickering when moving
     * between project cards.
     */
    if (!displayedProject) {
      hideTimeoutRef.current = setTimeout(() => {
        if (!barRef.current) {
          return;
        }

        gsap.to(barRef.current, {
          yPercent: -100,
          autoAlpha: 0,
          duration: 0.3,
          ease: "power3.inOut",
          overwrite: true,
          onComplete: () => {
            previousProjectRef.current = null;
          },
        });
      }, 180);

      return;
    }

    /*
     * First project hover.
     */
    if (!previousProjectRef.current) {
      previousProjectRef.current =
        displayedProject;

      if (barRef.current) {
        gsap.to(barRef.current, {
          yPercent: 0,
          autoAlpha: 1,
          duration: 0.35,
          ease: "power3.out",
          overwrite: true,
        });
      }

      if (contentRef.current) {
        gsap.fromTo(
          contentRef.current,
          {
            y: 10,
            opacity: 0,
          },
          {
            y: 0,
            opacity: 1,
            duration: 0.3,
            ease: "power3.out",
            overwrite: true,
          }
        );
      }

      return;
    }

    /*
     * Do nothing when the same project remains active.
     */
    const previousProject =
      previousProjectRef.current;

    const isSameProject =
      previousProject?.client ===
        displayedProject?.client &&
      previousProject?.title ===
        displayedProject?.title &&
      previousProject?.year ===
        displayedProject?.year;

    if (isSameProject) {
      return;
    }

    previousProjectRef.current =
      displayedProject;

    /*
     * Marker swipe animation when switching
     * from one project to another.
     */
    const swipeElements = [
      clientSwipeRef.current,
      titleSwipeRef.current,
      yearSwipeRef.current,
    ].filter(Boolean);

    if (swipeElements.length === 0) {
      return;
    }

    swipeTimelineRef.current =
      gsap.timeline();

    swipeTimelineRef.current
      .set(swipeElements, {
        scaleX: 0,
        xPercent: 0,
        transformOrigin: "left center",
      })
      .to(swipeElements, {
        scaleX: 1,
        duration: 0.18,
        stagger: 0.03,
        ease: "power3.out",
      })
      .to(
        swipeElements,
        {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.15,
          stagger: 0.03,
          ease: "power3.inOut",
        },
        "+=0.2"
      )
      .set(swipeElements, {
        transformOrigin: "left center",
      });
  }, [
    displayedProject,
    isProjectHoverEnabled,
  ]);

  /*
   * Reset and clean up when leaving /project
   * or unmounting the component.
   */
  useEffect(() => {
    if (isProjectHoverEnabled) {
      return;
    }

    clearTimeout(hideTimeoutRef.current);
    swipeTimelineRef.current?.kill();

    previousProjectRef.current = null;

    if (barRef.current) {
      gsap.set(barRef.current, {
        yPercent: -100,
        autoAlpha: 0,
      });
    }
  }, [isProjectHoverEnabled]);

  useEffect(() => {
    return () => {
      clearTimeout(hideTimeoutRef.current);
      swipeTimelineRef.current?.kill();
    };
  }, []);

  /*
   * Do not render the bar outside /project.
   */
  if (!isProjectHoverEnabled) {
    return null;
  }

  return (
    <div
      ref={barRef}
      className="
        pointer-events-none
        fixed left-0 top-[70px] z-[999]
        h-[82px] w-full
        overflow-hidden
        border-y-2 border-black
        bg-white text-black
      "
    >
      <div
        ref={contentRef}
        className="
          grid h-full w-full
          grid-cols-3 items-center
          px-[10px]
          font-[font1]
          text-[2.2vw]
          font-medium
          leading-none
        "
      >
        {/* Client */}
        <div className="flex justify-start">
          <div className="relative inline-block">
            <div
              ref={clientSwipeRef}
              className="
                absolute
                left-[-6px] right-[-6px]
                top-1/2 z-0
                h-[55%]
                -translate-y-1/2
                -rotate-[1deg]
                rounded-[45%_55%_48%_52%]
                bg-[#d3fd51]
              "
            />

            <p className="relative z-10 whitespace-nowrap">
              {displayedProject?.client}
            </p>
          </div>
        </div>

        {/* Project title */}
        <div className="flex justify-center">
          <div className="relative inline-block">
            <div
              ref={titleSwipeRef}
              className="
                absolute
                left-[-8px] right-[-8px]
                top-1/2 z-0
                h-[58%]
                -translate-y-1/2
                rotate-[0.8deg]
                rounded-[52%_48%_55%_45%]
                bg-[#d3fd51]
              "
            />

            <p className="relative z-10 whitespace-nowrap text-center">
              {displayedProject?.title}
            </p>
          </div>
        </div>

        {/* Year */}
        <div className="flex justify-end">
          <div className="relative inline-block">
            <div
              ref={yearSwipeRef}
              className="
                absolute
                left-[-6px] right-[-6px]
                top-1/2 z-0
                h-[54%]
                -translate-y-1/2
                -rotate-[1.5deg]
                rounded-[48%_52%_46%_54%]
                bg-[#d3fd51]
              "
            />

            <p className="relative z-10 whitespace-nowrap text-right">
              {displayedProject?.year}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectHoverBar;