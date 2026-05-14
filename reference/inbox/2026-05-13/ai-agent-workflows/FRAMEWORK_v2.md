# Man Kind AI Tech — Agent Hierarchy Framework (v2)

## Overview

This document defines the complete AI agent architecture for Man Kind AI Tech (mankindaitech.com), an AI consulting business offering tiered services from free Discovery calls to custom Enterprise engagements.

## Service Tiers

| Tier | Price | Description |
|------|-------|-------------|
| Discovery | Free | Initial consultation, AI readiness chat |
| Snapshot | Free (first 5), $75 (next 5), $150 (10+) | Quick AI readiness scan |
| Full Audit | $550 | Deep dive analysis with PDF report |
| Governance | $100 add-on | Policy and ethics review |
| Enterprise | $2,000+ custom | Custom scope, ongoing support |

## Agent Hierarchy (Updated)

```
┌──────────────────────────────────────────────────────────────────────────┐
│                         TIER 0 — ORCHESTRATOR                             │
├──────────────────────────────────────────────────────────────────────────┤
│                                                                          │
│                         ┌─────────────────┐                              │
│                         │ MKAI Orchestrator│                             │
│                         │ Routes, monitors │                             │
│                         └────────┬────────┘                              │
│                                  │                                       │
└──────────────────────────────────┼───────────────────────────────────────┘
                                   │
         ┌─────────────┬───────────┼───────────┬─────────────┐
         │             │           │           │             │
         ▼             ▼           ▼           ▼             │
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   TIER 1    │ │   TIER 1    │ │   TIER 1    │ │   TIER 1    │
│  SUPERVISOR │ │  SUPERVISOR │ │  SUPERVISOR │ │  SUPERVISOR │
├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤
│ Sales       │ │ Delivery    │ │ Operations  │ │ Admin       │
│             │ │             │ │             │ │             │
│ • NET NEW   │ │ • Audits    │ │ • CRM sync  │ │ • Email     │
│   clients   │ │ • Reports   │ │ • Email drip│ │   routing   │
│ • Leads     │ │ • Delivery  │ │ • Automation│ │ • Calendar  │
│ • Quotes    │ │             │ │             │ │ • Marketing │
│             │ │             │ │             │ │ • Maintenance│
└──────┬──────┘ └──────┬──────┘ └──────┬──────┘ └──────┬──────┘
       │               │               │               │
       ▼               ▼               ▼               ▼
┌─────────────┐ ┌─────────────┐ ┌─────────────┐ ┌─────────────┐
│   TIER 2    │ │   TIER 2    │ │   TIER 2    │ │   TIER 2    │
│   WORKERS   │ │   WORKERS   │ │   WORKERS   │ │   WORKERS   │
├─────────────┤ ├─────────────┤ ├─────────────┤ ├─────────────┤
│ • Discovery │ │ • Snapshot  │ │ • CRM Sync  │ │ • Email     │
│   Agent     │ │   Agent     │ │   Agent     │ │   Router    │
│ • Quote     │ │ • Full Audit│ │ • Email Drip│ │ • Calendar  │
│   Agent     │ │   Agent     │ │   Agent     │ │   Manager   │
│ • Lead Chat │ │ • Governance│ │ • Report Gen│ │ • Marketing │
│   Agent     │ │   Agent     │ │ • Task      │ │   Agent     │
│             │ │ • Enterprise│ │   Scheduler │ │ • Website   │
│             │ │   Agent     │ │             │ │   Maintenance│
└─────────────┘ └─────────────┘ └─────────────┘ └─────────────┘
```

---

## Supervisor Responsibilities & Routing (R&R)

### Sales Supervisor
**Handles:** NET NEW clients ONLY
- Lead qualification
- Discovery calls
- Quote generation
- New client onboarding

**Routes TO Sales:**
- Pricing inquiries from non-clients
- "Interested in services" emails
- New leads from any channel

### Delivery Supervisor
**Handles:** Active engagements
- Snapshot audits
- Full audit execution
- Governance reviews
- Enterprise projects
- Report generation

### Operations Supervisor
**Handles:** Internal automation
- CRM bidirectional sync (Airtable ↔ Zoho)
- Drip email campaigns
- Weekly metrics reports
- Task scheduling and reminders

### Admin Supervisor (NEW)
**Handles:** Email, calendar, marketing, maintenance

#### Email Router Agent
- Monitors inbox every 15 minutes
- Routes: Sales inquiries → Sales Supervisor
- Routes: Support issues → Zoho Desk
- Routes: Maintenance requests → Website Maintenance
- Flags: Partnership/media → Owner
- Archives: Spam automatically

#### Calendar Manager Agent
- Blocks calendar 48 hours in advance DAILY (6 AM EST)
- Business hours only: 9 AM - 5 PM EST
- 15-minute buffer between meetings
- No weekend auto-blocking

#### Marketing Agent
- Daily 8 AM: Post to Dorothy Dean Designs
- Daily 9 AM: Post to Man Kind AI
- Monday 7 AM: Weekly SEO analysis report
- Analyzes websites for Google ranking strategies

#### Website Maintenance Agent
- Assists EXISTING clients only
- Logs all requests to Airtable
- Routes urgent issues to Zoho Desk
- Sends confirmation emails

---

## Integration Points

### MCP Connectors (Connected)
| Service | Use |
|---------|-----|
| Gmail | Email routing, sending |
| Google Calendar | Calendar blocking |
| Zoho Desk | Support tickets |
| Zoho CRM | Client database |
| Zoho Books | Invoicing |
| Airtable | Task logging, content calendar |
| Canva | Social media graphics |
| Notion | Documentation |
| n8n | Workflow automation |

### External APIs Needed
- Meta Business Suite (Facebook/Instagram posting)
- Google Search Console (SEO data)
- Google Analytics (Traffic analysis)

---

## n8n Workflows

### Ops Supervisor Workflows
| Workflow | Webhook |
|----------|---------|
| MKAI Ops Supervisor | `/webhook/mkai-ops-supervisor` |
| CRM Sync | `/webhook/mkai-crm-sync` |
| Email Drip | `/webhook/mkai-email-drip` |
| Report Generator | `/webhook/mkai-report-gen` |
| Task Scheduler | `/webhook/mkai-task-scheduler` |

### Admin Supervisor Workflows
| Workflow | Webhook |
|----------|---------|
| MKAI Admin Supervisor | `/webhook/mkai-admin-supervisor` |
| Email Router | `/webhook/mkai-email-router` |
| Calendar Manager | `/webhook/mkai-calendar-manager` |
| Marketing Agent | `/webhook/mkai-marketing` |
| Website Maintenance | `/webhook/mkai-website-maintenance` |

---

## Deployment Platforms

### n8n (Primary Automation)
- https://agegroup.app.n8n.cloud
- All background workflows
- Scheduled tasks
- Webhook triggers

### Microsoft Copilot Studio (User Interface)
- Interactive agent for Copilot Chat
- Share with team or organization
- See: `COPILOT_DEPLOYMENT_GUIDE.md`

### Claude API (Customer-Facing Chat)
- Complex reasoning tasks
- Multi-step workflows

---

## Quick Reference: Email Classification

| Email Contains | Sender Type | Route To |
|----------------|-------------|----------|
| pricing, quote, interested | NEW | Sales Supervisor |
| help, issue, problem, broken | EXISTING | Zoho Desk |
| update, change, maintenance | EXISTING | Website Maintenance |
| partnership, media, interview | ANY | Flag for Owner |
| spam patterns | ANY | Archive |

---

## Schedule Summary

| Time | Agent | Action |
|------|-------|--------|
| Every 15 min | Email Router | Check inbox |
| Daily 6:00 AM | Calendar Manager | Block next 48 hours |
| Daily 8:00 AM | Marketing | Post to DDD social |
| Daily 9:00 AM | Marketing | Post to MKAI social |
| Monday 7:00 AM | Marketing | SEO report |
| Every 6 hours | CRM Sync | Reconcile databases |
| Daily 9:00 AM | Task Scheduler | Check overdue tasks |

---

## Files Structure

```
mkai-agents/
├── FRAMEWORK.md                    ← This file
├── skill/
│   ├── SKILL.md                    ← Claude Code skill entry
│   └── references/
│       ├── framework.md
│       └── ops-supervisor.md
├── ops-supervisor/
│   ├── AGENT_SPEC.md
│   └── ops-supervisor-workflow.json
├── admin-supervisor/
│   ├── ADMIN_SUPERVISOR_FULL_SPEC.md
│   ├── COPILOT_DEPLOYMENT_GUIDE.md
│   └── workflows/
│       ├── admin-supervisor-workflow.json
│       ├── email-router-workflow.json
│       ├── calendar-manager-workflow.json
│       ├── marketing-workflow.json
│       └── website-maintenance-workflow.json
└── [future: sales-supervisor/, delivery-supervisor/]
```
