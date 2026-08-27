# Project-root AGENTS.md gate

Merge this section into the root `AGENTS.md` of every OPC-managed code repository. Replace the placeholders only with private, non-secret project context. Preserve existing repository instructions.

```markdown
## OPC workflow gate — required for durable work

- OPC Agent Onboarding URL: `<REPLACE_WITH_PRIVATE_OPC_ONBOARDING_URL>`
- Root project: `<OPTIONAL_PROJECT_NAME_OR_LINK>`

Before launching a Codex session that may make durable code, document, task-card, infrastructure, or deployment changes, run:

```bash
npx skills update opc-project-discovery opc-feature-lifecycle --global --yes
```

After updating, start a **new** Codex session. Do not assume an active session hot-reloads newly installed Skills. If a Skill is missing, install the managed pair from `GarinZ/feishu-codex-workflows`; do not use a raw Git clone as the runtime Skill source.

In the new session:

1. Use `opc-project-discovery` whenever OPC context, project materials, source Base, or task card is not verified.
2. Use `opc-feature-lifecycle` for every durable feature, bug, refactor, operational change, review, deployment, or documentation iteration.
3. Do not create a task card for direct answers, read-only work, or non-durable trivial changes.
4. Treat the project-local task Base as the source of truth and the global Base as a synchronized mirror.

If the pre-session update failed, report it. Do not silently create or modify Feishu cards using an unknown/stale Skill version.
```

Never place tokens, App Secrets, cookies, passwords, private keys, or production credentials in `AGENTS.md`.
