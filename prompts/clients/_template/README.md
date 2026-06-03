# Client Overlay — Onboarding Template

Copy this folder to `clients/<client-slug>/` to onboard a new client. A client
overlay holds **only the deltas** from `core/` — never a full copy of an agent.

## How composition works
At runtime a workflow assembles each agent prompt in three layers:

```
core/agents/<role>/system-prompt.md     ← the reusable role logic (never edited per client)
        +
clients/<client>/brand.md               ← injected into ALL of this client's agents
        +
clients/<client>/agents/<role>/*.md     ← OPTIONAL per-agent override (only if this client deviates)
```

If a client's agent behaves exactly like the core template, it needs **no file**
in `agents/` — just `brand.md` carries the voice/product context. Add a per-agent
override file only when that role genuinely diverges for this client.

## Steps to onboard a client
1. `cp -r clients/_template clients/<client-slug>`
2. Fill `client.md` (systems, MCP IDs, data sources).
3. Fill `brand.md` (voice, tone, product context).
4. Add per-agent overrides under `agents/<role>/` only where needed.
5. Point the client's n8n workflows at `core` + this overlay.

## Files
| File | Purpose |
|---|---|
| `client.md` | Client meta: name, active systems, MCP tool IDs, data sources |
| `brand.md` | Brand voice/tone/product context injected into every agent |
| `agents/<role>/` | Optional per-agent overrides (omit if the core template is used as-is) |
