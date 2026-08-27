# Changelog

## v0.3.0 — 2026-08-27

- Added a managed-update and trigger model: `VERSION`, matching Skill versions, validation CI, project `AGENTS.md` template, and operating guidance.
- Made `AGENTS.md` the mandatory project-level gate for a fresh Skill update and correct discovery → lifecycle invocation order.
- Kept `main` as the stable update channel and added release-tag guidance for auditability.

## v0.2.0 — 2026-08-27

- Split the initial monolithic workflow into `opc-project-discovery` and `opc-feature-lifecycle`.
- Added a local, non-sensitive baseline of OPC Agent Onboarding rules and separate evaluation prompts for both Skills.

## v0.1.0 — 2026-08-27

- Created the public `feishu-codex-workflows` repository and the initial OPC project-management Skill.
