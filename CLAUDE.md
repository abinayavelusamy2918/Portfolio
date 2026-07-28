# Working notes — abinayavelusamy.com

Static portfolio site. Plain HTML, CSS, JS. No framework, no build step.

## ⚠️ Deployment: BATCH IT

**Do not deploy after every change.** Netlify deploys consume account credits;
deploying after each small edit exhausted the free tier on 2026-07-28 and blocked
all deploys until the plan was upgraded.

**The rule:** make all the changes the user asked for, verify locally, then commit
and deploy **once** at the end. If the user asks for several things across a
conversation, keep working locally and deploy when the batch is done — or when
they explicitly ask to push/deploy.

Verify locally instead of deploying to check work:

```bash
cd ~/Documents/Portfolio
python3 -m http.server 8000        # then curl / screenshot localhost:8000
```

## Publish

```bash
cd ~/Documents/Portfolio
git add -A && git commit -m "..." && git push      # GitHub
netlify deploy --prod --dir=.                      # goes live (consumes credits)
```

Deploys are **manual** — a `git push` alone does not publish. The repo is not
linked to Netlify builds (that's a browser-only setup step the user can do:
Site configuration → Build & deploy → Link repository).

## Live infrastructure

| Thing | Value |
|---|---|
| Live site | https://abinayavelusamy.com |
| Netlify fallback | https://abinayavelusamy.netlify.app |
| Netlify site ID | `b354690f-f5a5-445d-83ee-d83bd3fb0f55` |
| GitHub repo | `abinayavelusamy2918/Portfolio` (**public**) |
| Domain registrar | GoDaddy — **DNS stays at GoDaddy** (no Netlify DNS zone) |
| DNS records | `A @ → 75.2.60.5`, `CNAME www → abinayavelusamy.netlify.app` |
| Analytics | Plausible, `data-domain="abinayavelusamy.com"` |

## Structure

```
index.html  about  expertise  how-i-work  experience
projects    resi   education  work-with-me  shop  contact      (11 pages)
css/style.css   js/main.js   assets/
netlify.toml    sitemap.xml   robots.txt
```

## Gotchas that have bitten before

- **The sidebar and `<head>` are duplicated in all 11 HTML files.** There is no
  templating. Any nav, topbar, or meta change must be applied to every file —
  script it, don't hand-edit.
- **Assets are versioned** (`css/style.css?v=2`). Bump the version when the CSS
  changes materially, or browsers serve stale files. The user has repeatedly hit
  "I don't see the change" because of caching.
- **CSS cascade:** `.sidebar .avatar` and similar base rules are defined *late* in
  `style.css`. Media-query overrides placed earlier lose despite matching. Put
  responsive overrides at the **end** of the file.
- **Sidebar height:** content must fit ~700px viewports. Height-based media
  queries at the end of the stylesheet shrink the portrait/nav for short screens.
- **Never regex-delete CSS blocks with `re.DOTALL`** — doing so once ate a media
  query's closing brace and silently trapped every following rule inside it.
  Always re-check `c.count('{') == c.count('}')` after editing CSS.
- **Verify visually.** Headless Chrome screenshots have caught several bugs that
  looked fine in source (blank hero, broken stack, hidden links). Note headless
  enforces a 500px minimum window width.

## Still outstanding

- Shop has no real products — needs a Gumroad account, then real buy links.
- Work With Me buttons are `mailto:`, not real scheduling (Cal.com was chosen).
- Google Search Console: verified via meta tag; sitemap submission + indexing
  requests are user actions.
