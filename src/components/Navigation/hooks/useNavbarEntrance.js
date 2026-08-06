import { useContext } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

import { NavbarContext } from "../../../context/NavContext";

/*
 * Places each card completely above its final position.
 *
 * The offset is based on the card's own height so:
 * - Menu starts higher because it is taller.
 * - Agency starts slightly lower.
 * - Work starts slightly lower again.
 */
const getStartingY = (element) => {
  if (!element) {
    return -150;
  }

  return -(element.offsetHeight + 48);
};

const useNavbarEntrance = ({ scope, workRef, agencyRef, menuRef, enabled }) => {
  const { isPageTransitionComplete } = useContext(NavbarContext);

  useGSAP(
    () => {
      const menuElement = menuRef.current;
      const agencyElement = agencyRef.current;
      const workElement = workRef.current;

      const elements = [menuElement, agencyElement, workElement].filter(
        Boolean,
      );

      /*
       * Home does not use this entrance animation.
       */
      if (!enabled || elements.length === 0) {
        return;
      }

      /*
       * Keep the navbar cards above the viewport
       * while the page stairs are running.
       */
      if (!isPageTransitionComplete) {
        if (menuElement) {
          gsap.set(menuElement, {
            y: getStartingY(menuElement),
          });
        }

        if (agencyElement) {
          gsap.set(agencyElement, {
            y: getStartingY(agencyElement),
          });
        }

        if (workElement) {
          gsap.set(workElement, {
            y: getStartingY(workElement),
          });
        }

        return;
      }

      /*
       * Total sequence duration:
       *
       * Menu starts:   0.00s
       * Agency starts: 0.18s
       * Work starts:   0.36s
       *
       * Each animation lasts 0.64s.
       * Total duration is approximately 1 second.
       */
      const timeline = gsap.timeline({
        defaults: {
          duration: 0.64,
          ease: "power4.out",
          overwrite: "auto",
        },
      });

      /*
       * 1. Full Menu falls first.
       */
      if (menuElement) {
        timeline.fromTo(
          menuElement,
          {
            y: getStartingY(menuElement),
          },
          {
            y: 0,
          },
          0,
        );
      }

      /*
       * 2. Agency falls second.
       */
      if (agencyElement) {
        timeline.fromTo(
          agencyElement,
          {
            y: getStartingY(agencyElement),
          },
          {
            y: 0,
          },
          0.18,
        );
      }

      /*
       * 3. Work falls last.
       */
      if (workElement) {
        timeline.fromTo(
          workElement,
          {
            y: getStartingY(workElement),
          },
          {
            y: 0,
          },
          0.36,
        );
      }

      return () => {
        timeline.kill();
      };
    },
    {
      scope,
      dependencies: [enabled, isPageTransitionComplete],
      revertOnUpdate: true,
    },
  );
};

export default useNavbarEntrance;
