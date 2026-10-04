import { readdir, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

import { validateNewsletter } from "../src/data/newsletters/validateNewsletter.js";

const newsletterDirectory = fileURLToPath(
  new URL("../src/data/newsletters", import.meta.url),
);

const entries = await readdir(newsletterDirectory, { withFileTypes: true });
const jsonFiles = entries
  .filter((entry) => entry.isFile() && entry.name.endsWith(".json"))
  .map((entry) => entry.name)
  .sort();

const validationErrors = [];

for (const filename of jsonFiles) {
  const expectedDate = filename.match(/^(\d{4}-\d{2}-\d{2})\.json$/)?.[1] ?? "";

  try {
    const contents = await readFile(
      new URL(`../src/data/newsletters/${filename}`, import.meta.url),
      "utf8",
    );
    const newsletter = JSON.parse(contents);
    const errors = validateNewsletter(newsletter, expectedDate);

    if (!expectedDate) {
      errors.unshift("The filename must use the YYYY-MM-DD.json format.");
    }

    errors.forEach((error) => validationErrors.push(`${filename}: ${error}`));
  } catch (error) {
    validationErrors.push(`${filename}: ${error.message}`);
  }
}

if (validationErrors.length > 0) {
  console.error("Newsletter validation failed:\n");
  validationErrors.forEach((error) => console.error(`- ${error}`));
  process.exitCode = 1;
} else {
  console.log(`Newsletter validation passed (${jsonFiles.length} files).`);
}
