# Abinaya Velusamy — Portfolio

Personal portfolio site for Abinaya Velusamy, Senior Program, Project & Product Manager.

Built as a static site — plain HTML, CSS, and JavaScript. No build step, no dependencies, no framework.

## Structure

```
.
├── index.html        # all page markup/content
├── css/
│   └── style.css     # design tokens (CSS variables at the top) + all styling
├── js/
│   └── main.js        # scroll reveals, animated counters, timeline fill, nav highlighting
└── README.md
```

## Running locally

Just open `index.html` in a browser — everything works from the file system.

If you'd rather serve it (recommended, since some browsers restrict certain features on `file://`):

```bash
# Python
python3 -m http.server 8000

# or Node
npx serve .
```

Then visit `http://localhost:8000`.

## TODO before publishing

Three of the four project cards in `index.html` (`#projects` section) are placeholders, marked with `// TODO` comments in the visible copy:

- **Resi** (GECO AI Hackathon)
- **Iam Plus**
- **UBS Gold App**

Search `index.html` for `TODO` and replace those `<p class="todo-line">` lines with a real description, your role, tech stack, and any impact metrics. The card styling is already applied — no CSS changes needed.

## Customizing

All colors, fonts, and spacing tokens live at the top of `css/style.css` under `:root`. Key variables:

- `--brass`, `--teal`, `--risk` — the three accent colors
- `--font-display`, `--font-body`, `--font-mono` — the three typefaces (Fraunces / IBM Plex Sans / IBM Plex Mono, loaded from Google Fonts in `index.html`)

## Deploying

**GitHub Pages**
1. Push this repo to GitHub.
2. Repo → Settings → Pages → set source to the `main` branch, root folder.
3. Site will be live at `https://<username>.github.io/<repo-name>/`.

**Vercel**
1. Import the GitHub repo at [vercel.com/new](https://vercel.com/new).
2. Framework preset: "Other" (no build command needed).
3. Deploy.

**Netlify**
Drag-and-drop the project folder at [app.netlify.com/drop](https://app.netlify.com/drop), or connect the GitHub repo the same way as Vercel.
