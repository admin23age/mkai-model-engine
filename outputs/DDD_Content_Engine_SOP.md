# Dorothy Dean Designs — Content Engine SOP
**MKAI Model Engine | Workflow A + B**
*Last updated: 2026-05-12*

---

## Overview

The DDD Content Engine is a two-workflow system that takes a content brief from Airtable, generates platform-specific captions using AI, routes them for human approval via Slack, and publishes to LinkedIn, Instagram, and TikTok.

```
[Brief in Airtable] → Workflow A (Generate) → [Slack Approval] → Workflow B (Publish)
```

---

## System Map

| Component | Tool | Purpose |
|---|---|---|
| Content calendar | Airtable | Source of truth for all briefs and published content |
| AI generation | Gemini 2.0 Flash (via n8n) | Writes LinkedIn, Instagram, TikTok captions + hook + hashtags |
| Memory bank | GitHub (`mkai-model-engine/memory-bank/`) | Stores past content by brand + pillar to reduce repetition |
| Approval gate | Slack (`#content-approvals` channel) | Human review before anything goes live |
| Publishing | LinkedIn API, Instagram Graph API, Blotato (TikTok) | Final delivery |

---

## Airtable Field Reference

| Field | Type | Purpose |
|---|---|---|
| `Title` | Text | Topic or short description of the content piece |
| `Content Status` | Select | Controls workflow stage (see Status Flow below) |
| `Pillar` | Select | Content category — maps to memory bank file |
| `Date` | Date | Scheduled publish date |
| `Slot` | Select | Morning / Evening |
| `Video Format` | Select | Short Clip (15-25s) / Research/Demo (60-90s) |
| `Hook #` | Select | Hook template number (1–12) |
| `Content Brief` | Text | Optional detailed brief notes |
| `Media URL` | URL | Link to video/image asset |
| `LinkedIn Caption` | Text | ✍️ AI-generated — written by Workflow A |
| `Instagram Caption` | Text | ✍️ AI-generated — written by Workflow A |
| `TikTok Caption` | Text | ✍️ AI-generated — written by Workflow A |
| `Notes` | Text | ✍️ AI-generated — stores Hook text, Hashtags, Music category |
| `Last Modified` | Date | Auto-updated by Airtable |

### Content Status Flow

```
Generate Content  ──►  Caption Ready  ──►  Ready to Post  ──►  Posted
       ▲                                                            
       │ (if rejected in Slack)                                     
       └────────────────────────────────────────────────────────────
```

| Status | Meaning |
|---|---|
| `Generate Content` | Brief is ready — triggers Workflow A (via Airtable automation or webhook) |
| `Caption Ready` | Workflow A has written captions — Slack approval message sent |
| `Ready to Post` | Approved in Slack — Workflow B is running |
| `Posted` | Published to all platforms |
| `Needs Media` | Brief has no media URL — flagged by Workflow A in Slack |

---

## Workflow A — Content Generator

**n8n ID:** `8mmfbyucp1sBnhHg`
**Status:** Inactive by default (activate after credentials confirmed)
**Trigger:** Webhook POST to `/webhook/content-generate` (or Airtable automation)

### What It Does

1. Receives a content brief (from Airtable automation or manual webhook call)
2. Reads the memory bank for the brand + pillar combination from GitHub
3. Builds a system prompt + user prompt with brand voice, prior content history, and brief details
4. Sends to Gemini 2.0 Flash for generation
5. Parses the AI response into structured fields
6. Creates or updates the Airtable record with the generated captions
7. Sets `Content Status` → `Caption Ready`
8. Checks for a media URL:
   - **Media present** → builds Slack Block Kit message with Approve/Reject/Schedule date picker → posts to `#content-approvals`
   - **No media** → posts a flag message to Slack asking for media before approval
9. Updates the GitHub memory bank with a 2-sentence summary of this content piece

### How to Trigger

**Method 1 — Airtable Automation (recommended)**

Set up once in Airtable:
- Trigger: **When record matches conditions** → `Content Status = Generate Content`
- Action: **Send a webhook** → `https://agegroup.app.n8n.cloud/webhook/content-generate`
- Body:
```json
{
  "brand": "DDD",
  "topic": "{Title}",
  "pillar": "{Pillar}",
  "mediaUrl": "{Media URL}",
  "notes": "{Content Brief}"
}
```

**Method 2 — Manual webhook call**

POST to `https://agegroup.app.n8n.cloud/webhook/content-generate` with:
```json
{
  "brand": "DDD",
  "topic": "Your content topic here",
  "pillar": "Faith Expression through Fashion",
  "mediaUrl": "https://link-to-video-or-image.com/file.mp4",
  "notes": "Any additional context or direction"
}
```

Valid pillar values:
- `Faith Expression through Fashion`
- `Styling & Outfit Inspo`
- `Scripture & Devotional Tie-In`
- `Behind the Brand / Founder Story`
- `Community & Sisterhood`
- `Product Spotlight & New Arrivals`

### What the AI Generates

Gemini returns a JSON package with:
| Field | Limit | Saved to |
|---|---|---|
| `hook` | 150 chars | `Notes` field |
| `linkedin_post` | 700 chars | `LinkedIn Caption` |
| `instagram_caption` | 400 chars | `Instagram Caption` |
| `tiktok_script` | 300 chars | `TikTok Caption` |
| `hashtags` | 10 tags | `Notes` field |
| `music_category` | One of 5 categories | `Notes` field |
| `memory_update` | 2 sentences | GitHub memory bank |

### Credentials Required (assign in n8n UI)

| Node | Credential |
|---|---|
| `Airtable New Brief` trigger | Airtable Personal Access Token |
| All Airtable nodes | Airtable Personal Access Token |
| `Get Memory Bank` / `Update Git Memory` | GitHub (PAT — `github api`) |
| `Gemini 2.0 Flash` | Google Gemini API |
| `Slack Approval` / `Slack No Media Alert` | Slack OAuth2 / Bot Token |

---

## Workflow B — Approve & Publish

**n8n ID:** `xnrc51p90Z6AinUu`
**Status:** Active
**Trigger:** Webhook POST to `/webhook/content-approve` (fired by Slack when you click Approve or Reject)

### What It Does

When you click **Approve** or **Reject** on a Slack message from Workflow A:

**Approve path:**
1. Parses the Slack button payload (record ID, scheduled date from date picker)
2. Fetches the full Airtable record to get the generated captions
3. Sets `Content Status` → `Ready to Post`
4. Publishes to LinkedIn, Instagram, and TikTok simultaneously (fan-out)
5. Waits for all three to complete
6. Sets `Content Status` → `Posted`
7. Posts confirmation to Slack

**Reject path:**
1. Parses the Slack button payload
2. Sets `Content Status` → `Generate Content` (resets the record for regeneration)
3. Posts rejection confirmation to Slack

### Slack Message Structure

Each approval message contains:
- Topic, Pillar, Music category, Record ID
- Hook text
- LinkedIn, Instagram, TikTok caption previews
- Date picker (set your scheduled publish date before clicking Approve)
- **Approve** (green) and **Reject** (red) buttons

> ⚠️ **Set the date picker BEFORE clicking Approve** — the scheduled date gets passed to Blotato for TikTok scheduling.

### Credentials Required (assign in n8n UI)

| Node | Credential |
|---|---|
| All Airtable nodes | Airtable Personal Access Token |
| `Publish to LinkedIn` | LinkedIn OAuth2 (pending setup) |
| `Publish to TikTok (Blotato)` | Blotato API Key (pending) |
| `Publish to Instagram` | Instagram Graph API (pending) |
| `Slack Reject Confirm` / `Slack Publish Confirm` | Slack Bot Token (HTTP header) |

---

## Day-to-Day Operating Procedure

### Creating a New Content Piece

1. Open the Airtable content table
2. Create a new record — fill in:
   - `Title` — the content topic
   - `Pillar` — content category
   - `Date` — when you want to post
   - `Slot` — Morning or Evening
   - `Media URL` — link to your video/image (required for Slack approval message)
   - `Content Brief` — any specific direction, scripture references, product details, etc.
3. Set `Content Status` → **Generate Content**
4. Airtable automation fires → Workflow A runs → captions appear in Slack within ~30 seconds

### Reviewing and Approving Content

1. Open Slack → `#content-approvals` channel
2. Find the approval message for the record
3. Review the hook, LinkedIn, Instagram, and TikTok captions
4. Set the scheduled date using the date picker in the message
5. Click **Approve** → publishes immediately / at scheduled time
   OR click **Reject** → record resets to `Generate Content` for a new run

### Editing Captions Before Approving

If you want to tweak the AI output before approving:
1. Go to the Airtable record
2. Edit `LinkedIn Caption`, `Instagram Caption`, or `TikTok Caption` directly
3. Then return to Slack and click Approve — Workflow B reads the latest values from Airtable

### Regenerating Content

If you reject or want fresh content:
1. The record resets to `Content Status: Generate Content`
2. Update the `Content Brief` with more specific direction
3. Airtable automation re-fires → new Slack message arrives

---

## Quiet Hours Behavior

Workflow A detects Eastern Time hour on generation. Messages generated between **8 PM – 7 AM ET** display a `QUIET HOURS` badge in the Slack header as a reminder not to publish immediately.

---

## Memory Bank

The AI reads from and writes to GitHub at `memory-bank/ddd/{pillar-slug}.md`. This gives Gemini context on past content so it avoids repetition and builds on themes over time.

| Pillar | Memory file |
|---|---|
| Faith Expression through Fashion | `faith-expression-through-fashion.md` |
| Styling & Outfit Inspo | `styling-&-outfit-inspo.md` |
| Scripture & Devotional Tie-In | `scripture-&-devotional-tie-in.md` |
| Behind the Brand / Founder Story | `behind-the-brand-/-founder-story.md` |
| Community & Sisterhood | `community-&-sisterhood.md` |
| Product Spotlight & New Arrivals | `product-spotlight-&-new-arrivals.md` |

Each file grows automatically after every generation run. You can manually edit these files in GitHub to correct tone, add brand notes, or reset context.

---

## Troubleshooting

### Workflow A doesn't fire when I set status to "Generate Content"
- Verify the Airtable automation is active (Airtable → Automations tab)
- Check that Workflow A is **Active** in n8n
- Test manually: POST to `https://agegroup.app.n8n.cloud/webhook/content-generate` with a JSON body

### No Slack message appears after triggering
- Open the Workflow A execution log in n8n → look for errors on the `Slack Approval` node
- Most common cause: Slack credential not assigned — open the node and select your Slack Bot Token

### Slack message appears but buttons don't work
- Check that your Slack app's **Interactivity Request URL** is set to:
  `https://agegroup.app.n8n.cloud/webhook/content-approve`
- Confirm Workflow B is **Active** in n8n

### Captions appear empty in Slack message
- Check the Airtable record — the `LinkedIn Caption`, `Instagram Caption`, `TikTok Caption` fields may be empty
- Run the Workflow A execution log to see if `Save Content Fields` errored
- Most common cause: Airtable credential not assigned on the Save node

### Content Status doesn't update after clicking Approve
- Open Workflow B execution log in n8n
- Check `Mark Publishing` or `Mark Published` nodes for errors
- Confirm the Airtable credential is assigned on those nodes

### "Authorization failed" on Airtable trigger activation
- The Airtable trigger v1 sometimes rejects PAT credentials
- Workaround: use the Airtable Automation → Webhook method instead (Method 1 above) — more reliable
- Deactivate the Airtable trigger node and rely solely on the webhook trigger

---

## Pending Integrations (not yet live)

| Platform | Status | Blocker |
|---|---|---|
| LinkedIn | Placeholder | LinkedIn OAuth2 credential needs setup |
| Instagram | Placeholder | Instagram Graph API credentials + page ID needed |
| TikTok (Blotato) | Placeholder | Blotato API key needed |
| Slack confirm messages | HTTP Request | Slack Bot Token needs adding to HTTP header on confirm nodes |

Until these are live, Workflow B will attempt the publish calls but they will fail. The Airtable status will still update to `Posted` after the merge step completes.

---

*This document covers the production state as of 2026-05-12. Maintain this file as integrations go live.*
