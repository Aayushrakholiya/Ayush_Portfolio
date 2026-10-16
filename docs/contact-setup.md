# Contact page setup

The interface works without credentials, with honest email fallbacks. Shared likes and real booking require these steps before launch.

## Résumé

Add your current PDF at `public/resume/ayush-rakholiya-resume.pdf`. Replace that file and redeploy for future updates. The `/resume` page checks its content type before rendering the preview and download actions. Responses must revalidate so the stable URL picks up replacements.

## Cal.com

The verified public booking link is `https://cal.com/ayush-rakholiya-dcatmx/30min` and is the default in `src/data/contact.js`. It currently offers 30-minute meetings using Cal Video. No environment variable is required for this link to work locally or after deployment. Set `VITE_CAL_BOOKING_URL` only to override it; an explicitly empty value disables booking and shows the email fallback.

Create an event called **30-minute chat with Ayush**, with duration 30 minutes. Connect your calendar, set your real availability and time zone, choose a meeting location/video integration, and enable booking confirmations and invitations. Add its full HTTPS event URL as `VITE_CAL_BOOKING_URL` in Vercel and redeploy. The value must be on `cal.com` and contain both username and event slug.

The inline calendar owns available times, attendee details, conflict checks, time-zone selection, and confirmation. The site never fabricates booking success. A direct link and email fallback remain below the embed. Test an actual booking in a second time zone, check the invitation and calendar entry, verify the booked slot disappears, and cancel the test booking afterward.

## Shared likes

1. Create a Supabase project and run `supabase/contact-likes.sql` in its SQL editor.
2. Configure `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY`, and `CONTACT_RATE_LIMIT_SECRET` in Vercel. Generate a random secret with at least 32 bytes for the last value. Never put server credentials in a `VITE_` variable or commit an environment file.
3. For local testing, save these settings in the Git-ignored `.env.local` file and run `npm run dev`. The development-only Vite middleware serves `/api/contact/likes` using the same handler as Vercel. Restart the dev server after changing credentials. Only the three named server settings are loaded for the handler; they are never exposed as frontend variables. The key setting accepts either a legacy service-role key or a new Supabase secret key.
4. For deployment, add the same three server settings in Vercel and redeploy. Vercel serves `api/contact/likes.js` directly. Local settings are not uploaded by Git.

GET and POST `/api/contact/likes` accept an `X-Visitor-Id` UUIDv4 header. Both return `{ count, liked }`. POST inserts once, permanently. A unique constraint and transactional aggregate avoid duplicate increments across retries and concurrent submissions. Count is exact when read, rather than a permanent live stream; the UI refreshes on focus and after submissions.

Only the server can execute the database function. IPs are HMAC-hashed before storage. Limits are 10 writes and 120 reads per IP per minute, persisted across server instances; stale limiter entries are pruned. A browser identifier is stored locally without login. Clearing storage or changing browsers allows another like, so the total is appreciation rather than verified unique people. Shared-network visitors share rate budgets.

Check independent browsers, repeat likes, reload persistence, blocked storage, failed requests, retry, and concurrent submissions. Without configured services, verify no false totals or success states appear. Use a deployed environment to verify Vercel header trust, database permissions, and atomic SQL behavior.

## Verification

Run `npm run build`, `npm run lint`, and `npm run test:contact`. The database tests execute the actual SQL using development-only PGlite; parallel callers are serialized by that runtime, so deployed multi-connection concurrency still needs a smoke test. Browser QA is available via `node scripts/check-contact.cjs` with the local app on port 5176 and Playwright available through `PLAYWRIGHT_PATH`. Check contact and résumé routes at 360, 390, 768, 1024, and 1440 pixels; landscape and enlarged text; keyboard focus; reduced motion; page transitions; logo contrast; and footer links. Verify direct PDF and API requests are not rewritten to HTML.
