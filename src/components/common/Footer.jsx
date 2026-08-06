import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./Footer.css";

const socialLinks = [
  { label: "FB", name: "Facebook", href: "https://www.facebook.com/K72.ca/" },
  { label: "IG", name: "Instagram", href: "https://www.instagram.com/k72.ca/" },
  { label: "IN", name: "LinkedIn", href: "https://www.linkedin.com/company/k72/" },
  { label: "BE", name: "Behance", href: "https://www.behance.net/agenceK72" },
];

const legalLinks = [
  { label: "Privacy policy", href: "https://k72.ca/en/privacy-policy" },
  { label: "Privacy notice", href: "https://k72.ca/en/privacy-notice" },
  {
    label: "Ethics report",
    href: "https://secure.ethicspoint.com/domain/media/en/gui/47632/index.html",
  },
];

const montrealTimeFormatter = new Intl.DateTimeFormat("en-CA", {
  timeZone: "America/Toronto",
  hour: "2-digit",
  minute: "2-digit",
  second: "2-digit",
  hourCycle: "h23",
});

const getMontrealTime = () => montrealTimeFormatter.format(new Date());

const GlobeIcon = () => (
  <svg
    aria-hidden="true"
    className="site-footer__globe"
    viewBox="0 0 48 48"
    fill="none"
  >
    <circle cx="24" cy="24" r="21" stroke="currentColor" strokeWidth="2" />
    <path d="M3 24h42M7 14h34M7 34h34" stroke="currentColor" strokeWidth="2" />
    <path
      d="M24 3c6 5.5 9 12.5 9 21s-3 15.5-9 21c-6-5.5-9-12.5-9-21S18 8.5 24 3Z"
      stroke="currentColor"
      strokeWidth="2"
    />
  </svg>
);

const ContactMark = () => (
  <svg
    aria-hidden="true"
    className="site-footer__contact-mark"
    viewBox="0 0 72 78"
  >
    <path d="M7 3 25 20 36 8l11 12L65 3l6 8v40L36 76 1 51V11L7 3Z" fill="currentColor" />
  </svg>
);

const Footer = () => {
  const [montrealTime, setMontrealTime] = useState(getMontrealTime);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setMontrealTime(getMontrealTime());
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  const handleBackToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleConsentChoices = () => {
    window.OneTrust?.ToggleInfoDisplay?.();
  };

  return (
    <footer id="site-footer" className="site-footer">
      <div className="site-footer__top">
        <nav className="site-footer__socials" aria-label="Social media">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              className="site-footer__pill site-footer__social-link"
              href={social.href}
              target="_blank"
              rel="noreferrer"
              aria-label={social.name}
            >
              {social.label}
            </a>
          ))}
        </nav>

        <Link className="site-footer__pill site-footer__contact" to="/contact">
          <span>Contact</span>
          <ContactMark />
        </Link>
      </div>

      <div className="site-footer__bottom">
        <div className="site-footer__location">
          <GlobeIcon />
          <span>
            Canada_<time dateTime={montrealTime}>{montrealTime}</time>
          </span>
        </div>

        <nav className="site-footer__legal" aria-label="Legal">
          {legalLinks.map((link) => (
            <a key={link.label} href={link.href}>
              {link.label}
            </a>
          ))}
          <button type="button" onClick={handleConsentChoices}>
            Consent choices
          </button>
        </nav>

        <button className="site-footer__back-to-top" type="button" onClick={handleBackToTop}>
          Back to top
        </button>
      </div>
    </footer>
  );
};

export default Footer;
