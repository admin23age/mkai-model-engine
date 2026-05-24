# Workflow C — Higgsfield Node Edits (batch apply)

**Workflow:** `X1kDAxH1uZaVHdX4` — "DDD Content Engine — Workflow C: Media Generator (Higgsfield)"
**n8n:** agegroup.app.n8n.cloud · webhook path `/webhook/content-media`
**Architecture:** image-to-video (Seedance Pro) using the Airtable Reference Image as `image_url`.
**Apply all at once in the n8n UI, then Save.** Do NOT remove existing Airtable / Google Drive credentials.

---

## 1. Build Higgsfield Prompt  (Code node)
Replace the entire JS body with:

```js
const f = $input.item.json.fields || $input.item.json;
const aesthetics = {
  Faith: 'soft golden light, contemplative mood, devotional warmth',
  Identity: 'confident posture, modern editorial feel, clean lines',
  Legacy: 'rich heritage tones, generational depth, rooted dignity',
  Tomorrow: 'bright forward-leaning composition, hopeful skyward gaze'
};
const aesthetic = aesthetics[f.Pillar] || 'elegant editorial fashion';
const title = f.Title || '';
const brief = f['Content Brief'] || '';
const visualTheme = f['Visual Theme'] || '';
const slot = f.Slot || 'Morning';
const timeOfDay = slot === 'Morning' ? 'soft morning light' : 'warm evening golden hour';
const themeLine = visualTheme ? ' Visual theme: ' + visualTheme + '.' : '';

// Reference Image holds multiple, mixed-type attachments (images + sometimes a video).
// Pick the FIRST image-type attachment — never assume index [0] is an image.
const refs = Array.isArray(f['Reference Image']) ? f['Reference Image'] : [];
const firstImage = refs.find(a => a && typeof a.type === 'string' && a.type.startsWith('image/'));
const refImage = firstImage ? firstImage.url : '';
if (!refImage) {
  throw new Error('Row has no image-type Reference Image — image-to-video requires one. recordId: ' + $input.item.json.id);
}

const prompt = 'Cinematic fashion campaign for Dorothy Dean Designs LIFT collection — faith-based luxury streetwear for men, women, and children. ' + title + '. ' + brief + '. Visual aesthetic: ' + aesthetic + ', ' + timeOfDay + '.' + themeLine + ' Editorial photography style, luxury streetwear, Black-owned faith-led brand. Clean composition, premium fabric texture visible, vertical 9:16 framing. No text overlay, no logos.';

return { json: { recordId: $input.item.json.id, image_url: refImage, prompt: prompt.substring(0, 2000), pillar: f.Pillar, title } };
```

---

## 2. Higgsfield Generate  (HTTP Request)
- **Method:** POST
- **URL:**
  ```
  https://platform.higgsfield.ai/bytedance/seedance/v1/pro/image-to-video
  ```
- **Body → JSON:**
  ```
  ={{ JSON.stringify({ image_url: $json.image_url, prompt: $json.prompt }) }}
  ```
- **Headers:** keep `Content-Type: application/json`
- **Auth:** Generic → Header Auth → credential **Higgsfield Auth** (`tdz7JpnEqHyGUfop`).
  Verify that credential sends header **name** `Authorization`, **value** `Key {keyid}:{secret}`
  (i.e. `Key e082b05b-…:5d97…`, the literal word "Key" + space + keyid:secret).

---

## 3. Poll Higgsfield Status  (HTTP Request)
- **Method:** GET
- **URL:**
  ```
  =https://platform.higgsfield.ai/requests/{{ $('Higgsfield Generate').item.json.request_id }}/status
  ```
- **Auth:** Generic → Header Auth → credential **Higgsfield Auth** (was wrongly "Square Production" — fix this).

---

## 4. Extract Video URL  (Code node)
Replace the entire JS body with:

```js
const data = $input.item.json;
const status = data.status || 'unknown';
const videoUrl = (data.video && data.video.url) || '';
if (status === 'failed' || status === 'nsfw') {
  throw new Error('Higgsfield generation ' + status + ' — ' + JSON.stringify(data).substring(0, 400));
}
if (!videoUrl) {
  throw new Error('No video.url yet — status: ' + status + ' | resp: ' + JSON.stringify(data).substring(0, 400));
}
return { json: { videoUrl, status } };
```

---

## 5. Write Media URL  (Airtable, update)
- **Columns** field — restore the leading `=` (it is currently missing):
  ```
  ={{ { mappingMode: "defineBelow", value: { id: $("Build Higgsfield Prompt").item.json.recordId, "Media URL": $json.webViewLink, "Content Status": "Generate Content" }, matchingColumns: ["id"] } }}
  ```
- **Credential:** leave the existing Airtable credential attached.

---

## Untouched nodes (verify creds survive your edits)
- **Media Request** (Webhook) — no creds.
- **Get Queue Record** (Airtable) — keep existing Airtable cred.
- **Wait 3 Min** — no change.
- **Download Video** (HTTP) — reads `$json.videoUrl`, no change.
- **Save to Drive** (Google Drive) — keep existing Drive cred, "Dorothy Dean" folder.

---

## After saving — first real run (when you're ready)
1. Confirm credits (top up if low — ~22.5 credits per 5s/720p video; ~4 runs on current 91).
2. Trigger ONE record via the webhook.
3. Watch **Higgsfield Generate** → expect `{ status, request_id, status_url, cancel_url }`; a `401/403` means the key/header is wrong.
4. After ~3 min, **Poll** → expect `video.url` once `status: completed`.
5. Confirm the row's **Media URL** + **Content Status = Generate Content** update in Airtable.
