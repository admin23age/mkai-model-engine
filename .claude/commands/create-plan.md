You are creating a structured implementation plan based on the user's request.

First, read CLAUDE.md to understand the workspace, active project, data sources, and agent hierarchy. Then read any relevant files from context/ that relate to the request.

Using today's date and the user's request, generate a plan file and save it to plans/ using this naming convention:
  plans/YYYY-MM-DD_<short-slug>.md

Where <short-slug> is a 2-4 word kebab-case summary of the task (e.g., `zoho-contact-sync`, `lift-launch-email`, `inventory-audit`).

The plan file must follow this structure:

---
# Plan: [Title]
**Date:** YYYY-MM-DD  
**Requested by:** [infer from context or write "operator"]  
**Status:** Draft  

## Objective
One paragraph describing what this plan accomplishes and why.

## Scope
- What is in scope
- What is explicitly out of scope

## Dependencies
- Required context files
- Required data source access
- Any prerequisite tasks or prior plans

## Steps
Numbered, sequential steps. Each step includes:
- **Action:** What to do
- **Tool/System:** Which MCP, file, or system is involved
- **Output:** What gets created or updated
- **Confirm before proceeding:** Yes/No (Yes for irreversible actions)

## Success Criteria
Bullet list of what "done" looks like — observable, checkable outcomes.

## Risks & Notes
Any known risks, edge cases, or decisions that need operator input.
---

After writing the file, confirm the file path and give a one-paragraph summary of what the plan covers.
