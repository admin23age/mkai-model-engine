# Fix: "Something went wrong" on paid bookings (Full AI Audit + paid Snapshot)

**Date:** 2026-05-27
**Workflow:** MKAI lead routing (MATS) — `Qb4qZJzutjbJqKpr` on agegroup.app.n8n.cloud
**What it fixes:** Full AI Audit (and paid AI Snapshot) submissions failing with
"Something went wrong submitting your request."

**Why:** The Square checkout step has a corrupted/duplicated JSON body, and the
paid response has a stray `=` that breaks the payment link. Both are on the PAID
path only — that's why free bookings work but Audit/Snapshot don't.

There are NO passwords involved in these edits. You are only pasting text into
two boxes. Nothing else needs to change.

---

## Edit 1 of 2 — "Square — Create Checkout" node

1. Open the workflow in n8n.
2. Double-click the node named **Square — Create Checkout**.
3. Find the big box labeled **JSON / Body** (it currently has a lot of jumbled
   text with `{ ... }` in the middle).
4. Select ALL the text in that box and delete it.
5. Paste this in its place (include the leading `=`):

```
={
  "idempotency_key": "{{ $('Determine Tier Price').first().json.leadId }}",
  "payment_note": "{{ $('Determine Tier Price').first().json.leadId }}",
  "quick_pay": {
    "name": "Mankind AI - {{ $('Determine Tier Price').first().json.tierLabel }}",
    "price_money": {
      "amount": {{ Math.round($('Determine Tier Price').first().json.amount * 100) }},
      "currency": "USD"
    },
    "location_id": "LT7YHJKCWT1CC"
  },
  "checkout_options": {
    "redirect_url": "{{ $('Determine Tier Price').first().json.tier === 'full_audit' ? 'https://calendly.com/mankindaitech-support/full-ai-audit' : 'https://calendly.com/mankindaitech-support/ai-snapshot' }}"
  }
}
```

6. Close the node (click away / the X). Done with Edit 1.

---

## Edit 2 of 2 — "Respond to Webhook" node (the PAID one)

1. Double-click the node named **Respond to Webhook**
   (the one that comes right AFTER "Square — Create Checkout").
2. Find the box labeled **Response Body**. It currently reads:
   `"url": "={{ $json.payment_link.url }}"`  ← note the bad `=` before `{{`
3. Select ALL the text in that box and delete it.
4. Paste this in its place:

```
={
  "success": true,
  "action": "pay",
  "url": "{{ $json.payment_link.url }}"
}
```

5. Close the node. Done with Edit 2.

---

## Save & test

1. Click **Save** (top right).
2. Make sure the workflow toggle is **Active** (top right).
3. On the website, submit the contact form choosing **Full AI Audit** with a
   real email. You should be sent to a Square payment page (no error message).

---

## Still on the to-do list (separate from this fix — tell Claude when ready)

- **AI Snapshot Calendly link** is broken — needs the correct event link.
- **AI Readiness Calendly** event (`ai-readiness-assessment-clone`) is turned OFF
  in Calendly, so customers can't pick a time — switch it ON in Calendly.
- **"Send Proposal after a call" branch** is broken (the "Extract Call Details"
  node reads the wrong fields from Calendly).
- **Square access token** is hardcoded in the workflow and was exposed — it
  should be rotated in the Square dashboard.
</content>
</invoke>
