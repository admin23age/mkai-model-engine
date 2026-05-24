# Mateo Silva — Outbound Prospecting Workflow

**Date:** 2026-05-24
**Owner agent:** Mateo Silva (Sales Development Rep, reports to Natalie Nair)
**Status:** PLAN — not yet built. Requires explicit approval before any live n8n build.
**Registry ref:** `context/mkai-agent-workflow-registry.md` → Phase 2 gap #1

---

## Objective

Build the one remaining net-new workflow in the org chart: an **outbound** prospecting
pipeline that actively *sources* new leads (vs. the existing inbound/chat capture). It
discovers prospects, enriches them, writes them into Zoho CRM + Airtable, and starts a
sequenced outreach — all under Natalie's sales supervision.

This is the only Phase 2 build remaining. The Mei (social) and Aris (grant) clusters are
closed as managed-by-reuse; no builds pending there.

---

## Pipeline design (node-by-node)

1. **Trigger** — Scheduled (e.g. daily 8AM ET) + manual trigger for ad-hoc runs.
2. **Lead discovery** — Source prospects from a target-criteria definition (ICP: industry,
   geo, company size). Candidate sources: Apify actor (e.g. Google Maps / LinkedIn / directory
   scrape) via MCP, or an uploaded seed list in Airtable. *Decision needed: which source.*
3. **Dedupe** — Check Zoho CRM + Airtable for existing contact (match on email/domain) before
   creating anything. Skip known leads.
4. **Enrich** — Fill missing firmographic/contact fields (email, role, company). *Decision
   needed: enrichment provider or LLM-based inference.*
5. **Lead scoring** — Reuse the MATS scoring convention for consistency
   (enterprise 90 / full_audit 75 / paid 60 / else 40, +10 governance; high ≥ 70).
6. **Write to Zoho CRM** — `Create a lead` (mcp `mcp__3e401231`), capture returned Zoho Lead ID.
7. **Log to Airtable** — Write to "Website Contact Form" table `tblQmzMuVG0iVrWle` in base
   `appCdEGI61nC515lh`, OR a new "Outbound Prospects" table (decision below), storing Zoho Lead
   ID, score, source, and outreach status.
8. **Outreach sequence** — Draft + send personalized cold email via Gmail (`mcp__990e4ab0`).
   Multi-touch follow-up cadence tracked via an Airtable status field. Start as **drafts for
   human review**, not auto-send, until trust is established.
9. **Owner alert / handoff** — Notify Natalie (supervisor) on high-score leads (≥ 70) for
   personal follow-up.

---

## Data sources

| System | Use | MCP |
|---|---|---|
| Apify (or seed list) | Lead discovery | `mcp__Apify` |
| Zoho CRM | Lead create + dedupe | `mcp__3e401231` |
| Airtable | Prospect log + outreach status | `mcp__d5784726` (base `appCdEGI61nC515lh`) |
| Gmail | Outbound email + follow-ups | `mcp__990e4ab0` |

---

## Open decisions (resolve before build)

1. **Lead source:** scraper actor vs. uploaded seed list vs. both.
2. **Enrichment:** dedicated provider vs. LLM inference vs. skip (use only discovered fields).
3. **Airtable target:** reuse "Website Contact Form" table, or create a dedicated
   "Outbound Prospects" table (recommended — keeps inbound vs. outbound clean).
4. **Auto-send vs. draft-only:** recommend draft-only for first iteration (cold outbound +
   deliverability risk). Per Operating Principle #4, sending live email needs explicit approval.
5. **LLM for copy:** per `feedback_llm_gemini` memory — Gemini for prose (email body), Claude
   for any structured-JSON node.

---

## Success criteria

- Workflow runs end-to-end on a test seed of ~5 prospects without errors.
- No duplicate leads created (dedupe verified against Zoho + Airtable).
- Each prospect lands in Zoho with a captured Lead ID and a matching Airtable row with score.
- Outreach emails generated as **drafts** (or sent, only if explicitly approved) and logged.
- High-score leads alert Natalie.
- Workflow registered under Mateo in `mkai-agent-workflow-registry.md` with its new ID.

---

## Out of scope

- Twilio AI voice outbound (separate future idea).
- Auto-send without review (gated behind explicit approval).
- Any change to the Mei/Aris clusters (closed).
