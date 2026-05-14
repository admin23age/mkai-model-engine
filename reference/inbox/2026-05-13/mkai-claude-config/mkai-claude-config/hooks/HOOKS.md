# MKAI Hooks & Webhooks

> All webhooks, triggers, and automation hooks for MKAI agents

---

## Webhook Registry

### Admin Supervisor Webhooks

| Webhook | URL | Method | Purpose |
|---------|-----|--------|---------|
| Admin Supervisor | `/webhook/mkai-admin-supervisor` | POST | Main routing for admin tasks |
| Email Router | `/webhook/mkai-email-router` | POST | Email classification trigger |
| Calendar Manager | `/webhook/mkai-calendar-manager` | POST | Manual calendar blocking |
| Marketing | `/webhook/mkai-marketing` | POST | Manual social/SEO trigger |
| Website Maintenance | `/webhook/mkai-website-maintenance` | POST | Maintenance requests |

### Operations Supervisor Webhooks

| Webhook | URL | Method | Purpose |
|---------|-----|--------|---------|
| Ops Supervisor | `/webhook/mkai-ops-supervisor` | POST | Main routing for ops tasks |
| CRM Sync | `/webhook/mkai-crm-sync` | POST | Manual CRM sync trigger |
| Email Drip | `/webhook/mkai-email-drip` | POST | Drip campaign trigger |
| Report Generator | `/webhook/mkai-report-gen` | POST | Manual report generation |
| Task Scheduler | `/webhook/mkai-task-scheduler` | POST | Task scheduling |

### Full Webhook URLs

Base: `https://agegroup.app.n8n.cloud`

```
https://agegroup.app.n8n.cloud/webhook/mkai-admin-supervisor
https://agegroup.app.n8n.cloud/webhook/mkai-email-router
https://agegroup.app.n8n.cloud/webhook/mkai-calendar-manager
https://agegroup.app.n8n.cloud/webhook/mkai-marketing
https://agegroup.app.n8n.cloud/webhook/mkai-website-maintenance
https://agegroup.app.n8n.cloud/webhook/mkai-ops-supervisor
https://agegroup.app.n8n.cloud/webhook/mkai-crm-sync
```

---

## Scheduled Triggers

### Admin Supervisor Schedule

| Time (EST) | Trigger | Workflow | Action |
|------------|---------|----------|--------|
| Every 15 min | Cron | Email Router | Check inbox for new emails |
| 6:00 AM | Cron | Calendar Manager | Block next 48 hours |
| 8:00 AM | Cron | Marketing | Post to Dorothy Dean Designs |
| 9:00 AM | Cron | Marketing | Post to Man Kind AI |
| Monday 7:00 AM | Cron | Marketing | Weekly SEO report |

### Operations Supervisor Schedule

| Time (EST) | Trigger | Workflow | Action |
|------------|---------|----------|--------|
| Every 6 hours | Cron | CRM Sync | Airtable ↔ Zoho reconciliation |
| 9:00 AM | Cron | Task Scheduler | Check overdue tasks |
| 6:00 PM | Cron | Email Drip | Send drip emails |
| Monday 8:00 AM | Cron | Report Generator | Weekly metrics report |

### Cron Expressions Reference

```
# Every 15 minutes
*/15 * * * *

# Daily at 6 AM
0 6 * * *

# Daily at 8 AM
0 8 * * *

# Daily at 9 AM  
0 9 * * *

# Every 6 hours
0 */6 * * *

# Monday at 7 AM
0 7 * * 1

# Monday at 8 AM
0 8 * * 1
```

---

## Event-Based Triggers

### Airtable Automations

| Trigger | Condition | Action |
|---------|-----------|--------|
| New Record | Table: Clients, Status = "New" | Notify Sales Supervisor |
| Status Change | Field: Status → "Completed" | Trigger Report Generator |
| New Content | Table: Posts, Status = "Ready" | Queue for Marketing |

### Zoho Desk Triggers

| Trigger | Condition | Action |
|---------|-----------|--------|
| Ticket Created | Priority = High | Send alert email |
| Ticket Updated | Status → Resolved | Log completion |

### Gmail Triggers (via Polling)

| Check | Frequency | Action |
|-------|-----------|--------|
| New unread emails | Every 15 min | Run Email Router |
| Emails from VIP list | Every 15 min | Flag for priority |

---

## Webhook Payloads

### Standard Request

```json
{
  "task_type": "email_check|calendar_block|social_post|...",
  "task_id": "optional - auto-generated if missing",
  "data": {
    // Task-specific data
  },
  "source": "webhook|schedule|manual",
  "test": false
}
```

### Email Router Specific

```json
{
  "task_type": "email_check",
  "force_check": true,
  "max_emails": 20
}
```

### Calendar Manager Specific

```json
{
  "task_type": "calendar_block",
  "days_ahead": 2,
  "skip_existing": true
}
```

### Marketing Specific

```json
{
  "task_type": "social_post",
  "brand": "dorothy_dean_designs|mankind_ai",
  "force_post": false
}
```

```json
{
  "task_type": "seo_report",
  "websites": ["https://www.mankindaitech.com"],
  "email_report": true
}
```

### Website Maintenance Specific

```json
{
  "task_type": "maintenance_request",
  "client_email": "client@example.com",
  "client_name": "Client Name",
  "website_url": "https://clientsite.com",
  "description": "Please update the homepage banner",
  "priority": "normal|high"
}
```

---

## Inter-Workflow Hooks

### Workflow Chaining

When one workflow needs to trigger another:

```javascript
// In n8n Code node
const webhookUrl = 'https://agegroup.app.n8n.cloud/webhook/mkai-{target}';

// Pass data to next workflow
return {
  json: {
    source_workflow: 'email_router',
    source_task_id: $json.task_id,
    destination: 'sales_supervisor',
    data: {
      email_id: $json.email_id,
      classification: $json.classification
    }
  }
};
```

### Using Execute Workflow Node

For tight coupling between supervisor and workers:

1. Supervisor receives task
2. Classifies and routes
3. Uses "Execute Workflow" node to call worker
4. Worker executes and returns result
5. Supervisor logs completion

---

## Testing Hooks

### Test All Webhooks Script

```powershell
# Save as test-webhooks.ps1

$baseUrl = "https://agegroup.app.n8n.cloud/webhook"
$webhooks = @(
    "mkai-admin-supervisor",
    "mkai-email-router",
    "mkai-calendar-manager",
    "mkai-marketing",
    "mkai-website-maintenance"
)

foreach ($hook in $webhooks) {
    Write-Host "Testing $hook..."
    $body = @{ test = $true } | ConvertTo-Json
    try {
        $response = Invoke-RestMethod -Uri "$baseUrl/$hook" -Method Post -Body $body -ContentType "application/json"
        Write-Host "✓ $hook - Success" -ForegroundColor Green
    } catch {
        Write-Host "✗ $hook - Failed: $_" -ForegroundColor Red
    }
}
```

### cURL Test Commands

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

# Test Marketing
curl -X POST "https://agegroup.app.n8n.cloud/webhook/mkai-marketing" \
  -H "Content-Type: application/json" \
  -d '{"test": true, "task_type": "social_post", "brand": "mankind_ai"}'

# Test Website Maintenance
curl -X POST "https://agegroup.app.n8n.cloud/webhook/mkai-website-maintenance" \
  -H "Content-Type: application/json" \
  -d '{"test": true, "client_email": "test@example.com", "description": "Test request"}'
```

---

## Monitoring Hooks

### Health Check Endpoint

Create a simple health check workflow:

```json
{
  "webhook_path": "mkai-health",
  "response": {
    "status": "healthy",
    "timestamp": "ISO8601",
    "active_workflows": ["list of active workflow IDs"]
  }
}
```

### Error Notification Hook

When any workflow fails critically:

1. Log to Airtable Error Log
2. Send email to support@mankindaitech.com
3. (Optional) Send Slack notification

```javascript
// Error notification payload
{
  "alert_type": "workflow_failure",
  "workflow": "MKAI Email Router",
  "error": "Gmail API timeout",
  "timestamp": "2024-03-31T10:00:00Z",
  "severity": "high"
}
```
