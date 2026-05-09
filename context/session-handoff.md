# MKAI Session Handoff
*Capsized: 2026-05-08*

## What Was Accomplished This Session

### 1. Git Repository — Fully Operational
- Repo: `https://github.com/admin23age/mkai-model-engine` (private)
- Local: `C:/Users/immav/Projects/model-engine/`
- `.claude/commands/` in repo — `/prime`, `/create-plan`, `/implement`, `/grant-writer`
- Home `C:/Users/immav/CLAUDE.md` redirects to repo

### 2. Agent Division of Labor — Locked
- `CLAUDE.md` → Foundational Engineer (architecture, code, plans)
- `GEMINI.md` → Operations Agent (workflows, data sync, reporting)
- Both files in repo root and on Oracle VM

### 3. Oracle VM — Live (us-phoenix-1)
- **Public IP:** `129.151.26.21`
- **Private IP:** `10.0.0.159`
- **Compartment:** `dddesigns12` (root)
- **VCN CIDR:** `10.0.0.0/16`
- **Twingate Tenant:** `mychitchat126.twingate.com`

**Confirmed stack on VM:**
| Tool | Version | Status |
|---|---|---|
| Claude Code | v2.1.101 | ✅ Authenticated |
| Gemini CLI | 0.37.1 | ✅ Running |
| Node.js | v20.x | ✅ |
| PM2 | latest | ✅ MCP server running |
| Git | latest | ✅ Repo cloned at `/root/mkai-model-engine/` |
| Cron auto-pull | */15 * * * * | ✅ |

**Claude Code config on VM:**
- Path: `/root/.claude/settings.json`
- Mode: `--permission-mode plan`
- Denied: WebFetch, WebSearch, Bash(curl *), Bash(wget *)

**Gemini config on VM:**
- `/root/.gemini/` created ✅
- `/root/.gemini/GEMINI.md` system constitution ✅

### 4. Oracle Security List — Ports Open
| Port | Purpose | Status |
|---|---|---|
| 22 | SSH | ✅ Open |
| 80 | HTTP | ✅ Open |
| 443 | HTTPS / Webhooks | ✅ Open |
| 5678 | n8n UI | ✅ Open (lock to Twingate CIDR after connector deployed) |

---

## Remaining — Next Session Priorities

### Priority 1 — OS Firewall (iptables) on VM ⬅ IMMEDIATE
Not yet confirmed. Run on VM:
```bash
sudo iptables -I INPUT -p tcp --dport 80 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 5678 -j ACCEPT
sudo iptables-save | sudo tee /etc/iptables/rules.v4
```
Verify:
```bash
sudo iptables -L INPUT --line-numbers | grep -E "80|443|5678"
```

### Priority 2 — Twingate Connector on VM
Twingate client is on Windows (`mychitchat126.twingate.com`) but **connector is NOT deployed on the VM yet.**

**Steps:**
1. Twingate Admin → Remote Networks → Add Network → `oracle-vm-phoenix`
2. Connectors → Deploy Connector → copy token
3. On VM:
```bash
curl -s https://binaries.twingate.com/connector/setup.sh | sudo bash
sudo twingate-connector setup --token YOUR_TOKEN_HERE
sudo systemctl enable twingate-connector
sudo systemctl start twingate-connector
```
4. Add Resource: `10.0.0.159`
5. After connector live → lock OCI Security List port 5678 source to Twingate CIDR (remove `0.0.0.0/0`)

### Priority 3 — Docker + n8n on VM
```bash
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER
docker run -d --restart unless-stopped \
  --name n8n \
  -p 5678:5678 \
  -v ~/.n8n:/home/node/.n8n \
  n8nio/n8n
```
Verify: `docker ps | grep n8n`
Access: `http://10.0.0.159:5678` via Twingate

### Priority 4 — AGE-core-infrastructure Repo Migration
- Review: `context/`, `Claude` file, Docker/Nginx configs
- Migrate useful infra configs → `mkai-model-engine/reference/` or new `infra/`
- Then delete `AGE-core-infrastructure` repo

### Priority 5 — n8n Workflow Credentials & Imports
From `dd-automation-status.md`:
- Import: `DD_Personalized_Outreach.json`, `DD_Content_Repurposing.json` (JSONs in `outputs/`)
- Connect: Twilio (Text Support), Calendly (Appointment Setting)
- Connect: Gmail OAuth2, Google Calendar OAuth2, Airtable token, Gemini API
- Confirm: Zoho Flow webhook URL for workflow #12

### Priority 6 — MCP Config Update
- Update `.mcp.json` to point MCP server at VM once n8n is live

---

## Daily Workflow
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
- `reference/vm-gemini-install.md` — VM setup guide
- `context/dd-automation-status.md` — n8n workflow tracker
- `GEMINI.md` — Gemini ops constitution
- `CLAUDE.md` — Claude engineer constitution
