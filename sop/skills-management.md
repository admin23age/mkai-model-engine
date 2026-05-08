# SOP — Claude Code Skills Management

**Owner:** MKAI Engineering
**Audience:** Anyone adding, updating, removing, or assigning skills inside the MKAI workspace.
**Source of truth:** `https://github.com/admin23age/mkai-model-engine`

---

## 1. Purpose

This SOP defines how skills are organized, stored, installed, and assigned in the MKAI workspace. It exists so that:

- Every skill has **one canonical home** (the `mkai-model-engine` git repo).
- Every Claude Code session, on any machine, sees the **same** skill set after a sync.
- Adding a new skill family (e.g., legal, finance, design) follows a **repeatable pattern**.
- Project-specific overrides never accidentally drift away from the canon.

**If you ever wonder "where does this skill live?" the answer is always: in `mkai-model-engine`. Nothing else is authoritative.**

---

## 2. Vocabulary

| Term | Meaning |
|---|---|
| **Skill** | A single capability Claude can invoke — a folder with an instruction file plus optional supporting material. |
| **Skill family** | A group of related skills sharing a prefix (e.g. `gsd-*`, `mkt-*`, `dd-*`). |
| **Library** | The canonical skill collection inside `mkai-model-engine/skills/`. |
| **Install** | Copies of the library that live under `~/.claude/skills/` and `~/.claude/commands/`. Claude Code reads these at runtime. |
| **Global skill** | A skill installed under `~/.claude/` — visible in every project. |
| **Project skill** | A skill installed under `<project>/.claude/skills/` — visible only in that project (overrides globals of the same name). |

---

## 3. Architecture (the picture you must keep in your head)

```
GitHub: admin23age/mkai-model-engine          ← canonical library
                ↓ (git clone / git pull)
C:\Users\immav\Projects\model-engine\          ← local working copy
                ↓ (sync script)
C:\Users\immav\.claude\                        ← Claude Code runtime install
   skills\<name>\SKILL.md                      ← the Skill tool reads this
   commands\<group>\<name>.md                  ← the slash-command picker reads this
```

**Direction is one-way: library → install. Never edit `~/.claude/skills/` by hand. Always edit the library and sync.**

---

## 4. Repo layout (canonical structure inside `mkai-model-engine`)

Every skill lives inside `skills/` as a folder, organized into four functional buckets:

```
skills/<family>-<name>/
  ├── automation/agent.md      ← REQUIRED. The skill's instructions.
  ├── context/                  ← Skill-specific context (READMEs, runtime
  │                                captures, brand voice notes).
  ├── outputs/                  ← Templates and examples of what this skill
  │                                produces. Generated deliverables go here too.
  └── reference/                ← Supporting material — frameworks, evals,
                                    docs the agent reads while working.
```

Shared infrastructure (used by many skills) lives at the top level, mirroring the same buckets:

```
automations/
  gsd-sdk\, gsd-hooks\, gsd-agents\, gsd-bin\, gsd-scripts\
  marketing-tools\
  grants\, n8n-workflows\
context/
  gsd\          ← shared GSD contexts
  <family>\     ← any other family-wide context
outputs/
  gsd-templates\
reference/
  gsd\
  marketing\
scripts/
  build-gsd-skills.sh, build-mkt-skills.sh, sync-skills-to-claude.sh
```

**Rule:** every skill folder must contain `automation/agent.md`. Empty bucket folders need a `README.md` placeholder so git tracks them.

---

## 5. Daily use — three core workflows

### 5.1 Use a skill in a project

1. Open Claude Code from the project directory:
   ```
   cd C:/Users/immav/Projects/<project> && claude
   ```
2. Either type `/<family>-<name>` (e.g. `/mkt-copywriting`, `/gsd-new-project`) or describe the task and let Claude pick the matching skill.
3. Claude finds the skill via the global install (`~/.claude/skills/`).

**No per-project setup is required.** Every globally installed skill is already available in every project.

### 5.2 Steer which skills a project uses

For projects with a clear focus (a marketing campaign, an AI build phase), drop a `CLAUDE.md` at the project root that lists the relevant skills:

```markdown
# Dorothy Dean LIFT Campaign — context

## Active skills for this project
- mkt-copywriting, mkt-ad-creative, mkt-launch-strategy — campaign creative
- mkt-social-content, mkt-image — content production
- mkt-paid-ads — media buying

## Avoid
- gsd-* commands (this project is creative work, not engineering).
```

Claude reads `CLAUDE.md` at session start and biases its skill selection. **This is the right tool for "assigning skills to a project" 90% of the time.** No file copying needed.

### 5.3 Override a skill for one specific project

Only do this when a global skill needs **client-specific changes** that should not affect other projects (e.g. copywriting tuned to Dorothy Dean's brand voice).

```
<project>\.claude\skills\dd-copywriting\
  SKILL.md      ← copy of mkt-copywriting/automation/agent.md, edited
```

Project skills shadow globals only inside that project. Document why the override exists at the top of the SKILL.md.

---

## 6. Adding a new skill — step by step

### 6.1 Single skill (e.g., adding one new GSD skill)

1. **Create the folder** in the library:
   ```
   model-engine\skills\<family>-<name>\
     automation\agent.md     (the instructions)
     context\README.md
     outputs\README.md
     reference\README.md
   ```
2. **Write `automation/agent.md`** with YAML frontmatter:
   ```markdown
   ---
   name: <family>-<name>
   description: When the user wants to <task>. Also use when the user mentions...
   ---

   # <Skill name>

   You are a... (instructions)
   ```
3. **Commit and push**:
   ```bash
   cd C:/Users/immav/Projects/model-engine
   git add skills/<family>-<name>
   git commit -m "Add <family>-<name> skill"
   git push
   ```
4. **Sync to install**:
   ```bash
   bash scripts/sync-skills-to-claude.sh
   ```
5. **Restart Claude Code** to pick up the new skill in the picker.

### 6.2 Whole new skill family (e.g., a "legal" or "finance" family)

1. Identify the source — git repo, npm package, zip, or original work.
2. Clone or extract to `C:/Users/immav/Projects/<source-name>` if external.
3. Write a build script in `scripts/build-<family>-skills.sh` modeled on `scripts/build-gsd-skills.sh` or `scripts/build-mkt-skills.sh`. The script must:
   - Iterate every source skill.
   - Create `skills/<family>-<name>/{automation,context,outputs,reference}/`.
   - Place the skill instructions at `automation/agent.md`.
   - Place reference material under `reference/`.
   - Add placeholder READMEs in empty buckets.
   - Place shared infra under `automations/<family>-tools/`, `reference/<family>/`, etc.
4. Run the build, then commit and push.
5. Run `scripts/sync-skills-to-claude.sh`.
6. Restart Claude Code.

### 6.3 Quality checklist before committing any new skill

- [ ] `automation/agent.md` exists and starts with valid frontmatter.
- [ ] `name:` field matches the folder name exactly (e.g. `name: mkt-copywriting` for `skills/mkt-copywriting/`).
- [ ] `description:` is a full sentence starting with "When the user wants to..." — Claude routes by description.
- [ ] No `node_modules/`, `dist/`, `.env`, or binary blobs committed (check `.gitignore`).
- [ ] Empty bucket folders have a `README.md` placeholder.
- [ ] Skill family prefix is consistent (e.g., everything marketing → `mkt-`).

---

## 7. Updating an existing skill

1. Edit the relevant file in the library — usually `skills/<family>-<name>/automation/agent.md`.
2. Commit with a clear message: `fix(<family>-<name>): tighten objection-handling section`.
3. Push.
4. Run `scripts/sync-skills-to-claude.sh`.
5. Restart Claude Code if the skill is currently in use.

**Never** edit `~/.claude/skills/<name>/SKILL.md` directly. The next sync will overwrite it.

---

## 8. Removing a skill

1. `git rm -r skills/<family>-<name>` in the library.
2. Commit and push.
3. Manually remove from the install (sync script only adds, doesn't prune):
   ```bash
   rm -rf C:/Users/immav/.claude/skills/<family>-<name>
   rm C:/Users/immav/.claude/commands/<family>/<name>.md
   ```
4. Restart Claude Code.

---

## 9. Sync script reference

`scripts/sync-skills-to-claude.sh` should:

- Iterate every `skills/<family>-<name>/` in the library.
- Copy `automation/agent.md` → `~/.claude/skills/<family>-<name>/SKILL.md`.
- Copy `automation/agent.md` → `~/.claude/commands/<family>/<name>.md`.
- Copy `reference/` contents (evals, frameworks, supporting docs) into `~/.claude/skills/<family>-<name>/`.
- Skip `context/` and `outputs/` — those are repo-only buckets, not runtime.

The user runs this whenever the library changes. Keep it idempotent — running it twice should be a no-op, not an error.

---

## 10. Disaster recovery

If `~/.claude/skills/` gets corrupted, deleted, or out of sync:

1. `cd C:/Users/immav/Projects/model-engine`
2. `git pull` to make sure the library is current.
3. Optionally `rm -rf C:/Users/immav/.claude/skills/{gsd,mkt}-* C:/Users/immav/.claude/commands/{gsd,mkt}` to start clean.
4. Run `bash scripts/sync-skills-to-claude.sh`.
5. Restart Claude Code.

You'll be back to a known-good state within a minute. **This is why the git repo is the source of truth — the install is disposable.**

---

## 11. Adding cross-machine consistency (future)

When MKAI moves to the Oracle VM or a second workstation:

1. `git clone https://github.com/admin23age/mkai-model-engine` on the new machine.
2. Run `bash scripts/sync-skills-to-claude.sh` from the clone.
3. The new machine has every skill available immediately.

**No manual copying. No drift between machines.** This is the entire reason the library exists.

---

## 12. Common mistakes — do not do these

- ❌ Editing `~/.claude/skills/<name>/SKILL.md` directly. The sync will overwrite it.
- ❌ Uploading skills via the GitHub web UI. Always commit + push from a local clone.
- ❌ Committing `node_modules/`, `dist/`, or `.zip` files. Use `.gitignore`.
- ❌ Forgetting the family prefix (`gsd-`, `mkt-`, etc.) — collisions will happen.
- ❌ Letting a skill description start with anything other than "When the user wants to..." — Claude's routing is description-based.
- ❌ Skipping the restart after sync. Skills only re-register at session start.

---

## 13. Quick reference

| Task | Command |
|---|---|
| Open Claude in model-engine | `cd C:/Users/immav/Projects/model-engine && claude` |
| Pull latest skills | `git pull` (inside model-engine) |
| Sync library → install | `bash scripts/sync-skills-to-claude.sh` |
| Build GSD library from source | `bash scripts/build-gsd-skills.sh` |
| Build marketing library from source | `bash scripts/build-mkt-skills.sh` |
| Count installed skills | `ls ~/.claude/skills/ \| wc -l` |
| Force fresh install | Delete `~/.claude/skills/{gsd,mkt}-*` then re-sync |

---

## 14. Approval and review

This SOP is reviewed quarterly or whenever a new skill family is added. Owner signs off on any structural change (anything that affects the bucket layout or sync script).

**Last reviewed:** 2026-05-08
**Owner:** MKAI Engineering
