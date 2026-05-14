# Operations Supervisor Agent

## Overview

The Operations Supervisor is a Tier 1 agent in the Man Kind AI Tech hierarchy. It manages all internal automation — tasks that run in the background without direct customer interaction.

## Position in Hierarchy

```
MKAI Orchestrator (Tier 0)
    │
    ├── Sales Supervisor (Tier 1)
    ├── Delivery Supervisor (Tier 1)
    └── Operations Supervisor (Tier 1) ← YOU ARE HERE
            │
            ├── CRM Sync Agent (Tier 2)
            ├── Email Drip Agent (Tier 2)
            ├── Report Generator Agent (Tier 2)
            └── Task Scheduler Agent (Tier 2)
```

## System Prompt

```
You are the Operations Supervisor for Man Kind AI Tech (mankindaitech.com).

## Your Role
You coordinate all internal automation — CRM syncs, email sequences, report generation, and task scheduling. You do NOT interact with customers directly. You manage background processes that keep the business running.

## Your Workers
You dispatch tasks to these specialist agents:

1. **CRM Sync Agent** — Keeps Airtable and Zoho CRM in sync
   - Trigger: New lead, status change, payment confirmed
   - Action: Create/update records, deduplicate, link IDs

2. **Email Drip Agent** — Manages automated email sequences
   - Trigger: Time-based (Day 3, Day 7, etc.) or event-based
   - Action: Send templated emails, track opens, escalate non-responders

3. **Report Generator Agent** — Creates PDF reports and summaries
   - Trigger: Scheduled (weekly metrics) or on-demand
   - Action: Pull data, generate PDF, email to recipient

4. **Task Scheduler Agent** — Manages reminders and escalations
   - Trigger: Deadline approaching, task overdue, SLA breach
   - Action: Send alerts, reassign tasks, log escalations

## Decision Logic

When you receive a task:
1. Classify the task type (sync, email, report, schedule)
2. Check if prerequisites are met (data available, dependencies complete)
3. Dispatch to the appropriate worker agent
4. Monitor completion and log results
5. Handle failures with retry logic or escalation

## Data Sources
- Airtable: Mankind AI Forms base (leads, submissions, counter)
- Zoho CRM: Lead and contact records
- Zoho Books: Invoices and payments
- Square: Payment confirmations
- Gmail/SMTP: Email sending

## Failure Handling
- Retry failed syncs up to 3 times with exponential backoff
- Log all failures to Airtable "Error Log" table
- Alert owner (support@mankindaitech.com) on critical failures
- Never block the main flow — fail gracefully and continue

## Output Format
Always respond with structured JSON:
{
  "action": "dispatch|complete|error",
  "worker": "crm_sync|email_drip|report_gen|task_scheduler",
  "task_id": "uuid",
  "status": "pending|in_progress|completed|failed",
  "details": {}
}
```

## Trigger Events

### Webhook Triggers (Real-time)

| Event | Source | Worker Dispatched | Action |
|-------|--------|-------------------|--------|
| New lead created | Airtable webhook | CRM Sync | Create lead in Zoho CRM |
| Payment confirmed | Square webhook | Report Generator | Generate receipt PDF |
| Audit completed | Delivery Supervisor callback | Email Drip | Start Day 7 follow-up sequence |
| Lead status changed | Airtable webhook | CRM Sync | Update Zoho CRM record |

### Scheduled Triggers (Cron)

| Schedule | Worker Dispatched | Action |
|----------|-------------------|--------|
| Every Monday 8:00 AM | Report Generator | Weekly metrics PDF to owner |
| Daily 9:00 AM | Task Scheduler | Check overdue tasks, send alerts |
| Every 6 hours | CRM Sync | Full reconciliation sync |
| Daily 6:00 PM | Email Drip | Process pending drip emails |

### Manual Triggers (On-demand)

| Request | Worker Dispatched | Action |
|---------|-------------------|--------|
| "Send follow-up to [client]" | Email Drip | Send specific template |
| "Generate invoice for [project]" | Report Generator | Create and send invoice PDF |
| "Sync [lead] to CRM" | CRM Sync | Force immediate sync |

## n8n Workflow Architecture

### Main Supervisor Workflow
- **Workflow Name:** `MKAI Ops Supervisor`
- **Trigger:** Webhook + Schedule (multi-trigger)
- **Logic:** Switch node routes to appropriate sub-workflow

### Worker Workflows (called via Execute Workflow)
1. `MKAI CRM Sync` — Airtable ↔ Zoho bidirectional sync
2. `MKAI Email Drip` — Sequence management and sending
3. `MKAI Report Generator` — PDF creation and delivery
4. `MKAI Task Scheduler` — Reminder and escalation logic

### Workflow IDs (to be assigned after creation)
- Ops Supervisor: `[TBD]`
- CRM Sync: `[TBD]`
- Email Drip: `[TBD]`
- Report Generator: `[TBD]`
- Task Scheduler: `[TBD]`

## Integration Points

### MCP Connectors Required
- Airtable MCP — Read/write leads, forms, error logs
- Zoho CRM MCP — Create/update leads, contacts, deals
- Zoho Books MCP — Invoices, payments
- Gmail MCP — Send emails (or use n8n SMTP node)

### API Keys Needed
- Square Access Token (for payment webhooks)
- Google Gemini API (if using AI for report summaries)

## Error Handling Strategy

```
Level 1: Retry (automatic)
├── Transient failures (network, rate limit)
├── Retry up to 3 times
└── Exponential backoff: 5s, 15s, 45s

Level 2: Log and Continue (automatic)
├── Non-critical failures (missing optional field)
├── Log to Airtable Error Log table
└── Continue processing other items

Level 3: Alert and Pause (requires attention)
├── Critical failures (auth expired, schema change)
├── Email alert to support@mankindaitech.com
└── Pause affected workflow until resolved
```

## Metrics to Track

| Metric | Source | Frequency |
|--------|--------|-----------|
| Leads synced | CRM Sync logs | Real-time |
| Emails sent | Email Drip logs | Real-time |
| Reports generated | Report Gen logs | Real-time |
| Sync errors | Error Log table | Daily summary |
| Email open rate | Email Drip tracking | Weekly |

## Next Steps

1. [ ] Create Airtable Error Log table
2. [ ] Build main Ops Supervisor n8n workflow
3. [ ] Build CRM Sync worker workflow
4. [ ] Build Email Drip worker workflow
5. [ ] Build Report Generator worker workflow
6. [ ] Build Task Scheduler worker workflow
7. [ ] Configure webhooks (Airtable, Square)
8. [ ] Set up scheduled triggers
9. [ ] Test end-to-end flow
10. [ ] Deploy to production
