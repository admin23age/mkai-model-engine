# Oracle VM — Gemini CLI Install Guide
*MKAI Model Engine | Ubuntu | One-time setup*

---

## Prerequisites
- SSH access to VM (`ssh oracle-vm` via Twingate)
- VM username: `ubuntu`
- VM private IP: `10.0.0.159`

---

## Step 1 — Connect to the VM

```bash
ssh oracle-vm
```

---

## Step 2 — Update the System

```bash
sudo apt update && sudo apt upgrade -y
```

---

## Step 3 — Install Node.js v20+

```bash
# Add NodeSource repo for Node 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -

# Install Node.js
sudo apt install -y nodejs

# Verify
node -v    # should show v20.x.x
npm -v     # should show 10.x.x
```

---

## Step 4 — Install Gemini CLI

```bash
# Install globally
sudo npm install -g @google/gemini-cli

# Verify
gemini --version
```

---

## Step 5 — Authenticate Gemini CLI

```bash
gemini auth
```

This opens a browser auth flow. If the VM has no browser, use API key mode instead:

```bash
# Set API key (get from aistudio.google.com)
echo 'export GEMINI_API_KEY="AIza..."' >> ~/.bashrc
source ~/.bashrc

# Test it
gemini -p "say hello" --model gemini-2.0-flash
```

---

## Step 6 — Install Gemini MCP Server

```bash
sudo npm install -g @fre4x/gemini

# Verify location
ls /usr/local/lib/node_modules/@fre4x/gemini/dist/index.js
```

---

## Step 7 — Install PM2 (Process Manager)

```bash
sudo npm install -g pm2

# Start MCP server as a persistent service
pm2 start node --name gemini-mcp -- /usr/local/lib/node_modules/@fre4x/gemini/dist/index.js

# Save process list so it survives reboots
pm2 save

# Auto-start PM2 on system boot
pm2 startup
# → copy and run the command it outputs (starts with sudo env...)
```

---

## Step 8 — Verify Everything is Running

```bash
# Check PM2 service
pm2 status

# Test Gemini CLI
gemini -p "confirm you are online" --model gemini-2.0-flash

# Check Node version
node -v

# Check npm globals
npm list -g --depth=0
```

Expected output from `pm2 status`:
```
┌──────────────┬────┬─────────┬──────┬───────┬──────────┐
│ name         │ id │ mode    │ pid  │ status│ cpu      │
├──────────────┼────┼─────────┼──────┼───────┼──────────┤
│ gemini-mcp   │ 0  │ fork    │ xxxx │ online│ 0%       │
└──────────────┴────┴─────────┴──────┴───────┴──────────┘
```

---

## Step 9 — Update CLAUDE.md SSH Config (Windows)

Once VM is confirmed working, update `C:\Users\immav\.mcp.json` to point to the VM's MCP server instead of the local Windows install:

```json
{
  "mcpServers": {
    "gemini": {
      "command": "ssh",
      "args": ["oracle-vm", "node /usr/local/lib/node_modules/@fre4x/gemini/dist/index.js"],
      "env": {
        "GEMINI_API_KEY": "AIza..."
      }
    }
  }
}
```

---

## Installed Stack After This Guide

| Tool | Location | Purpose |
|---|---|---|
| Node.js v20 | `/usr/bin/node` | Runtime |
| Gemini CLI | `/usr/local/bin/gemini` | Free-tier AI in terminal + scripts |
| @fre4x/gemini | `/usr/local/lib/node_modules/@fre4x/gemini` | MCP server for Claude Code + n8n |
| PM2 | `/usr/local/bin/pm2` | Keeps MCP server alive on reboot |

---

## Cost Model

| Usage | Cost |
|---|---|
| Gemini CLI (`gemini -p "..."`) | Free (Google AI Studio free tier) |
| MCP server (tools via Claude Code) | Free (same API key) |
| n8n Execute Command → gemini | Free |

**Total recurring cost for Gemini on VM: $0/month**

---

## Next Steps After This Guide
- [ ] Install Docker + n8n on VM
- [ ] Configure Twingate Connector on VM
- [ ] Assign Ephemeral Public IP to Oracle VNIC
- [ ] Initialize `model-engine` GitHub repo
