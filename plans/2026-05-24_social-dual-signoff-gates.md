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
- Slack channel for cards: `C0B2ZKMKWN7`.
- Credentials (auto-bound): Airtable `Airtable Personal Access Token account`, Slack `Slack OAuth2 API`.

## Remaining work

1. **Workflow A edit** — Copy review card with 3 buttons (mei_approve_copy/owner_approve_copy/reject_copy), set status `Copy Review`, write detailed audience-tailored visual prompt. Fix base-switch for MKAI. Drop brief gate.
2. **Workflow C edit** — read approved `Visual Prompt` field; after render set `Media Review` + post Media card (mei_approve_media/owner_approve_media/reject_media). Fix base-switch for MKAI.
3. **Test** router v2 on a temp record (Slack button payloads), confirm both-flag advance + reject.
4. **Cutover** — point card buttons at `/content-approve-v2`, deactivate live B (`xnrc51p90Z6AinUu`), repoint v2 webhook to `/content-approve`, activate.
5. **90-day sunset** — remove Owner co-sign requirement (~2026-08-22).

## Client template / future clients

DDD + MKAI share credentials → one brand-aware engine serves both. External clients with their OWN Slack/Airtable → clone from `Client Template` folder (`OTUFknAYqzaUq11k` / Agents `rgOLrxPC2dEZoQsP`) with their own credentials.
