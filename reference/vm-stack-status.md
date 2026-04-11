# MKAI Oracle VM — Stack Status
*Last verified: 2026-04-11*

## VM Details

| Property | Value |
|---|---|
| Provider | Oracle Cloud Infrastructure |
| Region | us-phoenix-1 |
| Compartment | dddesigns12 (root) |
| VCN CIDR | 10.0.0.0/16 |
| Public IP | 129.151.26.21 |
| Private IP | 10.0.0.159 |
| User | root (cloudshell) |
| Access | Twingate → SSH (`ssh oracle-vm`) |
| VCN Created | Apr 8, 2026 |

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

## Oracle Security List — Required Port Rules

Before n8n webhooks and external access work, open these ports in the VCN Security List:

| Port | Protocol | Direction | Purpose |
|---|---|---|---|
| 22 | TCP | Ingress | SSH access |
| 80 | TCP | Ingress | HTTP (redirect to HTTPS) |
| 443 | TCP | Ingress | HTTPS (n8n UI + webhooks) |
| 5678 | TCP | Ingress | n8n direct access (dev only) |
| All traffic | Any | Egress | Outbound (already open by default) |

**To open in Oracle Cloud:**
> OCI Console → Networking → Virtual Cloud Networks → `dddesigns12` → Security Lists → Default Security List → Add Ingress Rules

Also open ports in the VM OS firewall:
```bash
sudo iptables -I INPUT -p tcp --dport 443 -j ACCEPT
sudo iptables -I INPUT -p tcp --dport 5678 -j ACCEPT
sudo iptables-save | sudo tee /etc/iptables/rules.v4
```

---

## Pending

- [ ] Open Security List ports (22, 80, 443, 5678) in Oracle VCN
- [ ] Docker + n8n install on VM
- [ ] Twingate Connector configured on VM
- [ ] `.mcp.json` updated to point MCP server at VM
- [ ] Update CLAUDE.md deployment status (VM is now live)
