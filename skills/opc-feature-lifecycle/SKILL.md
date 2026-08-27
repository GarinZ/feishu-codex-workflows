---
name: opc-feature-lifecycle
description: >-
  Use this skill whenever a Codex or other coding Agent is asked to implement, change, fix,
  refactor, investigate, review, test, deploy, or document a feature, bug, iteration, or other
  durable project deliverable in an OPC Feishu/Lark-managed project. Invoke it even when the
  user does not mention Feishu: decide whether the work needs a new task card, an existing card
  update, a cancellation/merge, or no card; then maintain the source task, global mirror, GitHub
  evidence, and outcome throughout the work. Load opc-project-discovery first whenever the
  project context, source Base, subproject, or existing task is not confirmed in this session.
metadata:
  compatibility: Requires opc-project-discovery for unresolved project context, plus official lark-cli and lark-base/lark-doc capabilities. GitHub integration is optional.
---

# OPC Feature Lifecycle

Use this Skill for work execution, not for discovering the knowledge base. The task starts with a verified root project, subproject, project-local source Base, and relevant documentation. If any of those are unknown, load `opc-project-discovery` first.

## What this Skill owns

```text
Intake → classify → find or create source card → claim → implement
       → record meaningful milestones → validate → review/complete/block/cancel
       → upsert global mirror
```

The project-local `任务` table inside `项目管理` is the task source of truth. `全局项目管理` is a derived mirror, not a second editable backlog.

## 1. Classify before writing a card

### Create a source card

Create one when the request is a new independently trackable feature, bug, refactor, operational change, research/architecture deliverable, or documentation deliverable that has an acceptance outcome, code/document artifact, cross-session handoff, GitHub reference, test result, or deployment evidence.

### Reuse and update an existing card

Search first when the request references a task title, record ID, Issue, PR, commit, branch, project document, previous Codex session, or already-active work. Search stable references before using title similarity. Do not split one deliverable into multiple cards merely because it crosses sessions.

### Intentionally create no card

Do not create a card for a direct answer, read-only exploration, brainstorming, one-off explanation, or a trivial non-durable correction with no meaningful handoff or audit value.

### Cancel or merge, do not erase history

An empty duplicate draft with no owner, comment, link, history, work, or code reference may be deleted only when the user authorizes it. Otherwise retain it and set the local equivalent of `已取消` or `已合并`, with the reason and a surviving-card link when relevant.

## 2. Preflight and claim

1. Confirm the target subproject and read its project-material document for goal, scope, constraints, important links, and acceptance criteria.
2. Read the source Base table/field structure before writing. Use actual field names and option values; never guess them.
3. Search for matching records and check whether another executor is actively recorded.
4. If another live executor owns the same card, do not overwrite it. Report the conflict and ask whether to split, coordinate, or take over.
5. For a new task, write a concise, testable title plus the local equivalent of subproject, status, priority, type, acceptance criterion, and known references.
6. When work begins, change the source card to the active equivalent of `进行中` and record executor, Codex task/session, or branch when the schema supports it.

## 3. Implement in a normal engineering loop

1. Restate the accepted scope and identify out-of-scope work.
2. Create or use the appropriate branch/worktree under repository rules.
3. Implement the smallest coherent change.
4. Run relevant tests, checks, or validations.
5. Update project/subproject documentation if the work changes a durable decision, operating procedure, architecture, or acceptance criteria.
6. Create/update the Issue, PR, commit, or deployment evidence according to the repository workflow.

Do not treat a Feishu card as approval to deploy, migrate data, rotate credentials, alter access control, or run unsafe commands. Repository policy and human approval still govern those actions.

## 4. Write back only meaningful milestones

| Milestone | Source-card update |
| --- | --- |
| Started | active status, executor/session/branch, concise plan or acceptance reminder |
| Material progress | a concise result, decision, scope change, or link—not a minute-by-minute transcript |
| Blocked | local `阻塞` status, concrete blocker, decision/dependency needed, and next action/owner |
| Ready for review | local `待评审` status, PR/commit, tests, risks, and requested review |
| Completed | local `已完成` status and final acceptance/test/deployment evidence |
| Cancelled/merged | relevant final state, reason, and surviving task link |

Never report `已完成` only because code exists. Completion requires the card’s acceptance condition and required validation/review to be satisfied.

## 5. Mirror after the source is correct

After a source card is created or materially updated, upsert its global overview row using source record ID or source URL as the stable external key. Synchronize only fields that are present and valid in the global schema: status, priority, subproject/root relation, executor, date, Codex session, GitHub evidence, concise progress, and sync state.

If global synchronization fails, leave the source task correct, preserve the error in an allowed progress/sync field, and report it. Never create an unrelated global card merely to make a dashboard appear complete.

## 6. Required closing report

End every meaningful implementation session with:

```text
Feishu lifecycle
- Source card: created / reused / updated / cancelled / intentionally not created
- Status and link or record ID: <verified value>
- Global mirror: synchronized / pending / failed with reason
- Evidence: <PR, commit, tests, deployment verification as applicable>
- Next action or blocker: <if any>
```

## Guardrails

- Never create a root-project row named after the root project in a subproject table.
- Never use the global overview as the primary task source.
- Never duplicate project-level repository, production, background, or architecture details into every task.
- Never silently delete started/referenced work to tidy a board.
- Never assume another machine’s OAuth, filesystem, session, branch, or production access.
