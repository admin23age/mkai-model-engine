# SOP — mankindaitech.com Website Operations

**Owner:** MKAI Engineering
**Audience:** Anyone who edits, deploys, or rolls back the Man Kind AI marketing site.
**Source of truth (live site):** branch `production` of `github.com/admin23age/mkai-website` → Hostinger `public_html`.
**Last cutover:** 2026-06-04 — site migrated from React/Vite to plain PHP.

---

## 1. Purpose

This SOP defines how the public website (mankindaitech.com) is built, edited, deployed, and rolled back, so that:

- Changes go live **safely and predictably** (one path, with a known rollback).
- A non-developer can make routine edits and recover the old site without help.
- The mistakes that cost us a week (the JotForm assessment form) never repeat.

**Golden rule:** the live site = whatever is on the **`production`** branch. Hostinger auto-deploys it to `public_html` on every push (~20s). Nothing else is authoritative.

---

## 2. Stack & architecture (keep this picture in your head)

```
EDIT here  →  C:\Users\immav\Projects\mkai-site-php   (local PHP source, git repo)
              ↓ git push origin master:production  (or Claude does it)
GitHub: admin23age/mkai-website
   ├── production              ← LIVE site (PHP). Hostinger watches this.
   ├── production-react-backup ← the OLD React site (rollback)
   └── php-rebuild             ← same as production (PHP), staging/PR branch
              ↓ Hostinger Git, auto-deploy ON
Hostinger public_html  →  https://mankindaitech.com
```

- **Plain PHP/HTML/CSS — NO build step.** The `.php` files ARE what runs. You do not "compile" anything.
- Pages: `index.php`, `about.php`, `project-management.php`, `higher-education.php`, `blog.php`, `blog-post.php` (`?slug=`), `terms.php`.
- Shared bits (edit once, applies everywhere): `includes/header.php` (nav + `<head>` + CSP), `includes/footer.php` (footer + chatbot + assessment modal), `includes/icons.php` (SVG icons).
- Styling: `assets/css/styles.css` — **all brand colors are in the `:root` block at the top.**
- Blog content: `content/posts/meta.json` (list) + one `content/posts/<slug>.md` per article.

---

## 3. Common edits (and where to make them)

| You want to… | Edit this |
|---|---|
| Change wording on a page | the matching `*.php` file |
| Change the menu or footer (all pages at once) | `includes/header.php` / `includes/footer.php` |
| Change brand colors / spacing | top of `assets/css/styles.css` (`:root`) |
| Add a blog post | add `content/posts/<slug>.md` **and** an entry in `content/posts/meta.json` |
| Swap an image | replace the file (e.g. `ashley-galloway.png`) keeping the same name |
| Point the PM "Start a Project" button at the real form | `$PROJECT_REQUEST_FORM_URL` in `project-management.php` |

**Preview before deploying (PHP isn't installed locally):**
```
cd C:\Users\immav\Projects\mkai-site-php
node build-preview.mjs     # renders the .php pages to .html previews
node server.mjs            # view at http://localhost:8899
```

---

## 4. Deploy a change

1. Make + save your edits in `C:\Users\immav\Projects\mkai-site-php`.
2. Commit:  `git add -A && git commit -m "what changed"`
3. Push to live:  `git push origin master:production`
4. Wait ~20 seconds → it's live. (Verify with a hard refresh / incognito.)

**Or just tell Claude** "deploy the website" and it runs steps 2–4.

> Optional safety step for big changes: push to `php-rebuild` first, open a PR, review the diff, then push to `production`.

---

## 5. Roll back (the safety net)

The old React site and the new PHP site are both preserved. To restore the **previous live site**:

**Self-serve (Hostinger, ~1 min, no tech help):**
> Hostinger → Websites → mankindaitech.com → Advanced → GIT → `⋮` menu → change branch from `production` to `production-react-backup` → **Redeploy**.

**Or tell Claude** "roll back the website" → done in ~20s via:
`git push -f origin origin/production-react-backup:refs/heads/production`

**File copies (off-server):** `C:\Users\immav\Projects\mkai-backups\`
- `mankindaitech-REACT-backup-2026-06-04.zip` (old site)
- `mankindaitech-PHP-live-2026-06-04.zip` (new site)
- `HOW-TO-ROLL-BACK.txt`

**Deepest net:** Hostinger → Hosting → Backups (automatic daily snapshots).

---

## 6. The assessment form & the JotForm CSP rule (lesson learned)

The "AI Readiness Quiz" is a JotForm (`260828415226053`) embedded in a popup. It once appeared "stuck/broken on submit" — but **submissions were always landing**; only the post-submit confirmation screen was blocked by our Content Security Policy.

**RULE: any page embedding JotForm must allow ALL of these in the CSP `frame-src` AND `connect-src`:**
```
https://*.jotform.com  https://jotform.com  https://*.jotfor.ms
```
(Subdomains alone are not enough — desktop lands on a subdomain, but **mobile's post-submit uses the apex `jotform.com`**, and assets come from `jotfor.ms`. Missing any one = stuck-on-submit on some devices.)

The CSP lives in `includes/header.php`. The full working policy is already there — don't narrow it.

- Form edits (questions, thank-you page) are made in JotForm directly and go live instantly to every embed — no site deploy needed.
- A broken thank-you screen is a **trust/UX** problem, not data loss. Check the JotForm submission count to confirm leads are arriving.

---

## 7. Cheat sheet

```
LIVE branch ............ production            (Hostinger auto-deploys it)
ROLLBACK branch ........ production-react-backup
EDIT folder ............ C:\Users\immav\Projects\mkai-site-php
DEPLOY ................. git push origin master:production   (~20s to live)
ROLL BACK ............. switch Hostinger branch to production-react-backup + Redeploy
PREVIEW ............... node build-preview.mjs ; node server.mjs  (localhost:8899)
COLORS ................ top of assets/css/styles.css (:root)
NAV / FOOTER .......... includes/header.php / includes/footer.php
JotForm CSP ........... must allow *.jotform.com + jotform.com + *.jotfor.ms
```
