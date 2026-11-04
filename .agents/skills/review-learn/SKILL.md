---
name: review-learn
description: Turn review comments, from a person or an agent, into a guardrail so the same comment never needs to be written twice — a lint rule, a test, a workspace rule, or a lesson. Use after a review, or when the user pastes PR feedback.
---

# Review Learn

A reviewer comments once. This skill makes the comment a guardrail that every agent follows.

## Model Routing

Use the smallest model that can do each step:

| Step | Model | Why |
| --- | --- | --- |
| Collect the comments | Small (haiku) | Copying text needs no judgment |
| Group them into patterns | Medium (sonnet) | Clustering needs some judgment |
| Decide the guardrail | Large (opus), or the main session | The decision changes every future run |

Run the first two steps as subagents with the `model` parameter. Keep the decision in the main session.

## Procedure

1. Collect the comments: `gh pr view <number> --comments`, or `.team/<TICKET>/review.md`.

1. Group them. Drop a comment that applies to this change only.

1. For each pattern, pick the strongest guardrail that can hold it:

	| The pattern is... | The guardrail is... |
	| --- | --- |
	| Detectable in the syntax of one file | A rule in `tools/eslint-plugin-local`, with a test in `rules.test.ts` |
	| A naming rule for files or directories | An entry in `.ls-lint.yml` |
	| Detectable across files | An extractor action in `tools/health/collect.ts` |
	| A behavior | A plan row and a test |
	| Judgment that a tool cannot check | A section in the rule in `.agents/rules/` whose `paths` cover the code |

	A doc says "please". A lint rule says "no". Choose a tool when a tool can hold it.

1. Make the change. Run `yarn verify`.

1. Append one row per pattern to `.agents/lessons.md`.
