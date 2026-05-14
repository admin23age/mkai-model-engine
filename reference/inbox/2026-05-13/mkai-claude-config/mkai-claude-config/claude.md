# MKAI Claude Configuration

> Master configuration for Man Kind AI Tech agent development

## Project Info

- **Project:** Man Kind AI Tech (MKAI)
- **Website:** https://www.mankindaitech.com
- **n8n Instance:** https://agegroup.app.n8n.cloud
- **Support Email:** support@mankindaitech.com

---

## Build Commands

### n8n Workflows

```bash
# Import workflow to n8n
curl -X POST "https://agegroup.app.n8n.cloud/api/v1/workflows" \
  -H "X-N8N-API-KEY: $N8N_API_KEY" \
  -H "Content-Type: application/json" \
  -d @workflow.json

# Activate workflow
curl -X PATCH "https://agegroup.app.n8n.cloud/api/v1/workflows/{id}/activate" \
  -H "X-N8N-API-KEY: $N8N_API_KEY"

# Test webhook
curl -X POST "https://agegroup.app.n8n.cloud/webhook/{webhook-path}" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Claude Code Skills

```bash
# Add skill (user-level)
claude mcp add-skill {skill-name} --path ~/.claude/skills/{skill-name} --scope user

# Add skill (project-level)
mkdir -p .claude/skills
cp -r {skill-folder} .claude/skills/

# Verify skills
claude /skills

# Test skill invocation
claude "Use the {skill-name} skill to..."
```

### Airtable

```bash
# List records
curl "https://api.airtable.com/v0/{baseId}/{tableName}" \
  -H "Authorization: Bearer $AIRTABLE_API_KEY"

# Create record
curl -X POST "https://api.airtable.com/v0/{baseId}/{tableName}" \
  -H "Authorization: Bearer $AIRTABLE_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{"fields": {"Name": "Test"}}'
```

---

## Naming Conventions

### Workflows

| Type | Pattern | Example |
|------|---------|---------|
| Supervisor | `MKAI {Name} Supervisor` | `MKAI Admin Supervisor` |
| Worker | `MKAI {Supervisor} - {Worker}` | `MKAI Admin - Email Router` |
| Utility | `MKAI Util - {Function}` | `MKAI Util - Error Logger` |

### Webhooks

| Type | Pattern | Example |
|------|---------|---------|
| Supervisor | `mkai-{name}-supervisor` | `mkai-admin-supervisor` |
| Worker | `mkai-{worker}` | `mkai-email-router` |

### Airtable

| Type | Pattern | Example |
|------|---------|---------|
| Base | `MKAI {Purpose}` | `MKAI Operations` |
| Table | `{Entity}` (plural) | `Clients`, `Tasks`, `Logs` |
| Field | `{Name}` (title case) | `Client Name`, `Created At` |
| Field ID | Use field ID, not name | `fldXXXXXXXXXXXXXX` |

### Variables

| Type | Pattern | Example |
|------|---------|---------|
| Environment | `MKAI_{SERVICE}_{KEY}` | `MKAI_AIRTABLE_API_KEY` |
| Task ID | `{agent}_{timestamp}_{random}` | `admin_1711900000_a1b2c3` |
| Record ID | Use platform native | `rec123ABC` (Airtable) |

---

## Architecture

### Agent Hierarchy

```
TIER 0: MKAI Orchestrator
    │
TIER 1: Supervisors (4)
    ├── Sales Supervisor      → NET NEW clients
    ├── Delivery Supervisor   → Audits, reports
    ├── Operations Supervisor → CRM, automation
    └── Admin Supervisor      → Email, calendar, marketing
    │
TIER 2: Workers (16+)
    └── Each supervisor has 3-5 workers
    │
TIER 3: Platforms
    ├── n8n (automation)
    ├── Claude API (chat)
    ├── Claude Code (complex tasks)
    └── MCP connectors (integrations)
```

### Data Flow

```
User Request
    │
    ▼
MKAI Orchestrator (classify, route)
    │
    ▼
Supervisor (validate, dispatch)
    │
    ▼
Worker (execute, log)
    │
    ▼
Response / Side Effect
```

### Routing Rules

| Signal | Destination |
|--------|-------------|
| New prospect, pricing inquiry | Sales Supervisor |
| Existing client issue | Zoho Desk (Support) |
| Website maintenance | Admin → Website Maintenance |
| Internal automation | Operations Supervisor |
| Audit/report delivery | Delivery Supervisor |

---

## Gotchas

### n8n

1. **Field IDs vs Names:** Always use Airtable field IDs (`fldXXX`), not display names — names can change
2. **Spread operator:** Always include `...item.json` in Code nodes to preserve upstream data
3. **Webhook responses:** Must call "Respond to Webhook" node or request hangs
4. **Credentials:** Each node needs its own credential reference, even if same account
5. **Timezone:** n8n server may be UTC — convert to EST for schedules

### Claude Code

1. **Skills path:** User-level skills go in `~/.claude/skills/`, project-level in `.claude/skills/`
2. **SKILL.md required:** Every skill needs a `SKILL.md` file at root
3. **No auto-reload:** After editing skills, restart Claude Code session
4. **MCP validation:** The `validate_workflow` tool often fails — use JSON import instead

### Airtable

1. **Rate limits:** 5 requests/second per base
2. **Record limit:** Max 100 records per API call
3. **Formula syntax:** Use `FIND()` for partial match, not `CONTAINS()`
4. **Linked records:** Return record IDs, not display values

### Zoho

1. **OAuth refresh:** Tokens expire — use refresh token flow
2. **Department ID:** Required for ticket creation — get from API first
3. **Contact ID:** Must exist or be created before ticket creation

### Gmail

1. **Labels:** Use label IDs, not names for reliability
2. **Threads vs Messages:** Search returns threads; get messages separately
3. **Send limits:** 500 emails/day for workspace accounts

---

## File References

- **Rules:** See `.claude/rules/` for testing and API standards
- **Permissions:** See `.claude/json/` for safety configs
- **Hooks:** See `.claude/hooks/` for webhook definitions
- **Skills:** See `~/.claude/skills/mkai-agents/` for agent skill

---

## Quick Links

| Resource | URL |
|----------|-----|
| n8n Dashboard | https://agegroup.app.n8n.cloud |
| Airtable | https://airtable.com |
| Zoho Desk | https://desk.zoho.com |
| Calendly | https://calendly.com/mankindaitech-support/30min |
| Claude API | https://console.anthropic.com |
