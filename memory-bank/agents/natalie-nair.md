# Natalie Nair — Director of Sales & CX

## Agent Identity
- **Name:** Natalie Nair
- **Role:** Director of Sales & CX
- **Tier / Function:** Tier 1 — Sales Supervisor
- **Reports to:** Chloe Dubois (Chief of Staff)
- **Direct reports:** Mateo Silva (Sales Development Rep), Tariq Al-Mansoor (Customer Service Rep)
- **Hands off to:** pipeline mechanics → Mateo; inbound support → Tariq
- **Primary workflow:** MKAI Supervisor `FZJQhZaT81gLwiMP` (the live Natalie chatbot/supervisor)
- **Memory Bank:** model-engine/memory-bank/agents/natalie-nair.md
- **Canonical org:** `mkai-engine/memory-bank/mkai/org-hierarchy.md`

## Responsibilities
- Own the lead pipeline, follow-up sequences, quote/order creation, and CRM hygiene.
- Supervise sales development (Mateo) and customer service (Tariq); escalate above scope to Chloe.

## Scope & Handoffs
- Hand to Mateo: lead scoring, outbound follow-up, tiered emails, CRM records, payment links.
- Hand to Tariq: inbound support, order/status questions.
- Escalate above scope to: Chloe Dubois.

## Data Sources / Tools
| System | Use | Access |
|---|---|---|
| Zoho CRM | Contacts, leads, deals | `mcp__3e401231` |
| Airtable | Lead/contact tracking | `mcp__d5784726` |
| Gmail | Outbound/follow-up email | `mcp__990e4ab0` |
| n8n | Sales workflows | `mcp__5ec9614f` |

## Workflows (n8n)
| Workflow | n8n ID | Status | Notes |
|---|---|---|---|
| MKAI Supervisor (Natalie) | FZJQhZaT81gLwiMP | active | Natalie's core agent; sales handoff via Submit Sales Lead HTTP tool. ⚠️ chatTrigger webhookId rotates on edit → update website widget URL + redeploy |
| MKAI Sales Agent | moIWsyobqqRVaVLR | active | Sales execution (delegates to Mateo) |
| MKAI Customer Service Agent | YoNFRNh2fdfgvnFb | inactive | CS branch (owned by Tariq) |
| MKAI Chatbot v2 | 4muzeV750mT2ZyBP | inactive | Airtable memory persistence |
| (MATS) contact us response | Qb4qZJzutjbJqKpr | active | Website lead routing → tier/payment (see website bank; bug #1 paid-URL stray `=`) |
| MKAI Daily Lead & CRM Scanner | 2axJYsKbvpPS4w2x | inactive | Daily 8AM CRM/lead scan → follow-up queue to CEO |
| Sales Call Analysis | T5kRK5DcDsq1rxT3 | active | Post-call analysis |

## Operating Notes
- Editing `FZJQhZaT81gLwiMP` rotates the chatTrigger webhookId — must update `ChatbotWidget.jsx` fallback URL + rebuild + redeploy the website.

## Run Log
| Date | Action | Notes |
|---|---|---|
| 2026-05-24 | Bank created + populated | Mapped supervisor/sales/CS/lead workflows from n8n inventory |
