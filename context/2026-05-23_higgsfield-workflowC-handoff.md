# MKAI — Higgsfield → n8n Workflow C Handoff
**Date:** 2026-05-23 · **Repo:** `C:\Users\immav\Projects\model-engine` (git: `admin23age/mkai-model-engine`)

## Goal
Wire Higgsfield video generation into n8n **Workflow C** (`X1kDAxH1uZaVHdX4`, "Media Generator", webhook `content-media`).

## Decisions locked
- **Architecture: image-to-video** (not text-to-video). Use Seedance image-to-video with the Airtable **Reference Image** attachment as `image_url`. Reason: the public REST API only documents image-to-video, and this matches the original Seedance plan.
- **No live test submit** — configure from the confirmed contract; first real run happens on your n8n trigger.
- **Apply via n8n MCP** (`mcp__5ec9614f…`). ⚠️ `update_workflow` republishes from SDK code and may drop attached credentials — pull the live workflow first and re-verify/re-attach Airtable, Drive, and Higgsfield Auth credentials.

## Verified facts (authoritative)
- **Key:** `HF_KEY=keyid:secret` is in `model-engine\.env` (uncommented, gitignored). Format `e082b05b-…:5d97…`.
- **Higgsfield MCP** (`mcp__846b3294…`) works: 116 credits, Plus plan. Useful for credit checks/preflight; n8n cannot use it.
- **REST contract:**
  - Submit: `POST https://platform.higgsfield.ai/{endpoint-path}` · header `Authorization: Key {key}:{secret}` · `Content-Type: application/json` · flat JSON body
  - Confirmed video endpoint: `bytedance/seedance/v1/pro/image-to-video` (fields: `image_url`, `prompt`; also `kling-video/v2.1/pro/image-to-video`)
  - Submit response: `{ status, request_id, status_url, cancel_url }`
  - Poll: `GET https://platform.higgsfield.ai/requests/{request_id}/status`
  - Result path: **`video.url`** (object, not array); statuses `queued`/`completed`/`failed`/`nsfw`
  - Auth enforced (no key → `401`); status endpoint `500`s on unknown IDs (can't cheaply validate the key — only a real POST confirms authorization).

## Workflow C fixes to apply
1. **Generate node URL** → `https://platform.higgsfield.ai/bytedance/seedance/v1/pro/image-to-video`
2. **Body** → `{ image_url: <Airtable Reference Image url>, prompt: <built prompt> }` (drop `negative_prompt`/`duration:5`/old model IDs)
3. **Auth** → `Authorization: Key {key}:{secret}` via the **Higgsfield Auth** credential on *both* Generate and Poll nodes
4. **Poll node** → fix wrong **"Square Production"** credential; URL `=https://platform.higgsfield.ai/requests/{{ $('Higgsfield Generate').item.json.request_id }}/status`
5. **Extract Video URL** → read `$json.video.url`
6. **Write Media URL** → restore leading `=` on the `columns` expression
7. **Build prompt node** → replace invalid pillar→model map (`veo-3.1`/`sora-2`/etc.) and pull the Reference Image URL from the Airtable record

## Key IDs
| Item | Value |
| --- | --- |
| Workflow C (Media Generator) | `X1kDAxH1uZaVHdX4` |
| Airtable base (Social Media Planner) | `appr0OjO1x803LE3z` |
| DD Content Queue table | `tblQ9hxifG4Y3Uech` |
| Higgsfield API host | `platform.higgsfield.ai` |
| Higgsfield dashboard/keys/credits | `cloud.higgsfield.ai` |
| n8n cloud | `agegroup.app.n8n.cloud` |
| n8n Higgsfield Auth credential | `tdz7JpnEqHyGUfop` ("Higgsfield Auth") |

## Open risks
- Key authorization unconfirmed (no test submit) — watch for `401/403` on first run.
- Image-to-video requires each Airtable row to have a Reference Image; add a guard/branch for rows without one.
- Exposed/**dead** GitHub PAT (`ghp_…`) sits in plaintext in both `.env` files — rotate/remove.

## MCP cross-checks (Higgsfield MCP `mcp__846b3294…`)
- `balance` → live credits/plan
- `models_explore` (action `recommend`/`get`) → model constraints (note: MCP uses short IDs like `veo3_1_lite`; REST uses path-style endpoints — do not conflate)
- `generate_video` with `get_cost:true` → preflight credit cost without spending

## Verified 2026-05-23 (this session)
- **Live workflow pulled** — current name: "DDD Content Engine — Workflow C: Media Generator (Higgsfield)", active, webhook path `/webhook/content-media`. Current (broken) state confirms all 7 fixes still needed: Generate URL is `https://cloud.higgsfield.ai` with old body `{model,prompt,negative_prompt,aspect_ratio,duration}`; Poll URL is `cloud.higgsfield.ai/v1/jobs/{id}`; Extract reads `result.video_url/url/...`; Write Media URL columns expr missing leading `=`; Build prompt still has dead `veo-3.1/sora-2/kling-3.0/seedance-2.0` map and no `image_url`.
- **Reference Image field confirmed**: DD Content Queue `fldKfdXpp0um2TGXb` (`multipleAttachments`). User confirms every row has one now and going forward → hard-fail guard in Build prompt is fine; no graceful branch needed yet.
- **Credential names blocker**: `get_workflow_details` strips the `credentials` field, and the n8n MCP has no credential-list tool. So an SDK `update_workflow` rewrite can't safely reattach the **Airtable** (Get Queue Record, Write Media URL) and **Google Drive** (Save to Drive) creds — names unknown. Decision: **user applies the 7 fixes manually in the n8n UI** (zero credential risk). Higgsfield Auth credential = `tdz7JpnEqHyGUfop`.
- **Sidebar finding (not acted on):** DD Content Queue also has a separate video pipeline (`Video Status`, `Tier`, `Resolution`, `Duration`, `Generation Run ID`, `Last Generation Error`, `Rejection Feedback`) whose field descriptions cite **fal.ai + Arcads**, not Higgsfield. Possible competing/newer approach — confirm with user before assuming Higgsfield is the only video path.

### Final node values to enter (manual)
1. **Higgsfield Generate · URL** → `https://platform.higgsfield.ai/bytedance/seedance/v1/pro/image-to-video`
2. **Higgsfield Generate · Body** → `={{ JSON.stringify({ image_url: $json.image_url, prompt: $json.prompt }) }}`
3. **Higgsfield Generate · Auth** → Higgsfield Auth cred; header must be `Authorization: Key {keyid}:{secret}` (verify header name/value).
4. **Poll Higgsfield Status · URL** → `=https://platform.higgsfield.ai/requests/{{ $('Higgsfield Generate').item.json.request_id }}/status` + attach Higgsfield Auth (was wrongly "Square Production").
5. **Extract Video URL · JS** → read `data.video.url`; throw on `failed`/`nsfw` or missing url.
6. **Write Media URL · columns** → restore leading `=`: `={{ { mappingMode: "defineBelow", value: { id: $("Build Higgsfield Prompt").item.json.recordId, "Media URL": $json.webViewLink, "Content Status": "Generate Content" }, matchingColumns: ["id"] } }}`
7. **Build Higgsfield Prompt · JS** → drop pillar→model map; emit `{ recordId, image_url, prompt, pillar, title }`. ⚠️ **Reference Image is multi-attachment AND mixed-type** (rows hold 4+ images, sometimes a `.mp4` too). Do NOT use `[0]` — pick the first *image-type* attachment:
   ```js
   const refs = Array.isArray(f['Reference Image']) ? f['Reference Image'] : [];
   const firstImage = refs.find(a => a && typeof a.type === 'string' && a.type.startsWith('image/'));
   const refImage = firstImage ? firstImage.url : '';
   ```

## Preflight results 2026-05-23
- **Balance: 91 credits** (handoff said 116 — ~25 consumed since). Plus plan.
- **Cost: ~22.5 credits / 5s 720p std** (MCP `seedance_2_0` estimate; REST pro endpoint may differ). → only ~4 runs left on current balance. **Top up before batch runs.**
- **Seedance 2.0 constraints**: accepts `image`/`start_image`/`end_image`/`video`/`audio` roles; aspect `9:16` ok; duration 4–15s; resolution 480/720/1080p (default 720p).
- **Airtable attachment URLs are temporary signed `v5.airtableusercontent.com` links** — they expire. Fine here because the workflow reads the record live then submits immediately; don't cache them.
- **Open question for user**: which Reference Image is the *intended* video source when a row has several? Current logic = first image-type attachment, which may not be the best frame. May want a convention (e.g. first attachment is always the reference).
