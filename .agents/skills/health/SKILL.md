---
name: health
description: Build the Workspace Health report from the source, check it for untracked actions, and show which actions the branch adds or resolves. Use when the user asks for the health report, after a change to a client extension, rule, or skill, or before a PR.
---

# Workspace Health

The harness reports on itself. `tools/health` reads the source and turns every problem it finds into an action: an object action with no handler, an OAuth2 application that no client extension defines, a rule scoped to paths that no longer exist, a skill with a thin description, a plan gap.

| Command | Result |
| --- | --- |
| `yarn health` | Writes `tools/health/build/index.html`, one page with a tab for each part of the harness |
| `yarn health:check` | Fails on an action that no ticket tracks, or a known defect that is fixed but still listed |
| `yarn health:diff [base]` | Lists the actions that the branch adds and resolves against `base` (default `main`) |

## When the Check Fails

- **UNTRACKED.** Fix the problem. When the fix belongs to another ticket, add the action ID to `tools/health/known-defects.json` with that ticket. Do not change an extractor to hide a problem.
- **RESOLVED.** The defect is fixed. Remove its entry from `known-defects.json` in the same commit as the fix.

## Publish

Open `tools/health/build/index.html` in a browser, or publish it as a private page and share the link. It shows where the defects are, so keep the link private.
