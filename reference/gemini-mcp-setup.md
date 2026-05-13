# Gemini MCP Setup Guide
*MKAI Model Engine — Gemini Integration*

---

## What's Installed (Windows Machine)

| Package | Version | Purpose |
|---|---|---|
| `@google/gemini-cli` | 0.37.0 | Gemini CLI for terminal use (`gemini` command) |
| `@fre4x/gemini` | 1.0.53 | Gemini MCP server — exposes Gemini as a tool to Claude Code + n8n |

**MCP server path:** `C:\Users\immav\AppData\Roaming\npm\node_modules\@fre4x\gemini\dist\index.js`

---

## Step 1: Get Your Gemini API Key

1. Go to **Google AI Studio** (aistudio.google.com)
2. Click **Get API key** → **Create API key**
3. Copy the key (starts with `AIza...`)

---

## Step 2: Activate Gemini MCP in Claude Code

Edit `C:\Users\immav\.mcp.json` — replace `YOUR_GEMINI_API_KEY_HERE` with your actual key:

```json
{
  "mcpServers": {
    "gemini": {
      "command": "node",
      "args": ["C:\\Users\\immav\\AppData\\Roaming\\npm\\node_modules\\@fre4x\\gemini\\dist\\index.js"],
      "env": {
        "GEMINI_API_KEY": "AIza..."
      }
    }
  }
}
```

Then **restart Claude Code** — the `gemini` MCP tool will appear in your tool list.

---

## Step 3: Use Gemini in n8n (Current — Cloud n8n)

While n8n is hosted at `agegroup.app.n8n.cloud`, Gemini is accessed via HTTP Request node (same pattern as Anthropic API):

**HTTP Request node config:**
- Method: `POST`
- URL: `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={{ $env.GEMINI_API_KEY }}`
- Body (JSON):
```json
{
  "contents": [{ "parts": [{ "text": "{{ $json.prompt }}" }] }]
}
```

**Parse response:** `$json.candidates[0].content.parts[0].text`

---

## Step 4: Oracle VM Setup (Future — Unlocks Full MCP Integration)

Once Oracle VM is configured with Twingate, you can run Gemini CLI directly in n8n:

### On Oracle VM:
```bash
# Install Node + Gemini CLI
npm install -g @google/gemini-cli
npm install -g @fre4x/gemini

# Auth Gemini CLI (run once)
gemini auth

# Set API key
echo 'export GEMINI_API_KEY="AIza..."' >> ~/.bashrc
source ~/.bashrc

# Run MCP server as a service (PM2)
npm install -g pm2
pm2 start node --name gemini-mcp -- /usr/local/lib/node_modules/@fre4x/gemini/dist/index.js
pm2 save
pm2 startup
```

### In n8n (once on VM):
Use **Execute Command** node instead of HTTP Request:
```bash
gemini -p "{{ $json.prompt }}" --model gemini-2.0-flash
```
No API key rotation needed — uses OAuth from `gemini auth`.

---

## Current Architecture

```
Claude Code (Windows)
    └── .mcp.json → node @fre4x/gemini → GEMINI_API_KEY → Google AI

n8n (agegroup.app.n8n.cloud) — CURRENT
    └── HTTP Request node → generativelanguage.googleapis.com → GEMINI_API_KEY

n8n (Oracle VM) — FUTURE
    └── Execute Command → gemini CLI → OAuth (no API key needed)
    └── OR: HTTP to localhost MCP server (secured by Twingate)
```

---

## Which Workflow Uses Gemini

| Workflow | Model | Status |
|---|---|---|
| DD Personalized Outreach | Currently Claude Haiku → migrate to Gemini | JSON ready, not imported |
| DD Content Repurposing | Currently Claude Haiku → optionally migrate | JSON ready, not imported |
| DD Social Caption Generator | Gemini (reference prompt written) | In reference/ folder |

---

## Note on bin conflict

`@fre4x/gemini` and `@google/gemini-cli` both register the `gemini` bin. If `gemini` stops working as CLI after MCP install, reinstall CLI:
```
npm install -g @google/gemini-cli --force
```
