#!/usr/bin/env bash
# Sync the model-engine skill library → ~/.claude/skills/ + ~/.claude/commands/.
# Idempotent — safe to run any time. Only ADDS and OVERWRITES; does not prune.
# To remove a skill, delete it from the library AND from ~/.claude/ manually.

set -euo pipefail

LIB="$(cd "$(dirname "$0")/.." && pwd)/skills"
DST_SKILLS="$HOME/.claude/skills"
DST_COMMANDS="$HOME/.claude/commands"

if [[ ! -d "$LIB" ]]; then
  echo "ERROR: library not found at $LIB" >&2
  exit 1
fi

mkdir -p "$DST_SKILLS" "$DST_COMMANDS"

count=0
for skill_dir in "$LIB"/*/; do
  name="$(basename "$skill_dir")"

  # Skip skills without the family-prefix pattern (e.g. legacy single-file skills)
  if [[ ! "$name" =~ ^[a-z]+- ]]; then
    continue
  fi

  family="${name%%-*}"
  base="${name#${family}-}"

  agent_md="$skill_dir/automation/agent.md"
  if [[ ! -f "$agent_md" ]]; then
    echo "WARN: $name has no automation/agent.md — skipped"
    continue
  fi

  # 1. Skill folder for the Skill tool
  mkdir -p "$DST_SKILLS/$name"
  cp "$agent_md" "$DST_SKILLS/$name/SKILL.md"

  # Copy reference/ contents (evals, frameworks, supporting docs) so the
  # skill can read them at runtime
  if [[ -d "$skill_dir/reference" ]]; then
    for ref in "$skill_dir/reference/"*; do
      [[ -e "$ref" ]] || continue
      base_ref="$(basename "$ref")"
      # Skip the README placeholder
      [[ "$base_ref" == "README.md" ]] && continue
      cp -r "$ref" "$DST_SKILLS/$name/"
    done
  fi

  # 2. Slash command for the picker
  mkdir -p "$DST_COMMANDS/$family"
  cp "$agent_md" "$DST_COMMANDS/$family/$base.md"

  count=$((count + 1))
done

echo "Synced $count skills."
echo "Restart Claude Code to refresh the picker."
