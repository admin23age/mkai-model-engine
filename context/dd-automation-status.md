# Dorothy Dean Designs — Automation Status
*Last updated: 2026-04-09 by MKAI*

---

## Pending Action Items (Immediate Priority)

- [ ] **Network Optimization:** Assign Ephemeral Public IP to Oracle VNIC to force Twingate UDP P2P speed
- [ ] **SSH Handshake:** Configure `$HOME\.ssh\config` on Windows and set strict permissions on the `.key` file
- [ ] **Remote Environment:** Install Node.js (v20+) and Gemini CLI on the Oracle VM
- [ ] **GitHub Integration:** Initialize the `model-engine` repository and link it to the Mankind AI Tech GitHub account
- [ ] **n8n Deployment:** Install Docker/n8n on the VM to start automated social media/Shopify workflows
- [ ] **pfSense Finalization:** Configure local gateway connectivity to bridge the home lab with the Cloud "Engine Room"

---

## Tool Stack

| Tool | Role |
|---|---|
| **Zoho Flow** | Creates NEW records in Zoho CRM |
| **Airtable** | Updates EXISTING records, central data hub |
| **n8n** | Orchestrates automation at `agegroup.app.n8n.cloud` |

---

## Workflow Status

| # | Automation | n8n Status | Action Needed |
|---|---|---|---|
| 1 | Mass Phone Outreach | 🔴 Not built | Vapi.ai integration — build after Vapi account set up |
| 2 | Phone Customer Support | 🔴 Not built | Vapi.ai integration — build after Vapi account set up |
| 3 | Text Customer Support | 🟡 In n8n, inactive | Connect Twilio credential + fix sender number in Format Response node |
| 4 | Personalized Outreach | 🟡 JSON ready, not imported | Import `outputs/DD_Personalized_Outreach.json` into n8n, connect credentials (uses Gemini 2.0 Flash) |
| 5 | Knowledge Base Search | ✅ Live (`9Moz2uaSlJ4GkY8o`) | None |
| 6 | Appointment Setting | 🟡 In n8n, inactive | Connect Calendly credential |
| 7 | Productized Info Product | ⛔ Not pursuing | N/A |
| 8 | Sales Call Analysis | ✅ Live (`T5kRK5DcDsq1rxT3`) | None |
| 9 | Content Repurposing | 🟡 JSON ready, not imported | Import `outputs/DD_Content_Repurposing.json` into n8n, connect credentials |
| 10 | AI Recruitment Screener | ✅ Live (`3ExHXaR8NgetNmYR`) | None |
| 11 | Website Chatbot | ✅ Live (`x5ra3uRTV3KVk8od`) | None |
| 12 | Chat → Zoho Flow | ✅ Live (`Y5DwHcZTUEJwS9Z9`) | Confirm Zoho Flow webhook URL is set |

**Summary: 5 live, 2 need import + credentials, 2 need credential connection only, 2 need Vapi, 1 removed**

**Also active (MKAI system):** MKAI Supervisor, Admin Agent, Sales Agent, Customer Service Agent, Marketing Agent — all live and active.

---

## Airtable Base: `appr0OjO1x803LE3z` (Social Media Planner)

**Tables needed:**
- Support Log
- Contacts
- Appointments
- Call Analysis
- Candidates
- Chat Log
- Leads
- Knowledge Base

**Posts Table** (`tblqK7VyoP7vOT8Ux`) — Content repurposing fields already added:
- Twitter Thread `fldfVCulMORVjM29h`
- LinkedIn Post `fld1M3m4T8ONu8n0N`
- Blog Intro `fldVbwvtScQdGve6E`
- Email Snippet `fldhaYbKU8oedpFoS`
- Pinterest Description `fldl9sRS8pswHn6Hx`
- Repurposed (checkbox) `fldXkGtqmkLPYf60D`
- Repurposed At `fldyzK1s0e20qWPRs`

---

## Website Chatbot Embed

After activating `DD_Website_Chatbot.json` in n8n, embed before `</body>`:

```html
<script>
  window.ChatWidgetConfig = {
    webhookUrl: 'YOUR_N8N_WEBHOOK_URL_HERE',
    title: 'Dorothy Dean Designs',
    subtitle: 'How can we help you today? 💜',
    primaryColor: '#2c3e50'
  };
</script>
<script src="https://cdn.n8n.io/chat/chat-widget.js"></script>
```

---

## Decisions Made

- **Phone AI:** Vapi.ai (for both mass outreach and phone customer support)
- **Productized Info Product:** Not pursuing — removed from scope

---

## Completion Checklist

### Phase 1: Core Infrastructure
- [ ] Set up all credentials in n8n
- [ ] Create Airtable tables (see specs)
- [ ] Import all 9 workflow JSON files
- [ ] Update credential IDs in each workflow
- [ ] Update Airtable table IDs in each workflow

### Phase 2: Test Each Workflow
- [ ] Text Support: Send test SMS
- [ ] Personalized Outreach: Add test contact, run manually
- [ ] Appointment Setting: Book test Calendly appointment
- [ ] Content Repurposing: Mark a post as "Posted"
- [ ] Sales Call Analysis: Upload test audio
- [ ] Recruitment: Submit test application
- [ ] Website Chatbot: Test chat widget
- [ ] Chat → Zoho: Test lead capture
- [ ] Knowledge Base: Test search query

### Phase 3: Activate & Monitor
- [ ] Activate all workflows
- [ ] Monitor first 24 hours for errors
- [ ] Adjust trigger frequencies if needed
- [ ] Populate Knowledge Base with FAQs
