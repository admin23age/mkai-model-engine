# Natalie Chatbot — Engage-Live Upgrade + Reliable Lead Capture

**Date:** 2026-06-04
**Owner agents:** Natalie Nair (front-line supervisor) → hands sales leads to Mateo Silva (sales)
**Status:** PLAN — Step 1 already shipped; Step 2 requires explicit approval (touches the LIVE website).
**Workflows:** MKAI Supervisor `FZJQhZaT81gLwiMP` (Natalie) · MKAI Sales Agent `moIWsyobqqRVaVLR` (Mateo bridge)
**Related memory:** `[[mkai-chatbot-lead-routing-handoff]]`, `[[mkai-website-platform]]`

---

## Objective

Make Natalie (the mankindaitech.com chat widget) **engage the visitor live while we have their
attention** — answer their question, recommend a tier, and drive them to book a call now or start
the assessment — instead of capturing details and signing off with "we'll call you." Also capture
the **phone number** reliably. All leads continue routing into the MATS pipeline (Zoho lead +
Airtable + owner alert) with Mateo as the sales owner.

---

## Background — what's already true (Step 1, DONE 2026-06-04)

- **Bug found:** Natalie's "Submit Sales Lead" tool POSTed to `/webhook/mkai-sales`, a dead stub
  that (a) did nothing and (b) actually threw 500s ("Unused Respond to Webhook node"). With the
  tool set to `onError: continueRegularOutput`, Natalie still told visitors "I've passed your
  details along" — so every chat lead was silently lost. Confirmed: test lead created no Zoho lead.
- **Fix shipped:** Rebuilt `moIWsyobqqRVaVLR` (Mateo) into a 3-node bridge —
  Webhook → Code "Normalize for MATS" → HTTP "Forward to MATS Pipeline" (`/webhook/mankind-ai-contact`).
  Verified end-to-end: Zoho lead `7325239000000923015` created + owner alert emailed. No website
  change was needed (path-based webhook). Sonya Harris test lead recovered.

**Result:** leads are no longer dropped. What remains is the *experience* (engage live) and reliable
phone capture — both of which live inside Natalie's own workflow.

---

## ⚠️ The blocking risk (read before approving)

Step 2 edits the **MKAI Supervisor** workflow. The n8n Workflow SDK **cannot pin a chatTrigger's
`webhookId`**, so regenerating the workflow **rotates the chat webhook ID** (currently
`f28923c0-87e1-448d-98d8-9cfcb9822faf`). The live widget will break until:

1. `ChatbotWidget.jsx` (repo **admin23age/mkai-website**) is updated with the new webhook ID,
2. the React app is rebuilt, and
3. the build is redeployed to Hostinger (production branch, ~20s auto-deploy).

This is an outward-facing, hard-to-reverse change. **Do not start Step 2 until approved**, and plan
to do steps 1–3 above back-to-back to minimize live downtime.

---

## Steps

### A. Rewrite Natalie's system prompt (engage-live)
Replace the "capture → we'll call you → wrap up" flow with:
1. Greet + discover intent (unchanged).
2. Capture name + **phone** + email (required before deep engagement).
3. Fire the lead tool **silently in the background** (no "we'll call you" sign-off).
4. **Stay in the conversation as the hand-off to Mateo:** answer the visitor's actual question
   (e.g. project management → AI-driven workflow automation), recommend the right tier from the
   pricing table, and drive a *now* action — **book via Calendly**
   (`https://calendly.com/mankindaitech-support/ai-snapshot`) or **start the AI assessment**.
5. Only wrap up once the visitor disengages.

### B. Add a real phone field to the lead tool
The "Submit Sales Lead" tool currently sends `{name, email, company, message, source}` — **no phone**.
Add a `phone` placeholder + field so phone is always passed (today it only survives if it happens to
appear in the message text; the Mateo bridge extracts digits as a fallback).

### C. (Optional, per standing preference) Move the structured handoff to Claude
The lead-handoff is a structured/tool step; user preference is Claude for those, Gemini for prose.
Either swap the model node to Claude, or keep Gemini for chat and ensure the tool call is robust.
Decision below.

### D. Routing
Keep posting to `/webhook/mkai-sales` (the now-working Mateo bridge) — no need to change the URL,
which keeps the bridge as the single sales entry point. (Alternative: point Natalie straight at
`/webhook/mankind-ai-contact` and retire the bridge. Decision below.)

### E. Webhook ID + redeploy (the live-site step)
After updating the Supervisor, re-fetch it, read the new chatTrigger `webhookId`, update
`ChatbotWidget.jsx`, rebuild, and redeploy to Hostinger. Verify the live widget connects and a test
chat lead lands in Zoho.

---

## Data sources

| System | Use | Access |
|---|---|---|
| n8n | Supervisor + Mateo bridge + MATS pipeline | `mcp__5ec9614f` (`agegroup.app.n8n.cloud`) |
| Zoho CRM | Lead create (via MATS) | `mcp__3e401231` |
| Airtable | Lead log + chat log | `mcp__d5784726` |
| Website repo | `ChatbotWidget.jsx` + Hostinger deploy | admin23age/mkai-website (separate repo) |

---

## Open decisions (resolve before build)

1. **Model:** keep Gemini, or switch the agent to Claude for the structured handoff? (Step C)
2. **Routing:** keep the Mateo bridge (`/webhook/mkai-sales`), or repoint Natalie directly to
   `/webhook/mankind-ai-contact` and retire the bridge? (Step D)
3. **Deploy ownership:** do I perform the `ChatbotWidget.jsx` update + Hostinger redeploy, or stage
   the changes and hand them off for you to ship?
4. **Service framing:** how to position "project management" requests — as AI workflow automation /
   multi-agent ops? Confirm the messaging so Natalie doesn't over-promise a generic PM service.

---

## Success criteria

- A visitor asking about services is engaged with a real answer + a next action (book / assess),
  not a dead-end "we'll call you."
- Every qualified chat lead creates a Zoho lead **with phone populated** + Airtable row + owner alert.
- The live mankindaitech.com widget connects to the new webhook ID with zero lingering downtime.
- No silent-success-on-failure: a failed handoff is visible (execution log / owner alert), not hidden.

## Rollback

- Supervisor: re-publish the prior version (n8n keeps version history) and restore the old
  `ChatbotWidget.jsx` webhook ID + redeploy.
- Mateo bridge: prior stub is retained in version history (not recommended — it was broken).
