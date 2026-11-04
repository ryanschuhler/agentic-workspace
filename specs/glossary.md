# Glossary

| Term | Meaning |
| --- | --- |
| Client extension | A unit of customization that Liferay loads from a zip in `osgi/client-extensions`. Each directory under `client-extensions/` builds one zip. |
| Custom element | A client extension that registers a web component, here `liferay-sample-custom-element-2`, which a page author places as a widget. |
| ERC | External reference code. The stable key of an object, a field, a picklist, or an entry. Never rename one without a migration. |
| Harness | Everything around the model that an agent uses: tools, context, sandbox, and guardrails. |
| Plan item | One row in `tests/plan/`. It names one behavior, the test tier that proves it, and the code it anchors to. |
| Requirement | One row in `specs/` with a `REQ-` ID. It says what must be true and names the plan items that prove it. |
| Sandbox | A disposable environment for one ticket: a git worktree and its own Liferay stack. |
| Sidecar | The Spring Boot client extension. It runs in its own container next to Liferay and answers object actions, validations, and REST calls. |
