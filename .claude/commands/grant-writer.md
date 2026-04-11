# /grant-writer — MKAI Grant Writing Agent

## What This Does
This command runs the full MKAI grant writing workflow. Given a grant URL (or grant name), it:
1. Fetches and analyzes the grant opportunity
2. Researches the grantor organization
3. Generates a tailored grant application draft for Mankind AI Tech
4. Self-critiques the draft and produces an improved final version
5. Saves the output to `outputs/grants/`

---

## How to Use

```
/grant-writer [GRANT_URL_OR_NAME]
```

**Examples:**
- `/grant-writer https://example.org/small-business-grant`
- `/grant-writer "SBIR Phase I Technology Grant"`
- `/grant-writer` (will prompt you to paste the grant description)

---

## Execution Steps

When this command is invoked, execute ALL of the following steps in order. Do not skip steps. Confirm completion of each before proceeding.

---

### STEP 0 — Load MKAI Profile

Read `C:\Users\immav\context\mkai-grant-profile.md` in full before doing anything else. This is MKAI's identity and must inform every response you write.

---

### STEP 1 — Fetch & Analyze the Grant

If a URL was provided, use the WebFetch tool to retrieve the full grant page content.

If no URL was provided, ask the user to paste the grant description text directly.

Extract and display:
- **Grant Name**
- **Grantor Organization** (who is giving the money)
- **Grant Amount** (total available and per-applicant cap if specified)
- **Deadline**
- **Eligibility Requirements** (who can apply)
- **Purpose / Focus Area** (what the grant is for)
- **Required Application Components** (questions, documents, attachments)
- **Evaluation Criteria** (how winners are selected)
- **Word/Character Limits** (note any per-question limits)

---

### STEP 2 — Research the Grantor

Based on the grantor organization name, use WebSearch to find:
- Their mission statement and core values
- What types of organizations or projects they have funded in the past
- Any specific language they use about their priorities
- Recent press releases, annual reports, or program pages

Identify the **3 strongest alignment points** between MKAI's mission and the grantor's mission. Write these down — they will anchor the entire application.

---

### STEP 3 — Generate the Grant Application Draft

Using the grant questions, MKAI's profile, and the alignment points from Step 2, write a complete draft response for every grant question.

#### Writing Rules:
- **Always speak as Mankind AI Tech** — first person plural ("we", "our")
- **Lead with mission alignment** — connect MKAI's purpose to the grantor's purpose in every answer
- **Be specific** — use real numbers, real services, real client outcomes (Dorothy Dean Designs as example)
- **Avoid jargon** — write for a non-technical grant reviewer
- **Respect word limits** — if a limit is given, stay within it; flag if you had to cut content
- **Close every answer with impact** — end each response with what the funding will make possible

#### Standard Questions to Address (even if not explicitly asked):
Even if the grant application doesn't ask all of these, generate answers for the likely questions:

1. **Organizational Overview** — Who is MKAI? What do we do? (3–5 sentences)
2. **Problem Statement** — What problem does MKAI solve, and why does it matter now?
3. **Project Description** — What will this grant fund specifically?
4. **Target Population / Community Served** — Who benefits from MKAI's work?
5. **Mission Alignment** — How does MKAI's mission connect with this grantor's goals?
6. **Measurable Outcomes** — What specific, measurable results will this grant produce?
7. **Organizational Capacity** — Why is MKAI qualified to execute this?
8. **Sustainability Plan** — How will MKAI continue this work after the grant period ends?
9. **Budget Narrative** — How will the funds be used? (see Step 4)

---

### STEP 4 — Generate the Budget

Create a budget table based on the grant amount. Use this format:

| Line Item | Description | Amount | How It Grows Revenue |
|---|---|---|---|
| [Item] | [What it is and why it's needed] | $X,XXX | [How this investment generates ROI] |

**Standard MKAI Budget Categories:**
- Personnel (AI engineer, ops support)
- Technology infrastructure (API costs, cloud hosting, tooling)
- Client subsidies (reduced-price deployments for underserved businesses)
- Educational content development (workshops, guides, templates)
- Marketing & outreach (to reach eligible SMBs)
- Administrative / reporting (compliance, grant tracking)

Total must match the grant amount. If the grant has a specific amount, fill the full budget.

---

### STEP 5 — Self-Critique & Revision

After generating the draft, run a self-critique using this framework:

**Act as a certified grant writer with 10 years of experience and a 98% success rate.**

Review each section and identify:
- [ ] Does this answer directly address what the grantor is asking?
- [ ] Is the mission connection explicit and compelling?
- [ ] Are there specific, verifiable claims (numbers, examples, outcomes)?
- [ ] Is the language accessible to a non-technical reviewer?
- [ ] Does it stay within word limits?
- [ ] Does it end with a clear statement of impact?

List all improvements needed, then produce a **Revised Final Draft** that incorporates all feedback.

---

### STEP 6 — Save Output

Save the completed grant application to:

```
outputs/grants/YYYY-MM-DD_[grant-name-slug].md
```

The output file must include:
- Grant name and URL at the top
- Date generated
- All application answers (revised final version)
- Budget table
- Self-critique notes (collapsed at bottom)
- Word counts per section

Confirm to the user that the file has been saved and show the file path.

---

### STEP 7 — Checklist Confirmation

Before finishing, run through this checklist and confirm each item:

- [ ] MKAI profile loaded and reflected in all answers
- [ ] Grantor mission researched and aligned in application
- [ ] All grant questions answered
- [ ] Budget created and totals match grant amount
- [ ] Word/character limits respected
- [ ] Self-critique completed and revisions applied
- [ ] Output saved to `outputs/grants/`
- [ ] No personal information left as [placeholder] — flag any unfilled fields to the user

---

## Notes

- Always confirm word limits before generating long answers
- If the grant requires a 501(c)(3) and MKAI does not have one, flag this immediately and suggest partnership options
- If a question asks for financial statements, flag this and note MKAI will need to provide actual documents
- Save each grant as a separate file — never overwrite previous applications
