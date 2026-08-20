import {
  useContext,
  useRef,
} from "react";

import { useLocation } from "react-router-dom";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { NavbarContext } from "../../context/NavContext";

const Stairs = ({ children }) => {
  const location = useLocation();
  const currentPath = location.pathname;

  const {
    setIsPageRevealStarted,
    setIsPageTransitionComplete,
  } = useContext(NavbarContext);

  const componentRef = useRef(null);
  const stairParentRef = useRef(null);
  const pageRef = useRef(null);

  useGSAP(
    () => {
      /*
       * The navbar entrance must wait until this
       * transition has fully completed.
       */
      setIsPageTransitionComplete(false);
      setIsPageRevealStarted(false);

      const stairs = gsap.utils.toArray(
        ".stair",
        componentRef.current
      );

      /*
       * Display the stair overlay before starting.
       */
      gsap.set(stairParentRef.current, {
        display: "block",
      });

      /*
       * Reset all stair panels.
       */
      gsap.set(stairs, {
        height: "100%",
        yPercent: 0,
      });

      /*
       * Hide and slightly enlarge the new page
       * before revealing it.
       */
      gsap.set(pageRef.current, {
        opacity: 0,
        scale: 1.05,
      });

      const timeline = gsap.timeline({
        defaults: {
          ease: "power2.inOut",
        },
      });

      timeline
        /*
         * Stair panels grow from top to bottom.
         */
        .fromTo(
          stairs,
          {
            height: 0,
            yPercent: 0,
          },
          {
            height: "100%",
            duration: 0.5,
            stagger: {
              amount: -0.2,
            },
          }
        )

        /*
         * Stair panels move downward and leave
         * the viewport.
         */
        .to(stairs, {
          yPercent: 100,
          duration: 0.6,
          stagger: {
            amount: -0.25,
          },
        })

        /*
         * Let route-specific entrances begin while the
         * stairs are moving away from the page.
         */
        .call(
          () => {
            setIsPageRevealStarted(true);
          },
          null,
          "-=0.5"
        )

        /*
         * Reveal the new route content while
         * the stairs are leaving.
         */
        .to(
          pageRef.current,
          {
            opacity: 1,
            scale: 1,
            duration: 0.6,
            ease: "power2.out",
          },
          "<"
        )

        /*
         * Hide the stair wrapper after the
         * route content is visible.
         */
        .set(stairParentRef.current, {
          display: "none",
        })

        /*
         * Prepare the panels for the next route.
         */
        .set(stairs, {
          height: "100%",
          yPercent: 0,
        })

        /*
         * Notify the navbar that it can now run
         * its entrance animation.
         */
        .call(() => {
          setIsPageTransitionComplete(true);
        });

      return () => {
        timeline.kill();
      };
    },
    {
      dependencies: [currentPath],
      scope: componentRef,
      revertOnUpdate: true,
    }
  );

  return (
    <div ref={componentRef}>
      {/*
        This overlay remains above:
        - Navbar
        - Logo
        - ProjectHoverBar
        - Page content
      */}
      <div
        ref={stairParentRef}
        className="
          fixed left-0 top-0 z-[100]
          hidden h-screen w-full
          overflow-hidden
        "
      >
        <div className="flex h-full w-full">
          <div className="stair h-full w-1/5 bg-black" />
          <div className="stair h-full w-1/5 bg-black" />
          <div className="stair h-full w-1/5 bg-black" />
          <div className="stair h-full w-1/5 bg-black" />
          <div className="stair h-full w-1/5 bg-black" />
        </div>
      </div>

      {/* Current route content */}
      <div
        ref={pageRef}
        key={currentPath}
      >
        {children}
      </div>
    </div>
  );
};

export default Stairs;
