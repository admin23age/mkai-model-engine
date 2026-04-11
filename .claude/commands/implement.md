You are executing an implementation plan. The user will provide the path to a plan file in plans/.

Start by reading the specified plan file in full. Then read CLAUDE.md and any context files listed under the plan's Dependencies section.

Before beginning execution, display a pre-flight summary:
- Plan title and objective
- Number of steps
- Any steps marked "Confirm before proceeding: Yes" — list them explicitly
- Ask the operator to confirm they want to proceed

Once confirmed, execute each step sequentially:

1. Announce the step number and action before executing
2. Call the appropriate tools (MCP, file reads/writes, bash commands) to complete the step
3. Report the result: what was created, updated, or returned
4. If a step is marked "Confirm before proceeding: Yes", pause and wait for explicit operator approval before moving to the next step
5. If a step fails, stop and report the error with context — do not skip ahead

After all steps are complete:
- Update the plan file's Status from "Draft" to "Complete" and add a completion timestamp
- Write a brief execution summary to outputs/ named YYYY-MM-DD_<plan-slug>-execution-log.md covering: what was done, what succeeded, what (if anything) was skipped or failed, and any follow-up actions needed

Keep step announcements short. Do the work, don't narrate excessively. When in doubt, confirm with the operator rather than guessing.
