# MKAI Session Handoff
*Capsized: 2026-04-11*

## What Was Accomplished This Session

### 1. Git Repository Initialized & Pushed
- Repo created at `C:/Users/immav/Projects/model-engine/`
- All MKAI workspace files moved in: `context/`, `outputs/`, `reference/`, `scripts/`, `skills/`
- `.gitignore` created (covers OS, secrets, runtime artifacts)
- Pushed to GitHub: `https://github.com/admin23age/mkai-model-engine` (private)

### 2. Agent Division of Labor Established
- `CLAUDE.md` — Foundational Engineer (architecture, code, plans, system design)
- `GEMINI.md` — Operations Agent (workflows, data sync, reporting, automation)
- Both files live in repo root and on the VM

### 3. Claude Slash Commands in Repo
- `.claude/commands/` added to repo — commands travel with the codebase
- Available: `/prime`, `/create-plan`, `/implement`, `/grant-writer`

### 4. Home Directory Redirect
- `C:/Users/immav/CLAUDE.md` updated to redirect both CLIs to the repo

### 5. Oracle VM — LIVE (us-phoenix-1)
- **Public IP:** `129.151.26.21`
- **Private IP:** `10.0.0.159`
- **Compartment:** `dddesigns12` (root)
- **VCN CIDR:** `10.0.0.0/16`
- **SSH Key:** `claude-bunker` added to GitHub
- **Stack confirmed:**
  - Claude Code v2.1.101 ✅ authenticated
  - Gemini CLI 0.37.1 ✅ running
  - Node.js v20 ✅
  - PM2 ✅ (MCP server)
  - Git ✅
  - Repo cloned at `/root/mkai-model-engine/`
  - Cron auto-pull every 15 min ✅
- `/root/.gemini/` created with `GEMINI.md` system constitution
- `/root/.claude/settings.json` configured (plan mode, no curl/wget)

---

## Remaining — Next Session Priorities

### Priority 1 — Open Oracle Security List Ports
> OCI Console → Networking → VCN dddesigns12 → Security Lists → Add Ingress Rules

| Port | Purpose |
|---|---|
| 22 | SSH |
| 80 | HTTP |
| 443 | HTTPS / webhooks |
| 5678 | n8n UI |

Also run on VM after ports open:
```bash
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 5678 -j ACCEPT
sudo iptables-save | sudo tee /etc/iptables/rules.v4
```

### Priority 2 — Docker + n8n on VM
```bash
# Install Docker
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Run n8n via Docker
docker run -d --restart unless-stopped \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```

### Priority 3 — Twingate Connector on VM
- Install Twingate Connector so the VM joins the private network as a node
- Allows Claude/Gemini on VM to be accessed securely without public exposure

### Priority 4 — AGE-core-infrastructure Repo
- Review and migrate: `context/`, `Claude` file, Docker/Nginx configs
- Target: move useful infra configs into `mkai-model-engine/reference/` or new `infra/` folder
- Then delete the old repo

### Priority 5 — MCP Config on VM
- Update `.mcp.json` to point MCP server at VM once n8n is live

---

## Daily Workflow (From Now On)

```bash
# Windows (dev/engineer)
cd C:/Users/immav/Projects/model-engine
claude

# Oracle VM (ops)
cd ~/mkai-model-engine && git pull
claude --permission-mode plan   # Claude as engineer
gemini                          # Gemini as ops agent
```

## Key Reference Files
- `reference/vm-stack-status.md` — full VM state
- `reference/vm-gemini-install.md` — original VM setup guide
- `GEMINI.md` — Gemini ops constitution
- `CLAUDE.md` — Claude engineer constitution
