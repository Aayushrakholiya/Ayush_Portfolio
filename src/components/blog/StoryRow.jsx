const getStorySource = (url) => {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return "External story";
  }
};

const StoryRow = ({ item, headingLevel = "h3" }) => {
  const rank = String(item.rank).padStart(2, "0");
  const StoryHeading = headingLevel;

  return (
    <li className="blog-story">
      <span className="blog-story__rank" aria-hidden="true">
        {rank}
      </span>

      <div className="blog-story__content">
        <p className="blog-story__source">
          <span>{getStorySource(item.url)}</span>
          <span aria-hidden="true">/</span>
          <span>{item.points} points</span>
        </p>

        <StoryHeading className="blog-story__title">{item.title}</StoryHeading>
        <p className="blog-story__summary">{item.summary}</p>

        <div className="blog-story__links">
          <a
            className="blog-story__link blog-story__link--primary"
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
          >
            Read article <span aria-hidden="true">↗</span>
          </a>
          <a
            className="blog-story__link"
            href={item.hnLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            HN discussion <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>
    </li>
  );
};

export default StoryRow;
