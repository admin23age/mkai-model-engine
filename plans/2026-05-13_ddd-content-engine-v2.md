# DDD Content Engine v2 — Architecture & Agent Management Spec
**Date:** 2026-05-13
**Status:** Architecture locked; n8n Workflow C deployed (Kling/HeyGen scaffolds); Arcads as final media gen path; agent management spec drafted.

---

## TL;DR

DDD content pipeline is now four workflows with a Claude-orchestrated media generation layer powered by **Arcads** (single API for Seedance/Sora 2/Veo 3.1/Kling/Nano Banana). Replaces the per-tool HeyGen/Kling/Higgsfield exploration from earlier. Airtable schema extended with `Reference Image` + `Visual Theme` to feed the orchestrator. Outstanding: Arcads API key signup, agent rebuild in n8n, end-to-end test.

---

## Architecture

```
[Workflow 1 — Monthly Planner]  (existing: bIR3eY2eFpNXYxwy)
   • Scrapes IG competitors via Apify
   • Gemini 2.5 Pro drafts 30-day LIFT-pillar calendar
   • Writes briefs to DD Content Queue with status = Needs Media
       ↓
[Workflow 2 — Media Generator]  via Claude routine + arcads-external-api skill
   • Reads record (Title, Pillar, Content Brief, Visual Theme, Reference Image)
   • Picks best Arcads model per content type:
     - Faith / contemplative → Veo 3.1 (cinematic)
     - Identity / confident → Sora 2 (editorial)
     - Legacy / heritage → Kling 3.0 (warm)
     - Tomorrow / aspirational → Seedance 2.0
   • Invokes arcads-external-api skill (HTTP Basic auth, polling)
   • Uploads result to Google Drive /mockups/
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

**Audience targeting (updated):** Men, women, and kids — LIFT collection serves the whole faith-led family across generations. Monthly Planner prompt updated to distribute briefs across all four audience segments instead of skewing female-only.

**Daily volume:** 1 post/day target (~30/month) to align with conservative Arcads budget. Can scale to 2x once budget validated.

---

## Tooling Decisions Made This Session

| Question | Decision | Why |
|---|---|---|
| Video gen tool | **Arcads (multi-model API)** via cowork skill | Consolidates Kling/Veo/Sora/Seedance into one API; matches DDD aesthetic flexibility better than single-model approach |
| HeyGen as backup | **Dropped** — kept on Free tier (no API) | Avatar-narrated didn't fit luxury fashion aesthetic + per-call cost was unpredictable |
| Kling direct API | **Dropped** | Resource pack juggling + daily limits on Standard plan |
| Higgsfield subscription | **Dropped** | Arcads gives access to same models via one credential |
| Veo via Gemini | **Dropped as standalone** | Accuracy concerns; usable through Arcads as one of many model options |
| Canva manual | **Dropped** | Defeated automation goal |
| Auth pattern | API key (HTTP Basic via `ARCADS_API_KEY` / `ARCADS_BASIC_AUTH`) | Simpler than JWT |

---

## Airtable Schema Changes

**Base:** `appr0OjO1x803LE3z` (Social Media Planner)
**Table:** `DD Content Queue` (`tblQ9hxifG4Y3Uech`)

Fields added this session:

| Field | Type | Field ID | Purpose |
|---|---|---|---|
| Reference Image | Attachment | `fldKfdXpp0um2TGXb` | Optional visual reference for Arcads to match aesthetic/composition |
| Visual Theme | Long text | `fldvHfWlf0OPpMRL8` | Optional text description of desired aesthetic — used alongside or instead of Reference Image |

**Content Status state machine (unchanged):**
- `Needs Media` (red) — Monthly Planner output; triggers Workflow 2
- `Generate Content` (blue) — Media exists; triggers Workflow 3
- `Caption Ready` (yellow) — Captions written; Slack approval pending
- `Ready to Post` (green) — Approved; Workflow 4 publishing
- `Posted` (gray) — Live on platforms

---

## n8n Workflow C (Media Generator Scaffold)

**ID:** `X1kDAxH1uZaVHdX4`
**Name:** `DDD Content Engine — Workflow C: Media Generator (Kling)`
**URL:** https://agegroup.app.n8n.cloud/workflow/X1kDAxH1uZaVHdX4

**Status:** Built but **superseded** by the Claude+Arcads orchestration path. Keep as backup or delete.

Original purpose: webhook-triggered video generation via Kling API. Replaced because Arcads via Claude routine is more flexible (model routing, reference image handling, quality gates).

**Decision pending:** delete Workflow C from n8n once Claude+Arcads orchestration is validated end-to-end.

---

## Agent Management Spec — MKAI Marketing Agent

**Existing n8n agent:** `MKAI Marketing Agent` (`jhnUF1wRfciai6qg`, currently inactive)
**Current state:** Stub workflow with Classify → Process → Respond nodes returning placeholder messages.
**Target state:** Real management agent for DDD content workflow.

### Responsibilities

**Daily routine (8AM ET):**
1. Scan `DD Content Queue` for current state — counts by status, oldest record per status
2. Identify stuck records:
   - `Needs Media` older than 24 hours → likely Arcads/Workflow 2 failure
   - `Caption Ready` older than 12 hours → unactioned Slack approval
   - `Ready to Post` older than 6 hours → publish failure
3. Take action:
   - Stuck `Needs Media` → retrigger Workflow 2 (HTTP POST to webhook) OR alert ops
   - Stuck `Caption Ready` → post Slack reminder to #content-approvals
   - Stuck `Ready to Post` → check execution log, alert ops with Workflow B error
4. Daily summary to Slack ops channel:
   - Posts published yesterday + which platforms
   - Posts in queue per status
   - Arcads credit balance (when API exposes it)
   - Action items requiring human input

**Per-record triggers (webhook):**
- Receive notifications from Workflow A/B/C completion or failure
- Update agent's own run log (Airtable or memory bank)
- Route failures appropriately

**Strategic (weekly):**
- Pull engagement metrics per post (Workflow B should write these back)
- Identify top vs bottom performing pillars
- Suggest tweaks for next Monthly Planner run
- Append run report to `memory-bank/ddd/{pillar}.md`

### Tools the agent needs

| Tool | Purpose |
|---|---|
| Airtable read | Query `DD Content Queue` with status filters |
| Airtable update | Adjust status, write retry notes |
| HTTP Request | Trigger Workflow 2/3/4 webhooks for retries |
| Slack message | Daily summaries + ad-hoc alerts |
| (Future) Engagement API | Pull LinkedIn/IG/TikTok metrics for posts |

### Rebuild plan (deferred to next session)

1. Open MKAI Marketing Agent in n8n UI
2. Replace `Process` stub with branching logic:
   - On `Daily 8AM DDD` schedule → run DDD content ops routine
   - On `Daily 9AM MKAI` → run MKAI brand routine (separate; placeholder until MKAI table exists)
   - On webhook → handle per-record events from Workflows A/B/C
3. Add nodes:
   - Airtable List (filter: Content Status in [Needs Media, Caption Ready, Ready to Post])
   - Code: classify stuck records by age + status
   - HTTP for retries
   - Slack post for summary
4. Test with a manually-stuck record before activating
5. Activate the daily 8AM schedule

---

## Outstanding to Ship End-to-End

### Blocking
1. **Arcads signup** — https://arcads.ai/?via=caleb → API key → `.env` → `./scripts/setup.sh`
2. **Claude routine** — `/schedule` an hourly polling routine that invokes `arcads-external-api` skill for any `Needs Media` records
3. **Monthly Planner UI edits:**
   - Reassign Apify/Gemini/Airtable creds (stripped in last SDK push)
   - Update Gemini prompt: audience = men/women/kids, distribution 40% women / 35% men / 15% kids / 10% multi-gen
   - Reduce totalPosts to `dates.length` (1/day) if budget requires
   - Change `Content Status` default from `Generate Content` → `Needs Media` in `Create Airtable Records` node
4. **Airtable Automation #1 (`Needs Media` → Workflow C webhook)** — only needed if keeping the n8n Workflow C as backup. Skip if going pure Claude routine.
5. **Airtable Automation #2 (`Generate Content` → `/webhook/content-generate`)** — confirms Workflow A trigger; build per the SOP if not already present.

### Non-blocking
- MKAI Marketing Agent rebuild (spec above)
- Workflow B: Instagram Graph API placeholder + Blotato API key
- Workflow A: GitHub auth fix (memory bank logging path)
- Pillar field cleanup in Airtable (delete 6 legacy options, keep LIFT only)
- Legacy `Posts` and `Content Calendar` table cleanup

---

## Files Touched This Session

- `plans/2026-05-13_ddd-content-engine-v2.md` (this file)
- `context/session-handoff.md` (updated below)
- n8n Workflow C (`X1kDAxH1uZaVHdX4`) — rebuilt 3 times during exploration; final state: Kling API scaffold (superseded by Arcads path)
- Airtable `DD Content Queue` — added `Reference Image` + `Visual Theme` fields

## References

- arcads-external-api skill: `.claude/skills/arcads-external-api/SKILL.md` (in github setup repo)
- MKAI Marketing Agent: n8n workflow `jhnUF1wRfciai6qg`
- DDD Brand Guide: `context/dd-brand-guide.md`
- LIFT pillars: `memory-bank/ddd/{faith,identity,legacy,tomorrow}.md`
- Earlier handoff: `plans/2026-05-11_content-engine-handoff.md`
