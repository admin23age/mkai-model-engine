# MKAI Rules & Standards

> Testing standards, API conventions, and concerns for all MKAI skills

---

## Testing Standards

### Before Deploying Any Workflow

1. **Unit Test** — Test each node individually with sample data
2. **Integration Test** — Run full workflow with test webhook
3. **Error Test** — Verify error handling with bad inputs
4. **Load Test** — Confirm rate limits aren't exceeded

### Test Data Convention

```json
{
  "test": true,
  "test_id": "test_1234567890",
  "test_email": "test@mankindaitech.com",
  "test_client": "Test Client Inc"
}
```

Always include `"test": true` flag so workflows can skip real actions during testing.

### Webhook Testing

```bash
# Test Admin Supervisor
curl -X POST "https://agegroup.app.n8n.cloud/webhook/mkai-admin-supervisor" \
  -H "Content-Type: application/json" \
  -d '{"test": true, "task_type": "email_check"}'

# Test Email Router
curl -X POST "https://agegroup.app.n8n.cloud/webhook/mkai-email-router" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'

# Test Calendar Manager
curl -X POST "https://agegroup.app.n8n.cloud/webhook/mkai-calendar-manager" \
  -H "Content-Type: application/json" \
  -d '{"test": true}'
```

### Expected Test Responses

| Workflow | Success Response |
|----------|------------------|
| Admin Supervisor | `{"status": "completed", "worker": "..."}` |
| Email Router | `{"emails_processed": N, "status": "completed"}` |
| Calendar Manager | `{"new_blocks_created": N, "status": "completed"}` |

---

## API Conventions

### Request Format

All internal APIs use JSON:

```json
{
  "task_id": "string (required)",
  "task_type": "string (required)",
  "data": { },
  "timestamp": "ISO8601",
  "source": "webhook|schedule|manual"
}
```

### Response Format

```json
{
  "task_id": "string",
  "status": "pending|in_progress|completed|failed",
  "worker": "string",
  "result": { },
  "error": "string (if failed)",
  "timestamp": "ISO8601"
}
```

### HTTP Status Codes

| Code | Meaning | When to Use |
|------|---------|-------------|
| 200 | Success | Task completed |
| 202 | Accepted | Task queued for processing |
| 400 | Bad Request | Missing required fields |
| 401 | Unauthorized | Invalid API key |
| 429 | Rate Limited | Too many requests |
| 500 | Server Error | Workflow failed |

### API Endpoints (n8n Webhooks)

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/webhook/mkai-admin-supervisor` | POST | Admin task routing |
| `/webhook/mkai-email-router` | POST | Email classification |
| `/webhook/mkai-calendar-manager` | POST | Calendar blocking |
| `/webhook/mkai-marketing` | POST | Social/SEO tasks |
| `/webhook/mkai-website-maintenance` | POST | Client maintenance |
| `/webhook/mkai-ops-supervisor` | POST | Ops task routing |
| `/webhook/mkai-crm-sync` | POST | CRM synchronization |

---

## Error Handling

### 3-Level Error Strategy

**Level 1: Retry**
- Retry up to 3 times
- Exponential backoff: 5s, 15s, 45s
- Use for: Network timeouts, rate limits

**Level 2: Log & Continue**
- Log error to Airtable Error Log table
- Continue processing other items
- Use for: Single record failures in batch

**Level 3: Alert & Pause**
- Send email alert to support@mankindaitech.com
- Pause workflow execution
- Use for: Critical failures, auth errors

### Error Log Format (Airtable)

| Field | Type | Example |
|-------|------|---------|
| Error ID | Auto | `err_123ABC` |
| Workflow | Text | `MKAI Admin Supervisor` |
| Node | Text | `Create Zoho Ticket` |
| Error Type | Select | `auth|network|validation|unknown` |
| Message | Long Text | Full error message |
| Input Data | Long Text | JSON of input that caused error |
| Timestamp | DateTime | Auto |
| Resolved | Checkbox | false |

### Error Handling Code Template

```javascript
// Standard error wrapper for n8n Code nodes
try {
  // Your logic here
  const result = doSomething();
  return { success: true, data: result };
} catch (error) {
  return {
    success: false,
    error: {
      message: error.message,
      type: error.name,
      stack: error.stack,
      timestamp: new Date().toISOString()
    }
  };
}
```

---

## Naming Conventions

### Files

| Type | Pattern | Example |
|------|---------|---------|
| Workflow JSON | `{agent}-workflow.json` | `email-router-workflow.json` |
| Spec docs | `{AGENT}_SPEC.md` | `ADMIN_SUPERVISOR_SPEC.md` |
| Config files | `{name}.json` | `permissions.json` |

### Code Variables

| Type | Pattern | Example |
|------|---------|---------|
| Constants | `UPPER_SNAKE_CASE` | `MAX_RETRIES` |
| Functions | `camelCase` | `classifyEmail()` |
| Classes | `PascalCase` | `EmailRouter` |
| IDs | `snake_case` | `task_id`, `client_email` |

### Airtable Fields

| Type | Pattern | Example |
|------|---------|---------|
| Primary | `Name` or `Title` | `Client Name` |
| Foreign Key | `{Related Table}` | `Client` (links to Clients) |
| Status | `Status` | Single select |
| Timestamps | `{Action} At` | `Created At`, `Posted At` |
| Boolean | `Is {State}` | `Is Active`, `Is Resolved` |

---

## Security Concerns

### Never Do

- ❌ Hardcode API keys in workflow JSON
- ❌ Log full email bodies (PII concern)
- ❌ Store passwords in Airtable
- ❌ Skip validation on webhook inputs
- ❌ Trust `sender_type` from external sources

### Always Do

- ✅ Use n8n credentials store for secrets
- ✅ Validate all webhook inputs
- ✅ Check if client exists before routing
- ✅ Sanitize data before logging
- ✅ Use HTTPS for all external calls

### Input Validation Template

```javascript
// Validate required fields
const required = ['task_type', 'task_id'];
for (const field of required) {
  if (!input[field]) {
    throw new Error(`Missing required field: ${field}`);
  }
}

// Sanitize strings
const sanitize = (str) => str.replace(/[<>\"\']/g, '');
const safeSubject = sanitize(input.subject || '');
```

---

## Rate Limits

| Service | Limit | Action |
|---------|-------|--------|
| Airtable | 5 req/sec per base | Add delays between batch calls |
| Gmail | 500 emails/day | Queue and spread sends |
| Zoho Desk | 100 req/min | Implement backoff |
| n8n Cloud | Varies by plan | Monitor execution counts |
| Google Calendar | 100 req/100 sec | Batch event creation |

### Rate Limit Handling

```javascript
// Simple rate limiter
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function rateLimitedCall(items, fn, delayMs = 200) {
  const results = [];
  for (const item of items) {
    results.push(await fn(item));
    await sleep(delayMs);
  }
  return results;
}
```
