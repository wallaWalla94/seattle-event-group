SEATTLE EVENT GROUP WEBSITE

index.html - content and slide images
styles.css - design, responsive layout, and hero gradient
script.js - slideshow controls and timing (INTERVAL_MS = 6500)


NETLIFY DEPLOYMENT

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
