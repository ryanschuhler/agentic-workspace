---
name: team
description: Take a ticket from plan through implementation, test, and review with four subagents (planner, developer, tester, reviewer) that hand off through files, with a human approval gate after the plan. Use when the user asks to run the team on a ticket, or invokes /team <TICKET>.
---

# Team

You are the coordinator. You never write code. You start each agent, read its handoff file, and decide whether the next phase starts.

## Handoff Files

Agents pass work through files in `.team/<TICKET>/`, not through the conversation. Each agent starts with a small context, and a person can read exactly what was passed.

| File | Written By | Read By |
| --- | --- | --- |
| `plan.md` | planner | the user, developer, tester, reviewer |
| `dev-handoff.md` | developer | tester, reviewer |
| `test-handoff.md` | tester | reviewer |
| `review.md` | reviewer | developer, the user |

## Phases

1. **Plan.** Start the `planner` subagent with the ticket. It reads the ticket, `specs/`, and the rules, and writes `plan.md`: the requirement IDs it touches, the files to change, the plan rows to add, and the risks.

1. **Gate: human approval.** Show `plan.md` to the user and stop. Do not continue until the user approves. Apply the changes the user asks for to `plan.md` first.

1. **Develop.** Start the `developer` subagent with `plan.md`. It works in the worktree of the ticket (`/worktree`), commits the code, and writes `dev-handoff.md`.

1. **Test.** Start the `tester` subagent with `plan.md` and `dev-handoff.md`. It adds the tests (`/test-add`), runs `/test`, commits the tests apart from the code, and writes `test-handoff.md`.

1. **Gate: green.** When `yarn verify` fails, send the failure back to the developer. Stop after 3 rounds and ask the user.

1. **Review.** Start the `reviewer` subagent, which is read only. It writes `review.md`. Send findings of high severity back to the developer.

1. **Gate: human merge.** Report the result and the review to the user. The user opens the PR with `/pr` and merges. The team never merges.
