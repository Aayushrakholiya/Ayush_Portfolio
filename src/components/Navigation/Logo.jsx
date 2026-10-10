import { useNavigate } from "react-router-dom";

import useRouteNavbarMode from "./hooks/useRouteNavbarMode";

const Logo = () => {
  const navigate = useNavigate();
  const config = useRouteNavbarMode();

  if (!config.showLogo) {
    return null;
  }

  // Use CSS `color` to control the SVG via `currentColor` so global
  // page classes can override the logo color during scroll.
  const initialLogoClass =
    config.logoColor === "black" ? "logo-black" : "logo-white";

  const handleLogoClick = () => {
    navigate("/");
  };

  return (
    <button
      type="button"
      onClick={handleLogoClick}
      aria-label="Go to home page"
      className={"fixed left-3 top-3 z-[999] w-30 cursor-pointer border-0 bg-transparent p-0 site-logo " + (config.mode === 'compact' ? 'home-logo ' : '') + (config.enableProjectHover ? 'work-logo ' : '') + (config.pageClass === 'agency' ? 'agency-logo ' : '') + initialLogoClass}
    >
      <svg
        className="w-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 103 44"
      >
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M0,43.9279 L18.5,0 L27.9,0 L9.7,43.9279 Z M18.5,0 L27.9,0 L46.4,43.9279 L36.8,43.9279 Z M11.25,25.3433 L35.15,25.3433 L35.15,33.792 L11.25,33.792 Z M57.8014,0 L66.0966,0 L66.0966,43.9279 L57.8014,43.9279 Z M66.0966,0 L93.2161,0 L93.2161,8.4487 L66.0966,8.4487 Z M93.2161,8.4487 L101.4174,8.4487 L101.4174,25.3438 L93.2161,25.3438 Z M66.0966,16.8953 L93.2161,16.8953 L93.2161,25.3438 L66.0966,25.3438 Z M81.6685,25.3438 L90.7866,25.3438 L101.4174,43.9279 L92.419,43.9279 Z"
        />
      </svg>
    </button>
  );
};

export default Logo;
