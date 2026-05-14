# MKAI Content Engine — Session Handoff Brief
**Date:** 2026-05-11  
**Status:** Workflow A COMPLETE ✅ | Workflow B NOT STARTED ⏳  
**Next session:** Build Workflow B (Slack listener → publisher)

---

## What Was Built This Session

### Workflow A — Generator (LIVE)
- **n8n ID:** `8mmfbyucp1sBnhHg`
- **URL:** https://agegroup.app.n8n.cloud/workflow/8mmfbyucp1sBnhHg
- **Status:** Created, NOT yet activated (needs credentials first)

**Node chain (19 nodes):**
```
Airtable New Brief ──┐
                     ├──→ Normalize Input → Get Memory Bank → Build Prompt Context
Manual Brief Webhook ┘                                              │
                                                                    ↓
                                                          Generate Content (Claude)
                                                                    │
                                                          Parse Content Package
                                                                    │
                                                          Source Gate (source === 'airtable'?)
                                                          ├── true  → Update Airtable Record ──┐
                                                          └── false → Create Airtable Record ──┤
                                                                                               ↓
                                                                                    Merge Airtable Result
                                                                                               │
                                                                                    Enrich Record ID
                                                                                               │
                                                                                    Media Audit (mediaUrl present?)
                                                                                    ├── true  → Build Slack Blocks → Update Git Memory → Restore Slack Data → Slack Approval
                                                                                    └── false → Slack No Media Alert
```

**Key config values already baked in:**
- Airtable base: `appr0OjO1x803LE3z`, table: `tblqK7VyoP7vOT8Ux`
- Slack channel: `C0B2ZKMKWN7`
- GitHub repo: `admin23age/mkai-model-engine`
- Memory bank path pattern: `memory-bank/{brandKey}/{pillarSlug}.md`
  - e.g., `memory-bank/ddd/product.md`, `memory-bank/mkai/lifestyle.md`
- LLM: Claude Sonnet 4.6 via `@n8n/n8n-nodes-langchain.chainLlm`

**Manual webhook trigger URL (after activation):**
`https://agegroup.app.n8n.cloud/webhook/content-generate`

**Manual webhook payload schema:**
```json
{
  "brand": "DDD",
  "topic": "LIFT collection launch",
  "pillar": "Product",
  "mediaUrl": "https://...",
  "scheduledDate": "2026-05-20",
  "notes": "Optional notes for Claude"
}
```

---

## Credentials to Configure in Workflow A

Before activating, go to https://agegroup.app.n8n.cloud/workflow/8mmfbyucp1sBnhHg and wire up:

| Node | Credential Type | What to Set |
|------|----------------|-------------|
| Airtable New Brief (trigger) | Airtable Token | Existing Airtable token |
| Get Memory Bank | HTTP Header Auth | Header: `Authorization`, Value: `token GITHUB_PAT` |
| Update Git Memory | HTTP Header Auth | Same GitHub PAT credential |
| Generate Content | Anthropic | API key |
| Update Airtable Record | Airtable Token | Same Airtable token |
| Create Airtable Record | Airtable Token | Same Airtable token |
| Slack Approval | Slack Bot | Slack bot token |
| Slack No Media Alert | Slack Bot | Same Slack bot |

**GitHub PAT needs scopes:** `repo` (read + write contents)

---

## Workflow B — To Build Next Session

**Purpose:** Slack interactive button handler → publish approved content to LinkedIn, Instagram, TikTok

**Trigger:** Slack sends a POST to a webhook URL when the user clicks Approve/Reject in the Block Kit message.

### Node chain (design):
```
Slack Interactive Webhook (POST /content-approve)
  │
  ↓
Parse Slack Payload
  - Extract: action_id, value (recordId), scheduled_date from datepicker
  - action_id === 'approve_content' → continue
  - action_id === 'reject_content' → update Airtable Status: Rejected → end
  │
  ↓
Fetch Approved Content (Airtable GET by recordId)
  │
  ↓
Update Airtable — Status: Publishing, Scheduled Date: [from datepicker]
  │
  ↓
Publish to LinkedIn (HTTP Request — LinkedIn API v2)
  │ (parallel or sequential)
Publish to Instagram (HTTP Request — IG Graph API or Blotato)
  │
Publish to TikTok (HTTP Request — Blotato)
  │
  ↓
Update Airtable — Status: Published, Published At: now
  │
  ↓
Slack Confirm (post to C0B2ZKMKWN7: "Content published ✅ RecordID...")
```

### Slack App Setup Required:
1. In Slack App settings → Interactivity & Shortcuts
2. Set Request URL to: `https://agegroup.app.n8n.cloud/webhook/content-approve`
3. This URL is the Workflow B webhook trigger

### Platform Publishing Details:

**LinkedIn:**
- API: `https://api.linkedin.com/v2/ugcPosts`
- Auth: OAuth 2.0 — need LinkedIn app credentials (client ID + secret + access token)
- User said: "not sure how to set up" → use HTTP Request node with `Authorization: Bearer {token}` placeholder
- Post type: `com.linkedin.ugc.ShareContent` with `shareMediaCategory: "IMAGE"` or `"NONE"`

**Instagram:**
- API: Facebook Graph API (IG connected via Facebook App)
- Endpoint: `POST /{ig-user-id}/media` then `POST /{ig-user-id}/media_publish`
- Two-step process: create container → publish
- User may already have IG Graph API credentials from existing DD 03 Publisher workflow

**TikTok via Blotato:**
- Blotato API key: NOT YET AVAILABLE — user will provide tomorrow
- Blotato endpoint: `https://api.blotato.com/v1/posts` (verify exact endpoint)
- Use HTTP Request node with `X-API-Key: {blotato_key}` placeholder
- Include `music_category` field from content package

### Airtable Fields to Update:
After publishing, update the record with:
- `Status` → "Published"
- `Published At` → ISO timestamp
- `LinkedIn URL` → returned URL from LinkedIn API
- `Scheduled Date` → date selected from Slack datepicker

---

## GitHub Memory Bank Setup

The memory bank path structure: `memory-bank/{brand}/{pillar}.md`

Before first run, create the directory structure in the repo:
```
memory-bank/
  ddd/
    product.md
    lifestyle.md
    faith.md
    community.md
  mkai/
    tech.md
    case-study.md
    thought-leadership.md
```

Each file is a markdown log. Workflow A reads the file, generates content, appends an entry at the bottom with format:
```
---
2026-05-11T14:00:00Z | DDD | LIFT Drop Launch
Created product content for LIFT Drop Launch. Featured spiritual empowerment theme with luxury aesthetic.
```

The `Get Memory Bank` node handles 404 gracefully (neverError: true) — returns no content, sha stays empty, new file gets created on first write.

---

## SDK Lessons Learned This Session

1. **Trigger syntax** changed: `trigger({ type, version, config, output })` — NOT `trigger('name', 'type', config)`
2. **Model field** in languageModel subnode requires `expr('"model-id"')` — string literal inside expression
3. **Slack node** v2.3 requires `select: 'channel'` AND `channelId: { __rl: true, mode: 'id', value: '...' }`
4. **httpRequest body** for JSON: use `sendBody: true, specifyBody: 'json', jsonBody: expr('{{ $json.bodyObj }}')`
5. **Fan-in pattern**: `.add(trigger2).to(sameNode)` at end of workflow chain — n8n handles isolation automatically
6. **`executeOnce: true`** on Get Memory Bank prevents N-execution when multiple items flow through

---

## Existing DD/MKAI Workflows (Don't Conflict)

| ID | Name | Status | Notes |
|----|------|--------|-------|
| VorYGRoZTgN9ohfn | DD 02 — Caption Generator | Active | Legacy, separate from this system |
| dc4KIpzsfXAjaprT | DD 03 — Publisher | Active | Posts IG + TikTok on schedule |
| ZSOCw8LoT5jhcuk5 | MKAI 02 — Caption Generator | Inactive | Legacy |
| LvCZBbXSOSgubRoQ | MKAI Social Media Publisher | Inactive | Legacy |

Workflow B's publisher nodes should NOT conflict with DD 03 as long as we're writing to separate Airtable records and using conditional status checks.
