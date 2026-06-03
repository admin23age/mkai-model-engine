---
prompt: email-scorecard-notification
title: Scorecard Notification (internal)
owner-agent: mateo-silva.md
consumed-by: Receiving AI Assessment Form (cFXR1KsgAw9zqm3W) → node "Send an Email"
version: 1.0.0
status: live
last-updated: 2026-06-03
source: pulled verbatim from live workflow on 2026-06-03; relocated from client-scorecard-delivery (it is an internal alert, not a client delivery)
---

# Scorecard Notification (internal)

> Internal alert when a new AI-assessment scorecard is generated. Sent from
> support@mankindaitech.com. Canonical source — live copy in n8n must match `version`.

> **⚠️ Live bug (flag for fix in n8n):** the "Send an Email" node's `toEmail` value is
> malformed — stored as the literal double-wrapped string
> `"toEmail": "={{ $("Jotform Trigger").item.json["Business Email"] }}"`, so the
> recipient expression likely does not resolve. If this is meant to reach the team,
> set it to a fixed internal address; if it is meant for the client, that is a
> different (currently nonexistent) email — see `client-scorecard-delivery.md`.

## Subject
```
New AI Assessment — {{ $("Code in JavaScript").item.json.business }} | {{ $("Code in JavaScript").item.json.tier }}
```

## Body
```
<p>New assessment submission ready for review.</p>
<p><strong>Client:</strong> {{ $("Code in JavaScript").item.json.fullName }}<br>
<strong>Company:</strong> {{ $("Code in JavaScript").item.json.business }}<br>
<strong>Industry:</strong> {{ $("Code in JavaScript").item.json.industry }}<br>
<strong>Score:</strong> {{ $("Code in JavaScript").item.json.totalScore }}/105<br>
<strong>Tier:</strong> {{ $("Code in JavaScript").item.json.tier }}</p>
<p><strong>Recommendation:</strong> {{ $("Code in JavaScript").item.json.recommendation }}</p>
<p><a href="{{ $("Upload file").item.json.webViewLink }}">View Scorecard in Google Drive</a></p>
<p>Vapi is calling the client now. Check Airtable for updates.</p>
```

## Change log
| Version | Date | Change | By |
|---|---|---|---|
| 1.0.0 | 2026-06-03 | Pulled verbatim from AI Assessment Form (cFXR1KsgAw9zqm3W); relocated here from client-scorecard-delivery | |
