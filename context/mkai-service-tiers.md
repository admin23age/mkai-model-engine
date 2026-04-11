# Man Kind AI Tech — Service Tiers & Business Model
*Source: FRAMEWORK.md (agents/)*

---

## Service Offerings

| Tier | Price | Description |
|---|---|---|
| Discovery | Free | Initial consultation, AI readiness chat |
| Snapshot | Free (first 5) · $75 (next 5) · $150 (10+) | Quick AI readiness scan |
| Full Audit | $550 | Deep dive analysis with PDF report |
| Governance | $100 add-on | Policy and ethics review |
| Enterprise | $2,000+ custom | Custom scope, ongoing support |

---

## Platform Runtimes

| Platform | Use Case | Agents |
|---|---|---|
| n8n Workflows | Automation, background tasks | Ops workers, CRM Sync, Email Drip |
| Claude API | Customer-facing chat | Discovery Agent, Lead Chat |
| Claude Code | Complex multi-step tasks | Full Audit, Enterprise |
| MCP Connectors | Data integration | All agents (Airtable, Zoho, Gmail) |

---

## Deployment Status

### Phase 1: Foundation
- [x] Define agent hierarchy
- [x] Spec Operations Supervisor
- [ ] Create Airtable Error Log table
- [ ] Build Ops Supervisor n8n workflow

### Phase 2: Operations Workers
- [ ] CRM Sync workflow
- [ ] Email Drip workflow
- [ ] Report Generator workflow
- [ ] Task Scheduler workflow

### Phase 3: Sales Agents
- [ ] Spec Sales Supervisor
- [ ] Discovery Agent (Claude API)
- [ ] Quote Agent (n8n)
- [ ] Lead Chat Agent (Claude API)

### Phase 4: Delivery Agents
- [ ] Spec Delivery Supervisor
- [ ] Snapshot Agent
- [ ] Full Audit Agent
- [ ] Governance Agent
- [ ] Enterprise Agent

### Phase 5: Integration
- [ ] Connect all supervisors to Orchestrator
- [ ] End-to-end testing
- [ ] Deploy to production (Oracle VM — pending)
