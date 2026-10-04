import { validateNewsletter } from "./newsletters/validateNewsletter.js";

const newsletterModules = import.meta.glob("./newsletters/*.json", {
  eager: true,
  import: "default",
});

const getDateFromPath = (path) =>
  path.match(/(\d{4}-\d{2}-\d{2})\.json$/)?.[1] ?? "";

const newsletters = Object.entries(newsletterModules)
  .map(([path, newsletter]) => {
    const fileDate = getDateFromPath(path);
    const errors = validateNewsletter(newsletter, fileDate);

    if (!fileDate) {
      errors.unshift("The filename must use the YYYY-MM-DD.json format.");
    }

    if (errors.length > 0) {
      if (import.meta.env.DEV) {
        console.warn(`Skipping invalid newsletter: ${path}`, errors);
      }
      return null;
    }

    return {
      ...newsletter,
      items: [...newsletter.items].sort((a, b) => a.rank - b.rank),
    };
  })
  .filter(Boolean)
  .sort((a, b) => b.date.localeCompare(a.date));

export default newsletters;
