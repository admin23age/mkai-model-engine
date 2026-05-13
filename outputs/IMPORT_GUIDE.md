# Workflow Import Guide
*Generated: 2026-04-09*

Two new workflows are ready to import into n8n. Both JSON files are in this `outputs/` folder.

---

## How to Import

1. Go to **https://agegroup.app.n8n.cloud**
2. Click **Workflows** in the left sidebar
3. Click **Add Workflow** (top right) → **Import from File**
4. Select the JSON file
5. After import, open the workflow and reconnect credentials (see below)

---

## DD_Personalized_Outreach.json

**What it does:** Reads contacts from the `DD Customers` Airtable table where `Outreach Status = Pending`. For each contact, uses **Gemini 2.0 Flash** to write a personalized email based on their interests and purchase history. Sends via Gmail. Marks contact as `Sent`.

**Trigger:** Manual only (no schedule set — you decide when to run it)

**Credentials to connect after import:**
| Node | Credential |
|---|---|
| Get Pending Contacts | Airtable Personal Access Token |
| Generate Email with Gemini | HTTP Query Auth (param name: `key`, value: your Google AI Studio API key) |
| Send Outreach Email | Gmail OAuth2 |
| Update Outreach Status | Airtable Personal Access Token |

**Gemini credential setup:**
1. Go to **Settings** → **Credentials** → **Add Credential**
2. Choose **HTTP Query Auth**
3. Name it `Gemini API`
4. Query Parameter Name: `key`
5. Query Parameter Value: your Google AI Studio API key (get it at aistudio.google.com)
6. Save

**To run:** Open the workflow → click **Test Workflow** (manual trigger)

---

## DD_Content_Repurposing.json

**What it does:** Polls the `Posts` Airtable table every hour for records where `Content Status = Posted` and `Repurposed = false`. For each, uses Claude Haiku to generate: Twitter thread, LinkedIn post, blog intro, email snippet, Pinterest description. Saves all back to the Airtable record and marks `Repurposed = true`.

**Trigger:** Polls Airtable every hour automatically once activated

**Credentials to connect after import:**
| Node | Credential |
|---|---|
| Watch for Posted Content | Airtable Personal Access Token |
| Generate Repurposed Content | HTTP Header Auth (header: `x-api-key`, value: your Anthropic API key) |
| Save Repurposed Content | Airtable Personal Access Token |

**To activate:** Open the workflow → connect credentials → toggle **Active** switch ON

---

## Anthropic API Credential Setup (if not already created)

1. In n8n, go to **Settings** → **Credentials** → **Add Credential**
2. Choose **HTTP Header Auth**
3. Name it `Anthropic API`
4. Header Name: `x-api-key`
5. Header Value: your Anthropic API key
6. Save

---

## Also Inactive (fix credentials to activate)

| Workflow | Issue |
|---|---|
| Text Customer Support | Connect Twilio credential. Also update the sender number in the `Format Response` node (currently shows `+1XXXXXXXXXX`) |
| Appointment Setting | Connect Calendly credential |
