import { useContext, useEffect, useRef } from "react";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

import { NavbarContext } from "../../context/NavContext.jsx";

const MENU_ITEMS = [
  {
    label: "Work",
    href: "/project",
    marqueeText: "See Everything",
    images: [
      "https://k72.ca/uploads/caseStudies/WIDESCAPE/WS---K72.ca---MenuThumbnail-640x290.jpg",
      "https://k72.ca/uploads/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_640x290-640x290.jpg",
    ],
  },
  {
    label: "Agency",
    href: "/agence",
    marqueeText: "Meet the Agency",
    images: [
      "https://k72.ca/uploads/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_640x290-640x290.jpg",
      "https://k72.ca/uploads/caseStudies/WIDESCAPE/WS---K72.ca---MenuThumbnail-640x290.jpg",
    ],
  },
  {
    label: "Contact",
    href: "/contact",
    marqueeText: "Start a Project",
    images: [
      "https://k72.ca/uploads/caseStudies/WIDESCAPE/WS---K72.ca---MenuThumbnail-640x290.jpg",
      "https://k72.ca/uploads/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_640x290-640x290.jpg",
    ],
  },
  {
    label: "Blog",
    href: "/blog",
    marqueeText: "Read the Stories",
    images: [
      "https://k72.ca/uploads/caseStudies/PJC/Thumbnails/PJC_SiteK72_Thumbnail_640x290-640x290.jpg",
      "https://k72.ca/uploads/caseStudies/WIDESCAPE/WS---K72.ca---MenuThumbnail-640x290.jpg",
    ],
  },
];

const MarqueeContent = ({ text, images }) => (
  <div className="k72-marquee-group" aria-hidden="true">
    <span className="k72-marquee-text">{text}</span>
    <img className="k72-marquee-image" src={images[0]} alt="" />
    <span className="k72-marquee-arrow">↗</span>
    <span className="k72-marquee-text">{text}</span>
    <img className="k72-marquee-image" src={images[1]} alt="" />
    <span className="k72-marquee-arrow">↗</span>
  </div>
);

const FullScreenNav = () => {
  const fullscreenRef = useRef(null);
  const cursorRef = useRef(null);

  const { navOpen, setNavOpen } = useContext(NavbarContext);

  /* Keep the page behind the fullscreen menu fixed while it is open. */
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const previousHtmlOverflow = html.style.overflow;
    const previousBodyOverflow = body.style.overflow;

    if (navOpen) {
      html.style.overflow = "hidden";
      body.style.overflow = "hidden";
    }

    return () => {
      html.style.overflow = previousHtmlOverflow;
      body.style.overflow = previousBodyOverflow;
    };
  }, [navOpen]);

  /* Smoothly attach the OPEN cursor to the pointer. */
  useEffect(() => {
    const root = fullscreenRef.current;
    const cursor = cursorRef.current;

    if (!navOpen || !root || !cursor) return undefined;

    gsap.set(cursor, {
      xPercent: -50,
      yPercent: -50,
      scale: 0.7,
      opacity: 0,
    });

    const moveX = gsap.quickTo(cursor, "x", {
      duration: 0.28,
      ease: "power3.out",
    });
    const moveY = gsap.quickTo(cursor, "y", {
      duration: 0.28,
      ease: "power3.out",
    });

    const handlePointerMove = (event) => {
      moveX(event.clientX);
      moveY(event.clientY);
    };

    root.addEventListener("pointermove", handlePointerMove);

    return () => {
      root.removeEventListener("pointermove", handlePointerMove);
    };
  }, [navOpen]);

  useGSAP(
    () => {
      const root = fullscreenRef.current;
      if (!root) return undefined;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (navOpen) {
        gsap.set(root, { display: "block" });

        if (reduceMotion) {
          gsap.set(".stairing", { scaleY: 1 });
          gsap.set([".k72-menu-header", ".k72-nav-row"], {
            opacity: 1,
            y: 0,
            rotateX: 0,
          });
          return undefined;
        }

        const timeline = gsap.timeline({ defaults: { ease: "power4.out" } });

        timeline
          .fromTo(
            ".stairing",
            { scaleY: 0, transformOrigin: "bottom" },
            {
              scaleY: 1,
              duration: 0.55,
              stagger: { each: 0.055, from: "end" },
            }
          )
          .fromTo(
            ".k72-menu-header",
            { y: -24, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.5 },
            "-=0.3"
          )
          .fromTo(
            ".k72-nav-row",
            {
              yPercent: 32,
              rotateX: 72,
              opacity: 0,
              transformOrigin: "top center",
            },
            {
              yPercent: 0,
              rotateX: 0,
              opacity: 1,
              duration: 0.75,
              stagger: 0.07,
            },
            "-=0.3"
          );

        return () => timeline.kill();
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => gsap.set(root, { display: "none" }),
      });

      timeline
        .to(".k72-menu-header", {
          y: -16,
          opacity: 0,
          duration: 0.25,
        })
        .to(
          ".k72-nav-row",
          {
            yPercent: 22,
            rotateX: 55,
            opacity: 0,
            duration: 0.35,
            stagger: { each: 0.035, from: "end" },
          },
          0
        )
        .to(
          ".stairing",
          {
            scaleY: 0,
            transformOrigin: "top",
            duration: 0.45,
            stagger: { each: 0.045, from: "start" },
          },
          "-=0.08"
        );

      return () => timeline.kill();
    },
    {
      scope: fullscreenRef,
      dependencies: [navOpen],
    }
  );

  const showCursor = (event) => {
    if (cursorRef.current && event.pointerType !== "touch") {
      gsap.to(cursorRef.current, {
        scale: 1,
        opacity: 1,
        duration: 0.16,
        ease: "power3.out",
        overwrite: "auto",
      });
    }
  };

  const hideCursor = () => {
    if (cursorRef.current) {
      gsap.to(cursorRef.current, {
        scale: 0.7,
        opacity: 0,
        duration: 0.14,
        ease: "power2.out",
        overwrite: "auto",
      });
    }
  };

  return (
    <div
      ref={fullscreenRef}
      id="fullscreennav"
      className="fullscreennav fixed inset-0 z-[1000] hidden h-dvh w-full overflow-hidden text-white"
      aria-hidden={!navOpen}
    >
      <style>{`
        .fullscreennav {
          --k72-lime: #d3fd51;
          --k72-black: #050505;
          background: transparent;
          cursor: default;
        }

        .k72-stairs {
          position: absolute;
          inset: 0;
          display: flex;
          pointer-events: none;
        }

        .stairing {
          width: 20%;
          height: 100%;
          background: var(--k72-black);
          transform: scaleY(0);
        }

        .k72-menu-shell {
          position: relative;
          z-index: 2;
          height: 100%;
          overflow-y: auto;
          overflow-x: hidden;
          overscroll-behavior: contain;
          background: transparent;
        }

        .k72-menu-header {
          min-height: 88px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          padding: 16px 20px 10px;
          opacity: 0;
        }

        .k72-logo {
          display: block;
          padding: 0;
          border: 0;
          background: transparent;
          width: clamp(76px, 7vw, 112px);
          cursor: pointer;
        }

        .k72-close {
          position: relative;
          width: clamp(58px, 6vw, 92px);
          aspect-ratio: 1;
          border: 0;
          background: transparent;
          cursor: pointer;
        }

        .k72-close::before,
        .k72-close::after {
          content: "";
          position: absolute;
          top: 50%;
          left: 50%;
          width: 108%;
          height: 2px;
          background: var(--k72-lime);
          transition: transform 350ms cubic-bezier(.2,.8,.2,1);
        }

        .k72-close::before {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .k72-close::after {
          transform: translate(-50%, -50%) rotate(-45deg);
        }

        .k72-close:hover::before {
          transform: translate(-50%, -50%) rotate(135deg);
        }

        .k72-close:hover::after {
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .k72-nav-list {
          border-bottom: none;
          perspective: 1000px;
        }

        .k72-nav-row {
          position: relative;
          display: flex;
          align-items: center;
          min-height: clamp(118px, 17.5vh, 210px);
          overflow: hidden;
          border-top: 1px solid rgba(255, 255, 255, 0.8);
          color: white;
          text-decoration: none;
          isolation: isolate;
          opacity: 0;
        }

        .k72-nav-row:last-child {
          border-bottom: 1px solid rgba(255, 255, 255, 0.8);
        }

        .k72-main-label {
          position: relative;
          z-index: 1;
          width: 100%;
          padding: 0.04em 0.12em 0;
          font-family: "Lausanne", Arial Black, Arial, sans-serif;
          font-size: clamp(4.7rem, 10.8vw, 11rem);
          font-weight: 900;
          line-height: 0.72;
          letter-spacing: -0.075em;
          text-align: center;
          text-transform: uppercase;
          transition: opacity 140ms linear, transform 360ms cubic-bezier(.16, 1, .3, 1);
          will-change: transform, opacity;
        }

        .k72-hover-layer {
          position: absolute;
          inset: 0;
          z-index: 2;
          display: flex;
          align-items: center;
          overflow: hidden;
          background: var(--k72-lime);
          color: var(--k72-black);
          clip-path: inset(100% 0 0 0);
          transition: clip-path 420ms cubic-bezier(.16, 1, .3, 1);
          transform: translateZ(0);
          will-change: clip-path;
        }

        .k72-nav-row:hover .k72-hover-layer,
        .k72-nav-row:focus-visible .k72-hover-layer {
          clip-path: inset(0 0 0 0);
        }

        .k72-nav-row:hover .k72-main-label,
        .k72-nav-row:focus-visible .k72-main-label {
          opacity: 0;
          transform: translateY(-18%);
        }

        .k72-marquee-track {
          display: flex;
          width: max-content;
          min-width: max-content;
          align-items: center;
          animation: k72-marquee 11s linear infinite;
          animation-direction: normal;
          animation-play-state: running;
          will-change: transform;
          backface-visibility: hidden;
          transform: translate3d(0, 0, 0);
        }

        .k72-marquee-group {
          display: flex;
          flex-shrink: 0;
          align-items: center;
          gap: clamp(1.2rem, 2.3vw, 3.25rem);
          padding-right: clamp(1.2rem, 2.3vw, 3.25rem);
        }

        .k72-marquee-text {
          flex-shrink: 0;
          padding-top: 0.04em;
          font-family: "Lausanne", Arial Black, Arial, sans-serif;
          font-size: clamp(4.7rem, 10.8vw, 11rem);
          font-weight: 900;
          line-height: 0.72;
          letter-spacing: -0.075em;
          text-transform: uppercase;
          white-space: nowrap;
        }

        .k72-marquee-image {
          width: clamp(190px, 19vw, 350px);
          height: clamp(68px, 8.5vw, 132px);
          flex-shrink: 0;
          border-radius: 999px;
          object-fit: cover;
        }

        .k72-marquee-arrow {
          display: grid;
          width: clamp(64px, 7vw, 112px);
          aspect-ratio: 1;
          flex-shrink: 0;
          place-items: center;
          border: 2px solid currentColor;
          border-radius: 50%;
          font-family: Arial, sans-serif;
          font-size: clamp(2.4rem, 4vw, 5rem);
          line-height: 1;
        }

        .k72-open-cursor {
          position: fixed;
          top: 0;
          left: 0;
          z-index: 50;
          display: grid;
          width: 86px;
          height: 86px;
          place-items: center;
          border: 1px solid #111;
          border-radius: 50%;
          background: white;
          color: #111;
          font-family: Arial, sans-serif;
          font-size: 11px;
          font-weight: 700;
          letter-spacing: 0.03em;
          pointer-events: none;
          opacity: 0;
          will-change: transform;
        }

        @keyframes k72-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }

        @media (pointer: fine) {
          .k72-nav-row { cursor: none; }
        }

        @media (pointer: coarse) {
          .k72-open-cursor { display: none; }
        }

        @media (max-width: 700px) {
          .k72-menu-header {
            min-height: 72px;
            padding: 12px 14px 8px;
          }

          .k72-nav-row {
            min-height: clamp(110px, 18vh, 155px);
          }

          .k72-main-label,
          .k72-marquee-text {
            font-size: clamp(4rem, 18vw, 7.2rem);
            line-height: 0.76;
          }

          .k72-marquee-image {
            width: 165px;
            height: 64px;
          }

          .k72-marquee-arrow {
            width: 58px;
            border-width: 1px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .k72-marquee-track {
            animation: none;
          }
        }
      `}</style>

      <div className="k72-stairs" aria-hidden="true">
        <div className="stairing" />
        <div className="stairing" />
        <div className="stairing" />
        <div className="stairing" />
        <div className="stairing" />
      </div>

      <div
        className="k72-menu-shell"
        data-lenis-prevent
        onPointerLeave={() => {
          if (cursorRef.current) {
            gsap.to(cursorRef.current, {
              opacity: 0,
              scale: 0.7,
              duration: 0.2,
            });
          }
        }}
      >
        <header className="k72-menu-header">
          <button
            type="button"
            className="k72-logo"
            aria-label="Go to home page"
            onClick={() => {
              setNavOpen(false);
              window.location.href = "/";
            }}
          >
            <svg
              className="w-full"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 103 44"
              aria-hidden="true"
            >
              <path
                fill="white"
                fillRule="evenodd"
                d="M35.1441047,8.4486911 L58.6905011,8.4486911 L58.6905011,-1.3094819e-14 L35.1441047,-1.3094819e-14 L35.1441047,8.4486911 Z M20.0019577,0.000230366492 L8.83414254,25.3433089 L18.4876971,25.3433089 L29.5733875,0.000230366492 L20.0019577,0.000230366492 Z M72.5255345,0.000691099476 L72.5255345,8.44846073 L94.3991559,8.44846073 L94.3991559,16.8932356 L72.5275991,16.8932356 L72.5275991,19.5237906 L72.5255345,19.5237906 L72.5255345,43.9274346 L102.80937,43.9274346 L102.80937,35.4798953 L80.9357483,35.4798953 L80.9357483,25.3437696 L94.3996147,25.3428482 L94.3996147,16.8953089 L102.80937,16.8953089 L102.80937,0.000691099476 L72.5255345,0.000691099476 Z M-1.30398043e-14,43.9278953 L8.78642762,43.9278953 L8.78642762,0.0057591623 L-1.30398043e-14,0.0057591623 L-1.30398043e-14,43.9278953 Z M58.6849955,8.4486911 L43.1186904,43.9274346 L52.3166592,43.9274346 L67.9877996,8.4486911 L58.6849955,8.4486911 Z M18.4688864,25.3437696 L26.7045278,43.9278953 L36.2761871,43.9278953 L28.1676325,25.3375497 L18.4688864,25.3437696 Z"
              />
            </svg>
          </button>

          <button
            type="button"
            className="k72-close"
            aria-label="Close menu"
            onClick={() => setNavOpen(false)}
          />
        </header>

        <nav className="k72-nav-list" aria-label="Main navigation">
          {MENU_ITEMS.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="k72-nav-row"
              onClick={() => setNavOpen(false)}
              onPointerEnter={showCursor}
              onPointerLeave={hideCursor}
              onBlur={hideCursor}
            >
              <span className="k72-main-label">{item.label}</span>

              <span className="k72-hover-layer" aria-hidden="true">
                <span className="k72-marquee-track">
                  <MarqueeContent text={item.marqueeText} images={item.images} />
                  <MarqueeContent text={item.marqueeText} images={item.images} />
                </span>
              </span>
            </a>
          ))}
        </nav>
      </div>

      <div ref={cursorRef} className="k72-open-cursor" aria-hidden="true">
        OPEN
      </div>
    </div>
  );
};

export default FullScreenNav;
