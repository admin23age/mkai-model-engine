# Seedance Content Engine — Plan

**Date:** 2026-05-13
**Client:** Dorothy Dean Designs (DDD)
**Status:** Ready to build
**Supersedes:** Arcads-based plan in `2026-05-13_content-engine-handoff.md` (Arcads → Seedance swap)

---

## Objective

Automate DDD video content generation. Airtable rows tagged `Status = Needs Media` → Claude routine reads the row → calls Seedance 2.0 via fal.ai → uploads result to Drive → writes video URL back to Airtable.

## Decision log

| Decision | Choice | Rationale |
|---|---|---|
| Video model | **Seedance 2.0** (ByteDance) | Cinematic output, native audio, real-world physics |
| API gateway | **fal.ai** (first 30 days) | Single key, minutes to set up; direct BytePlus is option B |
| Model variant | `bytedance/seedance-2.0/reference-to-video` | Up to 9 reference images → brand consistency across product/model/mood shots |
| Tier strategy | `/fast/` for volume, standard for hero pieces | Cost vs quality |
| Trigger | Hourly Claude routine polls Airtable | Simplest; no webhook infra |
| Skill scope | Full job (read row → fal → Drive → write back) | Single source of truth |
| Skill name | `cowork:ddd-content-engine` | Matches handoff filename |

## 30-day evaluation gate

Day 28 reminder: review fal.ai spend + Seedance subscription usage. Decision tree:
- **High volume + fal.ai costing more than Seedance sub** → migrate skill to BytePlus direct API (~1hr work), cancel either
- **Light usage** → cancel Seedance direct subscription, stay on fal.ai
- **Roughly equal** → stay on fal.ai for simplicity

---

## Airtable schema (LIVE — `appr0OjO1x803LE3z`)

**Single-table model.** All Seedance fields live on `DD Content Queue` (`tblQ9hxifG4Y3Uech`) alongside the existing content fields. The earlier separate `Video Creation Queue` table was consolidated away — deleted manually in the Airtable UI (the API doesn't support table deletion).

### `DD Content Queue` — relevant fields

**Pre-existing (used by skill):**
| Field | Type | Notes |
|---|---|---|
| `Title` | singleLineText | Primary field |
| `Reference Image` | multipleAttachments | Up to 9 reference images for Seedance |
| `Visual Theme` | multilineText | Optional theme; appended to prompt |
| `Video Format` | singleSelect | Drives aspect ratio inference |
| `Media URL` | url | Final video URL written here on success |

**Added 2026-05-13 for Seedance pipeline:**
| Field | Type | Notes |
|---|---|---|
| `Seedance Prompt` | multilineText | Primary prompt |
| `Duration` | number (precision 0) | Seconds (5 or 10) |
| `Tier` | singleSelect | `Basic` / `Pro` / `Premium` |
| `Resolution` | singleSelect | `720p` / `1080p` / `4K` |
| `Video Status` | singleSelect | `Queued` → `Generating` → `Complete` / `Error` |
| `Last Generation Error` | multilineText | Traceback on failure |
| `Generation Run ID` | singleLineText | fal.ai `request_id` |

### Tier → model mapping

| Tier | fal.ai model |
|---|---|
| `Basic` | `fal-ai/bytedance/seedance-2.0/fast/reference-to-video` |
| `Pro` | `fal-ai/bytedance/seedance-2.0/reference-to-video` |
| `Premium` | `fal-ai/bytedance/seedance-2.0/reference-to-video` + min `resolution=1080p` |

**Status flow:** `Queued` → (routine picks up) → `Generating` → `Complete` (URL filled) or `Error` (logged, retry on next run capped at 3 cumulative attempts).

---

## API integration — fal.ai

**Auth:** `FAL_KEY` env var
**Endpoint (image/reference):** `https://fal.run/fal-ai/bytedance/seedance-2.0/reference-to-video` (or `/fast/reference-to-video`)
**Pattern:** Sync call returns hosted video URL (or async with queue endpoint for long jobs)

**Request shape (representative):**
```json
{
  "prompt": "...",
  "reference_images": ["https://...", "https://..."],
  "duration": 5,
  "resolution": "1080p",
  "aspect_ratio": "9:16"
}
```

**Response:** `{ "video": { "url": "https://..." }, "request_id": "..." }`

> Verify exact schema against fal.ai docs at build time. Fields above are representative — actual param names may differ.

---

## Skill — `cowork:ddd-content-engine`

**Inputs:** Airtable `recordId` (string) — passed by the routine
**Reads from Airtable:** Prompt, Reference Images (URLs), Duration, Tier, Resolution, aspect ratio inferred from platform field
**Calls:** fal.ai (model selected by Tier field)
**Outputs:** Updates Airtable row with `Video URL`, `Video Status`, `Generation Run ID`

**Failure handling:**
- 3 retries with exponential backoff inside skill for transient API errors
- On persistent failure: write `Generation Failed` + traceback to `Last Generation Error`, exit cleanly
- Routine moves to next row regardless

**Implementation pattern:** MCP-driven, no separate runtime. Claude executes steps via Airtable MCP, Drive MCP, and WebFetch/Bash for fal.ai (no fal MCP exists).

**Skill scaffold location:** `skills/ddd-content-engine/`
- `SKILL.md` — step-by-step instructions Claude follows
- `references/fal-api.md` — endpoint quirks, schema notes

---

## Routine — hourly poll

Use `/schedule` to register:
- Cron: `0 * * * *` (every hour on the hour)
- Action: Query Airtable for `Status = Needs Media` rows, invoke `cowork:ddd-content-engine` for each (max N per run to avoid overrun), log results

---

## Build steps

1. ✅ Write this plan
2. ✅ Add `.env.example` with `FAL_KEY` placeholder + `.gitignore` to protect `.env`
3. ✅ Airtable: `Video Creation Queue` table live (`tblHmldbdiNtXsELc`)
4. ✅ Stub skill scaffold at `skills/ddd-content-engine/` with MCP-driven SKILL.md
5. ⬜ Test the skill against 1 real row (`Tier = Basic`)
6. ⬜ Register hourly routine via `/schedule` (polls `Video Status = Queued`)
7. ⬜ Monitor first 3 runs, tune retry/error handling
8. ⬜ **Day 28:** evaluation gate — decide fal.ai vs BytePlus direct

---

## Open questions

- Drive folder structure for generated videos — flat `DDD/Generated Videos/` or sliced by month/platform?
- Aspect ratio source — dedicated Airtable field, or infer from platform (Instagram Reels = 9:16, YouTube = 16:9)?
- Prompt authoring — generated upstream by another skill, or human-written in Airtable?

Resolve at build time; not blockers.
