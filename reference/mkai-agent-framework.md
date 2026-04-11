# Man Kind AI Tech — Agent Hierarchy Framework

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

## Agent Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│                    TIER 0 — ORCHESTRATOR                     │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│                    ┌─────────────────┐                      │
│                    │ MKAI Orchestrator│                     │
│                    │ Routes, monitors │                     │
│                    └────────┬────────┘                      │
│                             │                               │
└─────────────────────────────┼───────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│    TIER 1     │    │    TIER 1     │    │    TIER 1     │
│   SUPERVISOR  │    │   SUPERVISOR  │    │   SUPERVISOR  │
├───────────────┤    ├───────────────┤    ├───────────────┤
│ Sales         │    │ Delivery      │    │ Operations    │
│ Supervisor    │    │ Supervisor    │    │ Supervisor    │
│               │    │               │    │               │
│ • Leads       │    │ • Audits      │    │ • CRM sync    │
│ • Quotes      │    │ • Reports     │    │ • Email drip  │
│ • Consults    │    │ • Delivery    │    │ • Automation  │
└───────┬───────┘    └───────┬───────┘    └───────┬───────┘
        │                    │                    │
        ▼                    ▼                    ▼
┌───────────────┐    ┌───────────────┐    ┌───────────────┐
│    TIER 2     │    │    TIER 2     │    │    TIER 2     │
│    WORKERS    │    │    WORKERS    │    │    WORKERS    │
├───────────────┤    ├───────────────┤    ├───────────────┤
│ • Discovery   │    │ • Snapshot    │    │ • CRM Sync    │
│ • Quote Gen   │    │ • Full Audit  │    │ • Email Drip  │
│ • Lead Chat   │    │ • Governance  │    │ • Report Gen  │
│               │    │ • Enterprise  │    │ • Task Sched  │
└───────────────┘    └───────────────┘    └───────────────┘
```

## Platform Runtimes (Tier 3)

Agents run across multiple platforms depending on their function:

| Platform | Use Case | Agents |
|----------|----------|--------|
| n8n Workflows | Automation, background tasks | Ops workers, CRM Sync, Email Drip |
| Claude API | Customer-facing chat | Discovery Agent, Lead Chat |
| Claude Code | Complex multi-step tasks | Full Audit, Enterprise |
| MCP Connectors | Data integration | All agents (Airtable, Zoho, Gmail) |

## Agent Specifications

### Tier 0: MKAI Orchestrator
- **Role:** Central router for all requests
- **Triggers:** Every inbound request (form, chat, API, scheduled)
- **Action:** Classify intent → route to supervisor → monitor completion
- **Platform:** n8n webhook + AI classifier

### Tier 1: Supervisors

#### Sales Supervisor
- **Domain:** Customer acquisition and qualification
- **Workers:** Discovery Agent, Quote Agent, Lead Chat Agent
- **Metrics:** Leads captured, consults booked, quotes sent

#### Delivery Supervisor
- **Domain:** Service execution
- **Workers:** Snapshot, Full Audit, Governance, Enterprise Agents
- **Metrics:** Deliveries completed, client satisfaction, turnaround time

#### Operations Supervisor
- **Domain:** Internal automation
- **Workers:** CRM Sync, Email Drip, Report Gen, Task Scheduler
- **Metrics:** Sync success rate, emails sent, reports generated

### Tier 2: Workers

See individual agent spec files:
- `/ops-supervisor/AGENT_SPEC.md`
- `/sales-supervisor/AGENT_SPEC.md` (TBD)
- `/delivery-supervisor/AGENT_SPEC.md` (TBD)

## Data Architecture

### Primary Data Stores
- **Airtable:** Mankind AI Forms base (leads, forms, counters, error logs)
- **Zoho CRM:** Customer records, deals, pipeline
- **Zoho Books:** Invoices, payments

### Integration Pattern
```
Customer Action
      │
      ▼
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Website   │────▶│  n8n Hook   │────▶│  Airtable   │
│   Form      │     │  Webhook    │     │  (Source)   │
└─────────────┘     └─────────────┘     └──────┬──────┘
                                               │
                                               ▼
                    ┌─────────────┐     ┌─────────────┐
                    │  Zoho CRM   │◀────│  CRM Sync   │
                    │  (Mirror)   │     │  Agent      │
                    └─────────────┘     └─────────────┘
```

## Deployment Checklist

### Phase 1: Foundation
- [x] Define agent hierarchy
- [x] Spec Operations Supervisor
- [ ] Create Airtable Error Log table
- [ ] Build Ops Supervisor n8n workflow

### Phase 2: Operations Workers
- [ ] Build CRM Sync workflow
- [ ] Build Email Drip workflow
- [ ] Build Report Generator workflow
- [ ] Build Task Scheduler workflow

### Phase 3: Sales Agents
- [ ] Spec Sales Supervisor
- [ ] Build Discovery Agent (Claude API)
- [ ] Build Quote Agent (n8n)
- [ ] Build Lead Chat Agent (Claude API)

### Phase 4: Delivery Agents
- [ ] Spec Delivery Supervisor
- [ ] Build Snapshot Agent
- [ ] Build Full Audit Agent
- [ ] Build Governance Agent
- [ ] Build Enterprise Agent

### Phase 5: Integration
- [ ] Connect all supervisors to Orchestrator
- [ ] End-to-end testing
- [ ] Deploy to production
- [ ] Monitor and iterate

## File Structure

```
mkai-agents/
├── FRAMEWORK.md (this file)
├── orchestrator/
│   └── AGENT_SPEC.md
├── sales-supervisor/
│   ├── AGENT_SPEC.md
│   └── workers/
│       ├── discovery-agent.md
│       ├── quote-agent.md
│       └── lead-chat-agent.md
├── delivery-supervisor/
│   ├── AGENT_SPEC.md
│   └── workers/
│       ├── snapshot-agent.md
│       ├── full-audit-agent.md
│       ├── governance-agent.md
│       └── enterprise-agent.md
└── ops-supervisor/
    ├── AGENT_SPEC.md
    └── workers/
        ├── crm-sync-agent.md
        ├── email-drip-agent.md
        ├── report-gen-agent.md
        └── task-scheduler-agent.md
```
