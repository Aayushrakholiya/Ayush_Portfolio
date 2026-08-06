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

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: document.documentElement,
          start: "top top",
          end: "+=350",
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });

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

      return () => {
        timeline.scrollTrigger?.kill();
        timeline.kill();
      };
    },
    {
      scope,
      dependencies: [enabled],
      revertOnUpdate: true,
    },
  );
};

export default useNavbarScroll;
