# MKAI Oracle VM — Stack Status
*Last verified: 2026-04-11*

## VM Details

| Property | Value |
|---|---|
| Provider | Oracle Cloud Infrastructure |
| Region | us-phoenix-1 |
| User | root (cloudshell) |
| Private IP | 10.0.0.159 |
| Access | Twingate → SSH (`ssh oracle-vm`) |

---

## Installed Stack

| Tool | Version | Status |
|---|---|---|
| Node.js | v20.x | ✅ Running |
| Gemini CLI | 0.37.1 | ✅ Running |
| Claude Code | v2.1.101 | ✅ Authenticated |
| PM2 | latest | ✅ Running (MCP server) |
| Git | latest | ✅ Installed |

---

## Repo

| Property | Value |
|---|---|
| Remote | `git@github.com:admin23age/mkai-model-engine.git` |
| Local path | `/root/mkai-model-engine/` |
| Auth | SSH key (`claude-bunker`) added to GitHub |
| Sync | cron `*/15 * * * *` → `git pull` |

---

## Claude Code Config

Path: `/root/.claude/settings.json`

```json
{
  "permissions": {
    "deny": [
      "WebFetch",
      "WebSearch",
      "Bash(curl *)",
      "Bash(wget *)"
    ]
  }
}
```

Permission mode: `--permission-mode plan` (confirms before executing)

---

## Gemini Config

| Path | Purpose |
|---|---|
| `/root/.gemini/` | VM-local notes, logs, scratch |
| `/root/.gemini/GEMINI.md` | System-level ops constitution |
| `/root/mkai-model-engine/GEMINI.md` | Repo-level ops constitution |

---

## Agent Division of Labor (VM)

| Agent | Launch Command | Role |
|---|---|---|
| Claude | `cd ~/mkai-model-engine && claude --permission-mode plan` | Foundational Engineer |
| Gemini | `cd ~/mkai-model-engine && gemini` | Operations Agent |

---

## Pending

- [ ] Docker + n8n install on VM
- [ ] Twingate Connector configured on VM
- [ ] Ephemeral Public IP assigned to Oracle VNIC
- [ ] `.mcp.json` updated to point MCP server at VM
