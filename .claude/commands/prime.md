Read the file at CLAUDE.md in full. Then read every file inside the context/ directory (list them first with a glob, then read each one). After loading all available context, produce a structured readiness summary with these sections:

## Workspace Identity
- Project name and description
- Active pilot client(s)

## Context Loaded
- List each file found in context/ with a one-line summary of its contents
- Note any context files that appear empty or missing expected content

## Systems Status
List each data source from CLAUDE.md and indicate whether credentials/MCP access appear to be in place based on available information.

## Active Plans
List any files currently in plans/ with their titles and creation dates.

## Readiness Assessment
- What is ready to act on immediately
- What is blocked or missing
- Top 3 recommended next actions to advance the pilot project

Keep the summary concise and actionable. This is a morning briefing, not a report.
