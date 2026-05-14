# Slack Setup SOP — DDD Content Engine
**Slack workspace integration for Workflow A (Approval) + Workflow B (Publish/Reject)**
*Last updated: 2026-05-13*

---

## What Slack Does in This Engine

Slack is the human-in-the-loop step between AI generation and publishing.

```
Workflow A finishes generating captions
    ↓
Slack message posted to #content-approvals with captions + Approve/Reject buttons
    ↓
You click Approve or Reject in Slack
    ↓
Slack POSTs the button click back to n8n → fires Workflow B
    ↓
Workflow B publishes to LinkedIn/Instagram/TikTok (or marks rejected)
    ↓
Workflow B posts a confirmation back to Slack
```

| Slack role | Used by | Direction |
|---|---|---|
| Receive approval card with captions | Workflow A → Slack | n8n posts to channel |
| Send button click payload | Slack → Workflow B | Slack POSTs to n8n webhook |
| Receive publish/reject confirmation | Workflow B → Slack | n8n posts to channel |

---

## One-Time Slack App Setup

You need a Slack App in your workspace. This is what lets n8n post messages and receive button clicks.

### Step 1 — Create the App

1. Go to https://api.slack.com/apps
2. Click **Create New App** → **From scratch**
3. App name: `DDD Content Engine` (or whatever fits)
4. Workspace: your DDD workspace
5. Click **Create App**

### Step 2 — Add Bot Token Scopes

In the left sidebar: **OAuth & Permissions** → scroll to **Scopes** → **Bot Token Scopes** → **Add an OAuth Scope** for each:

| Scope | Why |
|---|---|
| `chat:write` | Post messages to channels the bot is in |
| `chat:write.public` | Post to public channels without being invited (optional but easier) |
| `channels:read` | Read channel list (n8n needs this to find the channel) |
| `groups:read` | Read private channels (only if `#content-approvals` is private) |

### Step 3 — Install to Workspace

1. Scroll to top of **OAuth & Permissions**
2. Click **Install to Workspace**
3. Approve the permissions
4. Copy the **Bot User OAuth Token** that appears — it starts with `xoxb-...`

This token is what n8n uses. Keep it secret.

### Step 4 — Enable Interactivity (so buttons work)

In the left sidebar: **Interactivity & Shortcuts** → toggle **Interactivity** ON.

**Request URL:**
```
https://agegroup.app.n8n.cloud/webhook/content-approve
```

Click **Save Changes**.

This is what makes the **Approve** and **Reject** buttons in your messages actually do something — Slack POSTs the button click payload to that URL, which fires Workflow B.

### Step 5 — Invite Bot to Channel

In Slack, open `#content-approvals` and type:
```
/invite @ddd-content-engine
```
(replace with your actual bot name from Step 1)

The bot must be a member of the channel to post in it.

---

## Wiring the Credential in n8n

### Workflow A — Slack OAuth2 (native Slack node)

These nodes use n8n's native Slack node and need a Slack OAuth2 credential:

- `Slack Approval` (the main approval message)
- `Slack No Media Alert` (the no-media-found warning)

**Steps in n8n:**

1. Open Workflow A
2. Click `Slack Approval` node → in the credential dropdown choose **Create New Credential**
3. Credential type: **Slack OAuth2 API**
4. Paste the Bot User OAuth Token from Slack App Step 3 (the `xoxb-...` value)
5. Name the credential: `Slack Bot Token` → Save
6. Reopen the node, confirm the credential is selected → Save the node
7. Click `Slack No Media Alert` → select the same credential → Save

### Workflow B — Bot Token (HTTP Request nodes)

Workflow B's Slack messages use HTTP Request nodes (not the native Slack node), so the token goes in a header instead:

- `Slack Reject Confirm`
- `Slack Publish Confirm`

**Steps in n8n:**

1. Open Workflow B
2. Click `Slack Reject Confirm` → scroll to **Headers** section
3. Add header:
   - Name: `Authorization`
   - Value: `Bearer xoxb-...` *(paste the same token, prefixed with `Bearer `)*
4. Add header:
   - Name: `Content-Type`
   - Value: `application/json`
5. Save the node
6. Repeat for `Slack Publish Confirm`

> Alternative: create a **Generic Credential Type → Header Auth** credential with the Authorization header, then attach it to both HTTP Request nodes. More secure since the token isn't visible in the node config.

---

## Channel Configuration

Current channel ID in both workflows: `C0B2ZKMKWN7`

To change channels:

1. In Slack, right-click the target channel → **Copy** → **Copy link** — the URL ends in the channel ID (e.g. `.../archives/C0B2ZKMKWN7`)
2. In Workflow A: open `Slack Approval` and `Slack No Media Alert` → update **Channel ID**
3. In Workflow B: open `Slack Reject Confirm` and `Slack Publish Confirm` → update the `channel` field in the JSON body
4. Save and republish both workflows

---

## What the Approval Message Looks Like

```
┌────────────────────────────────────────────┐
│  Dorothy Dean Designs — Content Approval   │
├────────────────────────────────────────────┤
│  Topic: <title>     Pillar: <Legacy/etc>   │
│  Music: <category>  Record: <recordId>     │
│                                            │
│  Hook: <hook text>                         │
│  ───────────────────────────────────────   │
│  LinkedIn:  <preview>                      │
│  Instagram: <preview>                      │
│  TikTok:    <preview>                      │
│  Hashtags:  <10 tags>                      │
│  ───────────────────────────────────────   │
│  📅 [Date picker]  ✅ Approve  ❌ Reject   │
│                                            │
│  Generated at ET hour 14                   │
└────────────────────────────────────────────┘
```

**Important:** Set the date picker BEFORE clicking Approve. The selected date gets passed to Blotato as the TikTok scheduled publish time.

---

## Day-to-Day Operation

### Approving content

1. Open Slack → `#content-approvals`
2. Read the captions previews
3. If you want to edit captions, go to the Airtable record and edit the `LinkedIn Caption`, `Instagram Caption`, or `TikTok Caption` fields. Workflow B reads fresh values from Airtable at publish time.
4. Set the date picker to your desired publish date
5. Click **Approve**
6. Wait ~10 seconds → confirmation message appears in the channel

### Rejecting content

1. Click **Reject**
2. The Airtable record's `Content Status` resets to `Generate Content`
3. To regenerate: edit the `Content Brief` with more direction, then re-trigger generation

---

## Troubleshooting

### No approval message arrived

- Check Workflow A execution log in n8n for the `Slack Approval` node error
- Verify the Slack credential is assigned to the node
- Verify the bot is invited to the channel (`/invite @bot-name`)
- Check that `chat:write` scope is granted on the Slack App

### Buttons do nothing when clicked

- Open the Slack App config → **Interactivity & Shortcuts** → confirm the Request URL is exactly `https://agegroup.app.n8n.cloud/webhook/content-approve`
- Check that Workflow B is **Active** in n8n
- Test by manually POSTing to the webhook to verify Workflow B fires

### Confirmation message never appears after Approve

- Workflow B is firing but the `Slack Publish Confirm` HTTP Request is failing
- Open Workflow B execution log → check the node error
- Most common: Authorization header is missing or token expired

### Message arrived but captions are empty

- This is an Airtable read issue, not a Slack issue
- Check the Airtable record — if captions are blank there too, Workflow A's `Save Content Fields` node didn't write properly. Re-trigger generation.

### "channel_not_found" error

- Bot isn't in the channel. Invite it: `/invite @bot-name`
- Or: enable `chat:write.public` scope so the bot can post to public channels without being invited

### "invalid_auth" or "token_revoked"

- Bot token is bad. Go to Slack App → **OAuth & Permissions** → **Reinstall to Workspace** → copy the new token → update the credential in n8n

---

## Reference

| Item | Value |
|---|---|
| Channel ID | `C0B2ZKMKWN7` |
| Channel name | `#content-approvals` |
| Approve webhook (Slack → n8n) | `https://agegroup.app.n8n.cloud/webhook/content-approve` |
| Workflow A Slack nodes | `Slack Approval`, `Slack No Media Alert` |
| Workflow B Slack nodes | `Slack Reject Confirm`, `Slack Publish Confirm` |
| Credential type (native Slack node) | Slack OAuth2 API |
| Credential type (HTTP Request nodes) | Bearer token header or Header Auth credential |
| Required Bot Token scopes | `chat:write`, `chat:write.public`, `channels:read` |

---

*Maintain this file as the Slack App config evolves.*
