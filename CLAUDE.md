# Mankind AI Tech (MKAI) — Model Engine Workspace

## What This Is

This is the **MKAI Model Engine** — the central AI operations workspace for Mankind AI Tech. It serves as the command center for building, deploying, and managing AI agent systems for client businesses.

**Pilot Project:** Dorothy Dean Designs — faith-based luxury streetwear, LIFT collection.
Dorothy Dean Designs uses this engine to run sales, fulfillment, content, and operations through a coordinated agent hierarchy connected to live business data.

---

## Workspace Structure

```
/
├── CLAUDE.md                    # This file — workspace constitution
├── .claude/
│   └── commands/
│       ├── prime.md             # /prime — load context and assess readiness
│       ├── create-plan.md       # /create-plan — generate a dated plan file
│       └── implement.md         # /implement — execute a plan file step by step
├── context/                     # Live context files: client briefs, SOPs, brand docs
├── plans/                       # Dated implementation plans (YYYY-MM-DD_name.md)
├── outputs/                     # Deliverables: copy, configs, reports, exports
├── reference/                   # Static reference: schemas, API docs, field maps
├── scripts/                     # Automation scripts: n8n helpers, data transforms
└── skills/
    ├── social-rebuilder/        # Skill: rebuild/generate social content from brand voice
    ├── brand-scanner/           # Skill: audit brand consistency across assets
    └── logic-core/              # Skill: business logic rules and decision trees
```

---

## Commands

### `/prime`
Reads `CLAUDE.md` and all files in `context/`, then summarizes workspace readiness: what is loaded, what is missing, what the current active project is, and recommended next actions.

### `/create-plan`
Takes a plain-language request and produces a structured, dated plan file in `plans/` named `YYYY-MM-DD_<slug>.md`. Includes objective, steps, dependencies, data sources, and success criteria.

### `/implement`
Reads a specified plan file from `plans/` and executes it step by step — calling tools, writing outputs, updating data sources, and confirming completion of each step before proceeding.

---

## MKAI Agent Hierarchy

### Tier 0 — Orchestrator
The top-level agent. Receives business objectives, routes tasks to Tier 1 Supervisors, monitors cross-functional dependencies, and reports on overall system health. Holds master context of all active clients and projects.

### Tier 1 — Supervisors

| Supervisor | Domain | Responsibilities |
|---|---|---|
| **Sales Supervisor** | Revenue & CRM | Lead pipeline, follow-up sequences, quote/order creation, CRM hygiene |
| **Delivery Supervisor** | Fulfillment & Ops | Order processing, inventory tracking, shipping coordination, client comms |
| **Ops Supervisor** | Internal Operations | Finance sync, reporting, workflow maintenance, tool integrations |

### Tier 2 — Workers
Specialized agents that execute discrete, repeatable tasks under Supervisor direction. Examples:
- `crm-updater` — writes contact/deal data to Zoho CRM
- `invoice-generator` — creates invoices in Zoho Books
- `social-poster` — schedules and publishes content
- `email-drafter` — composes outbound emails via Gmail
- `order-tracker` — monitors fulfillment status and triggers updates
- `report-builder` — aggregates data and outputs summaries to Airtable or Notion

---

## Data Sources

| System | Purpose | Access |
|---|---|---|
| **Airtable** | Structured data, product catalog, content calendar, task tracking | MCP via `mcp__d5784726` |
| **Zoho CRM** | Contacts, leads, deals, accounts | MCP via `mcp__3e401231` |
| **Zoho Books** | Invoices, payments, expenses, purchase orders | MCP via `mcp__3ef4a5e9` |
| **n8n** | Workflow automation engine | Hosted at `agegroup.app.n8n.cloud`; MCP via `mcp__5ec9614f` |
| **Gmail** | Outbound email, draft management, thread tracking | MCP via `mcp__990e4ab0` |

---

## Pilot: Dorothy Dean Designs

- **Brand:** Faith-based luxury streetwear
- **Collection:** LIFT
- **Mission:** Apparel that lifts the spirit and reflects purpose-driven identity
- **Active Systems:** Zoho CRM (contacts/leads), Zoho Books (invoices), Airtable (catalog + tasks), n8n (automations), Gmail (outreach)

---

## Deployment Status

> **Oracle VM is live.** `us-phoenix-1` | Public IP: `129.151.26.21` | Compartment: `dddesigns12`
> Claude Code v2.1.101 + Gemini CLI 0.37.1 authenticated and running from `/root/mkai-model-engine/`.
> Repo syncs every 15 min via cron `git pull`.
>
> **Remaining:** Docker + n8n install, Oracle Security List ports, Twingate Connector on VM.
> See `reference/vm-stack-status.md` for full details.

---

## Operating Principles

1. **Read before acting.** Always load relevant context files before executing tasks.
2. **Plan before implementing.** Non-trivial work gets a plan file first.
3. **Log outputs.** Deliverables go to `outputs/`. Plans go to `plans/`.
4. **Confirm before irreversible actions.** Creating records, sending emails, and modifying live data require explicit confirmation unless pre-authorized in a plan.
5. **Keep context fresh.** After completing a task, update relevant context files if state has changed.
