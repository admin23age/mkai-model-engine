# Social Content Engine — Dual Sign-off Gates (Mei + Owner)

**Date:** 2026-05-24
**Status:** IN PROGRESS — Router v2 built (inactive). Workflow A & C edits + cutover remain.
**Scope:** DDD + MKAI social pipeline. Add owner co-sign during first 90 days (~sunset 2026-08-22).

---

## Design (agreed)

- **No concept gate.** Owner manages the 30-day calendar manually with Mei (holidays/events/audience). Planner `DD 01` unchanged.
- **Gate 1 — Copy + Prompt:** dual sign-off (Mei + Owner, ANY order). Both ✅ → status `Ready to Generate` (fires media). Either reject → `Generate Content` (regenerate), flags cleared.
- **Gate 2 — Media:** dual sign-off on rendered video. Both ✅ → `Ready to Post`. Either reject → `Ready to Generate` (re-render), flags cleared.
- **After 90 days:** drop Owner co-sign; Mei approval advances directly.
- **Prompt fix:** Workflow C must USE the approved `Visual Prompt` field (today it rebuilds its own and ignores it). Workflow A must write a detailed, audience-tailored visual prompt.

## CRITICAL: two separate Airtable bases (one per brand)

| Brand | Base | Content Queue table |
|---|---|---|
| **DDD** | `appr0OjO1x803LE3z` (Social Media Planner) | `tblQ9hxifG4Y3Uech` (DD Content Queue) |
| **MKAI** | `app3AQ14VJHqlkoVG` (MKAI Social Media) | `tblUkPs0T6wTtLbaT` (MKAI Content Queue) |

**BUG in live engine:** Workflow A (`34W5VGQAt03NZyOS`), live Workflow B (`xnrc51p90Z6AinUu`), and Workflow C (`X1kDAxH1uZaVHdX4`) all **hardcode base `appr0OjO1x803LE3z`** and only switch the *table* (MKAI → `tblMyGWOlqercgwVV` inside the DDD base). So MKAI content is misrouted to the wrong base. Must fix base-switching in A/B/C too.

**Orphaned:** 4 checkbox fields were mistakenly created in `appr0OjO1x803LE3z/tblMyGWOlqercgwVV` (the misrouting artifact). Harmless/additive; ignore or delete later.

## Tracking fields created (checkboxes)

DDD `tblQ9hxifG4Y3Uech`: Copy Approved Mei `fldvFmMfZmpjPPtAf`, Copy Approved Owner `fldt7EzhZqay6TBXS`, Media Approved Mei `fldcAD8L0QHlEeuPg`, Media Approved Owner `fldhkCeaOCpuUohyN`
MKAI `tblUkPs0T6wTtLbaT`: Copy Approved Mei `fldcBFlVyoW1s4GVu`, Copy Approved Owner `fldIDJ61TrOUVqrtR`, Media Approved Mei `fldRmzHszaxYnTsGw`, Media Approved Owner `fld4UQFdoKTV5lGQF`

## Workflows

- **NEW — Approval Router v2 (Dual Sign-off)** `oiQnYlvmT06tRctH` — INACTIVE, temp webhook `/content-approve-v2`. 27 nodes. Brand-routes base+table. Actions: `mei_approve_copy`, `owner_approve_copy`, `reject_copy`, `mei_approve_media`, `owner_approve_media`, `reject_media`. Replaces live B at cutover.
- **NEW — Workflow A v2 (Generator + Dual-Gate Card)** `CROUAAn3CO6zQyBr` — INACTIVE, temp webhook `/content-generate-v2`. 15 nodes. Brand-routes base+table (MKAI fix). Announcement mode (skips pillar tone). Detailed audience-tailored visual_prompt. Sets status `Copy Review`. Posts Copy card w/ buttons mei_approve_copy/owner_approve_copy/reject_copy. Memory-bank fetch dropped in clone (re-add at cutover if wanted). Anthropic model `claude-sonnet-4-6`.
- Slack channel for cards: `C0B2ZKMKWN7`.
- Credentials (auto-bound): Airtable `Airtable Personal Access Token account`, Slack `Slack OAuth2 API`, Anthropic `Anthropic account`.

## Slack interactivity URL (cutover-critical)

Slack interactive buttons post to ONE app-level "Interactivity Request URL", not per-button. It currently points at the live Workflow B webhook (`/content-approve`). To TEST v2: temporarily point it at `/content-approve-v2`. At CUTOVER: either repoint the Slack app URL to `/content-approve-v2`, or rename the v2 webhook path to `/content-approve` after deactivating live B.

## Remaining work

1. ✅ **Workflow A v2** — built (`CROUAAn3CO6zQyBr`).
2. **Workflow C v2** — read approved `Visual Prompt` field; brand-route base+table; after render set `Media Review` + post Media card (mei_approve_media/owner_approve_media/reject_media). (Skip for image-only posts.)
3. **Test** router v2 + A v2 on a temp record; confirm both-flag advance + reject.
4. **Cutover** — repoint card webhooks + Slack interactivity URL to v2; set planner/automation to call `/content-generate-v2`; deactivate live A/B; activate v2.
5. **90-day sunset** — remove Owner co-sign requirement (~2026-08-22).

## First post queued (MKAI launch announcement)

"We Are LIVE — Your Human ALLY in the AI Revolution". Announcement (no pillar). Platforms: LinkedIn + TikTok now, IG pending account creation. CTA: https://calendly.com/mankindaitech-support/ai-snapshot + mankindaitech.com. Static graphic (skip video gen) — user attaches PNG to record's Reference Image. Needs: image attached + slot/date.

## Client template / future clients

DDD + MKAI share credentials → one brand-aware engine serves both. External clients with their OWN Slack/Airtable → clone from `Client Template` folder (`OTUFknAYqzaUq11k` / Agents `rgOLrxPC2dEZoQsP`) with their own credentials.
