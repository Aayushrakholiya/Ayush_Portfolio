import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const useNavbarAnimation = () => {
  useGSAP(() => {
    ScrollTrigger.create({
      start: "top top",

      onUpdate: (self) => {
        if (self.direction === 1) {
          gsap.to(".navbar", {
            y: -120,
            duration: 0.4,
            ease: "power3.out",
          });
        } else {
          gsap.to(".navbar", {
            y: 0,
            duration: 0.4,
            ease: "power3.out",
          });
        }
      },
    });
  });
};

export default useNavbarAnimation;
