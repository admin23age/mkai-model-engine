# MKAI API Conventions

> Standard API patterns for all MKAI integrations

---

## External APIs

### Airtable

**Base URL:** `https://api.airtable.com/v0`

**Authentication:**
```
Authorization: Bearer {AIRTABLE_API_KEY}
```

**MKAI Bases:**

| Base Name | Base ID | Purpose |
|-----------|---------|---------|
| Social Media Planner | `appr0OjO1x803LE3z` | DDD & MKAI content |
| Avatar Creator | `appn4fcpF8wWoBf7X` | Mockup generation |
| MKAI Operations | TBD | Clients, tasks, errors |

**Common Operations:**

```javascript
// List records with filter
GET /v0/{baseId}/{tableName}?filterByFormula={formula}

// Create record
POST /v0/{baseId}/{tableName}
Body: { "fields": { "Name": "value" } }

// Update record
PATCH /v0/{baseId}/{tableName}/{recordId}
Body: { "fields": { "Status": "Complete" } }

// Delete record
DELETE /v0/{baseId}/{tableName}/{recordId}
```

**Formula Examples:**

```
// Exact match
{Email} = 'test@example.com'

// Contains (partial match)
FIND('test', LOWER({Email})) > 0

// Multiple conditions
AND({Status} = 'Active', {Type} = 'Client')

// Date range
IS_AFTER({Created At}, '2024-01-01')
```

---

### Zoho Desk

**Base URL:** `https://desk.zoho.com/api/v1`

**Authentication:**
```
Authorization: Zoho-oauthtoken {ACCESS_TOKEN}
```

**Create Ticket:**

```javascript
POST /tickets
{
  "subject": "string",
  "description": "string",
  "departmentId": "string (required)",
  "contactId": "string",
  "email": "string",
  "priority": "Low|Medium|High|Urgent",
  "channel": "Email|Phone|Chat|Web"
}
```

**Get Departments (required first):**

```javascript
GET /departments
// Returns list with id and name
// Use id for ticket creation
```

---

### Gmail (via MCP)

**Available Operations:**

| Operation | Description |
|-----------|-------------|
| `gmail_search_messages` | Search inbox with query |
| `gmail_read_message` | Get full message content |
| `gmail_create_draft` | Create draft email |
| `gmail_list_labels` | Get all labels |

**Search Query Syntax:**

```
// Unread emails
is:unread

// From specific sender
from:example@gmail.com

// Subject contains
subject:invoice

// Recent emails
newer_than:1d

// Combined
is:unread from:client@example.com newer_than:7d
```

---

### Google Calendar (via MCP)

**Available Operations:**

| Operation | Description |
|-----------|-------------|
| `gcal_list_events` | Get events in time range |
| `gcal_create_event` | Create new event |
| `gcal_update_event` | Modify existing event |
| `gcal_delete_event` | Remove event |

**Create Event:**

```javascript
{
  "calendarId": "primary",
  "summary": "Meeting Title",
  "description": "Details",
  "start": {
    "dateTime": "2024-03-15T09:00:00-05:00",
    "timeZone": "America/New_York"
  },
  "end": {
    "dateTime": "2024-03-15T10:00:00-05:00",
    "timeZone": "America/New_York"
  },
  "colorId": "8"  // Graphite for blocks
}
```

**Color IDs:**

| ID | Color | Use For |
|----|-------|---------|
| 1 | Lavender | Personal |
| 4 | Flamingo | Client calls |
| 8 | Graphite | Blocked time |
| 10 | Basil | Team meetings |
| 11 | Tomato | Urgent |

---

### n8n Webhooks

**Base URL:** `https://agegroup.app.n8n.cloud/webhook`

**Standard Request:**

```javascript
POST /webhook/{webhook-path}
Content-Type: application/json

{
  "task_type": "string",
  "task_id": "string",
  "data": { },
  "timestamp": "ISO8601"
}
```

**Standard Response:**

```javascript
{
  "status": "completed|failed|pending",
  "task_id": "string",
  "result": { },
  "timestamp": "ISO8601"
}
```

---

## Internal API Patterns

### Task Object Schema

```javascript
{
  // Required
  "task_id": "admin_1711900000_abc123",
  "task_type": "email_check|calendar_block|social_post|...",
  
  // Routing
  "source": "webhook|schedule|manual",
  "destination": "sales|support|maintenance|owner|archive",
  
  // Context
  "data": {
    // Task-specific payload
  },
  
  // Metadata
  "timestamp": "2024-03-31T10:00:00Z",
  "status": "pending|in_progress|completed|failed"
}
```

### Email Object Schema

```javascript
{
  "email_id": "string",
  "thread_id": "string",
  "from_email": "sender@example.com",
  "from_name": "Sender Name",
  "subject": "Email Subject",
  "snippet": "First 100 chars...",
  "classification": "sales_inquiry|support_request|maintenance|partnership|spam",
  "confidence": 0.85,
  "destination": "sales_supervisor|zoho_desk|website_maintenance|owner|archive",
  "sender_type": "new_prospect|existing_client|unknown"
}
```

### Calendar Block Schema

```javascript
{
  "start": "ISO8601 datetime",
  "end": "ISO8601 datetime",
  "summary": "🔒 Focus Time (Auto-blocked)",
  "description": "Auto-blocked by MKAI Calendar Manager",
  "colorId": "8"
}
```

### Social Post Schema

```javascript
{
  "brand": "dorothy_dean_designs|mankind_ai",
  "caption": "Post caption text...",
  "image_url": "https://...",
  "hashtags": "#HashTag1 #HashTag2",
  "scheduled_time": "ISO8601",
  "record_id": "recXXXXXXXXXX",
  "status": "ready_to_post|posted|failed"
}
```

---

## Pagination

### Airtable

```javascript
// First request
GET /v0/{base}/{table}?pageSize=100

// Response includes offset if more records
{ "records": [...], "offset": "itrXXXXX" }

// Next page
GET /v0/{base}/{table}?pageSize=100&offset=itrXXXXX
```

### n8n Batch Processing

```javascript
// Use Split In Batches node
// Settings:
//   Batch Size: 10
//   Reset: false (continue from last batch)

// In Code node, check batch index:
const batchIndex = $('Split In Batches').first().json.batchIndex;
```

---

## Date/Time Handling

### Always Use ISO 8601

```javascript
// Correct
"2024-03-31T10:00:00Z"           // UTC
"2024-03-31T06:00:00-04:00"      // EST with offset

// Incorrect
"03/31/2024 10:00 AM"            // Ambiguous
"March 31, 2024"                  // Not parseable
```

### Timezone Conversion (for n8n)

```javascript
// Get current time in EST
const now = new Date();
const estOffset = -4 * 60; // EDT is UTC-4
const est = new Date(now.getTime() + (estOffset * 60 * 1000));

// Format for Google Calendar
const formatted = est.toISOString().replace('Z', '-04:00');
```

### Business Hours Check

```javascript
function isBusinessHours(date) {
  const hour = date.getHours();
  const day = date.getDay();
  
  // Monday-Friday, 9 AM - 5 PM
  return day >= 1 && day <= 5 && hour >= 9 && hour < 17;
}
```
