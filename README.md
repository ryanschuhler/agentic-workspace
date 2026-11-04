# The Agentic Workspace

The companion repository for the DevCon 2026 talk **The Agentic Workspace**. It is a small Liferay client extension workspace with the full harness around it, so you can copy the parts you need.

> **Agent = Model + Harness.** The model is rented: everyone gets the same one. The harness is the part you build: **Tools + Context + Sandbox + Guardrails**.

The client extensions are plain copies of the Liferay sample workspace (`workspaces/liferay-sample-workspace` in `liferay-portal`). They are here to show where your own code goes. Everything else is the harness.

## Quick Start

```bash
mise install            # JDK 21 and Node 24 (or use your own)
yarn install            # also points git at .githooks
yarn verify              # every check that CI runs, no portal needed

scripts/env.sh up       # Postgres and Liferay in Docker
scripts/deploy.sh       # build, deploy, and wait for each client extension
yarn test:integration   # Playwright against the running stack
yarn health             # tools/health/build/index.html
```

`scripts/gradlew.sh` runs Gradle in a JDK 21 container when the host has no JDK 21.

## The Talk, Mapped to Files

### Tools

| Idea | Where |
| --- | --- |
| Skills are tools with instructions: the procedure and the failure modes | [`.agents/skills/`](./.agents/skills/), 11 skills |
| The description decides when the agent uses a skill | `/health` reports a skill whose description is too thin |
| A step the agent keeps getting wrong becomes a script | [`scripts/env.sh reprovision`](./scripts/env.sh) counts the initializer runs before it deletes the site |
| Orchestration: subagents with roles, the coordinator never writes code | [`/team`](./.agents/skills/team/SKILL.md), [`.claude/agents/`](./.claude/agents/) |
| Handoffs are files, not a conversation | `.team/<TICKET>/plan.md`, `dev-handoff.md`, `test-handoff.md`, `review.md` |
| Model routing | [`/review-learn`](./.agents/skills/review-learn/SKILL.md): small model collects, medium groups, large decides |

### Context

| Idea | Where |
| --- | --- |
| One entry point for every agent | [`AGENTS.md`](./AGENTS.md), with `CLAUDE.md` and `.claude/*` as symlinks |
| Rules load only for the code they govern | `paths:` frontmatter in [`.agents/rules/`](./.agents/rules/) |
| Context rots: rules carry the date they were verified | `Verified on` lines; `/health` reports a rule with no date, or with paths that match nothing |
| Intent is context: requirement IDs | [`specs/`](./specs/), `REQ-<AREA>-<NNN>` |
| Writing for agents is writing for humans | [Simplified Technical English](./.agents/rules/simplified-technical-english.md), no code comments |
| Every review comment becomes a guardrail | [`.agents/lessons.md`](./.agents/lessons.md) |

### Sandbox

| Idea | Where |
| --- | --- |
| Declarative means disposable | Batch, site initializer, and instance settings client extensions; `scripts/env.sh reset --yes` rebuilds from the tree |
| Low code is agent code | Objects, workflows, sites, and settings are JSON and YAML |
| A worktree per ticket, with its own stack and ports | [`scripts/worktree.sh`](./scripts/worktree.sh), [`/worktree`](./.agents/skills/worktree/SKILL.md) |
| A test environment that does not depend on the host | [`docker-compose.yaml`](./docker-compose.yaml), [`scripts/gradlew.sh`](./scripts/gradlew.sh) |

### Guardrails

| Idea | Where |
| --- | --- |
| A doc says "please", a lint rule says "no" | [`tools/eslint-plugin-local/`](./tools/eslint-plugin-local/): `no-comments`, `log-message-form`, `filename-matches-default-export`, `test-cites-plan-id` |
| File and directory names | [`.ls-lint.yml`](./.ls-lint.yml) |
| Tests at every tier | Vitest beside the source, JUnit in the sidecar, Playwright in [`tests/`](./tests/) |
| Every test cites a plan item, every plan item traces to a requirement | [`tools/plan/`](./tools/plan/), `yarn plan:check` |
| The harness reports on itself | [`tools/health/`](./tools/health/): Workspace Health, `health:check`, `health:diff`, [`known-defects.json`](./tools/health/known-defects.json) |
| Hooks for deterministic steps | [`.claude/settings.json`](./.claude/settings.json): block a bare `git stash`, `git add -A`, `--no-verify`, and edits to `.env` or generated files; lint every edit |
| Git hooks | [`.githooks/`](./.githooks/): ticket in the commit title, lint on commit, plan and health on push |
| Tests in their own commit | `yarn commits:check` |
| Human in the loop | `/plan-ticket` and `/team` stop for approval; the reviewer subagent is read only; a person merges |
| CI runs what you run | [`.github/workflows/ci.yml`](./.github/workflows/ci.yml) is `yarn verify` plus JUnit |

### Metrics

`yarn metrics --repo <owner/name>` reads merged PRs with `gh` and reports shipped PRs per week, PRs per author per month, lead time (median and p75), and review comments per PR. Read the review comments next to the change failure rate: fewer comments is good only when fewer changes fail.

## Try the Guardrails

Each of these fails on purpose. Revert the change after you see the failure.

```bash
# A new route with no plan row, and no test: plan:check reports a GAP.
mkdir -p client-extensions/liferay-sample-custom-element-2/src/routes/hello-baz/pages
yarn plan:check

# An object action that calls a handler that does not exist: health:check reports it.
# Edit an objectActionExecutorKey in client-extensions/liferay-sample-batch/batch/object-definition.batch-engine-data.json
yarn health:check

# A log message written like generated code: lint reports it.
echo "console.error('Error: update failed');" >> client-extensions/liferay-sample-custom-element-2/src/index.js
yarn lint
```

## Starter Kit for Monday

1. Write one `AGENTS.md`.
1. Turn one review comment into a lint rule.
1. Make one sandbox that you can rebuild with one command.
1. Wrap your deploy in one skill.

## Known Defects

`yarn health` finds 3 real problems in the copied samples: the Sample object and the Comic component call a Node sidecar (`liferay-sample-etc-node`) that this repository does not copy. They are tracked in `tools/health/known-defects.json` as `EXAMPLE-1`, to show how the triage queue works.
