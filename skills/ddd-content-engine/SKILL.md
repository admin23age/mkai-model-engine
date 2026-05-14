---
name: cowork:ddd-content-engine
description: Generate Dorothy Dean Designs video content via Seedance 2.0 (fal.ai). Reads a DD Content Queue row from Airtable, calls fal.ai with reference images + prompt, uploads result to Google Drive, writes the video URL back to the row.
---

# DDD Content Engine

## Invocation

```
cowork:ddd-content-engine recordId=<airtable-record-id>
```

Triggered by an hourly Claude routine that polls Airtable for `Status = Needs Media` rows.

## What it does

1. **Read** the Airtable row by `recordId` from the DD Content Queue table
2. **Set status** to `Generating`
3. **Resolve** model variant from `Tier` field (`Fast` → `/fast/reference-to-video`, `Hero` → `/reference-to-video`)
4. **Call fal.ai** with:
   - `prompt` from `Seedance Prompt` field
   - `reference_images` from `Reference Images` attachments (up to 9 URLs)
   - `duration` from `Duration` field
   - `resolution` from `Resolution` field
   - `aspect_ratio` inferred from platform (Reels = 9:16, YouTube = 16:9)
5. **Download** the resulting video from the fal-hosted URL
6. **Upload** to Google Drive (`DRIVE_OUTPUT_FOLDER_ID`) with filename `<recordId>_<timestamp>.mp4`
7. **Write back** to Airtable:
   - `Video URL` ← Drive shareable link
   - `Video Status` ← `Generated`
   - `Generation Run ID` ← fal.ai `request_id`

## Failure handling

- 3 retries with exponential backoff (2s, 4s, 8s) on transient API errors (429, 5xx)
- On persistent failure: write `Video Status = Generation Failed`, traceback to `Last Generation Error`
- Skill exits cleanly so the routine moves to the next row
- Retries on next routine run capped at 3 cumulative attempts (tracked via `Last Generation Error` content)

## Environment

Requires:
- `FAL_KEY`
- `AIRTABLE_API_KEY`, `AIRTABLE_BASE_ID`, `AIRTABLE_TABLE_ID`
- `GOOGLE_APPLICATION_CREDENTIALS`, `DRIVE_OUTPUT_FOLDER_ID`

See `.env.example` at repo root.

## References

- `references/fal-api.md` — fal.ai Seedance endpoint schemas, gotchas
- Plan: `plans/2026-05-13_seedance-content-engine.md`

## Migration note

Day 28 of subscription: evaluate fal.ai spend vs BytePlus direct Seedance subscription. If migrating to BytePlus, only the API call block in `scripts/generate.py` changes. Auth swaps from `FAL_KEY` to `BYTEPLUS_API_KEY` + `BYTEPLUS_ENDPOINT_ID`.
