# MKAI Agent Memory Banks

One memory bank per canonical MKAI agent. Filenames use the canonical org name
(`{first}-{last}.md`). Source of truth for the roster and reporting graph is
`mkai-engine/memory-bank/mkai/org-hierarchy.md`.

## Roster
| File | Agent | Role | Tier |
|---|---|---|---|
| `chloe-dubois.md` | Chloe Dubois | Chief of Staff | Orchestrator |
| `natalie-nair.md` | Natalie Nair | Director of Sales & CX | Sales Supervisor |
| `mateo-silva.md` | Mateo Silva | Sales Development Rep | Worker → Natalie |
| `tariq-al-mansoor.md` | Tariq Al-Mansoor | Customer Service Rep | Worker → Natalie |
| `support-agent.md` | Support Agent | Post-Delivery Support Agent | Worker → Natalie (function-named) |
| `mei-ling-vance.md` | Mei-Ling Vance | Marketing Manager | Supervisor (persona "Kayla") |
| `jamal-washington.md` | Jamal Washington | Content Designer | Worker → Mei-Ling |
| `website-manager-agent.md` | Website Manager Agent | Website Build & SEO Agent | Worker → Mei-Ling (function-named, in dev) |
| `aris-thorne.md` | Dr. Aris Thorne | Operations Manager & Customer Success | Ops Supervisor |
| `elena-rostova.md` | Elena Rostova | Grant Writer | Worker → Aris |
| `customer-success-agent.md` | Customer Success Agent | Onboarding & Activation Agent | Worker → Aris (function-named) |

## Canonical copy & mirror
- **Canonical:** `model-engine/memory-bank/agents/` (active workspace).
- **Mirror:** `mkai-engine/memory-bank/agents/` is kept in sync. Edit the canonical copy, then copy the folder across and commit both.

## ⚠️ Live-read disconnect (must fix to make these authoritative)
Live n8n agents currently git-pull memory from `admin23age/AGE-core-infrastructure`
(e.g. grant workflows read `Grant Writing/MKAI_GRANT_MEMORY_BANK.md`), and one content
workflow still has an unconfigured `ORG/REPO` placeholder. Until those workflow URLs are
repointed to this `agents/` convention, edits here are organizational only — not read at
runtime. Repointing is a workflow edit, done in n8n directly.

_Workflow IDs populated from the n8n inventory on 2026-05-24._
