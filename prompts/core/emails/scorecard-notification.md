---
prompt: email-scorecard-notification
title: Scorecard Notification (internal)
owner-agent: mateo-silva.md
consumed-by: none (not currently wired in n8n)
version: 0.1.0
status: draft
last-updated: 2026-06-03
---

# Scorecard Notification (internal)

> Internal team alert when a new AI-assessment scorecard is generated.
> Canonical source — live copy in n8n must match `version`.

> **Note:** the AI Assessment workflow's single "Send an Email" node is now the
> *client* delivery (see `client-scorecard-delivery.md`). There is no separate
> internal-alert email wired today. This is a placeholder if you want to add one
> (e.g. a second email node to ops@) — the old internal body is preserved below
> for reuse.

## Subject
```
New AI Assessment — {{ business }} | {{ tier }}
```

## Body
```
<p>New assessment submission received.</p>
<p><strong>Client:</strong> {{ fullName }} &middot; <strong>Company:</strong> {{ business }}<br>
<strong>Industry:</strong> {{ industry }} &middot; <strong>Score:</strong> {{ totalScore }}/105 &middot; <strong>Tier:</strong> {{ tier }}</p>
<p><strong>Recommendation:</strong> {{ recommendation }}</p>
<p><a href="{{ webViewLink }}">View Scorecard in Google Drive</a></p>
<p>Vapi is calling the client now. Check Airtable for updates.</p>
```

## Change log
| Version | Date | Change | By |
|---|---|---|---|
| 0.1.0 | 2026-06-03 | Placeholder; internal body preserved for reuse | |
