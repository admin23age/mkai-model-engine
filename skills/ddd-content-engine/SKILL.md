---
name: cowork:ddd-content-engine
description: Generate Dorothy Dean Designs video content via Seedance 2.0 (fal.ai). Reads a DD Content Queue row from Airtable, calls fal.ai with reference images + prompt, uploads result to Google Drive, writes the video URL back to the row. MCP-driven — no separate runtime, executes via Airtable + Drive MCPs and WebFetch for fal.ai.
---

# DDD Content Engine

MCP-driven skill. Claude runs the steps below using its existing tools — no Python script, no external runtime.

## Invocation

```
cowork:ddd-content-engine recordId=<airtable-record-id>
```

Triggered by an hourly Claude routine that polls the DD Content Queue table for `Status = Needs Media` rows and invokes this skill per row.

## Tool map

| Step | Tool |
|---|---|
| Read/write Airtable | Airtable MCP (`mcp__d5784726__*`) — `get_record_for_page`, `update_records_for_table` |
| Call fal.ai | WebFetch (or Bash + curl) — no fal MCP exists |
| Upload to Drive | Google Drive MCP (`mcp__d75a2d06__*`) — `create_file` |
| Read FAL_KEY | Bash: `printenv FAL_KEY` (env loaded from `.env`) |

## Execution steps

1. **Fetch row** from DD Content Queue by `recordId` (Airtable MCP)
2. **Set** `Video Status = Generating` (Airtable MCP update)
3. **Resolve** fal.ai model from `Tier` field:
   - `Fast` → `fal-ai/bytedance/seedance-2.0/fast/reference-to-video`
   - `Hero` → `fal-ai/bytedance/seedance-2.0/reference-to-video`
4. **Build payload:**
   - `prompt` ← `Seedance Prompt`
   - `reference_images` ← attachment URLs from `Reference Images` (max 9)
   - `duration` ← `Duration` (5 or 10)
   - `resolution` ← `Resolution` (720p / 1080p)
   - `aspect_ratio` ← inferred from `Platform` field (Reels/TikTok → 9:16, YouTube → 16:9, Square → 1:1)
5. **POST** to `https://fal.run/<model-id>` with `Authorization: Key $FAL_KEY` (WebFetch or Bash curl)
6. **Extract** `video.url` and `request_id` from response
7. **Download** the video bytes (Bash curl → temp file)
8. **Upload** to Drive in `DRIVE_OUTPUT_FOLDER_ID` as `<Content ID>_<YYYYMMDD-HHMM>.mp4` (Drive MCP `create_file`)
9. **Get** the Drive shareable URL
10. **Write back** to Airtable (single update):
    - `Video URL` ← Drive URL
    - `Video Status` ← `Generated`
    - `Generation Run ID` ← fal `request_id`

## Failure handling

- **Transient errors (429, 5xx, network):** 3 retries with backoff (2s, 4s, 8s)
- **Persistent failure:** update Airtable with `Video Status = Generation Failed` and write traceback / response body to `Last Generation Error`. Exit cleanly.
- **Cumulative cap:** routine checks `Last Generation Error` count — skip rows that have failed 3+ times
- **Skill never throws** — always returns a status string so the calling routine can continue to the next row

## Environment

Loaded from `.env` (gitignored). See `.env.example`:
- `FAL_KEY` — fal.ai API key
- `DRIVE_OUTPUT_FOLDER_ID` — target Drive folder

Airtable + Drive MCPs are pre-authenticated at the workspace level.

## References

- `references/fal-api.md` — endpoint schemas, request/response shapes, gotchas
- Plan: `plans/2026-05-13_seedance-content-engine.md`

## Migration note

Day 28 of Seedance subscription: evaluate fal.ai spend vs direct BytePlus. If migrating, only step 5 (the POST) changes — swap `fal.run` host + `FAL_KEY` auth for the BytePlus Ark endpoint + `BYTEPLUS_API_KEY`. Everything else (Airtable read/write, Drive upload, retry logic) is unchanged.
