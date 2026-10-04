# Daily newsletter data

The publishing agent should write one file per day to this folder:

`src/data/newsletters/YYYY-MM-DD.json`

Each file must use this shape:

```json
{
  "date": "2026-10-04",
  "title": "Top 3 from Hacker News - October 4, 2026",
  "items": [
    {
      "rank": 1,
      "title": "Story title",
      "url": "https://example.com/story",
      "hnLink": "https://news.ycombinator.com/item?id=123",
      "points": 123,
      "summary": "A concise two or three sentence summary."
    },
    {
      "rank": 2,
      "title": "Second story title",
      "url": "https://example.com/second-story",
      "hnLink": "https://news.ycombinator.com/item?id=456",
      "points": 98,
      "summary": "A concise two or three sentence summary."
    },
    {
      "rank": 3,
      "title": "Third story title",
      "url": "https://example.com/third-story",
      "hnLink": "https://news.ycombinator.com/item?id=789",
      "points": 76,
      "summary": "A concise two or three sentence summary."
    }
  ]
}
```

Requirements:

- The filename and `date` value must match.
- `items` must contain exactly three entries with unique ranks 1, 2, and 3.
- Article and Hacker News links must be absolute HTTP(S) URLs.
- `points` must be a non-negative integer.
- The Vite build discovers every JSON file automatically and renders issues newest-first.
