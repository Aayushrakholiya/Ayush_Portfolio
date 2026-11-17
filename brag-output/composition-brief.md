# Composition brief

Create an 18-second landscape launch video for Ayush Rakholiya's portfolio from the adjacent brag-plan.md. K72 is the development folder, not the public-facing brand.

LOOK: 1920×1080; background #050505; white #ffffff; accent #d3fd51; Lausanne 300; hero 150px; gallery title 124px; gallery captions 31px; labels 24px; margins 96px; outlined pills 3px.
BANNED: fabricated stats, fake app screens, glass panels, generic SaaS copy, text that drifts after settling, narration.

Use src/components/home/HomeHeroText.jsx, HomeBottomText.jsx, Navigation/Logo.jsx, pages/project.jsx, Home.css, Project.css, and public/media/home-720-v1.mp4. Reproduce their design as seekable HTML scenes with the site's original font and project artwork. Offline assets only. Source-specific staircase motion is authored directly because registry lookup failed with network restrictions.

Scene slots: hello 0–2.19, hero 1.64–6.56 (under exiting hello panels), work 6.56–13.11, outro 13.11–18. Main stage 18 seconds. All scenes use matching host/root/timeline IDs. The work gallery includes two pairs with an upward transition at 9.83. No extra headline claims.

Music: assets/music/music.mp3, copied from brag's vol.12; local cues from its bundled JSON. 0.32 gain and fades, two soft impacts. A small decorative spark uses a locally decoded RMS envelope if extraction succeeds. Music attribution in share-copy.txt and CREDITS.md.

Deliver composition, local render script, source plan, credits, and share copy. Render output brag.mp4 and settled hero poster brag.jpg; the script replaces frame zero with the poster without changing duration. Check first, render with one worker to limit RAM. This agent cannot run browser QA due to localhost access restrictions; final checks remain explicitly pending.
