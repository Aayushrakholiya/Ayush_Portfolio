import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useNavbarScroll = ({
  scope,
  workRef,
  agencyRef,
  menuRef,
  menuTextRef,
  enabled,
  onReturnToTop,
}) => {
  useGSAP(
    () => {
      if (!enabled) {
        return;
      }

      const workElement = workRef.current;
      const agencyElement = agencyRef.current;
      const menuElement = menuRef.current;
      const menuTextElement = menuTextRef.current;

      if (!workElement || !agencyElement || !menuElement || !menuTextElement) {
        return;
      }

      let hasReachedCompactState = window.scrollY >= 350;

      const timeline = gsap.timeline({ paused: true });

      timeline
        .to(
          workElement,
          {
            yPercent: -110,
            ease: "none",
          },
          0,
        )
        .to(
          agencyElement,
          {
            yPercent: -100,
            ease: "none",
          },
          0,
        )
        .to(
          menuElement,
          {
            height: 56,
            ease: "none",
          },
          0,
        )
        .to(
          menuTextElement,
          {
            y: -30,
            opacity: 0,
            ease: "none",
          },
          0,
        );

      const placeCardsAboveViewport = () => {
        gsap.set(menuElement, {
          y: -(menuElement.offsetHeight + 48),
        });

        gsap.set(agencyElement, {
          y: -(agencyElement.offsetHeight + 48),
        });

        gsap.set(workElement, {
          y: -(workElement.offsetHeight + 48),
        });
      };

      const scrollTrigger = ScrollTrigger.create({
        trigger: document.documentElement,
        start: "top top",
        end: "+=350",
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const isScrollingDown = self.direction >= 0;
          const isAtPageTop = window.scrollY <= 8;

          if (isScrollingDown) {
            timeline.progress(self.progress);

            if (self.progress >= 0.999) {
              hasReachedCompactState = true;
            }

            return;
          }

          /*
           * Once the navbar is Menu-only, hold that compact
           * state while scrolling back. The falling timeline
           * gets a clean canvas instead of animating over cards
           * that ScrollTrigger has already revealed.
          */
          if (hasReachedCompactState && !isAtPageTop) {
            timeline.progress(1);
            return;
          }

          if (hasReachedCompactState && isAtPageTop) {
            hasReachedCompactState = false;

            timeline.progress(0);
            placeCardsAboveViewport();
            onReturnToTop?.();
            return;
          }

          /*
           * Shallow scrolling that never reached Menu-only mode
           * remains scrubbed normally in both directions.
           */
          timeline.progress(self.progress);
        },
        onRefresh: (self) => {
          if (window.scrollY >= 350) {
            hasReachedCompactState = true;
            timeline.progress(1);
            return;
          }

          timeline.progress(self.progress);
        },
      });

      return () => {
        scrollTrigger.kill();
        timeline.kill();
      };
    },
    {
      scope,
      dependencies: [enabled, onReturnToTop],
      revertOnUpdate: true,
    },
  );
};

export default useNavbarScroll;
