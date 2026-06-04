# Competitor Scraper Routine

## Overview

A free, self-hosted replacement for the paid Apify Instagram actor used inside the
**30-Day / Monthly Content Planner**. It pulls recent posts from a list of competitor
Instagram handles (per brand) using [Instaloader](https://instaloader.github.io/)
and writes them into an Airtable **Competitor Intel** table. The n8n Monthly Content
Planner then reads that table instead of calling Apify — no paywall, no per-result cost.

- **Type:** Claude Code routine (standalone Python script, cron/Claude-Code scheduled)
- **Owner:** Operations Supervisor (Ops automation — runs in the background, no customer contact)
- **Replaces:** Apify Instagram scraper actor in the content-planner pipeline
- **Cadence:** Monthly — 1st of the month, 6:00am (`0 6 1 * *`)
- **Cost:** $0 (Instaloader is open-source; Airtable REST via existing PAT)

## Position in Hierarchy

```
Operations Supervisor (Tier 1)
        │
        └── Competitor Scraper (Tier 2 routine)
                ├── reads:  COMPETITORS config (per brand)
                ├── writes: Airtable "Competitor Intel" table
                └── logs:   Airtable "Error Log" table
                        ↓
            n8n Monthly Content Planner reads Competitor Intel
```

## Inputs / Configuration

Competitor handles are configured per brand in the `COMPETITORS` dict inside the script:

- **MKAI** — `anuconsultants`, `cienaiagents`, `sabrina_ramonov`, `ai_consulting`,
  `bradfordtechnologies`, `saraitaughtme`, `shopebonymonique` (noted favorite)
- **Dorothy Dean** — _TODO: add Dorothy Dean Designs competitor handles_

| Knob | Default | Purpose |
|------|---------|---------|
| `POSTS_PER_HANDLE` | 12 | Recent posts pulled per competitor |
| `SLEEP_BETWEEN_HANDLES` | 30–90s random | Rate-limit safety between handles |
| `RETRY_BACKOFF` | 5s, 15s, 45s | Level-1 retry schedule |

## Environment Variables (never hardcode secrets)

| Var | Required | Purpose |
|-----|----------|---------|
| `AIRTABLE_PAT` | yes | Airtable personal access token |
| `AIRTABLE_BASE_ID` | yes | Base holding the Competitor Intel table |
| `INTEL_TABLE` | no (default `Competitor Intel`) | Destination table name |
| `ERROR_LOG_TABLE` | no (default `Error Log`) | Error log table name |
| `IG_USERNAME` | recommended | A **secondary** IG login (not your main account) |
| `IG_PASSWORD` | recommended | Password for that secondary login |

**Why a secondary IG login:** Instagram throttles anonymous scraping fast. A low-traffic
secondary account + monthly cadence keeps requests under the radar. Scraping public,
logged-out IG data is legal (*Meta v. Bright Data*, 2024) — the login just keeps it reliable.

## Airtable: Competitor Intel fields

Each post becomes one row with: `Handle`, `Brand`, `Post URL`, `Caption`, `Likes`,
`Comments`, `Posted At`, `Media Type` (Image / Video / Carousel), `Hashtags`, `Scraped At`.

## Run

```bash
python mkai_competitor_scraper.py                # all brands
python mkai_competitor_scraper.py --brand MKAI   # one brand
python mkai_competitor_scraper.py --limit 8      # posts per handle
```

## Schedule (cron — monthly, 1st at 6am)

```cron
0 6 1 * *  cd /path/to/routine && /usr/bin/python3 mkai_competitor_scraper.py
```

## Error Handling

Follows the standard MKAI 3-level model:

- **Level 1 — Retry (automatic):** transient `ConnectionException` (rate limit / network)
  retried with 5s/15s/45s backoff.
- **Level 2 — Log and Continue:** a single handle failing is logged to the Airtable
  Error Log (`WARN`) and the run moves on to the next handle.
- **Level 3 — Alert and Pause:** IG login failure is `CRITICAL` — logged and the script
  exits rather than hammering Instagram anonymously.

## Dependencies

```bash
pip install instaloader
```

Airtable writes use the REST API via Python's stdlib `urllib` (no extra dependency).

---

## Script

```python
#!/usr/bin/env python3
"""
MKAI Competitor Scraper — Claude Code routine
=============================================
Replaces the paid Apify actor in the 30-Day Content Planner.

What it does
------------
For each brand (MKAI, Dorothy Dean), pulls the most recent posts from a list of
competitor Instagram handles using Instaloader (free, open-source) and writes
them into an Airtable "Competitor Intel" table. The n8n Monthly Content Planner
then reads that table instead of calling Apify — no paywall, no per-result cost.

Run it
------
    python mkai_competitor_scraper.py                # all brands
    python mkai_competitor_scraper.py --brand MKAI   # one brand
    python mkai_competitor_scraper.py --limit 8      # posts per handle

Schedule it (Claude Code / cron — monthly, 1st at 6am)
    0 6 1 * *  cd /path/to/routine && /usr/bin/python3 mkai_competitor_scraper.py

Environment variables (set these, never hardcode secrets)
    AIRTABLE_PAT        Airtable personal access token
    AIRTABLE_BASE_ID    Base holding the Competitor Intel table
    INTEL_TABLE         Competitor Intel table name        (default: "Competitor Intel")
    ERROR_LOG_TABLE     Error Log table name               (default: "Error Log")
    IG_USERNAME         (recommended) a SECONDARY Instagram login, not your main
    IG_PASSWORD         password for that secondary login

Why a secondary IG login: Instagram throttles anonymous scraping fast. A
low-traffic secondary account + monthly cadence keeps you under the radar.
Scraping public, logged-out IG data is legal (Meta v. Bright Data, 2024) — this
just keeps it reliable.
"""

import os
import sys
import time
import json
import random
import argparse
import datetime as dt
from urllib import request as urlrequest, error as urlerror

try:
    import instaloader
except ImportError:
    sys.exit("Instaloader not installed. Run: pip install instaloader")

# ─────────────────────────────────────────────────────────────────────────────
# CONFIG — competitor handles per brand
# ─────────────────────────────────────────────────────────────────────────────
COMPETITORS = {
    "MKAI": [
        "anuconsultants",
        "cienaiagents",
        "sabrina_ramonov",
        "ai_consulting",
        "bradfordtechnologies",
        "saraitaughtme",
        "shopebonymonique",   # noted favorite
    ],
    "Dorothy Dean": [
        # TODO: add Dorothy Dean Designs competitor handles here
    ],
}

POSTS_PER_HANDLE = 12          # how many recent posts to pull per competitor
SLEEP_BETWEEN_HANDLES = (30, 90)   # random seconds between handles (rate-limit safety)
RETRY_BACKOFF = [5, 15, 45]    # Level 1 retry schedule (seconds)

# ─────────────────────────────────────────────────────────────────────────────
# Airtable helpers (REST API, no extra dependency)
# ─────────────────────────────────────────────────────────────────────────────
AIRTABLE_PAT = os.environ.get("AIRTABLE_PAT", "")
BASE_ID = os.environ.get("AIRTABLE_BASE_ID", "")
INTEL_TABLE = os.environ.get("INTEL_TABLE", "Competitor Intel")
ERROR_LOG_TABLE = os.environ.get("ERROR_LOG_TABLE", "Error Log")


def _airtable_post(table, records):
    """Create up to 10 records in an Airtable table."""
    if not (AIRTABLE_PAT and BASE_ID):
        raise RuntimeError("AIRTABLE_PAT and AIRTABLE_BASE_ID must be set.")
    url = f"https://api.airtable.com/v0/{BASE_ID}/{urlrequest.quote(table)}"
    payload = json.dumps({"records": records, "typecast": True}).encode()
    req = urlrequest.Request(
        url, data=payload, method="POST",
        headers={"Authorization": f"Bearer {AIRTABLE_PAT}",
                 "Content-Type": "application/json"},
    )
    with urlrequest.urlopen(req, timeout=30) as resp:
        return json.loads(resp.read())


def push_records(table, records):
    """Batch writes in chunks of 10 (Airtable's per-request limit)."""
    for i in range(0, len(records), 10):
        _airtable_post(table, records[i:i + 10])


def log_error(level, handle, brand, message):
    """Level 2/3 error handling — write to the Airtable Error Log table."""
    try:
        push_records(ERROR_LOG_TABLE, [{"fields": {
            "Source": "Competitor Scraper",
            "Level": level,
            "Handle": handle,
            "Brand": brand,
            "Message": str(message)[:1000],
            "Timestamp": dt.datetime.utcnow().isoformat(),
        }}])
    except Exception as e:
        print(f"  [!] could not write to Error Log: {e}")


# ─────────────────────────────────────────────────────────────────────────────
# Scrape one handle (with Level 1 retry)
# ─────────────────────────────────────────────────────────────────────────────
def scrape_handle(L, handle, brand, limit):
    attempt = 0
    while True:
        try:
            profile = instaloader.Profile.from_username(L.context, handle)
            rows = []
            for n, post in enumerate(profile.get_posts()):
                if n >= limit:
                    break
                media_type = ("Video" if post.is_video
                              else "Carousel" if post.typename == "GraphSidecar"
                              else "Image")
                caption = post.caption or ""
                hashtags = " ".join(f"#{t}" for t in post.caption_hashtags)
                rows.append({"fields": {
                    "Handle": handle,
                    "Brand": brand,
                    "Post URL": f"https://www.instagram.com/p/{post.shortcode}/",
                    "Caption": caption[:5000],
                    "Likes": post.likes,
                    "Comments": post.comments,
                    "Posted At": post.date_utc.date().isoformat(),
                    "Media Type": media_type,
                    "Hashtags": hashtags[:2000],
                    "Scraped At": dt.datetime.utcnow().isoformat(),
                }})
            return rows
        except instaloader.exceptions.ConnectionException as e:
            # Level 1 — transient (rate limit / network): retry with backoff
            if attempt < len(RETRY_BACKOFF):
                wait = RETRY_BACKOFF[attempt]
                print(f"  [retry {attempt+1}] {handle}: {e} — waiting {wait}s")
                time.sleep(wait)
                attempt += 1
                continue
            raise


# ─────────────────────────────────────────────────────────────────────────────
# Main
# ─────────────────────────────────────────────────────────────────────────────
def main():
    ap = argparse.ArgumentParser(description="MKAI competitor scraper")
    ap.add_argument("--brand", choices=list(COMPETITORS), help="scrape one brand only")
    ap.add_argument("--limit", type=int, default=POSTS_PER_HANDLE)
    args = ap.parse_args()

    L = instaloader.Instaloader(
        download_pictures=False, download_videos=False,
        download_comments=False, save_metadata=False, quiet=True,
    )

    ig_user, ig_pass = os.environ.get("IG_USERNAME"), os.environ.get("IG_PASSWORD")
    if ig_user and ig_pass:
        try:
            L.login(ig_user, ig_pass)
            print(f"Logged in as {ig_user}")
        except Exception as e:
            # Level 3 — auth failure is critical; log and stop.
            log_error("CRITICAL", ig_user, "-", f"IG login failed: {e}")
            sys.exit("CRITICAL: Instagram login failed. See Error Log. Exiting.")
    else:
        print("No IG login set — running anonymous (higher block risk).")

    brands = [args.brand] if args.brand else list(COMPETITORS)
    total_written = 0

    for brand in brands:
        handles = COMPETITORS.get(brand, [])
        if not handles:
            print(f"[{brand}] no handles configured — skipping.")
            continue
        print(f"\n=== {brand}: {len(handles)} handles ===")
        for handle in handles:
            try:
                rows = scrape_handle(L, handle, brand, args.limit)
                if rows:
                    push_records(INTEL_TABLE, rows)
                    total_written += len(rows)
                    print(f"  [ok] {handle}: {len(rows)} posts")
                else:
                    print(f"  [--] {handle}: no posts")
            except Exception as e:
                # Level 2 — one handle failed; log and keep going.
                print(f"  [skip] {handle}: {e}")
                log_error("WARN", handle, brand, e)
            time.sleep(random.randint(*SLEEP_BETWEEN_HANDLES))

    print(f"\nDone. {total_written} posts written to '{INTEL_TABLE}'.")


if __name__ == "__main__":
    main()
```
