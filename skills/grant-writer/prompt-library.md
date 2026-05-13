# MKAI Grant Writer — Prompt Library
*Modular prompts to use at each stage of the grant writing process.*
*These are based on proven grant-writing methodology. Use them in order.*

---

## STAGE 1: Grant Intelligence Prompts

### 1A — Summarize the Grant
```
I'm going to give you a grant opportunity. Read everything carefully and tell me:
1. What is the grant name and who is offering it?
2. What is the total funding amount and per-applicant cap?
3. Who is eligible to apply?
4. What is the application deadline?
5. What specific problems or projects does this grant fund?
6. What are the evaluation criteria (how do they pick winners)?
7. What are all the required application components (questions, documents, attachments)?
8. Are there word or character limits for any sections?
9. What would make an applicant the most competitive for this grant?

Here is the grant information: [PASTE GRANT URL OR DESCRIPTION]
```

### 1B — Research the Grantor Organization
```
I am applying for the [GRANT NAME] offered by [GRANTOR ORGANIZATION].

Please research [GRANTOR ORGANIZATION] and tell me:
1. What is their mission statement?
2. What are their core values and priorities?
3. What types of organizations or projects have they funded in the past?
4. What specific language do they use to describe the change they want to see in the world?
5. What are 3–5 specific phrases, themes, or values I should echo in my application?
6. Is there anything about [GRANTOR ORGANIZATION] that makes Mankind AI Tech a particularly strong fit?

Mankind AI Tech's mission: We make AI accessible, ethical, and operational for small and mid-sized businesses — especially underserved communities — through done-for-you AI agent systems, readiness assessments, and automation infrastructure.
```

### 1C — Find the Alignment
```
Based on what you know about [GRANTOR ORGANIZATION] and Mankind AI Tech, identify the 3 strongest alignment points between our missions.

For each alignment point:
- State the connection clearly in one sentence
- Quote or reference the specific language from each organization that creates this connection
- Suggest how I should frame this in my application to maximize resonance with the grant reviewers

Mankind AI Tech profile: [PASTE mkai-grant-profile.md content OR reference it]
```

---

## STAGE 2: Draft Generation Prompts

### 2A — Organizational Overview
```
Act as a professional grant writer with 10 years of experience and a 98% success rate.

Write a compelling organizational overview for Mankind AI Tech to use in a grant application for [GRANT NAME] offered by [GRANTOR ORGANIZATION].

Requirements:
- 3–5 sentences (or [WORD LIMIT] words if specified)
- Lead with our mission and the problem we solve
- Include what we do, who we serve, and why we're different
- Echo the language and values of [GRANTOR ORGANIZATION]
- Do NOT use jargon — write for a non-technical grant reviewer

Mankind AI Tech profile: [We make AI accessible, ethical, and operational for small and mid-sized businesses — especially underserved communities. We build done-for-you AI agent systems, conduct AI readiness assessments, and deploy automation infrastructure that eliminates manual bottlenecks. Our pilot client, Dorothy Dean Designs, went from zero automation to a full AI operations stack at a fraction of enterprise cost.]
```

### 2B — Problem Statement
```
Act as a professional grant writer with 10 years of experience and a 98% success rate.

Write a powerful problem statement for Mankind AI Tech's grant application to [GRANT NAME].

The problem statement should:
- Clearly identify the problem: Small businesses and underserved entrepreneurs are being left behind in the AI revolution
- Include relevant statistics about the AI adoption gap, technology access inequality, or small business challenges
- Explain why this problem is urgent and costly if not addressed
- Connect the problem to Mankind AI Tech's work — we exist specifically to close this gap
- [WORD LIMIT] words or less if specified

Make it emotionally resonant but grounded in facts.
```

### 2C — Project Description
```
Act as a professional grant writer with 10 years of experience and a 98% success rate.

Write a project description for Mankind AI Tech's grant application to [GRANT NAME] for $[GRANT AMOUNT].

The project description should answer:
- What specifically will this grant fund?
- What activities will be carried out during the grant period?
- Who will lead the work and what qualifies them?
- What is the timeline?
- How does this project align with [GRANTOR ORGANIZATION]'s priorities?

Use this grant budget as a guide: [PASTE BUDGET FROM STEP 4 OF grant-writer COMMAND]

Keep it concrete. Avoid vague language like "we will explore" — use "we will build", "we will deploy", "we will deliver".
[WORD LIMIT] words or less if specified.
```

### 2D — Target Population
```
Act as a professional grant writer with 10 years of experience and a 98% success rate.

Write a target population section for Mankind AI Tech's grant application to [GRANT NAME].

Describe who benefits from our work:
- Primary: Small and mid-sized business owners, especially those from underserved or minority communities
- Secondary: Their employees and customers who benefit from smoother, more efficient operations
- Include specific demographic details, geographic focus if relevant, and why this population has been historically underserved by enterprise technology
- Connect to [GRANTOR ORGANIZATION]'s commitment to [THEIR PRIORITY POPULATIONS]

[WORD LIMIT] words or less if specified.
```

### 2E — Outcomes & Metrics
```
Act as a professional grant writer with 10 years of experience and a 98% success rate.

Write a measurable outcomes section for Mankind AI Tech's grant application to [GRANT NAME].

List 5–8 specific, measurable outcomes we commit to delivering with this $[GRANT AMOUNT] grant.

For each outcome include:
- The metric (what we will measure)
- The target number (how much / how many)
- The timeframe (by when)
- How we will track and verify this

Examples of MKAI outcomes to build from:
- Number of businesses receiving AI readiness assessments
- Number of AI agent systems deployed
- Hours of manual work eliminated per client per month
- Percentage of clients from underserved or minority-owned businesses
- Number of businesses that could not previously afford AI services now receiving subsidized access
- Number of educational resources created and distributed
```

### 2F — Organizational Capacity
```
Act as a professional grant writer with 10 years of experience and a 98% success rate.

Write an organizational capacity section for Mankind AI Tech's grant application to [GRANT NAME].

This section should demonstrate that MKAI can actually execute what we're proposing. Include:
- Our relevant experience (AI systems, automation, business consulting)
- Technology infrastructure we already have in place
- Our pilot project success (Dorothy Dean Designs) as proof of concept
- Our methodology (readiness assessment → system design → deployment → support)
- Any partnerships, advisors, or tools that strengthen our capacity

Do NOT make claims we can't back up. Focus on what we have already done, not what we hope to do.
[WORD LIMIT] words or less if specified.
```

### 2G — Sustainability Plan
```
Act as a professional grant writer with 10 years of experience and a 98% success rate.

Write a sustainability plan for Mankind AI Tech's grant application to [GRANT NAME].

Explain how MKAI will continue this work after the grant period ends:
- Revenue model: We generate revenue through paid service tiers ($0–$2,000+)
- As we build more case studies and serve more clients, our reputation grows and attracts more paying clients
- The subsidized tier funded by this grant creates goodwill and referrals in underserved communities
- Educational content created with grant funding generates ongoing inbound leads
- Infrastructure investments (paid for by grant) reduce our cost per client, making us more sustainable long-term

Make it clear this is not a one-time program — this is building a company that will outlast the grant.
[WORD LIMIT] words or less.
```

---

## STAGE 3: Budget Prompts

### 3A — Budget Generator
```
I am applying for the [GRANT NAME] for $[GRANT AMOUNT].

Create a grant budget for Mankind AI Tech. The budget should:
- Total exactly $[GRANT AMOUNT]
- Be organized into line items with clear justification for each
- Show how each expenditure connects to delivering the proposed outcomes
- Prioritize: personnel, technology infrastructure, client subsidies, education/content, marketing/outreach, and administration
- Be presented in a table with columns: Line Item | Description | Amount | How It Advances the Mission

Make sure every dollar is defensible and clearly tied to delivering results.
```

### 3B — Budget Expansion (if scaling up from a previous grant)
```
I previously applied for a $[PREVIOUS AMOUNT] grant. I am now applying for $[NEW AMOUNT].

Help me expand my budget to reflect the larger grant amount. Show me:
- What additional line items should I add?
- Which existing items should I increase?
- How do I justify the larger ask without appearing wasteful?
- Present the full revised budget in table format.
```

---

## STAGE 4: Critique & Refinement Prompts

### 4A — Grant Answer Critique
```
Act as a certified grant writer with 10 years of experience and a 98% success rate.

Review the following grant answer and give me a critique. I want you to:
1. Rate it on a scale of 1–10 for: Mission alignment, Specificity, Clarity, Impact, Persuasiveness
2. Identify the top 3 weaknesses
3. Identify what's already strong and should be kept
4. Suggest specific revisions for each weakness
5. Note if I am at risk of exceeding word limits

Here is my answer: [PASTE ANSWER]

This is for the [GRANT NAME] grant from [GRANTOR ORGANIZATION]. Their priorities are: [KEY PRIORITIES].
```

### 4B — Merge Critique with Original
```
Please merge your critique suggestions with my original answer and write an improved version.

The revised answer should:
- Keep what was already strong
- Fix the weaknesses you identified
- Stay within [WORD LIMIT] words
- Sound natural and authentic — not like it was written by a committee

Original answer: [PASTE ORIGINAL]
Your critique: [PASTE CRITIQUE]
```

### 4C — Full Application Review
```
Act as a grant reviewer for [GRANTOR ORGANIZATION].

You are evaluating this application from Mankind AI Tech for the [GRANT NAME]. Score each section out of 10 and provide brief feedback:

1. Organizational Overview: /10
2. Problem Statement: /10
3. Project Description: /10
4. Target Population: /10
5. Outcomes & Metrics: /10
6. Organizational Capacity: /10
7. Sustainability Plan: /10
8. Budget: /10

Overall recommendation: Fund / Fund with revisions / Do not fund
Top 3 reasons this application should be funded:
Top 3 reasons it might be passed over:
What is the single most important improvement before submission?

[PASTE FULL APPLICATION]
```

---

## STAGE 5: Follow-Up & Reapplication Prompts

### 5A — When You Don't Win
```
Act as a seasoned grant writer with a 98% success rate.

I applied for the [GRANT NAME] from [GRANTOR ORGANIZATION] and did not win. Here is my application: [PASTE APPLICATION]

Please:
1. Critique the application honestly — what likely held it back?
2. Identify which sections need the most improvement
3. Suggest how I should reframe my mission alignment
4. Tell me what additional evidence, metrics, or documentation would strengthen the next submission
5. Give me a priority list of revisions to make before I apply again
```

### 5B — Adapting a Previous Grant to a New Opportunity
```
I have a previous grant application for [PREVIOUS GRANT NAME]. I want to adapt it for [NEW GRANT NAME] offered by [NEW GRANTOR].

Please:
1. Identify what can be reused with minimal changes
2. Identify what must be rewritten for the new grantor's priorities
3. Flag any sections where the language from the old application might hurt my chances with the new grantor
4. Give me a prioritized list of what to update first

Previous application: [PASTE]
New grant description: [PASTE]
```

---

## Quick Reference — Prompt Sequence

```
1. Paste grant URL → Prompt 1A (Summarize Grant)
2. Research grantor → Prompt 1B (Research Grantor)
3. Find alignment → Prompt 1C (Find Alignment)
4. Write each section → Prompts 2A through 2G
5. Build budget → Prompt 3A
6. Critique each answer → Prompt 4A → Prompt 4B
7. Full review → Prompt 4C
8. Save to outputs/grants/
```
