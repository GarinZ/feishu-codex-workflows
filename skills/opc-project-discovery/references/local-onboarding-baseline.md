# OPC local onboarding baseline

This file intentionally contains stable operating rules only. The private OPC Agent Onboarding document supplies live Wiki URLs, Base tokens, application scopes, current table fields, and project-specific exceptions.

## 1. Non-negotiable rules

1. OPC is the single entry point for project knowledge. Do not scatter project documents, Base tables, or task cards into personal Drive or unrelated knowledge spaces.
2. Root project and `项目` record are different levels: root project is a Wiki document node; `项目` is a child/subproject index row.
3. Project facts belong in documents; task state and delivery evidence belong in the task Base.
4. Never place secret material in documents, terminal output, Git repositories, task cards, or prompts.
5. User identity is preferred for human-owned knowledge resources. Bot/application identity is limited to explicitly approved automation.

## 2. Root project structure

```text
OPC
└─ <根项目文档节点>
   ├─ 项目管理（Base）
   ├─ <子项目资料文档>
   ├─ <调研文档>
   ├─ <架构文档>
   └─ <运行 / 复盘文档>
```

The root document includes background, goals, global status, success criteria, important verified links, and cross-subproject decisions. It should not become a duplicate task board or a dumping ground for every implementation detail.

## 3. Project-local Base minimum model

`项目` is a subproject index and should normally include:

- project/subproject name;
- project-material document URL;
- related tasks;
- last updated.

Avoid fixed columns for repository URL, production address, project owner, or long explanation. Those vary by subproject and belong in its project-material document.

`任务` records are minimal, testable work units. Existing local schemas may differ, but commonly include title/number, linked subproject, status, priority, type, owner/executor, due date, GitHub evidence, Codex session, progress, and last updated.

## 4. Task state baseline

```text
待处理 → 可执行 → 进行中 → 待评审 → 已完成
                 ↘ 阻塞
任何阶段 → 已取消
```

Only one live executor should claim a card at a time. A block entry must state the blocker, the required decision or dependency, and the next owner/action. Finished work should retain issue/PR/commit/test/deployment evidence.

## 5. Global overview rule

`全局项目管理` contains root project, subproject, and global task views across OPC. A local source task is mirrored there using its source record ID/URL. Agents update the source task first, then upsert the mirror; they do not create a divergent standalone global task.

## 6. First-session checklist

- Verify `lark-cli` authentication under the correct identity.
- Read the private OPC Agent Onboarding document.
- Find the existing root project before creating anything.
- Read the root document, relevant subproject document, Base structure, and existing related task.
- Confirm resource-level permissions before changing anything.
- Read back each important write before reporting success.
