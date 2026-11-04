# Agentic Workspace

A Liferay client extension workspace with the harness that makes agent work trustworthy: tools, context, a sandbox per ticket, and guardrails. `CLAUDE.md` is a symlink to this file, and `.claude/rules` and `.claude/skills` are symlinks into `.agents/`, so every agent reads the same files.

## Architecture

Client extensions only. No OSGi modules. Each directory under `client-extensions/` builds one zip:

| Project | Type | Role |
| --- | --- | --- |
| `liferay-sample-batch` | batch | The Sample object and a workflow definition. The only writer of the data model. |
| `liferay-sample-custom-element-2` | customElement | A React widget with three routes. Tested with Vitest. |
| `liferay-sample-etc-spring-boot` | microservice | The sidecar: object actions, a validation rule, an entry manager, a workflow action. Tested with JUnit. |
| `liferay-sample-global-css-1` | globalCSS | Styles on every page. |
| `liferay-sample-instance-settings` | instanceSettings | Instance configuration as YAML. |
| `liferay-sample-site-initializer` | siteInitializer | The Liferay Sample site. |

## Read Before You Build

1. [`specs/README.md`](./specs/README.md) — what the workspace must do, as requirement IDs.
1. The rules in [`.agents/rules/`](./.agents/rules/). Most carry a `paths:` scope and load only for the code they govern.
1. [`tests/README.md`](./tests/README.md) — the test tiers and the plan.
1. [`.agents/lessons.md`](./.agents/lessons.md) — the review comments that became guardrails.

The code is the source of truth for names. When a spec or a rule disagrees with the code, the spec or rule is stale: fix it, and say so.

## Commands

| Goal | Command |
| --- | --- |
| Every check that CI runs | `yarn verify` |
| Lint, and the file name lint | `yarn lint`, `yarn lint:fs` |
| Unit tests | `yarn test:unit`, `yarn test:java`, `yarn test:tools` |
| Portal tests (a running stack) | `yarn test:integration`, `yarn test:e2e` |
| Does the plan cover the code, tests, and specs? | `yarn plan:check`, `yarn plan:scaffold` |
| Workspace Health | `yarn health`, `yarn health:check`, `yarn health:diff` |
| Delivery metrics from GitHub | `yarn metrics --repo <owner/name>` |

## Skills

| Skill | Use It To |
| --- | --- |
| `/plan-ticket` | Turn a ticket into a plan, and stop for approval |
| `/worktree` | Create a sandbox for one ticket |
| `/env` | Start, stop, reset, or reprovision the stack |
| `/deploy` | Deploy client extensions and verify that they started |
| `/test`, `/test-add` | Run the tiers, or add a test at the right tier |
| `/review`, `/review-learn` | Review read only, then turn comments into guardrails |
| `/team` | Run planner, developer, tester, and reviewer on a ticket |
| `/health` | Build and check the Workspace Health report |
| `/pr` | Check, push, and open a pull request |

## Rules That Apply Everywhere

- Write in Simplified Technical English ([rule](./.agents/rules/simplified-technical-english.md)).
- Start every commit title with the ticket ID. Put tests in their own commit ([rule](./.agents/rules/pr-hygiene.md)).
- Commit early. Never run a bare `git stash`: every worktree shares the stash stack.
- Do not edit `.env`, generated files under `build/` or `dist/`, or `yarn.lock` by hand. A hook blocks it.
- When a check fails, fix the cause. Do not weaken the check, skip a hook, or add a known defect without a ticket.
