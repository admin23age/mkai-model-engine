# fal.ai — Seedance 2.0 API reference

> Verify exact schemas at https://fal.ai/models/fal-ai/bytedance/seedance-2.0/reference-to-video before implementation. Fields below are representative and may need adjustment.

## Endpoints

| Use case | Model ID | Notes |
|---|---|---|
| Text → video (hero) | `fal-ai/bytedance/seedance-2.0/text-to-video` | No image input |
| Text → video (fast) | `fal-ai/bytedance/seedance-2.0/fast/text-to-video` | Cheaper, faster |
| Image → video (hero) | `fal-ai/bytedance/seedance-2.0/image-to-video` | Single ref image |
| Image → video (fast) | `fal-ai/bytedance/seedance-2.0/fast/image-to-video` | |
| Reference → video (hero) | `fal-ai/bytedance/seedance-2.0/reference-to-video` | Up to 9 refs — **DDD default** |
| Reference → video (fast) | `fal-ai/bytedance/seedance-2.0/fast/reference-to-video` | DDD default for volume |

## Auth

Header: `Authorization: Key <FAL_KEY>`
Base URL: `https://fal.run/`

## Request (reference-to-video, representative)

```http
POST https://fal.run/fal-ai/bytedance/seedance-2.0/fast/reference-to-video
Authorization: Key $FAL_KEY
Content-Type: application/json

{
  "prompt": "...",
  "reference_images": ["https://...", "https://..."],
  "duration": 5,
  "resolution": "1080p",
  "aspect_ratio": "9:16",
  "seed": 42
}
```

## Response

```json
{
  "video": {
    "url": "https://v3.fal.media/files/.../output.mp4",
    "content_type": "video/mp4",
    "file_size": 1234567
  },
  "request_id": "..."
}
```

## Sync vs async

- Short jobs (≤30s) — call `fal.run/...` synchronously
- Long jobs or batches — use queue endpoints at `queue.fal.run/...` with poll-for-status pattern
- For DDD 5–10s clips, sync is fine

## Known constraints

- Reference images must be publicly fetchable URLs (Airtable attachment URLs work — they're signed but public during the URL TTL)
- If an Airtable URL expires before fal pulls it, re-fetch the row to get a fresh URL
- Max 9 reference images
- Duration options likely `5` or `10` (seconds)
- Native audio is included in 2.0 output — no separate TTS step needed

## Cost (approximate, verify at build time)

Fast tier: cheaper but lower quality. Hero/standard tier: full quality, ~2-3x cost. Check https://fal.ai/pricing for current rates.
