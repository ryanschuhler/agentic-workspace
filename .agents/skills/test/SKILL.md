---
name: test
description: Run the workspace test suites (Vitest, JUnit, Playwright integration and e2e) plus the plan and health checks, and report the result per tier. Use when the user asks to run tests, to check that a change works, or before a PR.
---

# Test

Run the fast tiers first. Stop at the first tier that fails and fix it before you run a slower one.

| Order | Command | Needs a Portal |
| --- | --- | --- |
| 1 | `yarn lint && yarn lint:fs` | No |
| 2 | `yarn test:unit` | No |
| 3 | `yarn test:java` | No |
| 4 | `yarn plan:check && yarn health:check` | No |
| 5 | `yarn test:integration` | Yes |
| 6 | `yarn test:e2e` | Yes |

`yarn verify` runs steps 1 to 4 and the commit check in one command.

## Before the Portal Tiers

Tiers 5 and 6 run against the deployed stack, not the source. Run `/deploy` for every client extension that the change touches first, or the tests check the old code.

## Report

Report each tier as passed, failed, or skipped, with the count of tests. For a failure, quote the assertion and the file. Do not report a skipped tier as passed.
