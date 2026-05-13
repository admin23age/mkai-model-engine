---
name: github
description: Use when working with the MKAI GitHub repository — branching, commits, PRs, workflow exports, repo structure, or any git operations
---

## When to invoke this skill

Invoke this skill when the user:
- Asks about the MKAI repo structure or where files live
- Wants to commit, branch, or create a PR
- Is exporting n8n workflows and needs to know where to save them
- Asks about `.gitignore`, secrets, or what to keep out of the repo
- Wants to set up a new developer on the project (onboarding)
- Asks about `/prime`, `/create-plan`, `/implement`, or `cs`/`cr` shell aliases

---

## Repository Overview

**Repo name:** `mkai` (private)
**Purpose:** Version control for Man Kind AI Tech — agent prompts, n8n workflows, skills, docs, and workspace config

---

## Directory Map

```
mkai/
├── CLAUDE.md                        ← workspace foundation — loaded every session via /prime
├── .claude/
│   ├── commands/
│   │   ├── prime.md                 ← /prime — initialize session context
│   │   ├── create-plan.md           ← /create-plan — plan before building
│   │   └── implement.md             ← /implement — execute a plan
│   └── skills/
│       ├── mkai-agents/             ← MKAI agent hierarchy skill
│       │   ├── SKILL.md
│       │   └── references/
│       └── github/                  ← this skill
│           └── SKILL.md
├── context/                         ← who MKAI is, current goals, priorities
│   ├── business-overview.md
│   ├── service-tiers.md
│   └── tech-stack.md
├── plans/                           ← dated implementation plans
├── outputs/                         ← deliverables and work products
├── reference/                       ← templates and reusable patterns
│   ├── audit-report-template.md
│   ├── snapshot-report-template.md
│   └── email-drip-templates/
├── scripts/                         ← automation scripts
├── agents/                          ← system prompts for every agent tier
│   ├── orchestrator/
│   │   └── system-prompt.md
│   ├── supervisors/
│   │   ├── sales/system-prompt.md
│   │   ├── delivery/system-prompt.md
│   │   └── operations/system-prompt.md
│   └── workers/
│       ├── sales/
│       ├── delivery/
│       └── ops/
├── workflows/
│   └── n8n/                         ← n8n workflow exports (JSON, no credentials)
└── docs/
    ├── architecture.md
    ├── deployment.md
    └── error-handling.md
```

---

## Session Workflow

Every developer session follows this pattern:

1. `cs` or `cr` in terminal (see Shell Aliases below)
2. `/prime` loads CLAUDE.md + context/
3. Use `/create-plan` before significant changes
4. Use `/implement` to execute plans
5. Claude updates CLAUDE.md if workspace structure changes

---

## Shell Aliases

Add to `~/.zshrc` (documented in `reference/shell-aliases.md`):

```bash
alias cs='claude "/prime"'          # Safe — prompts before each action
alias cr='claude --dangerously-skip-permissions "/prime"'  # Fast — no prompts
```

- Use `cs` for unfamiliar or sensitive tasks
- Use `cr` for trusted, routine work

---

## Branching Strategy

```
main      ← production-ready (agents, workflows, skills)
dev       ← integration and testing
feature/* ← new agents, new skills, new workflows
fix/*     ← corrections to existing agents or prompts
```

**Naming examples:**
- `feature/quote-agent-v2`
- `feature/snapshot-n8n-workflow`
- `fix/ops-supervisor-prompt`

---

## Commit Conventions

```
feat: add quote agent system prompt
fix: correct error handling in ops supervisor
chore: export n8n orchestrator workflow
docs: update service tiers in context/
refactor: restructure workers/ folder
```

---

## What to Commit vs. Keep Secret

| Commit | Keep Secret (env vars / vault) |
|---|---|
| Agent system prompts | Zoho API keys |
| n8n workflow JSON (no creds) | Airtable tokens |
| Skill files | Gmail OAuth secrets |
| CLAUDE.md + commands | Square API keys |
| Docs and templates | n8n credentials |
| Shell alias docs | Webhook URLs (if sensitive) |

**`.gitignore` must include:**
```
.env
*.env.local
secrets/
credentials/
node_modules/
__pycache__/
```

---

## Exporting n8n Workflows

1. In n8n: open workflow → ⋮ menu → **Download**
2. Save to `workflows/n8n/<workflow-name>.json`
3. Strip any embedded credential IDs before committing
4. Commit with: `git commit -m "chore: export <workflow-name> workflow"`

---

## Onboarding a New Developer

1. Clone the repo
2. Add shell aliases to `~/.zshrc` → `source ~/.zshrc`
3. Run `cs` to start a session — `/prime` will orient Claude automatically
4. Read `CLAUDE.md` and `context/` files
5. Import n8n workflows from `workflows/n8n/` into your n8n instance
6. Add credentials in n8n (not stored in repo)
