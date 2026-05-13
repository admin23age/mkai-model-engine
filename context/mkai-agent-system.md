# MKAI Agent System — Architecture & Spec
*Sources: MKAI_AGENT_SYSTEM.md + AGENT_SPEC.md (agents/)*

---

## Agent Hierarchy

```
MKAI Orchestrator (Tier 0)
    │
    ├── Sales Supervisor (Tier 1)
    │       └── [Sales workers: lead scoring, auto-reply, quote handling]
    │
    ├── Delivery Supervisor (Tier 1)
    │       └── [Delivery workers: order tracking, fulfillment, client comms]
    │
    └── Operations Supervisor (Tier 1)
            ├── CRM Sync Agent (Tier 2)       — Airtable ↔ Zoho CRM bidirectional sync
            ├── Email Drip Agent (Tier 2)      — Sequence management and sending
            ├── Report Generator Agent (Tier 2) — PDF creation and delivery
            └── Task Scheduler Agent (Tier 2)  — Reminders and escalations
```

**Simplified runtime (4-agent system):**
```
MKAI Supervisor
    ├── Admin Agent       — Calendar blocking, email routing, website maintenance
    ├── Sales Agent       — Net new leads only, auto-reply, lead scoring
    ├── Customer Service  — Existing clients, Zoho Desk tickets, priority response
    └── Marketing Agent   — SEO, daily social posts (DDD @ 8AM, MKAI @ 9AM), weekly SEO report
```

---

## n8n Webhook URLs

| Agent | Webhook |
|---|---|
| Supervisor | `https://agegroup.app.n8n.cloud/webhook/mkai-supervisor` |
| Admin | `https://agegroup.app.n8n.cloud/webhook/mkai-admin` |
| Sales | `https://agegroup.app.n8n.cloud/webhook/mkai-sales` |
| Customer Service | `https://agegroup.app.n8n.cloud/webhook/mkai-customer-service` |
| Marketing | `https://agegroup.app.n8n.cloud/webhook/mkai-marketing` |

---

## Scheduled Tasks

| Time | Agent | Action |
|---|---|---|
| Every 15 min | Admin | Check emails, classify, route |
| Daily 6 AM | Admin | Block calendar 48 hrs ahead |
| Daily 8 AM | Marketing | Post to Dorothy Dean Designs |
| Daily 9 AM | Marketing | Post to Man Kind AI |
| Monday 7 AM | Marketing | Weekly SEO report |
| Every Monday 8 AM | Report Generator | Weekly metrics PDF to owner |
| Daily 9 AM | Task Scheduler | Check overdue tasks, send alerts |
| Every 6 hours | CRM Sync | Full reconciliation sync |
| Daily 6 PM | Email Drip | Process pending drip emails |

---

## Email Routing Logic (Admin Agent)

| Email Contains | Routes To |
|---|---|
| pricing, quote, interested, services | Sales Agent |
| help, issue, problem, broken, error | Customer Service Agent |
| update, change, maintenance, website | Admin handles directly |
| spam patterns | Archive automatically |
| Everything else | Notify owner for review |

---

## Ops Supervisor — Worker Dispatch Logic

When a task arrives:
1. Classify: sync / email / report / schedule
2. Check prerequisites (data available, dependencies met)
3. Dispatch to appropriate worker
4. Monitor completion and log results
5. Handle failures with retry logic or escalation

**Output format (JSON):**
```json
{
  "action": "dispatch|complete|error",
  "worker": "crm_sync|email_drip|report_gen|task_scheduler",
  "task_id": "uuid",
  "status": "pending|in_progress|completed|failed",
  "details": {}
}
```

---

## Error Handling

| Level | Trigger | Action |
|---|---|---|
| Level 1 — Retry | Transient failures (network, rate limit) | Auto-retry 3x (5s, 15s, 45s backoff) |
| Level 2 — Log & Continue | Non-critical (missing optional field) | Log to Airtable Error Log, continue |
| Level 3 — Alert & Pause | Critical (auth expired, schema change) | Email support@mankindaitech.com, pause workflow |

---

## Data Sources

| System | MCP | Used For |
|---|---|---|
| Airtable | `mcp__d5784726` | Leads, forms, posts, error logs, content calendar |
| Zoho CRM | `mcp__3e401231` | Contacts, leads, deals, accounts |
| Zoho Books | `mcp__3ef4a5e9` | Invoices, payments, expenses |
| n8n | `mcp__5ec9614f` | Workflow automation at `agegroup.app.n8n.cloud` |
| Gmail | `mcp__990e4ab0` | Outbound email, drafts, thread tracking |

---

## Credentials Required (n8n)

| Credential | Used By |
|---|---|
| Gmail OAuth2 | Admin, Sales, CS, Marketing |
| Google Calendar OAuth2 | Admin |
| Zoho Desk OAuth2 | Customer Service |
| Airtable Personal Access Token | Sales, Marketing, Ops |
| Google Gemini API | Marketing (social/SEO) |
| OpenAI API (HTTP Header Auth) | DD AI workflows |
| Twilio API | Text Support |
| Calendly API | Appointment Setting |

---

## Workflow Import Order (n8n)

1. `mkai-admin-agent.json`
2. `mkai-sales-agent.json`
3. `mkai-customer-service-agent.json`
4. `mkai-marketing-agent.json`
5. `mkai-supervisor.json` (last — calls the others)

---

## Status: Post-Import Checklist

- [ ] Connect Gmail OAuth2
- [ ] Connect Google Calendar OAuth2
- [ ] Connect Zoho Desk OAuth2
- [ ] Connect Airtable API token
- [ ] Connect Google Gemini API key
- [ ] Set Zoho Desk department ID in Customer Service workflow
- [ ] Set Airtable base/table IDs in Sales workflow
- [ ] Connect Meta Business Suite API for social posting
- [ ] Test each workflow individually
- [ ] Activate all workflows
