# Abinaya Velusamy — Portfolio

Personal portfolio site for Abinaya Velusamy, Senior Program, Project & Product Manager.

Static site — plain HTML, CSS, and JavaScript. No build step, no dependencies, no framework.

## Structure

```
.
├── index.html          # home: hero, about, expertise, how I work,
│                       #       experience summary, projects, education, contact
├── experience.html     # full work history (detailed timeline)
├── work-with-me.html   # mentorship, product advisory, fractional engagements
├── shop.html           # digital guides — currently a "coming soon" state
├── css/
│   └── style.css       # design tokens (CSS variables at the top) + all styling
├── js/
│   └── main.js         # boot intro, scroll reveals, counters, timeline fill,
│                       # nav highlighting, cursor-tracked project previews
└── assets/
    ├── headshot.jpg          # sidebar portrait (optimised, 320px)
    ├── purands-preview.jpg   # Purands product thumbnail
    └── ubs-gold-preview.jpg  # UBS Gold Vault thumbnail
```

The sidebar navigation is duplicated in all four HTML files. **A nav change must be
made in every one of them** — there is no templating layer.

## Running locally

```bash
python3 -m http.server 8000
```

Then visit `http://localhost:8000`.

Opening `index.html` directly from the file system mostly works, but serving it is
closer to production behaviour.

## Pages

**Home** — hero, about, areas of expertise, the RAID + product-practice section,
a condensed experience summary linking to the full history, project cards,
education, and contact.

**Experience** — the complete timeline: four detailed roles with achievements and
metrics, plus a log of earlier engineering positions.

**Work With Me** — three service cards (mentorship, product advisory, fractional /
part-time). Buttons currently open a pre-addressed email; see below to switch them
to real scheduling.

**Shop** — a coming-soon panel with a notify-me email link. The Gumroad overlay
script is already loaded, so adding real products is markup-only.

## Before publishing

Placeholders that still need real content:

- **Projects** — the *Resi* and *Iam Plus* cards are `// TODO`: no description,
  no tools, no thumbnail.
- **Shop** — no products yet. Requires a Gumroad account; see below.
- **Work With Me** — service durations and scope bullets are drafted, not confirmed.

Two things to review for confidentiality before making the site public:

- `assets/purands-preview.jpg` shows an analytics dashboard with revenue figures
  and customer counts.
- `assets/ubs-gold-preview.jpg` is UBS marketing material.

The metrics on the UBS Gold card (CSAT, CHF revenue, user counts) are portfolio-level
figures from the wider Mobile Banking role, not Gold-specific.

## Selling PDFs (Shop)

**Never put the PDFs in this repo.** Anything under `assets/` is publicly
downloadable — a file there could be taken without payment. Gumroad hosts the files
and releases them only after purchase.

To go live:

1. Create a free account at [gumroad.com](https://gumroad.com) and upload each PDF
   as a product.
2. Replace the coming-soon panel in `shop.html` with product cards, each using:

   ```html
   <a class="btn btn-primary shop-cta"
      href="https://<username>.gumroad.com/l/<slug>"
      data-gumroad-overlay-checkout="true">Buy now →</a>
   ```

   The `data-gumroad-overlay-checkout` attribute opens checkout as an overlay
   instead of navigating away.

## Real booking links (Work With Me)

The three buttons currently use `mailto:` with a per-service subject line. To use
actual scheduling, create a [Cal.com](https://cal.com) or Calendly account and swap
each `href` for the event-type URL.

## Customizing

All colours, fonts, and spacing tokens live at the top of `css/style.css` under
`:root`:

- `--brass`, `--teal`, `--risk` — the three accent colours
- `--font-display`, `--font-body`, `--font-mono` — Fraunces / IBM Plex Sans /
  IBM Plex Mono, loaded from Google Fonts
- `--sidebar-w`, `--maxw` — layout widths

## Motion & accessibility

The boot intro plays once per tab session, is skippable with any click or keypress,
and is bypassed entirely on deep links and sub-pages. Every animation — the intro,
scroll reveals, counters, and the cursor-tracked project tilt — is disabled under
`prefers-reduced-motion`. The intro is injected from JavaScript, so with JS disabled
the site loads as plain content rather than sitting behind a dead overlay.

## Deploying

This repo is **private**, so GitHub Pages is not available on the free tier — it
requires a public repo. Both of these deploy from a private repo for free:

**Netlify** — import the repo at [app.netlify.com](https://app.netlify.com).
No build command, publish directory `.`.

**Vercel** — import at [vercel.com/new](https://vercel.com/new).
Framework preset "Other", no build command.

To use **GitHub Pages** instead, make the repo public first (Settings → General →
Danger Zone), then Settings → Pages → source `main`, root folder.
