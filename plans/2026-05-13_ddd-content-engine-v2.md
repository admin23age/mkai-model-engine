# DDD Content Engine v2 — Architecture & Agent Management Spec
**Date:** 2026-05-13 (media gen tool finalized 2026-05-16)
**Status:** Architecture locked. Media generation: **Higgsfield (FINAL)**. n8n Workflow C scaffold deployed. Agent management spec drafted.

---

## TL;DR

DDD content pipeline is four workflows with a Claude-orchestrated media generation layer powered by **Higgsfield** (Business plan; Cloud API at cloud.higgsfield.ai; access to Kling/Veo/Sora/Seedance + Higgsfield motion presets). This is the FINAL media gen decision — supersedes the earlier HeyGen/Kling/Higgsfield/Arcads/fal.ai exploration. Airtable schema extended with `Reference Image` + `Visual Theme` to feed the orchestrator. Outstanding: Higgsfield Business signup + API key, agent rebuild in n8n, end-to-end test.

---

## Architecture

```
[Workflow 1 — Monthly Planner]  (existing: bIR3eY2eFpNXYxwy)
   • Scrapes IG competitors via Apify
   • Gemini 2.5 Pro drafts 30-day LIFT-pillar calendar
   • Writes briefs to DD Content Queue with status = Needs Media
       ↓
[Workflow 2 — Media Generator]  via Claude routine + Higgsfield Cloud API
   • Reads record (Title, Pillar, Content Brief, Visual Theme, Reference Image)
   • Picks best Higgsfield model per content type:
     - Faith / contemplative → Veo 3.1 (cinematic)
     - Identity / confident → Sora 2 (editorial)
     - Legacy / heritage → Kling 3.0 (warm)
     - Tomorrow / aspirational → Seedance 2.0
   • Calls Higgsfield Cloud API (Bearer token auth, async poll)
   • Uploads result to Google Drive — Dorothy Dean folder
   • Updates Airtable: Media URL + status = Generate Content
       ↓
[Workflow 3 — Caption Generator]  (existing: 8mmfbyucp1sBnhHg, Workflow A)
   • Airtable Automation fires on Generate Content → POST /webhook/content-generate
   • Gemini writes LIFT-pillar-aware captions per platform
   • Slack approval card posted to #content-approvals
   • Status → Caption Ready
       ↓
[Workflow 4 — Publisher]  (existing: xnrc51p90Z6AinUu, Workflow B)
   • Slack Approve → publishes LinkedIn (UGC API), Instagram (Graph), TikTok (Blotato)
   • Slack Reject → status back to Generate Content (regenerate loop)
   • Status → Posted on success
```

**Audience targeting:** Men, women, and kids — LIFT collection serves the whole faith-led family across generations. Monthly Planner prompt distributes briefs across all four audience segments.

**Daily volume:** 1 post/day target (~30/month) initial; scale once Higgsfield credit usage validated.

---

## Media Generation — Higgsfield (FINAL)

| Item | Value |
|---|---|
| Platform | Higgsfield — https://higgsfield.ai |
| Plan | Business package |
| API | Higgsfield Cloud API — https://cloud.higgsfield.ai |
| Auth | Bearer token — `Authorization: Bearer {API_KEY}` |
| API key | Issued in Higgsfield Cloud dashboard → API section |
| Pattern | POST generation request → returns job/request ID → poll status → fetch video URL |
| Models | Higgsfield motion-preset models + Kling 3.0 / Veo 3.1 / Sora 2 / Seedance via the platform |
| Credits | Business plan credit pool; ~6 credits per Kling clip, 40-70 per Veo/Sora; credits expire 90 days |
| Output dimension | 9:16 vertical for TikTok/IG Reels |

**Why Higgsfield (final decision):** Single API for all major models, motion-preset library fits DDD luxury streetwear aesthetic, Business plan consolidates the video stack, API access included in subscription (no separate resource packages).

---

## Decision Trail (do NOT relitigate)

| Option | Rejected because |
|---|---|
| HeyGen pay-per-call | Cost unpredictability; avatar didn't fit luxury fashion brand; Free tier has no API |
| Kling Standard direct | Resource pack juggling; daily generation limits |
| Veo standalone | Accuracy concerns; available within Higgsfield as one model option |
| Canva manual | Defeats automation goal |
| Arcads | Considered, skill installed, then dropped — Higgsfield chosen instead |
| fal.ai | Briefly considered, then dropped |
| **Higgsfield** | **FINAL — 2026-05-16** |

---

## Airtable Schema Changes

**Base:** `appr0OjO1x803LE3z` (Social Media Planner)
**Table:** `DD Content Queue` (`tblQ9hxifG4Y3Uech`)

Fields added:

| Field | Type | Field ID | Purpose |
|---|---|---|---|
| Reference Image | Attachment | `fldKfdXpp0um2TGXb` | Optional visual reference for Higgsfield to match aesthetic/composition |
| Visual Theme | Long text | `fldvHfWlf0OPpMRL8` | Optional text description of desired aesthetic |

**Content Status state machine:**
- `Needs Media` (red) — Monthly Planner output; triggers Workflow 2
- `Generate Content` (blue) — Media exists; triggers Workflow 3
- `Caption Ready` (yellow) — Captions written; Slack approval pending
- `Ready to Post` (green) — Approved; Workflow 4 publishing
- `Posted` (gray) — Live on platforms

---

## Config Values

| Key | Value |
|---|---|
| `DRIVE_OUTPUT_FOLDER_ID` (DDD) | `17f9pdrIKIdA76F72PbhCjVWzod6d94Qn` (Dorothy Dean Drive folder) |
| MKAI Drive folder | `1cvVoBSs0wI_JGHA0FXPI8wigib91Ly3m` |
| Higgsfield API key | TBD — issue in cloud.higgsfield.ai dashboard, store in `.env` |

---

## n8n Workflow C (Media Generator Scaffold)

**ID:** `X1kDAxH1uZaVHdX4`
**URL:** https://agegroup.app.n8n.cloud/workflow/X1kDAxH1uZaVHdX4

**Status:** Scaffold built (10 nodes: webhook → get record → build prompt → generate → wait → poll → extract URL → download → Drive → update Airtable). Built against Kling API shape during exploration — **needs rewiring to Higgsfield Cloud API endpoints** OR replacement by the Claude routine path.

**Decision pending:** rewire Workflow C to Higgsfield, or run media gen purely through a Claude routine and delete Workflow C.

---

## Agent Management Spec — MKAI Marketing Agent

**Existing n8n agent:** `MKAI Marketing Agent` (`jhnUF1wRfciai6qg`, currently inactive)
**Current state:** Stub workflow — Classify → Process → Respond returning placeholder messages.
**Target state:** Real management agent for the DDD content workflow.

### Responsibilities

**Daily routine (8AM ET):**
1. Scan `DD Content Queue` — counts by status, oldest record per status
2. Identify stuck records:
   - `Needs Media` >24h → likely Higgsfield/Workflow 2 failure
   - `Caption Ready` >12h → unactioned Slack approval
   - `Ready to Post` >6h → publish failure
3. Take action:
   - Stuck `Needs Media` → retrigger Workflow 2 OR alert ops
   - Stuck `Caption Ready` → Slack reminder to #content-approvals
   - Stuck `Ready to Post` → check execution log, alert ops with error
4. Daily Slack summary: posts published, queue counts, Higgsfield credit balance, action items

**Per-record triggers (webhook):** receive completion/failure events from Workflows A/B/C, update run log, route failures.

**Strategic (weekly):** pull engagement metrics, identify top/bottom pillars, suggest Monthly Planner tweaks, append run report to `memory-bank/ddd/{pillar}.md`.

### Tools the agent needs

| Tool | Purpose |
|---|---|
| Airtable read | Query `DD Content Queue` with status filters |
| Airtable update | Adjust status, write retry notes |
| HTTP Request | Trigger Workflow 2/3/4 webhooks for retries |
| Slack message | Daily summaries + alerts |
| (Future) Engagement API | Pull LinkedIn/IG/TikTok metrics |

### Rebuild plan (deferred to next session)

1. Open MKAI Marketing Agent in n8n
2. Replace `Process` stub with branching: Daily 8AM DDD routine / Daily 9AM MKAI / webhook per-record events
3. Add nodes: Airtable List (filter on stuck statuses), Code (classify by age), HTTP (retries), Slack (summary)
4. Test with a manually-stuck record before activating
5. Activate the daily 8AM schedule

---

## Outstanding to Ship End-to-End

### Blocking
1. **Higgsfield Business signup** → API key → `.env` → confirm Cloud API endpoints from dashboard
2. **Workflow C rewire** to Higgsfield Cloud API endpoints (or replace with Claude routine)
3. **Claude routine** — `/schedule` an hourly routine to process `Needs Media` records via Higgsfield
4. **Monthly Planner UI edits:**
   - Reassign Apify/Gemini/Airtable creds (stripped in last SDK push)
   - Update Gemini prompt: audience = men/women/kids, distribution 40% women / 35% men / 15% kids / 10% multi-gen
   - Reduce totalPosts to `dates.length` (1/day) if budget requires
   - Change `Content Status` default `Generate Content` → `Needs Media` in `Create Airtable Records`
5. **Airtable Automation #1** (`Needs Media` → Workflow C webhook) — if keeping n8n Workflow C
6. **Airtable Automation #2** (`Generate Content` → `/webhook/content-generate`) — confirms Workflow A trigger

### Non-blocking
- MKAI Marketing Agent rebuild (spec above)
- Workflow B: Instagram Graph API placeholder + Blotato API key
- Workflow A: GitHub auth fix (memory bank logging)
- Pillar field cleanup in Airtable (delete 6 legacy options)
- Legacy `Posts` / `Content Calendar` table cleanup

---

## Deployment / Environment

- **Production runtime:** n8n Cloud (`agegroup.app.n8n.cloud`) + Anthropic Cloud (Claude routines). Oracle VM is provisioned but NOT a runtime — stack (Docker, n8n, Security List ports, Twingate Connector) still to install.
- **Timezone:** Eastern Time (EDT/EST). All cron schedules written in UTC.

## References

- Higgsfield Cloud API: https://cloud.higgsfield.ai
- MKAI Marketing Agent: n8n workflow `jhnUF1wRfciai6qg`
- DDD Brand Guide: `context/dd-brand-guide.md`
- LIFT pillars: `memory-bank/ddd/{faith,identity,legacy,tomorrow}.md`
- Earlier handoff: `plans/2026-05-11_content-engine-handoff.md`
