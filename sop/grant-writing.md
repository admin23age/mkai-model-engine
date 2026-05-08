# SOP — Grant Writing Process
**Organization:** Mankind AI Tech (MKAI)
**Version:** 1.0
**Created:** 2026-04-09
**Owner:** MKAI Operations
**Review Cycle:** Quarterly

---

## Purpose

This SOP defines the standard process for identifying, researching, writing, and submitting grant applications on behalf of Mankind AI Tech. It ensures every application is consistent, high-quality, and aligned with MKAI's mission and brand voice.

---

## Scope

Applies to all grant applications submitted by or on behalf of Mankind AI Tech, including federal, state, local, corporate, and foundation grants.

---

## Tools Required

| Tool | Purpose |
|---|---|
| Claude Code + `/grant-writer` | AI-assisted grant drafting workflow |
| `context/mkai-grant-profile.md` | MKAI identity reference document |
| `skills/grant-writer/prompt-library.md` | Prompt templates for each application stage |
| `outputs/grants/` | Storage for all completed applications |
| `outputs/grants/_TEMPLATE.md` | Output format for every application |
| WebFetch / WebSearch | Grant research and grantor research |
| Gmail (MCP) | Application submission and correspondence |
| Airtable (MCP) | Grant pipeline tracking |

---

## Roles & Responsibilities

| Role | Responsibility |
|---|---|
| **Grant Lead (Owner)** | Final review and submission of every application |
| **AI Agent (/grant-writer)** | Research, drafting, critiquing, and formatting |
| **Founder** | Provide personal credentials, sign off on budget, approve submission |

---

## Grant Pipeline Stages

```
DISCOVER → QUALIFY → RESEARCH → DRAFT → REVIEW → SUBMIT → TRACK
```

---

## PHASE 1 — DISCOVER

**Trigger:** Any team member finds a potential grant opportunity.

### Steps

1. **Log the opportunity** in the Grant Tracker (Airtable):
   - Grant name
   - Grantor organization
   - URL
   - Amount
   - Deadline
   - Status: `Discovered`

2. **Initial gut check** — answer these 3 questions before spending time on it:
   - Is MKAI eligible? (check requirements)
   - Is the amount worth the effort? (minimum $1,000 recommended)
   - Is the deadline at least 5 business days away?

   If any answer is NO → mark as `Not Pursuing` in tracker and stop.

3. If all answers YES → move to Phase 2.

**Time estimate:** 15 minutes

---

## PHASE 2 — QUALIFY

**Goal:** Confirm MKAI meets all eligibility requirements before investing in a full application.

### Steps

1. Read the full grant guidelines — not just the summary.

2. Check against MKAI's current status:

   | Requirement | MKAI Status |
   |---|---|
   | For-profit eligible | Confirm per grant |
   | 501(c)(3) required | MKAI does NOT currently have 501(c)(3) — flag immediately |
   | US-based | Yes |
   | Years in business | Confirm per grant |
   | Revenue cap | Confirm per grant |
   | Geographic restriction | Confirm per grant |
   | Industry focus | AI / Technology / Small Business Support |

3. If disqualified → mark `Not Eligible` in tracker.

4. If eligible → mark `Qualified` and move to Phase 3.

**Time estimate:** 20–30 minutes

> **Note:** If a grant requires 501(c)(3) status, evaluate whether a nonprofit partnership is possible before disqualifying.

---

## PHASE 3 — RESEARCH

**Goal:** Understand the grantor deeply enough to mirror their language and priorities in the application.

### Steps

1. Run `/grant-writer [URL]` — the agent will execute Steps 1 and 2 of the workflow automatically (fetch grant + research grantor).

   **OR** manually run these prompts from `skills/grant-writer/prompt-library.md`:
   - Prompt 1A: Summarize the Grant
   - Prompt 1B: Research the Grantor
   - Prompt 1C: Find the Alignment

2. Review the 3 alignment points the agent generates. Confirm they are accurate and compelling.

3. Note any past grant winners the grantor has funded — read their descriptions and note the language they used.

4. Update the Grant Tracker: Status → `In Progress`

**Time estimate:** 30–45 minutes

---

## PHASE 4 — DRAFT

**Goal:** Produce a complete first draft of the application.

### Steps

1. Run the full `/grant-writer` command — the agent will draft all standard sections and the budget.

   **OR** use prompts 2A–2G and 3A from `skills/grant-writer/prompt-library.md` manually.

2. As each section is generated, paste it into the output file:
   ```
   outputs/grants/YYYY-MM-DD_[grant-name-slug].md
   ```
   Use `outputs/grants/_TEMPLATE.md` as the starting structure.

3. Fill in any placeholder fields:
   - `[Insert founder name and credentials]`
   - Verify budget totals match grant amount exactly
   - Verify word counts are within limits

4. Note any sections you could not complete due to missing information — flag to founder.

**Time estimate:** 1–3 hours depending on application length

---

## PHASE 5 — REVIEW

**Goal:** Ensure the application is polished, accurate, and competitive before submission.

### Step 5A — AI Self-Critique

1. Run Prompt 4A (Grant Answer Critique) on each section individually.
2. Run Prompt 4B (Merge Critique) to produce a revised version of each section.
3. Run Prompt 4C (Full Application Review) to get an overall score and final recommendations.

### Step 5B — Human Review (Founder Sign-Off)

The **founder must personally review** before submission:

- [ ] All answers are factually accurate
- [ ] Budget is realistic and defensible
- [ ] Founder's name and credentials are correctly stated
- [ ] No exaggerated claims or promises we cannot deliver
- [ ] Tone matches MKAI's brand voice (professional, mission-driven, accessible)
- [ ] Application reads as a cohesive document, not disconnected sections

### Step 5C — Final Checklist

- [ ] All grant questions answered
- [ ] Word/character limits respected on every section
- [ ] Budget totals match grant amount exactly
- [ ] No `[placeholder]` text remaining
- [ ] Supporting documents prepared (if required): financial statements, tax ID, business registration, letters of support
- [ ] Application saved to `outputs/grants/` with correct filename

Update Grant Tracker: Status → `Ready to Submit`

**Time estimate:** 1–2 hours

---

## PHASE 6 — SUBMIT

**Goal:** Submit the application on time with all required materials.

### Steps

1. Submit via the grantor's required method (online portal, email, PDF upload).

2. Immediately after submission:
   - Screenshot or save the confirmation
   - Note the submission timestamp
   - Update Grant Tracker:
     - Status → `Submitted`
     - Submission date
     - Confirmation number (if provided)

3. Send a follow-up email if appropriate (some grantors welcome a brief note confirming receipt).

4. Set a calendar reminder for the decision date (if announced).

**Time estimate:** 30–60 minutes

---

## PHASE 7 — TRACK & FOLLOW UP

**Goal:** Stay organized and improve over time.

### If Awarded

1. Update Grant Tracker: Status → `Awarded`
2. Note award amount and any conditions
3. Set up a reporting calendar if the grant requires progress reports
4. Log the key factors that made this application successful (for future applications)

### If Not Awarded

1. Update Grant Tracker: Status → `Not Awarded`
2. Request reviewer feedback if available (many grantors offer this)
3. Run Prompt 5A (Reapplication Critique) — identify what to improve
4. If it's a recurring grant, set a reminder to reapply next cycle with improvements
5. Save lessons learned in the grant file under `## Self-Critique Notes`

### Monthly Grant Pipeline Review

On the first Monday of each month:
- Review all active grants in tracker
- Check deadlines for the next 60 days
- Identify new grant opportunities using the Discovery search criteria
- Archive completed (awarded/not awarded) grants older than 6 months

---

## Grant Search Criteria (Where to Find Grants)

### MKAI is a strong candidate for grants focused on:
- Small business development and support
- Technology access and digital equity
- AI ethics and responsible technology
- Minority entrepreneurship and economic inclusion
- Workforce development through technology
- Innovation and startup ecosystem development

### Where to search:
- Grants.gov (federal)
- SBA (Small Business Administration) programs
- State economic development agencies
- Corporate foundations (Google, Microsoft, Salesforce, Comcast)
- CDFI (Community Development Financial Institutions)
- Local chambers of commerce and business councils
- HBCUs and minority business development centers (MBDCs)

---

## Quality Standards

Every grant application submitted by MKAI must meet these standards:

| Standard | Requirement |
|---|---|
| Mission alignment | Every section explicitly connects to the grantor's stated priorities |
| Specificity | Every claim is backed by a specific example, number, or outcome |
| Accuracy | No exaggerated or unverifiable claims |
| Voice | Professional, accessible, mission-driven — not technical or corporate |
| Completeness | All questions answered, all attachments included |
| Timeliness | Submitted at least 24 hours before deadline (never last-minute) |

---

## Common Mistakes to Avoid

- Submitting a generic application without customizing for the grantor
- Exceeding word limits (automatic disqualification in many programs)
- Using technical jargon that non-technical reviewers won't understand
- Leaving budget line items without justification
- Missing required attachments
- Applying for grants we are not eligible for
- Making promises in the application we cannot actually deliver

---

## File Naming Convention

All grant files saved to `outputs/grants/` must follow this format:

```
YYYY-MM-DD_[grantor-short-name]_[grant-slug].md
```

**Examples:**
```
2026-04-09_google_small-business-ai-grant.md
2026-05-15_sba_underserved-tech-grant.md
2026-06-01_comcast_rise-program.md
```

---

## Related Files

| File | Description |
|---|---|
| `context/mkai-grant-profile.md` | MKAI identity document for all applications |
| `skills/grant-writer/prompt-library.md` | All grant writing prompts |
| `.claude/commands/grant-writer.md` | `/grant-writer` slash command |
| `outputs/grants/_TEMPLATE.md` | Application output template |

---

*This SOP should be reviewed and updated each quarter or whenever MKAI's services, pricing, or mission focus changes.*
