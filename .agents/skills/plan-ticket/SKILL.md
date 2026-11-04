---
name: plan-ticket
description: Read a Jira ticket and the specs, then write an implementation plan and stop for the user's approval before any code is written. Use when the user asks to plan a ticket, or as the first phase of work on a new ticket.
---

# Plan a Ticket

A person owns the intent. This skill turns a ticket into a plan that the person approves before an agent writes code.

## Procedure

1. Read the ticket:

	```bash
	curl --silent --user "${JIRA_API_USER}:${JIRA_API_TOKEN}" \
		--url "https://${JIRA_HOST}/rest/api/3/issue/<TICKET>?fields=summary,description"
	```

1. Find the requirements that the ticket touches in `specs/`. When the ticket adds behavior with no requirement, draft the new `REQ-` row.

1. Find the code and the plan rows: `yarn plan:check` lists the surface, and `.agents/rules/` lists the rules for each path.

1. Write `.team/<TICKET>/plan.md` with these sections: Intent, Requirements, Changes (file by file), Plan Rows, Tests (with the tier of each), Risks, and Out of Scope.

1. Show the plan and stop. Ask the user to approve it or to change it. Do not edit code in this skill.
