---
name: opc-project-discovery
version: 0.3.2
description: >-
  Use this skill whenever a Codex or other Agent needs to find, understand, create,
  organize, or maintain a project in an OPC Feishu/Lark knowledge base, including when a
  user asks to inspect a project, locate its documents, find its project-management Base,
  understand a repository's project context, create a root project or subproject, or begin
  work with incomplete context. Invoke it before a feature/bug workflow whenever the root
  project, subproject, source task Base, project materials, or current task card are not
  already verified in the session. This is the local operational companion to the OPC Agent
  Onboarding specification; it must not guess tenant-specific URLs, tokens, table IDs, or
  permissions.
metadata:
  compatibility: Requires official lark-cli plus lark-doc, lark-wiki, lark-drive, and lark-base capabilities. Uses user OAuth and resource-level permissions for OPC.
---

# OPC Project Discovery

Use this Skill to build a trustworthy project context before doing work. It is a local, executable copy of the **stable** parts of OPC Agent Onboarding. The private OPC Onboarding document remains the canonical source for live resource links, current schemas, exceptions, and authorization details.

## Version coherence

This Skill is designed to pair with `opc-feature-lifecycle` from the same release. Refresh the managed installation **before launching a new Codex session**; an already-running session must not be assumed to hot-reload a changed Skill. If project instructions report a failed preflight, a missing companion Skill, or mismatched declared versions, do not make Feishu writes until the pair is repaired and a new session begins, or the user explicitly accepts the known local version.

Read [local-onboarding-baseline.md](references/local-onboarding-baseline.md) when entering a new organization, creating a project, or when the hierarchy is unclear.

## Core model

```text
OPC Wiki
├─ Agent Onboarding 规范
├─ <根项目：Wiki 文档节点，项目容器>
│  ├─ 项目管理（Base）
│  │  ├─ 项目（子项目索引）
│  │  └─ 任务（该根项目的来源任务卡）
│  ├─ <子项目资料文档>
│  └─ <调研 / 架构 / 运行 / 复盘文档>
└─ 全局项目管理（跨项目汇总镜像）
```

- A root-project Wiki node is the project container. It is **not** a row named after the root project in a `项目` table.
- A project-local `项目` row is a subproject index record; its `项目资料` link leads to the subproject documentation.
- The project-local `任务` table is the source of truth for task cards.
- `全局项目管理` is a derived cross-project overview, never a replacement source table.

## Preflight: identity and source of truth

1. Find the authoritative OPC Onboarding document from a project-local `AGENTS.md`, local `OPC_ONBOARDING_URL` configuration, or user-provided URL.
2. Run `lark-cli auth status` under the current machine's user identity. Do not expose or copy credentials.
3. Read the Onboarding document before the first Feishu write in a new session. It supplies live URLs, project-specific rules, field names, and scope expectations that cannot live in this public Skill.
4. If the Onboarding location or resource access is absent, do not guess tokens or fabricate a Base mapping. Ask the user or limit work to local read-only inspection.

## Code-repository bootstrap

When onboarding or creating a project that has a code repository, make the project-root `AGENTS.md` part of the setup—not an optional follow-up. Read [project-agents-gate.md](references/project-agents-gate.md), then merge its OPC gate into the repository’s existing `AGENTS.md` or create that file when absent.

1. Fill the project’s private OPC Onboarding URL and verified non-secret project context.
2. Preserve existing repository instructions; never overwrite unrelated guidance.
3. Commit the resulting `AGENTS.md` with the project when repository policy permits, so worktrees and other authorized machines inherit it.
4. Tell the user that Skills must be refreshed before the **next** Codex session and that the new session should be used for implementation.
5. If the repository is read-only or the Onboarding URL is unknown, report the missing gate instead of silently claiming the project is onboarded.

## Discovery protocol

### 1. Find OPC and the root project

1. Search the Feishu Wiki/Docs space for `OPC`, then inspect the current tree and the target root project.
2. Search before creating anything. A similar project title may already exist as a root node or a subproject document.
3. Read the root project document for macro background, objectives, overall status, key GitHub/production/system links, and its child-document index.
4. Treat missing fields as unknown—not permission to infer production URLs, owners, repositories, or architecture.

### 2. Find the correct project-management Base

1. Under the root project node, locate the child named `项目管理` and resolve its actual Base token through the Wiki node metadata when necessary.
2. Read the Base structure before using it. Identify the local `项目` and `任务` tables by their actual names/IDs, then inspect fields before any write.
3. Do not treat a Wiki token as a Base token. Resolve the Wiki node first and use its actual object token.
4. Read the local `项目` table to find the relevant subproject record and its `项目资料` link.

### 3. Build the working context pack

Read the subproject documentation and only the related documents needed for the request. Locate existing work through task records, GitHub Issue/PR/commit references, branch context, and task links.

Before handing off to implementation, report this compact context pack:

```text
OPC context
- Root project: <name + document link>
- Subproject: <name + project-material link>
- Source task Base/table: <link + table name>
- Current task: <record/link or “none found”>
- Relevant documents: <only those read>
- Repository / environment references: <only verified values>
- Gaps or authorization blockers: <if any>
```

### 4. Reuse, do not duplicate

When a user references a feature, bug, issue, branch, PR, commit, or earlier session, search existing cards and documents first. A matching active card plus project-material link is better context than a newly created generic card.

## Creating and maintaining the knowledge structure

When the user explicitly asks to create a root project:

1. Create a new document node at the OPC top level; this is the root project folder.
2. Put only macro content in it: background, target/success standard, overall status, core links, and links to child documents.
3. Create/reuse `项目管理` underneath that node.
4. Create a subproject record only for an independently manageable subproject, then create its single project-material document and link it from the record.
5. Create research, architecture, operations, and retrospective documents as children of the correct root project—not in personal Drive.
6. For code-bearing projects, complete the code-repository bootstrap above before calling the onboarding complete.

When maintaining documents:

- Root project document: macro direction and cross-subproject decisions.
- Subproject material: scope, goals, non-goals, current status, acceptance criteria, and project-specific links.
- Independent research/architecture/operations documents: long-lived evidence and decisions.
- Base task card: state, ownership, execution evidence, and links—not a long-form project specification.

## Safety and ownership

- Prefer user identity for creating or moving Wiki resources so ownership and later organization remain clear.
- Resource-level permission is separate from OAuth scope. Report the smallest missing permission; do not bypass it with shared tokens or public links.
- Do not move/delete existing nodes, tables, fields, or records without clear user authorization and confirmed targets.
- Do not put app secrets, OAuth tokens, cookies, private keys, or tenant-specific Base/Wiki tokens in a public repository or terminal output.

## Handoff to feature work

When the user wants to implement, fix, refactor, test, review, deploy, or document a durable change, load `opc-feature-lifecycle` after this discovery process. Do not let feature work begin with an unverified project/source-task mapping.
