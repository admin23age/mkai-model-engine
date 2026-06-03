# MKAI Prompt Library

Version-controlled source of truth for every agent, email, and workflow prompt
across **all MKAI clients**. Git is the audit trail: prompts change through
commits, not by editing live records. The operational layer (n8n / Airtable)
reads the **approved** version; this repo decides what "approved" means.

## Why this exists
- **Rollback.** A prompt change that breaks a workflow reverts to a known-good commit.
- **Review before live.** Changes land here first (`draft → review → approved`), then push to the live record — not the other way around.
- **No duplication across clients.** Role logic is written once in `core/`; each client supplies only its deltas.
- **Client deliverable.** At handoff, export a client's overlay (+ the core it references) as a clean standalone repo.

## The two-layer model
MKAI is an agency: the same agent **roles** (SDR, CS rep, marketing manager) are
deployed for every client with different voice, products, and data. So prompts
split on two axes:

- **`core/`** — reusable, client-agnostic role templates. The canonical "how an SDR behaves."
- **`clients/<client>/`** — per-client deltas only. Brand voice, products, and any role overrides.

A workflow composes each agent prompt at runtime:
```
core/agents/<role>/system-prompt.md     ← reusable role logic (never edited per client)
        +
clients/<client>/brand.md               ← injected into ALL of that client's agents
        +
clients/<client>/agents/<role>/*.md     ← OPTIONAL per-agent override (only if the client deviates)
```
If a client's agent matches the core template, it needs **no file** under its
`agents/` — `brand.md` alone carries the context.

## Layout
```
prompts/
├── README.md
├── _TEMPLATE.md                # copy to start a new core prompt
├── core/
│   ├── agents/<role>/          # slug = {first}-{last}-{role}; function agents keep function slug
│   │   ├── system-prompt.md    # every role
│   │   ├── first-message.md    # customer-facing roles only
│   │   └── voicemail-scripts.md# phone-capable roles only (TCPA caveat inside)
│   └── emails/                 # reusable email skeletons
└── clients/
    ├── _template/              # copy this to onboard a client
    └── dorothy-dean/           # pilot client overlay
```

## The edit → live flow
1. Edit the prompt file (core or client overlay); bump `version`, add a change-log row.
2. Commit (the audit trail).
3. Update the live value in n8n / Airtable to match; set `status: live`.
4. n8n keeps reading from its node/Airtable — no GitHub API call in the workflow.

## Core registry — agent roles
Scaffolded from the canonical org chart on 2026-06-03; bodies are placeholders (`status: draft`).
| Role folder | Tier / role | Files | Memory bank |
|---|---|---|---|
| `chloe-dubois-chief-of-staff` | Orchestrator — Chief of Staff | system | `chloe-dubois.md` |
| `natalie-nair-sales-director` | Supervisor — Sales & CX | system, first-message, voicemail | `natalie-nair.md` |
| `mateo-silva-sdr` | Worker — Sales Development Rep | system, first-message, voicemail | `mateo-silva.md` |
| `tariq-al-mansoor-csr` | Worker — Customer Service Rep | system, first-message, voicemail | `tariq-al-mansoor.md` |
| `support-agent` | Worker — Post-Delivery Support | system, first-message | `support-agent.md` |
| `mei-ling-vance-marketing-manager` | Supervisor — Marketing | system | `mei-ling-vance.md` |
| `jamal-washington-content-designer` | Worker — Content Designer | system | `jamal-washington.md` |
| `website-manager-agent` | Worker — Website & SEO (in dev) | system | `website-manager-agent.md` |
| `aris-thorne-ops-manager` | Supervisor — Ops & Customer Success | system | `aris-thorne.md` |
| `elena-rostova-grant-writer` | Worker — Grant Writer | system | `elena-rostova.md` |
| `customer-success-agent` | Worker — Onboarding & Activation | system, first-message | `customer-success-agent.md` |

## Core registry — emails
| File | Purpose | Owner role |
|---|---|---|
| `core/emails/scorecard-notification.md` | Internal alert on new AI-assessment scorecard | `mateo-silva.md` |
| `core/emails/client-scorecard-delivery.md` | Delivers completed scorecard to prospect | `natalie-nair.md` |
| `core/emails/follow-up-24hr.md` | 24h follow-up after scorecard, no response | `mateo-silva.md` |

## Clients
| Client | Status | Overlay |
|---|---|---|
| Dorothy Dean Designs | active (pilot) | `clients/dorothy-dean/` |

## Prompts living elsewhere (to migrate into core/)
Predate the library. Leave in place until the workflow is repointed, then move the
canonical copy here and replace the original with a pointer.
| Current location | What it is |
|---|---|
| `skills/grant-writer/prompt-library.md` | Staged grant-writing prompts → `core/agents/elena-rostova-grant-writer/` |
| `reference/dd-social-caption-prompt.md` | DDD social caption → `clients/dorothy-dean/` (client-specific) |
| `outputs/gsd-templates/*-prompt.md` | GSD subagent/phase templates |
| `reference/gsd/gate-prompts.md` | GSD gate prompts |

## ⚠️ Live-read disconnect (same caveat as memory-bank/agents)
Live n8n agents do **not** yet read prompts from this folder — prompts are still
embedded in workflow nodes. Until a workflow is explicitly pointed at its prompt
here, edits are **organizational only, not read at runtime**. Repointing is a
workflow edit, done in n8n directly. See `memory-bank/agents/README.md` for the
parallel note on memory banks.
