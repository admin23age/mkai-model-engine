# Plan — AI Snapshot Service Paywall (pay-first, free-first-5)

**Date:** 2026-05-23
**Business:** Mankind AI Tech (mankindaitech.com)
**Service gated:** AI Snapshot ($75)
**Processor:** Square (reuse existing n8n integration)

---

## Objective

Turn the AI Snapshot service from an open/free Calendly booking into a **conditional paywall**:

- **First 5 Snapshot clients** → free. They book the Calendly `ai-snapshot` session directly, no payment.
- **Client #6 onward** → must pay **$75 via Square** before they can book. On successful payment, the Calendly booking link is revealed.

Only AI Snapshot is gated in this plan. Discovery (free), Full Audit, Governance, Project Management, and Enterprise are unchanged.

## Architecture constraint (why n8n is the gate)

The site is a **static React/Vite SPA on Hostinger (Apache, no Node backend)**. It cannot know how many free Snapshots have been claimed — that count lives in the n8n MATS workflow / Airtable "Snapshot Counter." Therefore the gate logic **must run server-side in n8n**, and the site only redirects the browser to whatever URL n8n returns.

## ⚡ REVISED after Step 1 inspection (2026-05-23)

**The backend is already done.** `(MATS) contact us response` (`Qb4qZJzutjbJqKpr`) already implements:
- Snapshot counter + free-first-5 in `Determine Tier Price`: `<5` → $0 free; `5–9` → **$75**; `10+` → $150; full_audit → $550; +$100 governance add-on.
- `Square — Create Checkout` builds the payment link; its `redirect_url` already = the ai-snapshot Calendly URL (Option A already wired server-side).
- Webhook returns the contract: paid → `{success:true, action:"pay", url:<square link>}`; free/enterprise → `{success:true, action:"book"}` (no url).

**The gap is 100% frontend.** `src/pages/HomePage.jsx` submit handler (lines ~171-196) does `await fetch(...)` but **ignores the response**, then **unconditionally `window.open`s the free Calendly link** — bypassing the paywall for everyone. The direct AI Snapshot CTA buttons also deep-link to Calendly, a second bypass.

### Revised steps (supersede Steps 2–6 below for this task)
- **F1 — Honor the response.** Capture `const data = await res.json()`. If `data.action === "pay"` → `window.location.href = data.url` (Square checkout; it redirects to Calendly post-pay). If `data.action === "book"` → open the selected service's Calendly URL (current behavior). On fetch failure → show an error, do **not** fall through to free Calendly.
- **F2 — Close the direct bypass.** Any standalone "AI Snapshot" button that links straight to Calendly must route through the contact form/gate instead (audit cards at HomePage lines ~492, ~633, and pricing CTAs ~560+).
- **F3 — Build & deploy** (main → build → production worktree → push → Hostinger Deploy). Add Square domains to `index.html` CSP if checkout is loaded/redirected (`connect.squareup.com`, `*.squareup.com`, `square.link`).
- **F4 — Test** free path (counter <5 → Calendly) and paid path (counter ≥5 → Square → pay → Calendly).

### Known latent bug (flag, out of scope)
`Square — Create Checkout` `redirect_url` is hardcoded to the **ai-snapshot** Calendly. A Full Audit ($550) payer would be redirected to the *snapshot* booking page. Fine for this task (only Snapshot gated) — fix when Full Audit gets paywalled.

### Re: Square token blocker
The leaked token still *functions*, so it does **not** block the frontend fix. It remains a security cleanup to do (rotate + move to n8n credential) before heavy promotion.

---

## Target flow

1. Visitor clicks **Get AI Snapshot** → small name+email capture (modal) on the site.
2. Site `POST`s to an n8n gate webhook.
3. n8n reads the Snapshot Counter (Airtable `tblQmzMuVG0iVrWle` "Website Contact Form", field `Snapshot Counter`):
   - **count < 5 (free window):** create/lookup Zoho lead, increment counter, return `{ action: "book", url: <ai-snapshot Calendly URL> }`.
   - **count >= 5 (paid):** create a Square checkout for $75 (line item "AI Snapshot") with `redirect_url = https://www.mankindaitech.com/snapshot-confirmed`, return `{ action: "pay", url: <Square checkout URL> }`.
4. Site does `window.location = url` → either Calendly (free) or Square hosted checkout (paid).
5. On payment, Square redirects to **`/snapshot-confirmed`** — a new React route that reveals the `ai-snapshot` Calendly embed/link.
6. Square payment webhook → n8n → mark the Airtable record `Paid` + update Zoho deal stage (records who actually paid vs who only started checkout).

---

## Steps

### Step 0 — SECURITY PREREQUISITE (BLOCKER, do first)
- Rotate the **leaked live Square access token** currently hardcoded as `Bearer EAAAl6...` in the MATS workflow's `Square — Create Checkout` node.
- Create the new token as an **n8n Square credential**; replace the hardcoded header with the credential reference.
- **Do not build/charge on the live token until rotated.** (User action in Square dashboard + n8n.)

### Step 1 — Inspect live MATS workflow
- Pull `(MATS) contact us response` (`Qb4qZJzutjbJqKpr`) via n8n MCP.
- Confirm: Snapshot Counter field name/location, existing tier-pricing logic, current Square node config, and whether free-first-5 is already partially implemented in pricing.

### Step 2 — Build the gate in n8n
- Add a Snapshot-gate path (extend MATS or a dedicated `POST /webhook/snapshot-gate`) returning JSON `{ action, url }`.
- Free branch: increment Snapshot Counter atomically, create Zoho lead, return Calendly URL.
- Paid branch: Square **Create Checkout** with $75 line item + `redirect_url` → `/snapshot-confirmed`; return checkout URL.
- Enable CORS on the webhook response for `https://www.mankindaitech.com`.

### Step 3 — Frontend changes (`mankindaitech-site`, `main` branch)
- In `src/pages/HomePage.jsx`: replace the AI Snapshot CTA's direct Calendly link with a name+email capture → `POST` to gate webhook → redirect to returned `url`. Add `SNAPSHOT_GATE_WEBHOOK_URL` constant.
- Add a `/snapshot-confirmed` route + component that surfaces the `ai-snapshot` Calendly booking (reuse `CalendlyEmbed.jsx`).
- Update `index.html` CSP to allow Square checkout domains (`*.squareup.com`, `square.link`, `connect.squareup.com`) for script/frame/connect as needed.

### Step 4 — Payment confirmation loop
- Square `payment.updated` / order-completed webhook → n8n → set Airtable record `Paid = true` + Zoho deal stage. Confirms real payers.

### Step 5 — Build & deploy
- `npm run build` on `main` → copy `dist/.` into the `production` worktree → commit → push → user clicks **Deploy** in Hostinger hPanel.
- Remember: deploy `dist/` CONTENTS (index.html + assets/ + .htaccess), never `src/`.

### Step 6 — Test
- **Free path:** counter < 5 → redirects straight to Calendly, counter increments.
- **Paid path:** force counter >= 5 → redirects to Square checkout; pay (sandbox or $1 live test) → lands on `/snapshot-confirmed` → Calendly visible; Airtable marked Paid.

---

## Dependencies / data sources
- **Square:** rotated token in n8n credential; Create Checkout + payment webhook.
- **n8n:** MATS workflow `Qb4qZJzutjbJqKpr` (agegroup.app.n8n.cloud).
- **Airtable:** `appCdEGI61nC515lh` → `tblQmzMuVG0iVrWle` (Snapshot Counter, Paid, Zoho Lead ID).
- **Zoho CRM:** lead/deal create + stage update.
- **Calendly:** `mankindaitech-support/ai-snapshot`.
- **Site:** `admin23age/mkai-website` (`C:\Users\immav\Projects\mankindaitech-site`).

## Success criteria
- [ ] Square token rotated; no live secret hardcoded in n8n.
- [ ] First 5 Snapshot requests book free; counter increments correctly and atomically.
- [ ] Request #6+ is forced through $75 Square checkout before booking.
- [ ] Successful payment lands on `/snapshot-confirmed` with the Calendly booking revealed.
- [ ] Paid leads are recorded (Airtable `Paid` + Zoho stage), distinguishing payers from abandoned checkouts.

## Open decisions (confirm before/at Step 2)
1. ~~Post-pay UX~~ — **DECIDED (2026-05-23): Option A — reveal Calendly booking** on `/snapshot-confirmed`. Customer pays then books themselves, fully automatic.
2. **Counter source of truth:** single Airtable field vs Zoho — recommend Airtable `Snapshot Counter` (already exists).
3. **Test mode:** Square sandbox vs a real $1 live test before go-live.
4. Reuse existing `/webhook/mankind-ai-contact` vs dedicated `/webhook/snapshot-gate` (recommend dedicated for clean redirect semantics).
