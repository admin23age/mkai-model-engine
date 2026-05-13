# Shell Aliases for Claude Sessions

Two aliases streamline launching Claude sessions with this workspace. Choose the setup for your OS.

---

## macOS / Linux (bash or zsh)

Add to `~/.zshrc` or `~/.bashrc`:

```bash
alias cs='claude "/prime"'
alias cr='claude --dangerously-skip-permissions "/prime"'
```

Reload: `source ~/.zshrc`

---

## Windows (PowerShell)

Add to your PowerShell profile:

```powershell
function cs { claude "/prime" }
function cr { claude --dangerously-skip-permissions "/prime" }
```

Reload: `. $PROFILE`

**Setup tips:**
- Find your profile path: `echo $PROFILE`
- If the profile file doesn't exist: `New-Item -Path $PROFILE -ItemType File -Force`
- Common profile location: `C:\Users\<You>\Documents\PowerShell\Microsoft.PowerShell_profile.ps1`

---

## The Aliases

### `cs` — Claude Safe

Launches Claude and immediately runs `/prime` to load workspace context. Claude will ask for permission before executing commands, reading sensitive files, or making changes.

**Use when:** Starting a new session where you want to review and approve each action, working on unfamiliar tasks, or doing sensitive operations.

### `cr` — Claude Run

Launches Claude with permission prompts disabled, then runs `/prime`. Claude can execute commands and make changes without asking for approval.

**Use when:** You trust the task, want faster iteration, or are doing routine work where constant approvals slow you down.

---

## Why Both?

- **`cs`** gives you oversight — good for unfamiliar tasks, sensitive operations, or when you want to see what Claude is doing step by step
- **`cr`** gives you speed — good for familiar workflows where you trust Claude to operate autonomously

Both run `/prime` automatically so Claude starts every session fully oriented to the MKAI workspace, goals, and context.
