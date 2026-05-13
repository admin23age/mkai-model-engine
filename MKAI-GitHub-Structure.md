# MKAI GitHub Repository — Setup & Structure

## Overview

This document is the complete reference for:
1. How Claude skills are structured (the anatomy)
2. The full MKAI GitHub repo layout (merging CLAUDE.md workspace + MKAI agents)
3. Shell aliases for launching Claude sessions
4. Where the GitHub skill lives and what it does

---

## 1. Skill Anatomy

Every skill lives in `.claude/skills/<skill-name>/` and follows this pattern:

```
skill-name/
├── SKILL.md          ← REQUIRED — frontmatter + instructions Claude reads on invoke
├── references/       ← optional — context docs (agent specs, schemas, lookup tables)
│   └── *.md
├── scripts/          ← optional — Python/JS helpers Claude can run via Bash
│   └── *.py
├── agents/           ← optional — sub-agent system prompts
│   └── *.md
└── LICENSE.txt       ← optional
```

**SKILL.md frontmatter:**
```markdown
---
name: skill-name
description: One-line trigger description — this is what Claude matches against user requests
---
```

The `description` field is critical — it determines when Claude auto-invokes the skill. Include specific trigger phrases and actions.

---

## 2. Full MKAI GitHub Repository Structure

This merges the Claude Workspace Template (CLAUDE.md + commands) with the MKAI-specific agent and workflow structure.

```
mkai/
│
├── CLAUDE.md                            ← workspace foundation, loaded every session
│
├── .claude/
│   ├── commands/                        ← slash commands
│   │   ├── prime.md                     ← /prime — initialize session
│   │   ├── create-plan.md               ← /create-plan — plan before building
│   │   └── implement.md                 ← /implement — execute a plan
│   └── skills/
│       ├── mkai-agents/                 ← MKAI agent hierarchy skill
│       │   ├── SKILL.md
│       │   └── references/
│       │       ├── framework.md
│       │       ├── ops-supervisor.md
│       │       ├── sales-supervisor.md
│       │       └── delivery-supervisor.md
│       └── github/                      ← GitHub repo skill (this project)
│           └── SKILL.md
│
├── context/                             ← who MKAI is, goals, priorities (read by /prime)
│   ├── business-overview.md
│   ├── service-tiers.md
│   └── tech-stack.md
│
├── plans/                               ← dated implementation plans (/create-plan output)
│
├── outputs/                             ← deliverables, reports, work products
│
├── reference/                           ← templates and reusable patterns
│   ├── shell-aliases.md                 ← cs / cr setup guide
│   ├── audit-report-template.md
│   ├── snapshot-report-template.md
│   └── email-drip-templates/
│       └── *.md
│
├── scripts/                             ← automation scripts
│
├── agents/                              ← system prompts for every tier
│   ├── orchestrator/
│   │   └── system-prompt.md
│   ├── supervisors/
│   │   ├── sales/system-prompt.md
│   │   ├── delivery/system-prompt.md
│   │   └── operations/system-prompt.md
│   └── workers/
│       ├── sales/
│       │   ├── discovery-agent.md
│       │   ├── quote-agent.md
│       │   └── lead-chat-agent.md
│       ├── delivery/
│       │   ├── snapshot-agent.md
│       │   ├── full-audit-agent.md
│       │   ├── governance-agent.md
│       │   └── enterprise-agent.md
│       └── ops/
│           ├── crm-sync-agent.md
│           ├── email-drip-agent.md
│           ├── report-gen-agent.md
│           └── task-scheduler-agent.md
│
├── workflows/
│   └── n8n/                             ← n8n workflow exports (JSON, no credentials)
│       ├── orchestrator.json
│       ├── sales-supervisor.json
│       ├── delivery-supervisor.json
│       ├── ops-supervisor.json
│       └── workers/
│           └── *.json
│
├── docs/
│   ├── architecture.md
│   ├── deployment.md
│   ├── error-handling.md
│   └── data-sources.md
│
├── .gitignore
└── README.md
```

---

## 3. CLAUDE.md — The Workspace Foundation

`CLAUDE.md` sits at the repo root and is **automatically loaded at the start of every Claude session**. It is the single source of truth for how Claude understands and operates within this workspace.

### What it tells Claude

- What this workspace is and how it's organized
- The Claude–user relationship and how to operate
- Which commands exist and what they do
- How to maintain itself as the workspace evolves

### The Claude–User relationship model

| Role | Responsibility |
|---|---|
| **User** | Defines goals, provides context, directs work through commands |
| **Claude** | Reads context, understands objectives, executes commands, produces outputs, maintains workspace |

Claude should always orient itself through `/prime` at session start, then act with full awareness of who the user is, what they're trying to achieve, and how this workspace supports that.

### Session workflow
```
1. Start    → run cs or cr in terminal (aliases below)
2. Prime    → /prime loads CLAUDE.md + context/ files
3. Plan     → /create-plan before any significant change
4. Build    → /implement to execute the plan
5. Maintain → Claude updates CLAUDE.md if structure changes
```

### Critical rule — Maintain this file

After **any** change to the workspace, Claude must ask:

1. Does this add new functionality users need to know about?
2. Does it modify the workspace structure?
3. Should a new command be listed?
4. Does `context/` need new files to capture this?

If yes to any → update CLAUDE.md. Examples:
- Adding a new slash command → add to Commands section
- Creating a new output type → document in Workspace Structure
- Adding a script → document its purpose and usage
- Changing workflow patterns → update relevant documentation

---

## 4. Shell Aliases

Two aliases streamline launching Claude sessions. Choose the setup for your OS.

### macOS / Linux (bash or zsh)

Add to `~/.zshrc` or `~/.bashrc`:

```bash
alias cs='claude "/prime"'
alias cr='claude --dangerously-skip-permissions "/prime"'
```

Reload: `source ~/.zshrc`

### Windows (PowerShell)

Add to your PowerShell profile (`$PROFILE`):

```powershell
function cs { claude "/prime" }
function cr { claude --dangerously-skip-permissions "/prime" }
```

Reload: `. $PROFILE`

To find your profile path: `echo $PROFILE`
If the profile file doesn't exist yet: `New-Item -Path $PROFILE -ItemType File -Force`

### Both aliases explained

| Alias | Name | Behavior | When to use |
|---|---|---|---|
| `cs` | Claude Safe | Asks permission before each action | Unfamiliar tasks, sensitive ops |
| `cr` | Claude Run | No permission prompts | Trusted, routine workflows |

Both run `/prime` automatically so Claude starts fully oriented every session.

---

## 5. Slash Commands

| Command | Purpose |
|---|---|
| `/prime` | Load CLAUDE.md + context/, orient Claude to workspace and goals |
| `/create-plan [request]` | Draft a detailed plan in `plans/` before making changes |
| `/implement [plan-path]` | Execute a saved plan step by step |

### `/prime`
Run at the start of every session. Claude will:
1. Read CLAUDE.md and all files in `context/`
2. Summarize its understanding of the user, workspace, and goals
3. Confirm readiness to assist

### `/create-plan [request]`
Use before adding new functionality, commands, scripts, or making structural changes. Produces a thorough plan document in `plans/` with context, rationale, and step-by-step tasks.

Example: `/create-plan add a quote agent for the sales supervisor`
→ Claude writes `plans/2026-04-04-quote-agent.md`

### `/implement [plan-path]`
Reads the plan, executes each step in order, validates the work, and updates the plan status.

Example: `/implement plans/2026-04-04-quote-agent.md`
→ Claude builds the agent, updates CLAUDE.md

---

## 6. What to Commit vs. Keep Secret

| Commit to GitHub | Keep in env vars / secrets manager |
|---|---|
| Agent system prompts (`agents/`) | Zoho, Airtable, Gmail, Square API keys |
| n8n workflow JSON (no creds) | n8n credential objects |
| Skill files (`.claude/skills/`) | OAuth tokens |
| CLAUDE.md + commands | Webhook URLs (if sensitive) |
| Docs, templates, reference | Customer PII or financial data |

**`.gitignore`:**
```
.env
*.env.local
secrets/
credentials/
node_modules/
__pycache__/
*.pyc
```

---

## 7. Branching Strategy

```
main      ← production-ready
dev       ← integration / staging
feature/* ← new agents, skills, workflows
fix/*     ← corrections to existing prompts or workflows
```

**Commit conventions:**
```
feat: add quote agent system prompt
fix: patch ops supervisor error routing
chore: export orchestrator n8n workflow
docs: update service tiers in context/
```

---

## 8. Exporting n8n Workflows

1. n8n → open workflow → ⋮ → **Download**
2. Save to `workflows/n8n/<workflow-name>.json`
3. Remove any embedded credential IDs
4. `git commit -m "chore: export <workflow-name> workflow"`

---

## 9. Quick Start (New Repo or New Developer)

```bash
# Clone or initialize
git clone https://github.com/<org>/mkai.git
cd mkai

# Add shell aliases
echo "alias cs='claude \"/prime\"'" >> ~/.zshrc
echo "alias cr='claude --dangerously-skip-permissions \"/prime\"'" >> ~/.zshrc
source ~/.zshrc

# Start a session
cs
# Claude will run /prime and orient to the workspace automatically
```

Then in n8n: import workflows from `workflows/n8n/` and add your credentials.
