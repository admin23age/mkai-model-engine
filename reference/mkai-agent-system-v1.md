# MKAI Agent System (Simplified)

## Overview

4 agents total: 1 Supervisor + 3 Workers

```
MKAI Supervisor
    │
    ├── Admin Agent
    │   • Block calendar 48 hrs ahead (daily 6 AM)
    │   • Monitor & route emails (every 15 min)
    │   • Handle website maintenance for existing clients
    │
    ├── Sales Agent
    │   • Handle leads
    │   • NET NEW clients only
    │   • Auto-reply + lead scoring
    │
    ├── Customer Service Agent
    │   • Support existing clients
    │   • Create Zoho Desk tickets
    │   • Priority-based response times
    │
    └── Marketing Agent
        • SEO analysis (MKAI + client sites)
        • Daily social: DDD @ 8 AM, MKAI @ 9 AM
        • Weekly SEO report (Monday 7 AM)
```

---

## Webhooks

| Agent | Webhook URL |
|-------|-------------|
| Supervisor | `https://agegroup.app.n8n.cloud/webhook/mkai-supervisor` |
| Admin | `https://agegroup.app.n8n.cloud/webhook/mkai-admin` |
| Sales | `https://agegroup.app.n8n.cloud/webhook/mkai-sales` |
| Customer Service | `https://agegroup.app.n8n.cloud/webhook/mkai-customer-service` |
| Marketing | `https://agegroup.app.n8n.cloud/webhook/mkai-marketing` |

---

## Schedules

| Time | Agent | Action |
|------|-------|--------|
| Every 15 min | Admin | Check emails, classify, route |
| Daily 6 AM | Admin | Block calendar 48 hrs ahead |
| Daily 8 AM | Marketing | Post to Dorothy Dean Designs |
| Daily 9 AM | Marketing | Post to Man Kind AI |
| Monday 7 AM | Marketing | Weekly SEO report |

---

## Workflow Files

| File | Agent |
|------|-------|
| `mkai-supervisor.json` | MKAI Supervisor |
| `mkai-admin-agent.json` | Admin Agent |
| `mkai-sales-agent.json` | Sales Agent |
| `mkai-customer-service-agent.json` | Customer Service Agent |
| `mkai-marketing-agent.json` | Marketing Agent |

---

## Required Credentials

Set these up in n8n before activating workflows:

| Credential | Used By | Get From |
|------------|---------|----------|
| Gmail OAuth2 | Admin, Sales, CS, Marketing | Google Cloud Console |
| Google Calendar OAuth2 | Admin | Google Cloud Console |
| Zoho Desk OAuth2 | Customer Service | Zoho API Console |
| Airtable Token | Sales, Marketing | airtable.com/create/tokens |
| Google Gemini API | Marketing | aistudio.google.com |

---

## Email Routing Logic

Admin Agent classifies incoming emails:

| Email Contains | Routes To |
|----------------|-----------|
| pricing, quote, interested, services | → Sales Agent |
| help, issue, problem, broken, error | → Customer Service Agent |
| update, change, maintenance, website | Admin handles directly |
| spam patterns | Archive automatically |
| Everything else | Notify owner for review |

---

## Import Instructions

1. Go to https://agegroup.app.n8n.cloud
2. Click **Workflows** → **Add Workflow** → **Import from File**
3. Import all 5 JSON files
4. Set up credentials for each workflow
5. Activate workflows

### Import Order (recommended)
1. `mkai-admin-agent.json`
2. `mkai-sales-agent.json`
3. `mkai-customer-service-agent.json`
4. `mkai-marketing-agent.json`
5. `mkai-supervisor.json` (last, since it calls the others)

---

## Test Commands

```bash
# Test Supervisor
curl -X POST "https://agegroup.app.n8n.cloud/webhook/mkai-supervisor" \
  -H "Content-Type: application/json" \
  -d '{"task_type": "lead", "content": "I am interested in pricing"}'

# Test Admin - Email Check
curl -X POST "https://agegroup.app.n8n.cloud/webhook/mkai-admin" \
  -H "Content-Type: application/json" \
  -d '{"task_type": "email_route"}'

# Test Admin - Calendar Block
curl -X POST "https://agegroup.app.n8n.cloud/webhook/mkai-admin" \
  -H "Content-Type: application/json" \
  -d '{"task_type": "calendar_block"}'

# Test Sales
curl -X POST "https://agegroup.app.n8n.cloud/webhook/mkai-sales" \
  -H "Content-Type: application/json" \
  -d '{"from": "test@example.com", "name": "Test Lead", "subject": "Pricing inquiry", "snippet": "I want a quote for AI consulting"}'

# Test Customer Service
curl -X POST "https://agegroup.app.n8n.cloud/webhook/mkai-customer-service" \
  -H "Content-Type: application/json" \
  -d '{"from": "client@example.com", "name": "Client Name", "subject": "Help needed", "description": "My website is broken"}'

# Test Marketing - Social Post
curl -X POST "https://agegroup.app.n8n.cloud/webhook/mkai-marketing" \
  -H "Content-Type: application/json" \
  -d '{"task_type": "social_post", "brand": "mankind_ai"}'

# Test Marketing - SEO Report
curl -X POST "https://agegroup.app.n8n.cloud/webhook/mkai-marketing" \
  -H "Content-Type: application/json" \
  -d '{"task_type": "seo_report"}'
```

---

## TODO After Import

- [ ] Connect Gmail OAuth2 credentials
- [ ] Connect Google Calendar OAuth2 credentials
- [ ] Connect Zoho Desk OAuth2 credentials
- [ ] Connect Airtable API token
- [ ] Connect Google Gemini API key
- [ ] Set Zoho Desk department ID in Customer Service workflow
- [ ] Set Airtable base/table IDs in Sales workflow (for Leads table)
- [ ] Connect Meta Business Suite API for real social posting
- [ ] Test each workflow individually
- [ ] Activate all workflows
