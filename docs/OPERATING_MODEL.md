# Operating model: freshness and correct invocation

This repository solves two different problems that should not be conflated:

| Concern | Control | Reason |
| --- | --- | --- |
| Which Skill files are installed? | `npx skills add` / `npx skills update` | Records the GitHub source and refreshes the local installed copy. |
| Which Skill should Codex use for a task? | Project-root `AGENTS.md` | Codex reads it before work, so it can require the correct order for every new session. |
| Is a change release-quality? | `scripts/validate-skills.mjs`, evaluation prompts, PR review, Git tag | “Latest” should mean latest validated stable version, not latest unreviewed edit. |

## 1. Installation and refresh

Use the managed installer. Do **not** clone this repository into an arbitrary folder and assume that Codex will discover it.

```bash
npx skills add GarinZ/feishu-codex-workflows \
  --skill '*' \
  --agent codex \
  --global \
  --yes \
  --full-depth
```

The installation tool records the source and installs the two Skills into the agent’s global skill location. Refresh only these Skills **before launching** a new Codex session:

```bash
npx skills update opc-project-discovery opc-feature-lifecycle --global --yes
```

After the update, start a new Codex task/session. Installed capabilities are selected at session startup; do not assume an already-running session will hot-reload its Skill catalog. The same principle appears in the official guidance for plugins, whose added skills are available to new chats, and in the `AGENTS.md` lifecycle, which Codex rebuilds on each run/session. See [Codex plugins](https://learn.chatgpt.com/docs/plugins) and [Codex AGENTS.md](https://learn.chatgpt.com/docs/agent-configuration/agents-md).

For Codex CLI, this repository includes a launcher that makes the order deterministic:

```bash
<path-to-feishu-codex-workflows>/scripts/opc-codex "your task prompt"
```

It refreshes the two Skills and then `exec`s a fresh Codex process. A source checkout can be used for this launcher, but it is not the runtime source of the Skills themselves; the managed installation remains authoritative.

Verify the installed pair when onboarding or troubleshooting:

```bash
npx skills list --global --json
```

Both installed `SKILL.md` files must carry the same `version` field. A mismatch means an interrupted/manual installation; repair it by rerunning the `add` command before any Feishu write.

## 2. Project-level activation gate

Codex reads `AGENTS.md` before doing work and rebuilds its instruction chain when a new run/session begins. Therefore every OPC-managed code repository must contain a project-root `AGENTS.md` based on [the template](../templates/AGENTS.md.template).

During project onboarding:

1. Copy the template into the code repository root as `AGENTS.md`, or merge its `## OPC workflow gate` section into an existing file.
2. Fill only the private OPC Onboarding URL and project-specific non-secret context.
3. Commit the file with the project so every checkout, worktree, and authorized machine inherits it.
4. Start a fresh Codex session and ask it to summarize active instructions; confirm that it reports the OPC gate.

The gate requires `opc-project-discovery` when context is unknown and `opc-feature-lifecycle` for durable work. Skill descriptions improve automatic selection, but the `AGENTS.md` rule makes that selection an explicit project policy rather than a best-effort inference. It detects missing/mismatched Skills inside a session; it does not attempt to hot-reload them.

## 3. Stable release policy

- Use feature branches for changes to this repository.
- Update relevant evaluation prompts whenever behavior changes.
- Run `node scripts/validate-skills.mjs` locally and let the GitHub workflow run it again on push/PR.
- Merge only reviewed, validated changes into `main`.
- Update `VERSION`, matching Skill frontmatter versions, and `CHANGELOG.md` together.
- Create a matching Git tag and GitHub Release after merge. The tag is the auditable stable version; `main` is the current stable update channel.

## 4. Offline and failure behavior

An update failure must not make a coding session silently violate project management rules.

- For read-only reasoning, identify the failure and continue with local analysis if useful.
- For new Feishu cards, task-state transitions, or document writes, stop and ask for network recovery or explicit approval to proceed with the installed version.
- Never copy credentials or bypass OAuth merely to make the updater or Lark tooling work.

## 5. Desktop versus CLI

- **Codex CLI:** use `scripts/opc-codex` or run `npx skills update … && codex …`; the updater runs before process startup.
- **Codex Desktop:** run the updater in a terminal, then create a new task/session (or restart the app if the installed-skill list has not refreshed). Do not rely on a currently open task to acquire new instructions automatically.
- **Any environment:** the project-root `AGENTS.md` remains the trigger gate after the new session starts.

## 6. Scope boundaries

This mechanism updates Skills, not project code, task cards, or deployments. A task card still does not authorize production changes. Repository-specific instructions, code review, test policy, and deployment approvals always apply.
