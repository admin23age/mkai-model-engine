---
name: mkai-agents
description: Use when building, deploying, debugging, or discussing Man Kind AI Tech agents and automation workflows
---

## When to invoke this skill

Invoke this skill when:
- Building n8n workflows for Man Kind AI Tech
- Designing agent system prompts
- Deploying agents to n8n, Claude API, or other platforms
- Debugging MKAI automation workflows
- Discussing the agent hierarchy or service tiers
- Creating new agents that fit the MKAI framework

## Man Kind AI Tech — Service Tiers

| Tier | Price | Description |
|------|-------|-------------|
| Discovery | Free | Initial consultation, AI readiness chat |
| Snapshot | Free (first 5), $75 (next 5), $150 (10+) | Quick AI readiness scan |
| Full Audit | $550 | Deep dive analysis with PDF report |
| Governance | $100 add-on | Policy and ethics review |
| Enterprise | $2,000+ custom | Custom scope, ongoing support |

## Agent Hierarchy

```
TIER 0 — ORCHESTRATOR
└── MKAI Orchestrator (routes all requests)

TIER 1 — SUPERVISORS
├── Sales Supervisor (leads, quotes, consults)
├── Delivery Supervisor (audits, reports, delivery)
└── Operations Supervisor (CRM sync, email drip, automation)

TIER 2 — WORKERS
├── Sales: Discovery Agent, Quote Agent, Lead Chat Agent
├── Delivery: Snapshot, Full Audit, Governance, Enterprise
└── Ops: CRM Sync, Email Drip, Report Gen, Task Scheduler

TIER 3 — PLATFORMS
├── n8n workflows (automation, background tasks)
├── Claude API (customer-facing chat)
├── Claude Code (complex multi-step tasks)
└── MCP connectors (Airtable, Zoho, Gmail)
```

## Agent Specifications

Detailed specs are in the `references/` folder:

- `references/ops-supervisor.md` — Operations Supervisor agent spec
- `references/sales-supervisor.md` — Sales Supervisor agent spec (TBD)
- `references/delivery-supervisor.md` — Delivery Supervisor agent spec (TBD)
- `references/competitor-scraper.md` — Competitor Scraper routine (free Instaloader replacement for the Apify actor in the content planner)
- `references/framework.md` — Full hierarchy documentation

## Deployment Pattern

All agents follow this deployment pattern:

1. **Spec** — Define system prompt, triggers, data sources
2. **Build** — Create n8n workflow JSON or Claude API implementation
3. **Import** — Add to n8n instance or deploy API endpoint
4. **Connect** — Link credentials (Airtable, Zoho, Gmail, Square)
5. **Test** — Run with sample data
6. **Activate** — Toggle workflow active, connect to production triggers

## n8n Instance

- **URL:** https://agegroup.app.n8n.cloud
- **MCP connectors available:** Airtable, Zoho CRM, Zoho Books, Zoho Desk, Gmail, Notion

## Data Sources

| Source | Purpose | Connection |
|--------|---------|------------|
| Airtable | Leads, forms, error logs | MCP connector |
| Zoho CRM | Customer records, deals | MCP connector |
| Zoho Books | Invoices, payments | MCP connector |
| Square | Payment processing | API credentials |
| Gmail | Email sending | MCP connector |

## Creating New Agents

When creating a new agent for MKAI:

1. Determine which Supervisor it reports to
2. Define triggers (webhook, schedule, manual)
3. Write system prompt following existing patterns
4. Create n8n workflow or Claude API implementation
5. Add to appropriate Supervisor's worker list
6. Update this skill with new agent reference

## Error Handling

All agents follow 3-level error handling:

```
Level 1: Retry (automatic)
├── Transient failures (network, rate limit)
├── Retry up to 3 times
└── Exponential backoff: 5s, 15s, 45s

Level 2: Log and Continue (automatic)
├── Non-critical failures
├── Log to Airtable Error Log table
└── Continue processing

Level 3: Alert and Pause (requires attention)
├── Critical failures (auth expired, schema change)
├── Email alert to support@mankindaitech.com
└── Pause workflow until resolved
```
