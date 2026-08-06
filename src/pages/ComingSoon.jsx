import { Link } from "react-router-dom";

const ComingSoon = ({ section }) => {
  const isContact = section === "Contact";

  return (
    <main className="coming-soon-page">
      <style>{`
        .coming-soon-page {
          --lime: #d3fd51;
          min-height: 100svh;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          overflow: hidden;
          padding: clamp(96px, 12vh, 132px) clamp(14px, 1.4vw, 28px) clamp(14px, 2vw, 28px);
          background: #050505;
          color: #fff;
          font-family: "Lausanne", Arial, sans-serif;
        }

        .coming-soon-eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          margin: 0;
          font-family: Arial, sans-serif;
          font-size: clamp(.72rem, .85vw, .95rem);
          letter-spacing: .08em;
          text-transform: uppercase;
        }

        .coming-soon-dot {
          width: 10px;
          height: 10px;
          flex: none;
          border-radius: 50%;
          background: var(--lime);
          box-shadow: 0 0 0 5px rgba(211, 253, 81, .13);
          animation: coming-soon-pulse 1.8s ease-in-out infinite;
        }

        .coming-soon-title {
          width: 100%;
          margin: auto 0;
          font-size: clamp(5rem, 16.5vw, 17.5rem);
          font-weight: 300;
          line-height: .7;
          letter-spacing: -.075em;
          text-align: center;
          text-transform: uppercase;
        }

        .coming-soon-title span {
          display: block;
        }

        .coming-soon-title span:last-child {
          color: var(--lime);
        }

        .coming-soon-footer {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          padding-top: 18px;
          border-top: 1px solid rgba(255, 255, 255, .65);
        }

        .coming-soon-copy {
          max-width: 36rem;
          margin: 0;
          font-family: Arial, sans-serif;
          font-size: clamp(.95rem, 1.35vw, 1.35rem);
          line-height: 1.2;
        }

        .coming-soon-home {
          display: inline-flex;
          align-items: center;
          gap: clamp(20px, 3vw, 54px);
          flex: none;
          padding: 10px 12px 9px;
          border: 1px solid currentColor;
          border-radius: 999px;
          color: #fff;
          font-family: Arial, sans-serif;
          font-size: .78rem;
          line-height: 1;
          text-decoration: none;
          text-transform: uppercase;
          transition: background-color 250ms ease, color 250ms ease;
        }

        .coming-soon-home:hover,
        .coming-soon-home:focus-visible {
          background: var(--lime);
          color: #050505;
          outline: none;
        }

        .coming-soon-arrow {
          font-size: 1.1rem;
          transition: transform 250ms ease;
        }

        .coming-soon-home:hover .coming-soon-arrow,
        .coming-soon-home:focus-visible .coming-soon-arrow {
          transform: translate(3px, -3px);
        }

        @keyframes coming-soon-pulse {
          50% { opacity: .45; transform: scale(.8); }
        }

        @media (max-width: 640px) {
          .coming-soon-page {
            padding-top: 88px;
          }

          .coming-soon-title {
            font-size: clamp(4.25rem, 25vw, 8.5rem);
            line-height: .75;
          }

          .coming-soon-footer {
            align-items: flex-start;
            flex-direction: column;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .coming-soon-dot { animation: none; }
        }
      `}</style>

      <p className="coming-soon-eyebrow">
        <span className="coming-soon-dot" aria-hidden="true" />
        {section} / In progress
      </p>

      <h1 className="coming-soon-title">
        <span>Coming</span>
        <span>Soon</span>
      </h1>

      <footer className="coming-soon-footer">
        <p className="coming-soon-copy">
          {isContact
            ? "Good things are taking shape. Our contact space will be ready shortly."
            : "Fresh thinking is on the way. Our stories will be ready shortly."}
        </p>

        <Link className="coming-soon-home" to="/">
          Back home <span className="coming-soon-arrow" aria-hidden="true">↗</span>
        </Link>
      </footer>
    </main>
  );
};

export default ComingSoon;
