---
prompt: email-client-scorecard-delivery
title: Client Scorecard Delivery
owner-agent: natalie-nair.md
consumed-by: Receiving AI Assessment Form (cFXR1KsgAw9zqm3W) → node "Send an Email"
version: 1.0.0
status: approved
last-updated: 2026-06-03
source: client-facing rewrite of the live "Send an Email" node (internal copy replaced)
---

# Client Scorecard Delivery

> Client-facing email delivering the completed AI-readiness scorecard to the prospect.
> Canonical source — live copy in n8n must match `version`.

## Delivery config (to apply in n8n "Send an Email" node)
- **To:** `={{ $('Jotform Trigger').item.json['Business Email'] }}`  (was malformed/double-wrapped)
- **From:** `support@mankindaitech.com`

> **Approved (2026-06-03):** goes straight to the client. The previous internal-facing body
> ("Vapi is calling the client now. Check Airtable.") was replaced with the client copy below.
> Confirm the Google Drive `webViewLink` is shared ("anyone with the link") so the recipient
> can open it — Drive links are often restricted by default.

## Subject
```
Your AI Readiness Scorecard — {{ $("Code in JavaScript").item.json.business }} ({{ $("Code in JavaScript").item.json.tier }} tier)
```

## Body
```
<p>Hi {{ $("Code in JavaScript").item.json.fullName }},</p>
<p>Thank you for completing the Mankind AI Tech AI Readiness Assessment. Your personalized scorecard is ready.</p>
<p><strong>Your results</strong><br>
Overall score: {{ $("Code in JavaScript").item.json.totalScore }}/105<br>
Readiness tier: {{ $("Code in JavaScript").item.json.tier }}</p>
<p><strong>What we recommend:</strong> {{ $("Code in JavaScript").item.json.recommendation }}</p>
<p><a href="{{ $("Upload file").item.json.webViewLink }}">View your full scorecard</a></p>
<p>A member of our team will reach out shortly to walk you through your results and next steps.</p>
<p>Warm regards,<br>
The Mankind AI Tech Team<br>
support@mankindaitech.com</p>
```

## Change log
| Version | Date | Change | By |
|---|---|---|---|
| 1.0.0 | 2026-06-03 | Client-facing rewrite; To→Business Email, From→support@mankindaitech.com | |
| 1.0.0 | 2026-06-03 | Approved — delivers straight to client | |
