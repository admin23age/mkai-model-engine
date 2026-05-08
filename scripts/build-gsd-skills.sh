#!/usr/bin/env bash
# Builds the gsd-* skill folder structure inside skills/, with
# automation/ context/ outputs/ reference/ buckets per skill.
# Source: C:/Users/immav/Projects/get-shit-done

set -euo pipefail

SRC="C:/Users/immav/Projects/get-shit-done"
DST="C:/Users/immav/Projects/model-engine"

# 1. Per-skill folders -------------------------------------------------------
for cmd in "$SRC"/commands/gsd/*.md; do
  name="$(basename "$cmd" .md)"
  skill_dir="$DST/skills/gsd-$name"
  mkdir -p "$skill_dir/automation" "$skill_dir/context" "$skill_dir/outputs" "$skill_dir/reference"

  # automation/agent.md = the slash-command instruction file
  cp "$cmd" "$skill_dir/automation/agent.md"

  # README in each bucket so empty dirs are tracked & humans know what goes where
  cat > "$skill_dir/context/README.md" <<EOF
# Context — \`gsd-$name\`

Shared GSD context lives at \`context/gsd/\`. Skill-specific context (planning
artefacts, captured discussions) gets written here at runtime by the
\`/gsd-$name\` workflow.
EOF

  cat > "$skill_dir/outputs/README.md" <<EOF
# Outputs — \`gsd-$name\`

Templates that this skill emits live at \`outputs/gsd-templates/\`. Generated
deliverables from running the skill (plans, reports, audit results) are
written here.
EOF

  cat > "$skill_dir/reference/README.md" <<EOF
# Reference — \`gsd-$name\`

Top-level GSD reference (README, CHANGELOG, contributing) lives at
\`reference/gsd/\`. Skill-specific reference notes go here.
EOF
done

# 2. Shared GSD infrastructure ----------------------------------------------
# Automations bucket: SDK, hooks, agents, bin
mkdir -p "$DST/automations/gsd-sdk" "$DST/automations/gsd-hooks" \
         "$DST/automations/gsd-agents" "$DST/automations/gsd-bin" \
         "$DST/automations/gsd-scripts"

cp -r "$SRC/sdk/." "$DST/automations/gsd-sdk/"
cp -r "$SRC/hooks/." "$DST/automations/gsd-hooks/"
cp -r "$SRC/agents/." "$DST/automations/gsd-agents/"
cp -r "$SRC/bin/." "$DST/automations/gsd-bin/"
cp -r "$SRC/scripts/." "$DST/automations/gsd-scripts/"

# Context bucket: GSD shared contexts
mkdir -p "$DST/context/gsd"
cp -r "$SRC/get-shit-done/contexts/." "$DST/context/gsd/"

# Outputs bucket: GSD templates
mkdir -p "$DST/outputs/gsd-templates"
cp -r "$SRC/get-shit-done/templates/." "$DST/outputs/gsd-templates/"

# Reference bucket: README, CHANGELOG, docs, GSD references
mkdir -p "$DST/reference/gsd"
cp "$SRC/README.md" "$DST/reference/gsd/README.md"
cp "$SRC/CHANGELOG.md" "$DST/reference/gsd/CHANGELOG.md"
cp "$SRC/CONTRIBUTING.md" "$DST/reference/gsd/CONTRIBUTING.md"
cp "$SRC/SECURITY.md" "$DST/reference/gsd/SECURITY.md"
cp "$SRC/VERSIONING.md" "$DST/reference/gsd/VERSIONING.md"
cp "$SRC/CONTEXT.md" "$DST/reference/gsd/CONTEXT.md"
cp "$SRC/CLAUDE.md" "$DST/reference/gsd/CLAUDE-gsd.md"
cp "$SRC/LICENSE" "$DST/reference/gsd/LICENSE"
cp "$SRC/package.json" "$DST/reference/gsd/package.json"
cp -r "$SRC/get-shit-done/references/." "$DST/reference/gsd/" 2>/dev/null || true
cp -r "$SRC/get-shit-done/workflows" "$DST/reference/gsd/workflows" 2>/dev/null || true
cp -r "$SRC/docs" "$DST/reference/gsd/docs" 2>/dev/null || true

echo "Done — built skill folders and shared GSD infra."
