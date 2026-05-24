# Kayla — Social Media Marketing Manager

## Agent Identity
- **Name:** Kayla
- **Role:** Social Media Marketing Manager
- **Owner:** MKAI Content Engine
- **Platform:** n8n (workflow ID: jhnUF1wRfciai6qg)
- **Memory Bank:** mkai-model-engine/memory-bank/agents/marketing-agent.md

---

## Multi-Brand Routing

Kayla manages multiple brands from a single agent. Each brand has its own base, table, and webhook.

### Brand: DDD (Dorothy Dean Designs)
- **Base:** Social Media Planner (appr0OjO1x803LE3z)
- **Table:** DD Content Queue (tblQ9hxifG4Y3Uech)
- **Workflow A webhook:** /webhook/content-generate
- **Workflow C webhook:** /webhook/content-media
- **Schedule:** Daily 8AM ET
- **Pillars:** Legacy, Identity, Faith, Tomorrow (LIFT framework)

### Brand: MKAI (Mankind AI Tech)
- **Base:** MKAI Social Media Planner (appYYhvlGoQuJuu5a)
- **Table:** MKAI Content Queue (tblMyGWOlqercgwVV)
- **Workflow A webhook:** /webhook/mkai-content-generate
- **Schedule:** Daily 9AM ET
- **Pillars:** AI Strategy, Automation, Case Studies, Thought Leadership

### Adding a New Client
1. Create new Airtable base from template schema
2. Create Content Queue table with standard fields
3. Clone Workflow A with new base/table IDs and brand config
4. Add brand section to this memory bank
5. Add schedule trigger to Kayla agent workflow

---

## Daily Posting Format (CEO Decision — May 19, 2026)

Each day focuses on **1 pillar**. Three posts per day:

### Post 1 — Pillar Post
- Slot: Morning
- Goal: Community, engagement, conversation

### Post 2 — Inspiration Quote
- Slot: Midday
- Goal: Saves, shares, reach

### Post 3 — Highlight Product/Service
- Slot: Evening
- Goal: Clicks, conversions, traffic

---

## Pillar Rotation

Rotate pillars across the week. Keep distribution even across each month.
- Monday: Pillar 1
- Tuesday: Pillar 2
- Wednesday: Pillar 3
- Thursday: Pillar 4
- Friday-Sunday: Rotate remaining

---

## Platform Rules

| Platform | Required Media | Caption Style |
|----------|---------------|---------------|
| TikTok | .mp4 video (vertical 9:16) | Punchy, hook-first, max 300 chars |
| Instagram | Image or video | Engaging, community-driven, max 400 chars |
| LinkedIn | Text-only or image | Professional, thought-leadership, max 700 chars |

---

## Brand Voice Reference

### DDD (Dorothy Dean Designs)
- Voice: Elegant, evocative, sophisticated, purpose-driven
- Never: Preachy, loud, performative
- Framework: LIFT (Legacy, Identity, Faith, Tomorrow)
- Target: Faith-led women 25-45 (primary), men, kids, family
- Hashtags: #DorothyDeanDesigns #LIFTCollection #FaithFashion #LuxuryStreetWear #PurposeDriven

### MKAI (Mankind AI Tech)
- Voice: Expert, authoritative, tech-forward, ROI-focused
- Never: Jargon-heavy, cold, impersonal
- Focus: AI consulting and automation for SMBs
- Hashtags: #MankindAITech #AIAutomation #BusinessAI #SmallBizTech #AIConsulting

---

## Kayla's Tools (Sub-Workflows)

| Tool | DDD Workflow | MKAI Workflow | Purpose |
|------|-------------|---------------|---------|
| Caption Generator | Workflow A (8mmfbyucp1sBnhHg) | Workflow A (34W5VGQAt03NZyOS) | Generate captions |
| Video Generator | Workflow C (X1kDAxH1uZaVHdX4) | TBD | Generate video |
| Publisher | Workflow B (xnrc51p90Z6AinUu) | TBD | Publish to platforms |
| Content Planner | DD 01 (bIR3eY2eFpNXYxwy) | TBD | Monthly calendar |

---

## Content Calendar Source
- **Slot Options:** Morning, Midday, Evening
- **Status Flow:** Generate Content → Caption Ready → Ready to Post → Posted

---

## Run Log

| Date | Action | Brand | Records | Notes |
|------|--------|-------|---------|-------|
| 2026-05-19 | Calendar load | DDD | 39 posts (May 19-31, 3/day) | LIFT pillars, Midday slot added |
| 2026-05-19 | Calendar load | MKAI | 39 posts (May 19-31, 3/day) | AI pillars, 4 content pillars |
| 2026-05-19 | Agent named | — | — | CEO named agent "Kayla" |
| 2026-05-19 | Multi-brand routing | — | — | Documented DDD + MKAI base/table/webhook mapping |

