---
name: review
description: Review the current branch against the workspace rules for correctness, safety, and convention, as a read only reviewer, and record how fresh the reviewer was. Use when the user asks for a review, or as the review phase of /team.
---

# Review

A reviewer that watched the code get built finds less. Record which kind of reviewer you are, so the result can be weighed:

| Freshness | Meaning |
| --- | --- |
| fresh | A new session that read only the diff and the rules |
| briefed | A new session that also read the plan or the handoff |
| author | The session that wrote the code |

Prefer a fresh reviewer: run the `reviewer` subagent (`.claude/agents/reviewer.md`), which cannot edit files.

## Procedure

1. Run `git diff main...HEAD --stat`, then read the full diff.

1. Read the rules whose `paths` match the changed files, in `.agents/rules/`.

1. Run `yarn verify`. Report its failures first: a rule that a tool enforces is not a review comment.

1. Review for:
	- Correctness: wrong result, missed case, wrong order of arguments.
	- Safety: a secret in the bundle, a missing CSRF token, an open endpoint.
	- Contract: a renamed ERC, field, endpoint, or OAuth2 application that other code still uses.
	- Tests: a behavior change with no test, or a test that cannot fail.

1. Write each finding with the file and line, what goes wrong, and the fix. Rank them from the most severe.

1. Write the result to `.team/<TICKET>/review.md` when /team runs, or show it to the user. Start it with `Reviewer: fresh | briefed | author`.

After the review, run `/review-learn` on the findings that a rule could have prevented.
