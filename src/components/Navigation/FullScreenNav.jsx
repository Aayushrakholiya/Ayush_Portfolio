import { useContext, useEffect, useRef } from "react";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";

import { NavbarContext } from "../../context/NavbarContext.js";

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
    label: "About",
    href: "/agence",
    marqueeText: "Meet Me",
    images: ["/about/education.svg", "/about/ibm.svg"],
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
      "/y-combinator-blog.webp",
      "/y-combinator-blog.webp",
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
  const hasOpenedRef = useRef(false);

  const {
    navOpen,
    setNavOpen,
    replayNavbarEntrance,
  } = useContext(NavbarContext);

  useEffect(() => {
    if (!navOpen) return undefined;
    const previousFocus = document.activeElement;
    const root = fullscreenRef.current;
    const focusFrame = requestAnimationFrame(() => root?.querySelector('.k72-close')?.focus());
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setNavOpen(false);
      }
      if (event.key !== 'Tab' || !root) return;
      const controls = Array.from(root.querySelectorAll('button, a[href]'));
      const first = controls[0];
      const last = controls[controls.length - 1];
      if (event.shiftKey && (document.activeElement === first || !root.contains(document.activeElement))) {
        event.preventDefault();
        last?.focus();
      } else if (!event.shiftKey && (document.activeElement === last || !root.contains(document.activeElement))) {
        event.preventDefault();
        first?.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      cancelAnimationFrame(focusFrame);
      document.removeEventListener('keydown', handleKeyDown);
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus();
    };
  }, [navOpen, setNavOpen]);

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

  useGSAP(
    () => {
      const root = fullscreenRef.current;
      if (!root) return undefined;

      const reduceMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (navOpen) {
        hasOpenedRef.current = true;
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

      const shouldReplayNavbar = hasOpenedRef.current;

      if (reduceMotion) {
        gsap.set(root, { display: 'none' });
        if (shouldReplayNavbar) {
          hasOpenedRef.current = false;
          replayNavbarEntrance();
        }
        return undefined;
      }

      const timeline = gsap.timeline({
        defaults: { ease: "power3.inOut" },
        onComplete: () => {
          gsap.set(root, { display: "none" });

          if (shouldReplayNavbar) {
            hasOpenedRef.current = false;
            replayNavbarEntrance();
          }
        },
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
      dependencies: [navOpen, replayNavbarEntrance],
    }
  );

  return (
    <div
      ref={fullscreenRef}
      id="fullscreennav"
      className="fullscreennav fixed inset-0 z-[1000] hidden h-dvh w-full overflow-hidden text-white"
      aria-hidden={!navOpen}
      inert={!navOpen}
      role="dialog"
      aria-modal="true"
      aria-label="Navigation menu"
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

        .k72-close:focus-visible,
        .k72-logo:focus-visible {
          outline: 2px solid var(--k72-lime);
          outline-offset: 4px;
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

        @keyframes k72-marquee {
          from { transform: translate3d(0, 0, 0); }
          to { transform: translate3d(-50%, 0, 0); }
        }

        @media (max-width: 1024px) {
          .fullscreennav {
            --k72-black: #000;
          }

          .stairing {
            width: calc(20% + 1px);
            flex-shrink: 0;
            margin-right: -1px;
          }

          .k72-menu-shell {
            display: flex;
            flex-direction: column;
          }

          .k72-menu-header {
            position: absolute;
            top: env(safe-area-inset-top, 0px);
            left: 0;
            right: 0;
            min-height: clamp(76px, 23vw, 100px);
            align-items: flex-start;
            padding: 12px 10px 0;
          }

          .k72-logo {
            width: clamp(80px, 23vw, 104px);
            min-height: 44px;
            display: flex;
            align-items: center;
          }

          .k72-close {
            width: clamp(72px, 22vw, 96px);
            flex-shrink: 0;
          }

          .k72-close::before,
          .k72-close::after {
            width: 135%;
            background: white;
          }

          .k72-close:hover::before {
            transform: translate(-50%, -50%) rotate(45deg);
          }

          .k72-close:hover::after {
            transform: translate(-50%, -50%) rotate(-45deg);
          }

          .k72-nav-list {
            flex-shrink: 0;
            width: 100%;
            margin-block: auto;
          }

          .k72-nav-row {
            justify-content: center;
            min-height: 44px;
            height: clamp(44px, min(14.4vw, 16dvh), 80px);
            padding: 0 12px;
            border-color: rgba(255, 255, 255, 0.45);
          }

          .k72-nav-row:last-child {
            border-bottom: 1px solid rgba(255, 255, 255, 0.45);
          }

          .k72-main-label {
            width: 100%;
            padding: 0.18em 0 0;
            text-align: center;
            font-size: clamp(40px, min(15.8vw, 17.5dvh), 88px);
            line-height: 0.85;
            letter-spacing: -0.065em;
            white-space: nowrap;
          }

          .k72-nav-row:focus-visible {
            outline: 2px solid var(--k72-lime);
            outline-offset: -3px;
          }

          .k72-hover-layer {
            display: none;
          }

          .k72-nav-row:hover .k72-main-label,
          .k72-nav-row:focus-visible .k72-main-label {
            opacity: 1;
            transform: none;
          }

          .k72-nav-row:active {
            background: var(--k72-lime);
            color: var(--k72-black);
          }
        }
        @media (max-width: 1024px) and (max-height: 500px) {
          .k72-menu-header {
            min-height: 60px;
          }

          .k72-close {
            width: 44px;
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
                d="M0,43.9279 L18.5,0 L27.9,0 L9.7,43.9279 Z M18.5,0 L27.9,0 L46.4,43.9279 L36.8,43.9279 Z M11.25,25.3433 L35.15,25.3433 L35.15,33.792 L11.25,33.792 Z M57.8014,0 L66.0966,0 L66.0966,43.9279 L57.8014,43.9279 Z M66.0966,0 L93.2161,0 L93.2161,8.4487 L66.0966,8.4487 Z M93.2161,8.4487 L101.4174,8.4487 L101.4174,25.3438 L93.2161,25.3438 Z M66.0966,16.8953 L93.2161,16.8953 L93.2161,25.3438 L66.0966,25.3438 Z M81.6685,25.3438 L90.7866,25.3438 L101.4174,43.9279 L92.419,43.9279 Z"
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

    </div>
  );
};

export default FullScreenNav;
