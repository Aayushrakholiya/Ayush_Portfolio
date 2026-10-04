const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

const isPlainObject = (value) =>
  Boolean(value) && typeof value === "object" && !Array.isArray(value);

const isNonEmptyString = (value) =>
  typeof value === "string" && value.trim().length > 0;

const isHttpUrl = (value) => {
  if (!isNonEmptyString(value)) return false;

  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
};

export const isCalendarDate = (value) => {
  if (!ISO_DATE_PATTERN.test(value)) return false;

  const [year, month, day] = value.split("-").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day));

  return (
    date.getUTCFullYear() === year &&
    date.getUTCMonth() === month - 1 &&
    date.getUTCDate() === day
  );
};

export const validateNewsletter = (newsletter, expectedDate) => {
  const errors = [];

  if (!isPlainObject(newsletter)) {
    return ["The file must contain one JSON object."];
  }

  if (!isCalendarDate(newsletter.date)) {
    errors.push("`date` must be a real date in YYYY-MM-DD format.");
  }

  if (expectedDate && newsletter.date !== expectedDate) {
    errors.push(
      `The payload date (${newsletter.date || "missing"}) must match the filename (${expectedDate}).`,
    );
  }

  if (!isNonEmptyString(newsletter.title)) {
    errors.push("`title` must be a non-empty string.");
  }

  if (!Array.isArray(newsletter.items) || newsletter.items.length !== 3) {
    errors.push("`items` must contain exactly three stories.");
    return errors;
  }

  const ranks = newsletter.items.map((item) => item?.rank).sort((a, b) => a - b);
  if (ranks.join(",") !== "1,2,3") {
    errors.push("Story ranks must be the unique values 1, 2, and 3.");
  }

  newsletter.items.forEach((item, index) => {
    const label = `items[${index}]`;

    if (!isPlainObject(item)) {
      errors.push(`${label} must be an object.`);
      return;
    }

    if (!Number.isInteger(item.rank) || item.rank < 1 || item.rank > 3) {
      errors.push(`${label}.rank must be an integer from 1 to 3.`);
    }

    if (!isNonEmptyString(item.title)) {
      errors.push(`${label}.title must be a non-empty string.`);
    }

    if (!isHttpUrl(item.url)) {
      errors.push(`${label}.url must be a valid HTTP(S) URL.`);
    }

    if (!isHttpUrl(item.hnLink)) {
      errors.push(`${label}.hnLink must be a valid HTTP(S) URL.`);
    }

    if (!Number.isInteger(item.points) || item.points < 0) {
      errors.push(`${label}.points must be a non-negative integer.`);
    }

    if (!isNonEmptyString(item.summary)) {
      errors.push(`${label}.summary must be a non-empty string.`);
    }
  });

  return errors;
};
