import StoryRow from "./StoryRow.jsx";

const MONTH_FORMATTER = new Intl.DateTimeFormat("en-CA", {
  month: "short",
  timeZone: "UTC",
});

const getDateParts = (dateString) => {
  const [year, month, day] = dateString.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return {
    day: String(day).padStart(2, "0"),
    month: MONTH_FORMATTER.format(date).toUpperCase(),
    year,
  };
};

const StoryList = ({ items, headingLevel = "h3" }) => (
  <ol className="blog-story-list">
    {items.map((item) => (
      <StoryRow
        key={`${item.rank}-${item.hnLink}`}
        item={item}
        headingLevel={headingLevel}
      />
    ))}
  </ol>
);

const NewsletterPost = ({ newsletter, latest = false }) => {
  const date = getDateParts(newsletter.date);
  const headingId = `newsletter-${newsletter.date}`;

  if (!latest) {
    return (
      <article
        className="blog-archive-issue"
        id={`issue-${newsletter.date}`}
        aria-labelledby={headingId}
      >
        <details>
          <summary className="blog-archive-issue__summary">
            <time className="blog-archive-issue__date" dateTime={newsletter.date}>
              {date.day}.{String(new Date(`${newsletter.date}T00:00:00Z`).getUTCMonth() + 1).padStart(2, "0")}.{String(date.year).slice(-2)}
            </time>
            <h3 id={headingId}>{newsletter.title}</h3>
            <span className="blog-archive-issue__count">03 stories</span>
            <span className="blog-archive-issue__toggle" aria-hidden="true" />
          </summary>
          <StoryList items={newsletter.items} headingLevel="h4" />
        </details>
      </article>
    );
  }

  return (
    <article
      className="blog-latest-issue"
      id={`issue-${newsletter.date}`}
      aria-labelledby={headingId}
    >
      <header className="blog-latest-issue__header">
        <time className="blog-latest-issue__date" dateTime={newsletter.date}>
          <span className="blog-latest-issue__day">{date.day}</span>
          <span className="blog-latest-issue__month">
            {date.month} / {date.year}
          </span>
        </time>

        <div className="blog-latest-issue__heading">
          <p>Latest dispatch / Three stories</p>
          <h2 id={headingId}>{newsletter.title}</h2>
        </div>
      </header>

      <StoryList items={newsletter.items} />
    </article>
  );
};

export default NewsletterPost;
