import { useEffect, useRef } from "react";

import NewsletterPost from "../components/blog/NewsletterPost.jsx";
import Footer from "../components/common/Footer.jsx";
import newsletters from "../data/newsletters.js";

import "./Blog.css";

const setBodyLogoColor = (color) => {
  document.body.classList.toggle("logo-black", color === "black");
  document.body.classList.toggle("logo-white", color === "white");
};

const Blog = () => {
  const pageRef = useRef(null);
  const latestNewsletter = newsletters[0];
  const archivedNewsletters = newsletters.slice(1);
  const storyCount = newsletters.reduce(
    (count, newsletter) => count + newsletter.items.length,
    0,
  );

  useEffect(() => {
    const previousTitle = document.title;
    document.title = "The Daily Three | Blog";

    return () => {
      document.title = previousTitle;
    };
  }, []);

  useEffect(() => {
    const page = pageRef.current;
    if (!page) return undefined;

    let animationFrame = 0;

    const updateLogoColor = () => {
      animationFrame = 0;
      const logoLine = 34;
      const sections = page.querySelectorAll("[data-logo-color]");
      let color = "white";

      sections.forEach((section) => {
        const bounds = section.getBoundingClientRect();
        if (bounds.top <= logoLine && bounds.bottom > logoLine) {
          color = section.dataset.logoColor;
        }
      });

      setBodyLogoColor(color);
    };

    const scheduleUpdate = () => {
      if (!animationFrame) {
        animationFrame = window.requestAnimationFrame(updateLogoColor);
      }
    };

    updateLogoColor();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      window.cancelAnimationFrame(animationFrame);
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
      document.body.classList.remove("logo-black", "logo-white");
    };
  }, []);

  return (
    <main ref={pageRef} className="blog-page">
      <section className="blog-hero" data-logo-color="white">
        <div className="blog-hero__topline">
          <p className="blog-status">
            <span className="blog-status__dot" aria-hidden="true" />
            AI editor online
          </p>
          <p>Daily / 08:00 Toronto</p>
        </div>

        <div className="blog-hero__title-wrap">
          <p className="blog-hero__edition" aria-hidden="true">
            03
          </p>
          <h1 className="blog-hero__title">
            <span>Daily</span>
            <span>Three</span>
          </h1>
        </div>

        <div className="blog-hero__footer">
          <p className="blog-hero__intro">
            Three of the most-upvoted new Hacker News stories, selected and
            distilled by our AI editor every morning.
          </p>

          <div className="blog-hero__actions">
            <a
              className="blog-pill"
              href="https://news.ycombinator.com/newest"
              target="_blank"
              rel="noopener noreferrer"
            >
              Source / Hacker News <span aria-hidden="true">↗</span>
            </a>
            {latestNewsletter && (
              <a className="blog-pill blog-pill--lime" href="#latest-issue">
                Read latest <span aria-hidden="true">↓</span>
              </a>
            )}
          </div>
        </div>
      </section>

      {latestNewsletter ? (
        <>
          <section
            className="blog-latest"
            id="latest-issue"
            data-logo-color="black"
          >
            <div className="blog-section-label">
              <p>Today&apos;s signal</p>
              <p>
                {newsletters.length} {newsletters.length === 1 ? "issue" : "issues"}
                {" / "}
                {storyCount} stories
              </p>
            </div>
            <NewsletterPost newsletter={latestNewsletter} latest />
          </section>

          <section className="blog-archive" data-logo-color="white">
            <header className="blog-archive__header">
              <p>Archive / Newest first</p>
              <h2>
                Past
                <br />
                issues<span>.</span>
              </h2>
            </header>

            {archivedNewsletters.length > 0 ? (
              <div className="blog-archive__list">
                {archivedNewsletters.map((newsletter) => (
                  <NewsletterPost
                    key={newsletter.date}
                    newsletter={newsletter}
                  />
                ))}
              </div>
            ) : (
              <div className="blog-archive__empty">
                <span>001</span>
                <p>
                  The archive starts here. A new issue joins it every morning.
                </p>
              </div>
            )}
          </section>
        </>
      ) : (
        <section className="blog-empty" data-logo-color="white">
          <p className="blog-empty__number" aria-hidden="true">
            000
          </p>
          <div className="blog-empty__copy">
            <p>First dispatch / Pending</p>
            <h2>The first three are being selected.</h2>
            <p>
              This page is ready. The first daily newsletter will appear here
              automatically after the editor publishes it at 08:00 Toronto.
            </p>
          </div>
        </section>
      )}

      <div data-logo-color="white">
        <Footer />
      </div>
    </main>
  );
};

export default Blog;
