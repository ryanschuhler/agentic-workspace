---
name: pr
description: Check the branch, push it, and open a GitHub pull request with the health diff and the test results in the description. Use when the user asks to create, open, or send a PR.
---

# Pull Request

## Procedure

1. Run `yarn verify`. Stop and fix any failure. CI runs the same commands.

1. Run `yarn commits:check`. A commit that mixes code and tests must be split first: see `.agents/rules/testing.md`.

1. Run `yarn health:diff` and keep the output.

1. Push the branch: `git push --set-upstream origin HEAD`.

1. Open the PR with `gh pr create`. Title it like the first commit. Use this body:

	```markdown
	## Intent

	<one sentence: the requirement IDs and what changes for the user>

	## Workspace Health

	<the output of yarn health:diff>

	## Tests

	<tier: count passed, for each tier that ran>
	```

1. Give the user the PR link. A person reviews and merges.
