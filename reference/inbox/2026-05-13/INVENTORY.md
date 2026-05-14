# Inbox — 2026-05-13

Five folders dropped from `C:\Users\immav\Downloads\` for triage. Staged verbatim; nothing has been merged into canonical reference yet.

## Sources

| Folder | Contents | Notes |
|---|---|---|
| `agents/` | `AGENT_SPEC.md`, `FRAMEWORK.md`, `Workflows/` (DD_* n8n JSONs, ChatbotWidget.jsx, multi-agent arch SVG, horizons export) | Dorothy Dean–specific workflows; multiple chatbot revisions (FINAL, FINAL_1, FIXED, GEMINI) |
| `ai-agent-workflows/` | `COPILOT_DEPLOYMENT_GUIDE.md`, `FRAMEWORK_v2.md`, admin-supervisor / calendar-manager / email-router / marketing / website-maintenance workflow JSONs + admin-supervisor zip | Generic MKAI workflow set; v2 framework |
| `mkai-agents-skill/skill/` | `SKILL.md`, `references/framework.md`, `references/ops-supervisor.md` | Claude skill packaging of the agent framework |
| `mkai-simple-agents-2/` | `MKAI_AGENT_SYSTEM.md`, `workflows/` (supervisor + admin/sales/marketing/customer-service agents) | Simplified agent set, v2 |
| `mkai-claude-config/` | `claude.md`, `hooks/HOOKS.md` + `webhooks.json`, `json/` (credentials-template, permissions, safety), `rules/` (API_CONVENTIONS, RULES) | Claude Code configuration bundle |

## Overlap to resolve

- **Framework docs:** `agents/FRAMEWORK.md` vs `ai-agent-workflows/FRAMEWORK_v2.md` vs `mkai-agents-skill/skill/references/framework.md` vs canonical `reference/mkai-agent-framework.md`. Pick latest, fold into canonical.
- **Agent system docs:** `mkai-simple-agents-2/MKAI_AGENT_SYSTEM.md` vs canonical `reference/mkai-agent-system-v1.md`.
- **Chatbot workflows:** 4 variants of DD_Website_Chatbot in `agents/Workflows/` — keep `_GEMINI` (per memory: always Gemini), archive rest.

## Next actions

1. Diff framework docs → write canonical `reference/mkai-agent-framework.md` v2.
2. Move DD-specific workflows to `automations/dorothy-dean/` (Gemini variant as primary).
3. Move generic workflows to `automations/mkai/`.
4. Evaluate `mkai-claude-config/` for installation into `.claude/`.
5. Delete this inbox folder once triaged.
