#!/usr/bin/env bash
# Builds the mkt-* skill folder structure inside skills/, mirroring the
# bucket layout used for gsd-* skills (automation/context/outputs/reference).
# Source: C:/Users/immav/Projects/marketingskills

set -euo pipefail

SRC="C:/Users/immav/Projects/marketingskills"
DST="C:/Users/immav/Projects/model-engine"

# 1. Per-skill folders -------------------------------------------------------
for skill_src in "$SRC"/skills/*/; do
  name="$(basename "$skill_src")"
  skill_dst="$DST/skills/mkt-$name"
  mkdir -p "$skill_dst/automation" "$skill_dst/context" \
           "$skill_dst/outputs" "$skill_dst/reference"

  # automation/agent.md = the SKILL.md instruction file
  if [[ -f "$skill_src/SKILL.md" ]]; then
    cp "$skill_src/SKILL.md" "$skill_dst/automation/agent.md"
  fi

  # reference/ = SKILL's references/ contents + evals (evals are spec/test
  # material — they belong with reference, not output)
  if [[ -d "$skill_src/references" ]]; then
    cp -r "$skill_src/references/." "$skill_dst/reference/"
  fi
  if [[ -d "$skill_src/evals" ]]; then
    mkdir -p "$skill_dst/reference/evals"
    cp -r "$skill_src/evals/." "$skill_dst/reference/evals/"
  fi

  # context/ and outputs/ get placeholder READMEs
  cat > "$skill_dst/context/README.md" <<EOF
# Context — \`mkt-$name\`

Per-skill runtime context (interview answers, audited assets, captured
brand voice) goes here. Shared marketing context lives at \`context/marketing/\`.
EOF

  cat > "$skill_dst/outputs/README.md" <<EOF
# Outputs — \`mkt-$name\`

Generated deliverables from running the skill (drafts, audits, tracking
plans, ad sets) get written here.
EOF

  # If reference is still empty, add a placeholder so the dir is tracked
  if [[ -z "$(ls -A "$skill_dst/reference" 2>/dev/null)" ]]; then
    cat > "$skill_dst/reference/README.md" <<EOF
# Reference — \`mkt-$name\`

No reference material shipped with this skill. Top-level marketing
reference (README, AGENTS.md, contributing) lives at \`reference/marketing/\`.
EOF
  fi
done

# 2. Shared marketing infrastructure ----------------------------------------
mkdir -p "$DST/automations/marketing-tools" "$DST/reference/marketing"

if [[ -d "$SRC/tools" ]]; then
  cp -r "$SRC/tools/." "$DST/automations/marketing-tools/"
fi

# Top-level docs into reference/marketing
for f in README.md AGENTS.md CLAUDE.md CONTRIBUTING.md VERSIONS.md LICENSE; do
  if [[ -f "$SRC/$f" ]]; then
    cp "$SRC/$f" "$DST/reference/marketing/$f"
  fi
done
# Validation scripts are reference too (used to lint skill structure)
for f in validate-skills.sh validate-skills-official.sh; do
  if [[ -f "$SRC/$f" ]]; then
    cp "$SRC/$f" "$DST/reference/marketing/$f"
  fi
done

echo "Done — built marketing skill folders and shared infra."
