# MKAI Admin Agent — Microsoft Copilot Studio Deployment Guide

## Overview

This guide covers deploying the MKAI Admin Supervisor and its worker agents to Microsoft Copilot Studio for use in Copilot Chat.

---

## Prerequisites

- Microsoft 365 Business/Enterprise license with Copilot access
- Copilot Studio access (included in Copilot license or standalone)
- Admin or Developer permissions in your tenant

---

## Step 1: Create the Agent in Copilot Studio

### 1.1 Access Copilot Studio
1. Go to https://copilotstudio.microsoft.com
2. Sign in with your Microsoft 365 account
3. Click **Create** → **New Agent**

### 1.2 Configure Agent Basics
- **Name:** MKAI Admin Agent
- **Description:** Manages email routing, calendar blocking (48-hour advance), marketing/SEO, and client website maintenance for Man Kind AI Tech.
- **Icon:** Upload a custom icon or use default

### 1.3 Add the System Prompt

Paste this into the **Instructions** field:

```
You are the Admin Agent for Man Kind AI Tech (mankindaitech.com).

## Your Responsibilities

### Email Management
- Monitor support@mankindaitech.com inbox every 15 minutes
- Route emails based on content:
  - Pricing/interest inquiries → Sales Supervisor (NET NEW clients only)
  - Support issues from existing clients → Create Zoho Desk ticket
  - Website maintenance requests → Website Maintenance workflow
  - Partnership/media inquiries → Flag for owner review
  - Spam → Archive automatically

### Calendar Management  
- Block calendar 48 hours in advance DAILY at 6 AM EST
- Business hours only: 9 AM - 5 PM EST
- 15-minute buffer between meetings
- No weekend auto-blocking

### Marketing (Daily)
- 8 AM: Post to Dorothy Dean Designs social media
- 9 AM: Post to Man Kind AI social media
- Monday 7 AM: Generate weekly SEO analysis report
- Analyze mankindaitech.com and client websites for Google ranking strategies

### Website Maintenance
- Assist EXISTING clients with website updates
- Log all maintenance requests to Airtable
- Route urgent issues (bugs, downtime) to Zoho Desk immediately
- Send confirmation emails to clients

## Critical Rules
1. SALES handles NET NEW clients only — never route existing clients to Sales
2. Always check if sender is existing client before routing
3. Block calendar 48 hours ahead, not less
4. Post to BOTH DDD and MKAI social media daily

## When You Need Help
- Complex technical issues → Escalate to Support
- Partnership inquiries → Flag for owner
- Unclear classification → Ask for clarification
```

---

## Step 2: Add Knowledge Sources

### 2.1 Add Company Knowledge
Click **Knowledge** → **Add Knowledge** → **Files**

Upload:
- Company info document (services, pricing tiers)
- Client list (for existing client verification)
- Social media content calendar
- SEO guidelines

### 2.2 Add Website Knowledge
Click **Add Knowledge** → **Public Websites**

Add:
- https://www.mankindaitech.com
- https://www.dorothydeandeisgns.com (if applicable)

---

## Step 3: Configure Actions (Plugins)

### 3.1 Email Actions
Click **Actions** → **Add Action** → **Connector**

Connect:
- **Outlook/Gmail** — Read inbox, send emails, archive
- Configure for support@mankindaitech.com

### 3.2 Calendar Actions
Add connector:
- **Microsoft Graph Calendar** or **Google Calendar**
- Permissions: Read/Write events

### 3.3 Zoho Desk Integration
Add connector:
- **HTTP with Azure AD** or **Custom Connector**
- Configure Zoho Desk API endpoints for ticket creation

### 3.4 Airtable Integration
Add connector:
- **HTTP Request** action
- Configure Airtable API for client lookup and logging

---

## Step 4: Share the Agent

### 4.1 Open Settings
1. Click the **gear icon** (Settings)
2. Go to **Share**

### 4.2 Choose Access Level

**Option A: Specific People or Groups**
- Click **Add people or groups**
- Search for individuals or Microsoft Teams groups
- Assign permissions

**Option B: Organization-Wide**
- Toggle **Make available to everyone in [Your Org]**
- All users in your tenant can access the agent

### 4.3 Set Roles

| Role | Permissions |
|------|-------------|
| **Viewer** | Can use the agent in Copilot Chat |
| **Editor** | Can modify instructions, prompts, and knowledge sources |
| **Owner** | Full control including sharing settings |

---

## Step 5: Test the Agent

### 5.1 Test in Studio
Use the **Test** panel on the right side of Copilot Studio.

Try these prompts:
- "Check my email for any new messages"
- "Block my calendar for the next 48 hours"
- "What maintenance requests are pending?"
- "Post today's content to Dorothy Dean Designs"

### 5.2 Test in Copilot Chat
1. Open Microsoft Teams or Microsoft 365 Copilot
2. Type `@MKAI Admin Agent` to invoke
3. Test the same prompts

---

## Step 6: Connect n8n Workflows (Advanced)

For full automation, the Copilot agent can trigger n8n workflows via webhooks.

### 6.1 Create HTTP Action in Copilot
1. Go to **Actions** → **Add Action** → **HTTP Request**
2. Configure:
   - **URL:** `https://agegroup.app.n8n.cloud/webhook/mkai-admin-supervisor`
   - **Method:** POST
   - **Body:** Dynamic based on user request

### 6.2 Workflow Webhooks

| Workflow | Webhook URL |
|----------|-------------|
| Admin Supervisor | `/webhook/mkai-admin-supervisor` |
| Email Router | `/webhook/mkai-email-router` |
| Calendar Manager | `/webhook/mkai-calendar-manager` |
| Marketing | `/webhook/mkai-marketing` |
| Website Maintenance | `/webhook/mkai-website-maintenance` |

---

## Troubleshooting

### Agent not responding
- Check that connectors are properly authenticated
- Verify knowledge sources are indexed
- Review conversation logs in Copilot Studio

### Emails not routing correctly
- Verify Gmail/Outlook connector has inbox read permissions
- Check classification logic in instructions

### Calendar not blocking
- Ensure Calendar connector has write permissions
- Verify time zone settings (should be EST)

---

## Reference

Microsoft Learn: [Manage prompts and conversations in Copilot Chat](https://learn.microsoft.com/en-us/training/modules/employ-copilot-assistant/4-manage-prompts-conversations-copilot-chat)
