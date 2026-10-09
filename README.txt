SEATTLE EVENT GROUP WEBSITE

index.html - content and slide images
styles.css - design, responsive layout, and hero gradient
script.js - slideshow controls and timing (INTERVAL_MS = 6500)
occasions.css and occasions.js - distinct occasion pages and downloadable event briefs
theme.css and theme.js - shared light/dark palette toggle, saved across pages
event-effects.css and event-effects.js - seasonal wedding scenes and subtle photo animations
weddings/, tea-ceremony/, xv-anos/, corporate/ - occasion pages
assets/ - AI-generated event inspiration; see assets/README.md for prompts


NETLIFY DEPLOYMENT

Live domain: https://seattleeventgroup.com

Import wallaWalla94/seattle-event-group from GitHub into Netlify.
Production branch: main
Base directory: leave empty
Build command: leave empty
Publish directory: .
netlify.toml saves the publish directory and redirects /main.html to /.

Once connected, Netlify deploys new commits pushed to main automatically.
For routine changes, review git status, then run:
git add .
git commit -m "Describe your changes"
git push
