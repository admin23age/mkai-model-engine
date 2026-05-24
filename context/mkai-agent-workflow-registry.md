# MKAI Agent ↔ n8n Workflow Registry

> **Purpose:** Authoritative ownership map assigning every AI-agent persona in the
> org chart to the n8n workflows they manage. Git-first source of truth — agents
> read this on each run to know what they own. n8n is the runtime; this file is canonical.
>
> **Source org chart:** `Downloads/org_chart.html` (Mankind AI — Organizational Workforce Structure)
> **n8n host:** `agegroup.app.n8n.cloud`
> **Last mapped:** 2026-05-24
> **Phase:** 1 of 2 — ownership assignment (this file). Phase 2 — build manager supervisor workflows (see bottom).

---

## Org Hierarchy

```
Ashley Galloway — CEO & Founder            [report/escalation recipient]
    │
Chloe Dubois — Chief of Staff              [admin, email infra, recruitment]
    │
    ├── Natalie Nair — Director of Sales & CX
    │       ├── Mateo Silva — Sales Development Rep
    │       └── Tariq Al-Mansoor — Customer Service Rep
    │
    ├── Mei-Ling Vance — Marketing Manager
    │       └── Jamal Washington — Content Designer
    │
    └── Dr. Aris Thorne — Operations Manager
            └── Elena Rostova — Grant Writer
```

---

## Ownership Map

### Ashley Galloway — CEO & Founder
*Not a workflow operator. Recipient of digests/reports and final escalation point.*
Receives output from: MKAI Daily Ops Digest, MKAI Daily Lead & CRM Scanner, MKAI Weekly Grant Finder, Weekly metrics.

### Chloe Dubois — Chief of Staff
| Workflow | ID | Active |
|---|---|---|
| MKAI Admin Agent | `V3lUWtE9spHlHyV2` | ❌ |
| Email Assistant with Deadlines v2 | `hLjfr3wtPG6hmCqU` | ✅ |
| Email Client Template (Gmail) | `XmvGugevqQFJM2w6` | ❌ |
| AI Recruitment Screener | `3ExHXaR8NgetNmYR` | ✅ |

### Natalie Nair — Director of Sales & CX *(Tier-1 supervisor)*
| Workflow | ID | Active |
|---|---|---|
| MKAI Supervisor (already "Natalie") | `FZJQhZaT81gLwiMP` | ✅ |
| MKAI Daily Lead & CRM Scanner | `2axJYsKbvpPS4w2x` | ❌ |
| Sales Call Analysis | `T5kRK5DcDsq1rxT3` | ✅ |
| MKAI Payment Confirmation | `FGNqSaRZyQenokG2` | ❌ |

#### Mateo Silva — Sales Development Rep *(reports to Natalie)*
*Scope includes **outbound** — actively sourcing/finding new leads, not just handling inbound. No outbound-prospecting workflow exists yet → Phase 2 build candidate (lead discovery → enrich → Zoho/Airtable → outreach).*
| Workflow | ID | Active |
|---|---|---|
| MKAI Sales Agent | `moIWsyobqqRVaVLR` | ✅ |
| Mankind AI Solar Lead Agent | `jfX31XOm8wwtEiU6` | ✅ |
| Chat Lead to Zoho Flow | `Y5DwHcZTUEJwS9Z9` | ✅ |
| Lead Generation and Estimate Chat Agent | `0DywklNtoFQzmyW9` | ❌ |
| Mankind AI Lead Agent and quote process | `zj3cO7tnA1kyhrTT` | ❌ |
| Appointment Setting | `dmfRxg7PFEubqmk2` | ❌ |
| (MATS) contact us response | `Qb4qZJzutjbJqKpr` | ✅ |
| MKAI Chatbot v2 | `4muzeV750mT2ZyBP` | ❌ |

#### Tariq Al-Mansoor — Customer Service Rep *(reports to Natalie)*
| Workflow | ID | Active |
|---|---|---|
| MKAI Customer Service Agent | `YoNFRNh2fdfgvnFb` | ❌ |
| Text Customer Support | `Kf4v8geRMdocRhnq` | ❌ |
| DD Knowledge Base Search | `9Moz2uaSlJ4GkY8o` | ✅ |
| DDD - Email Assistant with Deadlines | `ckTMZBMLujnjixDO` | ❌ |

### Mei-Ling Vance — Marketing Manager — *manages the SOCIAL MEDIA cluster*
*Mei's team (Mei + Jamal) manages all social media workflows end-to-end.
Approval reuses the EXISTING Workflow B (`xnrc51p90Z6AinUu`) — no new approval workflow.
Pipeline already chains via Airtable status fields: Planner → Workflow A (Jamal generates)
→ Workflow B (Mei approves/rejects, rejection feedback loops back to A) → Workflow C (media) → Publisher.*
| Workflow | ID | Active |
|---|---|---|
| DDD + MKAI Content Engine — Workflow B (Approve & Route) | `xnrc51p90Z6AinUu` | ✅ |
| DD 01 — Monthly Content Planner | `bIR3eY2eFpNXYxwy` | ✅ |
| DD 01 v2 — Monthly Content Planner (Client Deliverable) | `JyJ98BFUKt09RIiL` | ❌ |
| MKAI 01 — Monthly Content Planner (ALLY) | `cbIZCAw6UP5BdU22` | ❌ |
| MKAI Marketing Agent | `jhnUF1wRfciai6qg` | ❌ |

#### Jamal Washington — Content Designer *(reports to Mei)*
*Creates content + media. Output flows to Mei (Workflow B) for approval.*
| Workflow | ID | Active |
|---|---|---|
| DDD + MKAI Content Engine — Workflow A (Generator) | `34W5VGQAt03NZyOS` | ✅ |
| DDD Content Engine — Workflow C: Media Generator (Higgsfield) | `X1kDAxH1uZaVHdX4` | ✅ |
| MKAI Daily Content Engine | `Xgpqct5AkCtkJkty` | ❌ |
| DD 02 — Caption Generator | `VorYGRoZTgN9ohfn` | ❌ |
| Caption Generator | `GUlORNzh9bz2IsWx` | ❌ |
| DD 03 — Publisher (9AM + 7PM ET) | `dc4KIpzsfXAjaprT` | ❌ |
| Publisher (9AM + 7PM ET) | `5LKBgEhEwuNfJAKY` | ❌ |
| Publisher (9AM + 7PM ET) | `7DD4z7JucooDU4uX` | ❌ |
| DD Printify Publisher | `lh0eCyyDUP3JeYbT` | ❌ |
| DDDesigns Avatar Generator v2 - Full Auto | `jYAeGbV1xmG70TgQ` | ❌ |
| DDDesigns Avatar Generator v2 - Full Auto | `AWKoduI6QAtlRF4A` | ❌ |
| DDDesigns Avatar Generator v3 - Two Pass Compositing | `zVXad9UrImhiH8Dz` | ✅ |
| Model Submit → Mockup Generator | `r84WZTzRQQ3DLSWw` | ✅ |

### Dr. Aris Thorne — Operations Manager — *manages the GRANT WRITING cluster*
*Aris's team (Aris + Elena) manages all grant-writing workflows end-to-end.
Elena executes the pipeline (Finder → Writer → Doc Creator → Deadline Scanner, chained via Airtable);
Aris oversees quality + continuous improvement via the Grant & Profile Auto-Updater and grant memory bank.*
| Workflow | ID | Active |
|---|---|---|
| MKAI Grant & Profile Auto-Updater | `ptj9VyqWkrgUK8Ho` | ✅ |
| MKAI Daily Ops Digest | `2czFBHSLMNE4EY6k` | ❌ |

#### Elena Rostova — Grant Writer *(reports to Dr. Aris)*
*Runs the grant-writing workflow + triggers end-to-end.*
| Workflow | ID | Active |
|---|---|---|
| Grant Writer | `Jq4pr9qAOyU6khxp` | ✅ |
| MKAI Weekly Grant Pipeline | `yLlupL6kByDLCQIW` | ✅ |
| MKAI Weekly Grant Finder | `PnKIXdOSJmh90GD2` | ❌ |
| MKAI Grant Deadline Scanner | `SZ2KTyHXHPyqfpL2` | ❌ |
| Grant Doc Creator | `5H2cwZ3qgTQBMp16` | ✅ |
| MKAI Grant Tracker Cleanup | `xSYiiKD0DAVI2Zxr` | ❌ |

### Unassigned
| Workflow | ID | Note |
|---|---|---|
| My workflow 3 | `A98emzODhHOqkriS` | Empty/scratch — no owner |

---

## Managed Clusters (current direction)

Management is assigned at the **team/cluster** level, reusing existing workflows — not by
building redundant supervisor bots. Two clusters are managed pipelines today:

- **Social Media cluster → Mei's team.** Planner → Workflow A (Jamal) → Workflow B approval
  (Mei) → Workflow C → Publisher. **Approvals use the existing Workflow B** (`xnrc51p90Z6AinUu`).
  No new approval workflow.
- **Grant Writing cluster → Aris's team.** Finder → Writer → Doc Creator → Deadline Scanner
  (Elena executes); Grant & Profile Auto-Updater + memory bank (Aris's continuous improvement).

## Cluster management — CLOSED (2026-05-24)

Both managed clusters are **complete** — managed by reusing existing live workflows, with
no net-new builds pending. This decision is final; do not build redundant supervisor bots
for these clusters.

- ✅ **Social Media cluster (Mei's team) — DONE; v2 dual-sign-off pipeline built 2026-05-24.**
  Planner → Workflow A (Jamal) → approval (Mei) → Workflow C (media) → Publisher.
  - **v1 (live):** Workflow A `34W5VGQAt03NZyOS` → Workflow B `xnrc51p90Z6AinUu` → Workflow C `X1kDAxH1uZaVHdX4`. Single approve. MKAI base-misrouting bug (points MKAI at DDD base).
  - **v2 (built, INACTIVE, pending cutover):** dual sign-off Mei + Owner (any order, first 90 days). Brand-routes base+table correctly (DDD `appr0OjO1x803LE3z`, MKAI `app3AQ14VJHqlkoVG`). See `plans/2026-05-24_social-dual-signoff-gates.md`.
    - Workflow A v2 (Generator + Copy card, Announcement mode) `CROUAAn3CO6zQyBr` — webhook `/content-generate-v2`
    - Approval Router v2 (Copy + Media gates, image-skip) `oiQnYlvmT06tRctH` — webhook `/content-approve-v2`
    - Workflow C v2 (Media, uses approved Visual Prompt) `5yFlDpd2t5lgJifp` — webhook `/content-media-v2`
    - Cutover: repoint Slack app interactivity URL to `/content-approve-v2`; activate v2; deactivate v1. Higgsfield cred needs manual UI bind on C v2.
- ✅ **Grant Writing cluster (Aris's team) — DONE.** Finder → Writer → Doc Creator → Deadline
  Scanner (Elena executes, chained via Airtable) + Grant & Profile Auto-Updater and grant memory
  bank (Aris's continuous improvement). No new orchestrator workflow.

## Phase 2 — remaining net-new builds (gaps only)

Only one real gap remains; do not duplicate working pipelines:

1. ⏳ **Mateo — Outbound Prospecting** *(net-new; no existing workflow).* Lead discovery → enrich →
   Zoho/Airtable → outreach sequence. Under Natalie. **Plan:** see `plans/2026-05-24_mateo-outbound-prospecting.md`.
2. **Natalie — already live** as MKAI Supervisor (`FZJQhZaT81gLwiMP`); optionally extend to
   dispatch Mateo/Tariq workers.

---

## Notes & Caveats

- **n8n-native tags not applied.** The n8n MCP `update_workflow` requires resubmitting the
  full workflow as SDK code; there is no description-only or tag-only endpoint. Stamping
  ownership directly on 44 live workflows would risk dropping nodes/credentials, so ownership
  lives here in Git instead. Revisit if a safe tag API becomes available.
- Several assignments are by best-fit (e.g., AI Recruitment Screener → Chloe; Printify
  Publisher → Jamal). Adjust any that don't match intended ownership.
- Duplicate-named workflows (two "Publisher (9AM + 7PM ET)", two "Avatar Generator v2")
  are distinct IDs — candidates for cleanup.
