# Website Manager Agent — Build & SEO (Placeholder)

## Agent Identity
- **Name:** Website Manager Agent (function-named — no persona)
- **Role:** Website Build & SEO Agent
- **Tier / Function:** Tier 2 — Web Worker
- **Status:** ⚠️ OPEN role — not yet filled/built (platform TBD; no n8n workflow yet)
- **Reports to:** Mei-Ling Vance (Marketing Manager)
- **Direct reports:** none
- **Memory Bank:** model-engine/memory-bank/agents/website-manager-agent.md
- **Canonical org:** `mkai-engine/memory-bank/mkai/org-hierarchy.md`
- **Spec source:** MKAI Operations Supervisor — Agent Specs v1.0 (Aris Thorne, 2026-05-29)

## Mission
Handle website builds and SEO optimization for new and existing MKAI clients. Assess each client's web presence and route to the correct workflow — new site build or SEO optimization on an existing site.

## Key Decision Logic (To Be Built)
Determined during the Full AI Audit, before any build work begins:
> **Does the client have an existing website?**
> - **Yes** → SEO audit path → optimization and fixes
> - **No** → Website build path → build first, then SEO

## Planned Responsibilities
- **No-Website path:** site build (platform TBD — Hostinger / Wix / custom), basic on-page SEO, Google Search Console submission, Google Business Profile setup.
- **Existing-Website path:** full SEO audit (47-criteria framework), crawl-error fixes, on-page optimization, structured data, AI-search indexing (llms.txt, robots.txt), GSC monitoring.
- **Both paths:** keyword research, local SEO setup, monthly reporting.

## Scope & Handoffs
- Escalate above scope to: Mei-Ling Vance.
- Website-build path is determined in the Full AI Audit (run by Customer Success / Aris) — coordinate intake there.

## Planned Data Sources / Tools
| System | Purpose | Access |
|---|---|---|
| Google Search Console | Indexing + performance monitoring | no MCP yet |
| Airtable | Website records, SEO audit logs | `mcp__d5784726` |
| Gmail | Client communication + reports | `mcp__990e4ab0` |
| n8n | Audit + reporting automation | `mcp__5ec9614f` |

## Notes for Development
- Must handle PHP-based sites for AI-crawler compatibility (llms.txt, JSON-LD).
- Reusable SEO audit report template exists: `Template_AI_Audit_Report_v1.0.docx`.
- First live test: signsealdeliveredllc.com (Wix, NYC notary).
- Build-path platform decision pending — evaluate Hostinger Horizons vs custom PHP vs Wix per client need/budget.

## Dependencies Before Build
- [ ] Confirm website-build platform options + pricing
- [ ] Define SEO service scope per tier (Basic, Standard, Enterprise)
- [ ] Price the Website Manager service offering
- [ ] Decide standalone add-on vs bundled into existing tiers

## Workflows (n8n)
| Workflow | n8n ID | Status | Notes |
|---|---|---|---|
| _none yet_ | — | not built | Placeholder; blocked on dependencies above |

## Run Log
| Date | Action | Notes |
|---|---|---|
| 2026-05-29 | Bank created | Placeholder from spec v1.0; reports to Mei-Ling. In development. |
| 2026-06-07 | Marked OPEN role | CEO direction — Website Manager is an open/unfilled role. |
