# Feishu-Codex Workflows

可安装、可版本化的 Agent Skills：帮助 Codex 和其他兼容 Agent 把日常开发工作同步到以飞书文档与多维表格为中心的项目管理体系。

本仓库只包含可公开的通用工作流；项目名称、飞书知识库链接、Base token、用户信息、OAuth token、App Secret 和生产凭证都不得提交。

## 可用 Skills

| Skill | 用途 |
| --- | --- |
| [`opc-project-discovery`](skills/opc-project-discovery/SKILL.md) | OPC Agent Onboarding 的本地、可执行副本：发现知识库、根项目、子项目资料、项目管理 Base、关联任务及项目文档；也约束新项目的正确目录结构。 |
| [`opc-feature-lifecycle`](skills/opc-feature-lifecycle/SKILL.md) | 在 feature、bug、重构、运维或文档迭代中，判断卡片是否需要创建/复用/更新/取消，维护来源任务、全局镜像、GitHub 证据和验收状态。 |

两个 Skill 需要配合使用：先用 `opc-project-discovery` 建立可信的项目上下文；再用 `opc-feature-lifecycle` 推进真正的开发工作。若当前 session 已明确确认过项目、子项目、来源 Base 和任务卡，可直接进入后者。

## 安装到 Codex

在每一台运行 Codex 的开发机器上执行：

```bash
npx skills add GarinZ/feishu-codex-workflows \
  --skill '*' \
  --agent codex \
  --global \
  --yes \
  --full-depth
```

安装后，该机器还需要：

1. 安装并完成官方 `lark-cli` 的应用配置与**本机用户 OAuth**；不要复制其他机器的 token。
2. 在当前项目的 `AGENTS.md`、本机配置或首条任务消息中提供 OPC Agent Onboarding 文档的位置。
3. 让当前用户拥有对应知识库、项目文档和 Base 的资源级访问权。

首次验证可使用：

```bash
lark-cli auth status
```

## 工作模型

```text
Codex session
  -> opc-project-discovery（定位 OPC 与项目上下文）
  -> opc-feature-lifecycle（分类、找卡、创建/认领/更新）
  -> 项目内「项目管理」Base（唯一任务来源）
  -> 「全局项目管理」Base（自动维护的汇总镜像）
```

本仓库采用“Codex 主导、飞书留痕”的模型：它不监听飞书事件，不自动唤醒机器，也不代替人工审批。若未来需要 Base 卡片自动触发无人值守执行，应在独立的受控编排层中实现，而不是把该能力隐式加入此 Skill。

## 贡献与版本策略

- 新增飞书工作流 Skill 时，放在 `skills/<skill-name>/SKILL.md`。
- 每个写入型 Skill 都必须说明来源数据、镜像规则、身份/权限要求、并发处理与删除策略。
- 项目资料发现、目录结构和 Onboarding 规则应放入独立的 discovery Skill；不要把它们隐式地散落在 feature Skill 里。
- 不提交真实的飞书 token、App Secret、项目私有链接、生产地址或仓库密钥。
- 对工作流行为的实质变化应同时更新相应的 `evals/` 用例。

## 许可证

[MIT](LICENSE)
