# Task-card decision matrix

Apply this matrix after locating the organization’s Agent Onboarding document and before writing the project-local source Base.

| Situation | Card action | Why |
| --- | --- | --- |
| New feature with acceptance criteria | Create | It needs durable scope, review evidence, and a handoff point. |
| New reproducible bug or production defect | Create | It needs severity, evidence, ownership, and a completion test. |
| Continuation of a known task, PR, branch, issue, or prior session | Reuse and update | A second card would split status and evidence. |
| New research/architecture/document deliverable | Create when it has an intended output or decision | Research without an outcome can remain session-local; a deliverable should be traceable. |
| Code review, test failure, or deployment verification that changes the original task outcome | Update the existing card | The evidence belongs with the work it evaluates. |
| Direct factual answer, brainstorming, or local read-only inspection | No card | It does not create project work by itself. |
| One-character/format-only correction with no durable project significance | Usually no card | Avoid turning the Base into a terminal transcript. |
| Empty duplicate draft, never started and never linked | Delete after confirming it is truly empty | This is the only normal deletion case. |
| Obsolete, duplicated, or superseded tracked task | Mark cancelled or merged | Preserve the decision trail and links to completed work. |

## Completion evidence

Use the project’s actual field names. Capture only the evidence that applies:

- acceptance criterion/result;
- GitHub Issue, PR, branch, or commit;
- test command and outcome;
- deployment/verification URL or result;
- user decision, review result, or blocker;
- concise explanation of a cancellation or merge.

## Concurrency rule

Before claiming a card, search by record ID, issue/PR, branch, external link, task title, subproject, and active status. If another active executor is recorded, do not overwrite it. Use a separate card only when the work is genuinely independently deliverable.
