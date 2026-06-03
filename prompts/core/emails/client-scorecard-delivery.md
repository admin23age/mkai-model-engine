---
prompt: email-client-scorecard-delivery
title: Client Scorecard Delivery
owner-agent: natalie-nair.md
consumed-by: Receiving AI Assessment Form (cFXR1KsgAw9zqm3W) → node "Send an Email"
version: 1.0.0
status: live
last-updated: 2026-06-03
source: pulled verbatim from live workflow on 2026-06-03
---

# Client Scorecard Delivery

> Email that delivers the completed AI-readiness scorecard to the prospect.
> Canonical source. Live copy in n8n / Gmail must match `version`.

> **Note:** The live "Send an Email" node reads more like an INTERNAL review notification than a client-facing delivery — body says "New assessment submission ready for review." and "Vapi is calling the client now. Check Airtable for updates." From: support@mankindaitech.com. The `toEmail` field is also malformed in the live workflow — its value is the literal string `"toEmail": "={{ $("Jotform Trigger").item.json["Business Email"] }}"` (a JSON fragment double-wrapped), so the recipient expression likely does not resolve correctly. Captured verbatim; flag for human review of intended audience and the toEmail bug.

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
| 1.0.0 | 2026-06-03 | Pulled verbatim from Receiving AI Assessment Form (cFXR1KsgAw9zqm3W) → "Send an Email" | |
