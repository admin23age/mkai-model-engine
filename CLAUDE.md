# CLAUDE.md

This file provides guidance to Claude when working in this repository.

---

## What This Is

This is the **Man Kind AI Tech (MKAI) workspace** — a structured environment for building, deploying, and managing MKAI's agent hierarchy, n8n workflows, skills, and client delivery systems.

**This file (CLAUDE.md) is the foundation.** It is automatically loaded at the start of every session. Keep it current — it is the single source of truth for how Claude should understand and operate within this workspace.

---

## The Claude–User Relationship

| Role | Responsibility |
|---|---|
| **User** | Defines goals, provides context about MKAI priorities, directs work through commands |
| **Claude** | Reads context, understands objectives, executes commands, produces outputs, maintains workspace |

Claude should always orient itself through `/prime` at session start, then act with full awareness of the MKAI business, agent hierarchy, and current priorities.

---

## Workspace Structure

```
.
├── CLAUDE.md                        # This file — core context, always loaded
├── .claude/
│   ├── commands/                    # Slash commands
│   │   ├── prime.md                 # /prime — session initialization
│   │   ├── create-plan.md           # /create-plan — plan before building
│   │   └── implement.md             # /implement — execute a plan
│   └── skills/
│       ├── mkai-agents/             # MKAI agent hierarchy skill
│       │   ├── SKILL.md
│       │   └── references/
│       │       ├── framework.md
│       │       ├── ops-supervisor.md
│       │       ├── sales-supervisor.md
│       │       └── delivery-supervisor.md
│       ├── github/                  # GitHub workflow skill
│       │   └── SKILL.md
│       ├── arcads-external-api/     # Arcads AI video/image API skill
│       │   ├── SKILL.md
│       │   ├── reference.md
│       │   └── prompting/
│       │       ├── guide.md
│       │       ├── brand-voice-starter.md
│       │       ├── prompt-library/   # Per-model prompt templates
│       │       ├── analyze-video/    # Reverse-engineer video styles
│       │       └── clone-ad/         # Clone existing video ads
│       └── generate-youtube-thumbnail/  # YouTube thumbnail generation
│           ├── SKILL.md
│           └── scripts/generate-batch.sh
├── context/                         # Who MKAI is, goals, priorities (read by /prime)
│   ├── business-overview.md
│   ├── service-tiers.md
│   └── tech-stack.md
├── plans/                           # Dated implementation plans (/create-plan output)
├── outputs/                         # Deliverables, reports, work products
├── reference/                       # Templates and reusable patterns
│   ├── shell-aliases.md             # cs / cr setup guide (bash, zsh, PowerShell)
│   ├── audit-report-template.md
│   ├── snapshot-report-template.md
│   └── email-drip-templates/
├── shared/
│   └── skills/generate-youtube-thumbnail/  # Shared prompting guides
├── scripts/                         # Automation scripts (incl. Arcads setup)
├── automations/
│   ├── gsd-agents/                  # GSD framework agent prompts (33 agents)
│   ├── gsd-hooks/                   # GSD lifecycle hooks
│   ├── gsd-scripts/                 # Security scanning scripts
│   ├── gsd-sdk/                     # GSD SDK package
│   ├── marketing-tools/             # Marketing tool registry
│   ├── n8n-workflows/               # n8n workflow exports (DD + MKAI)
│   └── grants/                      # Grant writer workflow templates
├── skills/
│   └── grant-writer/                # Grant writing skill
├── sop/                             # Standard Operating Procedures
├── memory-bank/
│   ├── ddd/                         # Dorothy Dean Designs memory
│   └── mkai/                        # MKAI thought leadership & case studies
├── references/                      # Arcads reference images (gitignored)
│   ├── influencers/                 # Face references for AI recreation
│   ├── products/                    # Product photos
│   ├── aesthetics/                  # Style/mood references
│   ├── logos/                       # Brand logos
│   └── examples/                    # Example content
├── logs/                            # API call logs
├── agents/                          # System prompts for every tier
│   ├── orchestrator/
│   ├── supervisors/
│   │   ├── sales/
│   │   ├── delivery/
│   │   └── operations/
│   └── workers/
│       ├── sales/
│       ├── delivery/
│       └── ops/
├── docs/
├── .gitignore
└── README.md
```

**Key directories:**

| Directory | Purpose |
|---|---|
| `context/` | MKAI business context, service tiers, tech stack. Read by `/prime`. |
| `plans/` | Dated implementation plans. Created by `/create-plan`, executed by `/implement`. |
| `outputs/` | Deliverables, reports, client-facing work products. |
| `reference/` | Templates, shell aliases, reusable patterns. |
| `agents/` | System prompts for orchestrator, supervisors, and all workers. |
| `workflows/n8n/` | Exported n8n workflows (no credentials committed). |
| `.claude/skills/arcads-external-api/` | Arcads AI video/image generation via external API (Seedance 2, Sora 2, Veo 3.1, Kling, Nano Banana). |
| `.claude/skills/generate-youtube-thumbnail/` | YouTube thumbnail generation using Nano Banana 2 via Arcads. |
| `shared/` | Shared prompting guides used across skills. |
| `logs/` | API call logs (arcads-api.jsonl). |
| `automations/gsd-agents/` | GSD (Get Stuff Done) framework — 33 specialized agent prompts for dev, research, security, and planning. |
| `automations/n8n-workflows/` | n8n workflow exports for DD and MKAI (content planning, captions, publishing). |
| `skills/grant-writer/` | Grant writing skill with prompt library and weekly workflow. |
| `sop/` | Standard Operating Procedures (grant writing, skills management). |
| `memory-bank/` | Persistent memory for DDD and MKAI brands (identity, faith, tech, case studies). |
| `references/` | Arcads reference images — influencers, products, aesthetics (gitignored). |

---

## Commands

### /prime

**Purpose:** Initialize a new session with full context awareness.

Run at the start of every session. Claude will:
1. Read CLAUDE.md and all files in `context/`
2. Summarize understanding of MKAI, workspace structure, and current priorities
3. Confirm readiness to assist

### /create-plan [request]

**Purpose:** Create a detailed implementation plan before making changes.

Use when adding new agents, skills, workflows, or making structural changes. Produces a plan document in `plans/` with context, rationale, and step-by-step tasks.

Example: `/create-plan add a quote agent for the sales supervisor`

### /implement [plan-path]

**Purpose:** Execute a plan created by /create-plan.

Reads the plan, executes each step in order, validates the work, and updates the plan status.

Example: `/implement plans/2026-04-04-quote-agent.md`

### /grant-writer

**Purpose:** Activate the grant writing workflow for MKAI grant applications.

Loads grant context, profile, and prompt library for structured grant writing sessions.

---

## Critical Instruction: Maintain This File

**Whenever Claude makes changes to the workspace, Claude MUST consider whether CLAUDE.md needs updating.**

After any change — adding commands, agents, skills, workflows, or modifying structure — ask:

1. Does this change add new functionality users need to know about?
2. Does it modify the workspace structure documented above?
3. Should a new command or skill be listed?
4. Does `context/` need new files to capture this?

If yes to any, update the relevant sections. This file must always reflect the current state of the workspace.

---

## Session Workflow

1. **Start** — Run `cs` or `cr` in terminal (see `reference/shell-aliases.md`)
2. **Prime** — `/prime` loads this file + `context/` files
3. **Plan** — `/create-plan` before any significant addition or change
4. **Build** — `/implement` to execute the plan
5. **Maintain** — Claude updates CLAUDE.md as the workspace evolves

---

## MKAI Model Engine

This workspace incorporates the **MKAI Model Engine** — the central AI operations platform. It includes the GSD (Get Stuff Done) framework with 33 specialized agents, the grant writer skill, marketing automation tools, and memory banks for both MKAI and Dorothy Dean Designs.

**Pilot Project:** Dorothy Dean Designs — faith-based luxury streetwear, LIFT collection. Connected to Zoho CRM, Zoho Books, Airtable, n8n, and Gmail via MCP.

**Deployment:** Oracle VM (`us-phoenix-1`, IP: `129.151.26.21`) running Claude Code + Gemini CLI. See `reference/vm-stack-status.md` for details.

---

## Arcads Integration

- **API:** Arcads external API (`https://external-api.arcads.ai`)
- **Auth:** HTTP Basic via `ARCADS_BASIC_AUTH` or `ARCADS_API_KEY` in `.env`
- **Setup:** Run `./scripts/setup.sh` to configure API key and create `MASTER_CONTEXT.md`
- **Skill:** `.claude/skills/arcads-external-api/SKILL.md` — full API reference, prompting, and polling
- **YouTube thumbnails:** `.claude/skills/generate-youtube-thumbnail/SKILL.md` — Nano Banana 2 image generation
- **Cost disclosure:** Always present credit totals as estimates — confirm exact pricing in Arcads platform
- **Logging:** Every generation call logged to `logs/arcads-api.jsonl`
- **Sign up:** [arcads.ai](https://arcads.ai/?via=caleb) — get API key at Settings > API

---

## Notes

- Keep context minimal but sufficient — avoid bloat
- Plans live in `plans/` with dated filenames (e.g., `2026-04-04-quote-agent.md`)
- Outputs are organized by type/purpose in `outputs/`
- Never commit credentials — use env vars or a secrets manager
- n8n workflows: export as JSON, strip credential IDs before committing
