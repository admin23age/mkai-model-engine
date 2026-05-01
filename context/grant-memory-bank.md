# MKAI Grant Writer — Memory Bank
*This is the single source of truth for the Grant Writer Agent. Loaded from GitHub at the start of every run.*

---

## Part 1 — Business Profile

> Loaded from: context/mkai-grant-profile.md (see that file for full details)

**Legal Name:** Mankind AI Technology and Services (MKAI)
**Type:** AI consulting & implementation firm
**Website:** mankindaitech.com
**Contact:** support@mankindaitech.com
**Location:** United States

### Mission Statement
Mankind AI Tech exists to make artificial intelligence accessible, ethical, and operational for businesses of every size — not just Fortune 500 companies. We design, build, and deploy AI agent systems that eliminate manual bottlenecks, reduce overhead, and empower business owners to operate at a higher level without hiring more staff.

### Services
- AI Readiness Assessments (Snapshot + Full Audit)
- Agent System Design & Deployment
- Workflow Automation (n8n, Zoho, Airtable, Claude AI)
- AI Governance & Ethics Reviews

### Service Tiers
| Tier | Price | Deliverable |
|---|---|---|
| Discovery | Free | Initial AI readiness consultation |
| Snapshot | Free–$150 | Quick AI readiness scan |
| Full Audit | $550 | Deep-dive analysis with PDF report |
| Governance | $100 add-on | Responsible AI policy review |
| Enterprise | $2,000+ | Custom multi-agent system design |

### Who We Serve
- Small and mid-sized businesses overwhelmed by manual operations
- Entrepreneurs needing AI infrastructure without enterprise budgets
- Nonprofits seeking to automate donor management and outreach
- Minority-owned businesses in underserved communities

### Founder Story
Ashley Galloway founded MKAI after seeing firsthand how small businesses were being left behind in the AI revolution. With a background in technology consulting, she built MKAI to bridge the gap between enterprise AI and the businesses that need it most.

### 501(c)(3) Status
MKAI does **not** currently hold 501(c)(3) status. Skip grants that require nonprofit status unless a fiscal sponsor is available.

---

## Part 2 — 4-Step Secret Sauce Blueprint

### Section 1 — Problem Statement
- Link the business to a BIGGER community problem
- Include 2-3 relevant statistics from credible sources
- Format: "Our company provides [services] to [target audience] in order to [benefit/outcome]"
- Show the gap between what exists and what's needed

### Section 2 — The Story
- How and why the business started
- What inspired the founder — the personal "why"
- Key accomplishments and milestones
- Make it human, relatable, and emotionally resonant

### Section 3 — Challenges & Obstacles
- Business obstacles faced and overcome
- How those challenges fuel the mission today
- Show resilience and determination

### Section 4 — Future Goals & Impact
- 12-month objectives with MEASURABLE outcomes
- 5-year vision for scaling and community transformation
- Be specific: "serve 500 businesses" not "serve many businesses"

### Section 5 — Budget & Fund Usage
- Scale budget items to the grant amount
- Every line shows ROI or community impact
- Categories: Technology, Staff, Marketing, Operations, Training
- Show how each dollar multiplies into outcomes

### Key Principles
- **Activities** = what you DO. **Outcomes** = what clients BECOME.
- Funders fund **outcomes**, not activities.
- Every narrative must connect MKAI's mission to the grantor's mission.
- Use persuasive but professional tone.
- Statistics build credibility. Stories build connection. Both are required.

---

## Part 3 — Airtable Schema

### Base ID
`appq98YoenqhsVjOB`

### Grants Table
**Table ID:** `tblN20ZEOvZ7Plo5w`

| Field | Field ID | Type |
|---|---|---|
| Grant Name | `fld6jjwDpjo8pN5xd` | Text |
| Grantor | `fldmCoRDuAA74i0gV` | Text |
| Grant Amount | `fldJXtV4LfvLpjn0X` | Number |
| Deadline Date | `fld1sf5Jh8c7fNcQT` | Date |
| Funding Link | `flduNiztTJf1FPotk` | URL |
| Status | `fldqTLR9GtYzu2NX4` | Select |
| SOP Phase | `fld29grf5eWzkkFGx` | Select |
| Eligibility Confirmed | `fldQBJIRImsRqXwSA` | Checkbox |
| 501c3 Required | `fldEOyuvFeqsvAVlW` | Checkbox |
| Mission Alignment Notes | `fldullppTrbkpk56e` | Long Text |
| Narrative Draft | `fldVW2V9ZQ8ozeyNM` | Long Text |
| Tasks | `fldBltyQGayHDO9mW` | Long Text |
| Eligibility Notes | `fldzWszXYdVMfWrSs` | Select |

### Client Profiles Table
**Table ID:** `tbl03nyGZeG2pLGEd`

| Field | Field ID | Type |
|---|---|---|
| Generated Memory Bank | `flds1kL1OloksTmas` | Long Text |
| Approval Status | (filter for "Approved") | Select |

---

## Part 4 — GitHub Configuration

**Repository:** `admin23age/AGE-core-infrastructure`
**Branch:** `main`

### Key File Locations
| File | Path |
|---|---|
| This memory bank | `context/grant-memory-bank.md` |
| Grant profile | `context/mkai-grant-profile.md` |
| Grant SOP | `context/sop-grant-writing.md` |
| Agent spec | `skills/grant-writer/agent.md` |
| Prompt library | `skills/grant-writer/prompt-library.md` |
| n8n workflow | `automations/grants/grant-writer-workflow.json` |
| Agent reports | `context/reports/` (created per run) |
