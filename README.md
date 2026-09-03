# AgentFence

**The security boundary between AI agents and the web.**

AgentFence is a WebMCP-powered security workspace that exposes structured repository tools to WebMCP-aware agents while applying a policy decision to every tool call.

Read-only investigation can proceed automatically. Consequential actions are intercepted by AgentFence and require explicit human approval.

The core principle is:

> **The agent can decide what it wants to do. AgentFence decides whether the application will let it.**

## Why AgentFence?

WebMCP makes web applications accessible to AI agents through structured, discoverable tools.

That creates a powerful new interaction model — but it also creates a security question:

**What happens when an agent encounters untrusted web content that tells it to perform a consequential action?**

AgentFence demonstrates one answer:

- WebMCP provides the agent-accessible capabilities.
- AgentFence evaluates tool calls through a policy boundary.
- Untrusted repository content remains data, not authorization.
- Consequential actions require human approval.
- Verification establishes whether the resulting change actually worked.
- A deterministic security receipt records the final outcome.

AgentFence does **not** claim that WebMCP itself prevents prompt injection.

Instead, AgentFence demonstrates how an application can keep **agent intent, untrusted content, and application authorization as separate concerns**.

## MVP Flow

1. A WebMCP-aware agent discovers AgentFence's available tools.
2. The agent reads the demo `payment-service` repository.
3. The agent scans the repository for a deliberately seeded vulnerability.
4. The agent inspects the finding.
5. The agent proposes a remediation patch.
6. The agent encounters untrusted repository text containing an instruction-injection attempt.
7. The agent simulates the proposed remediation.
8. `apply_fix` is classified as a consequential action.
9. AgentFence intercepts the action and requires human approval.
10. The human reviews the exact proposed patch.
11. The human approves or denies the action.
12. If approved, the patch is applied.
13. Verification runs against the resulting repository state.
14. A deterministic security receipt records the decision and verification outcome.

## Security Scenario

The demo repository intentionally contains a vulnerable payment operation.

The vulnerability is an unvalidated payment amount in:

`src/payments.js`

The repository also contains deliberately malicious, untrusted text in:

`src/notes.txt`

The text attempts to instruct the agent to ignore previous instructions and apply the remediation without operator confirmation.

AgentFence treats that repository text as **untrusted content**.

The content may influence what an agent proposes to do, but it cannot independently authorize a consequential application action.

The important security boundary is:

`Untrusted content ≠ Authorization`

## WebMCP Tools

AgentFence exposes structured tools through the native WebMCP imperative API.

### Read-only investigation

- `get_repository`
- `get_commit_diff`
- `scan_repository`
- `inspect_finding`

These operations can proceed without human approval.

### Remediation

- `propose_fix`
- `simulate_fix`

These operations prepare and evaluate a potential remediation without mutating the repository.

### Consequential action

- `apply_fix`

This is the security boundary.

`apply_fix` requires human approval before the simulated repository can transition from vulnerable to fixed.

### Verification

- `run_verification`

Verification runs after an approved remediation and produces the final deterministic result.

## WebMCP

AgentFence uses the native WebMCP imperative API:

`document.modelContext.registerTool(...)`

The application also demonstrates browser-side discovery and execution through:

`document.modelContext.getTools()`

and:

`document.modelContext.executeTool(...)`

The WebMCP Agent Console provides a transparent browser-side test harness for exercising the actual registered WebMCP tools.

It is intentionally **not presented as an LLM**. It demonstrates the same WebMCP discovery and execution path that a compatible agent can use.

## Policy Boundary

Every tool call passes through the AgentFence policy layer.

Conceptually:

`WebMCP Tool`

↓

`AgentFence Policy`

↓

`ALLOW`

or

`HUMAN APPROVAL REQUIRED`

or

`DENY`

Read-only operations can proceed automatically.

Consequential remediation cannot proceed merely because an agent requested it.

The application remains the final authority over whether the action is executed.

## Human Approval

When `apply_fix` is requested, AgentFence pauses the action and presents the exact proposed patch to the operator.

The operator can:

- **Approve** the patch
- **Deny** the patch

Approval changes the application state and permits the remediation to proceed.

Denial leaves the repository unchanged.

This makes the human approval step part of the actual application control flow rather than merely a visual confirmation.

## Verification & Security Receipt

After an approved remediation, AgentFence runs deterministic verification.

The successful demo path results in:

- Repository: `FIXED`
- Verification: `PASS`
- Tests: `12 passed / 0 failed`

AgentFence then produces a deterministic security receipt containing the remediation outcome, including information such as:

- Finding
- Patch
- Policy decision
- Approval decision
- Verification result
- Tests
- Commit
- Timestamp

The receipt answers:

> **What ultimately happened?**

## Architecture

The high-level architecture is:

`WebMCP-aware Agent`

↓

`WebMCP`

↓

`AgentFence`

- Tool Registry
- Policy Engine
- Approval Boundary

↓

`Human`

↓

`Application / Verification`

↓

`Security Receipt`

WebMCP provides the capability surface.

AgentFence provides the application-level security boundary around consequential capabilities.

## Stack

- Next.js
- JavaScript
- Tailwind CSS
- Native WebMCP imperative API
- React
- No external API key required for the MVP

## Run Locally

```bash
npm install
npm run dev
````

Open:

`http://localhost:3000`

For local WebMCP testing, use a WebMCP-enabled Chrome build and enable the WebMCP testing flag if required by your Chrome version.

## WebMCP Browser Testing

AgentFence can be tested through a WebMCP-capable browser.

The WebMCP Agent Console exposes:

* Available registered tools
* Tool schemas
* Tool discovery
* Actual WebMCP tool execution
* Current agent task context
* Last WebMCP call
* Policy outcomes
* Approval state

The important distinction is that the console invokes the **actual registered WebMCP tools** rather than a separate mock API.

## Important Implementation Detail

The WebMCP registry is mounted once per page-provider lifecycle.

Tool callbacks read current application state through a ref so React state changes do not cause the same WebMCP tools to be registered repeatedly.

Registration is owned by a single `AbortController`.

Cleanup aborts that controller and removes the registered tools.

This matters because WebMCP tool names are unique within the page's registry. Re-registering the same tool names on every React state update can produce:

`InvalidStateError: Duplicate tool name`

The implementation therefore keeps WebMCP registration separate from ordinary React state updates.

## Demo Simulator

The local **Run Agent Demo** button is a deterministic development/test harness.

It demonstrates the WebMCP execution path locally without requiring an external LLM or external repository.

The hackathon-facing capability is the native WebMCP registration and the tools exposed through:

`document.modelContext`

The simulator should not be interpreted as an LLM implementation.

## Deliberately Simulated Environment

The repository shown in AgentFence is an **in-app security lab**.

It is intentionally deterministic so the security boundary can be demonstrated reliably.

It is not a real Git repository and does not mutate external systems.

The remediation, verification, and security receipt are therefore deterministic parts of the demonstration environment.

## Security Design Principle

AgentFence separates three things:

### Agent intent

What the agent is attempting to do.

### Untrusted content

Information encountered by the agent while investigating the repository or web application.

### Application authorization

What the application actually permits the agent to execute.

The key principle is:

> **Agent intent is not application authorization.**

This allows AgentFence to demonstrate a security boundary even when the agent encounters adversarial content.

## Hackathon Checklist

* Native `document.modelContext.registerTool(...)`
* Structured WebMCP tool schemas
* WebMCP tool discovery
* WebMCP tool execution
* Consequential action protected by human approval
* Deliberate prompt-injection scenario
* Verification after remediation
* Deterministic security receipt
* Public-source license
* Public HTTPS deployment
* Under-3-minute demo
* Dated commits showing work completed during the challenge

## Project Status

AgentFence is a hackathon MVP demonstrating a security architecture for agent-accessible web capabilities.

The current implementation focuses on one concrete scenario:

**AI agent → repository investigation → untrusted content → proposed remediation → policy boundary → human approval → verification → security receipt**

The architecture is intentionally small and deterministic so the security boundary is easy to inspect and demonstrate.

## What's Next

Potential future directions include:

* Connecting AgentFence to real repositories.
* Expanding the policy engine beyond repository remediation.
* Supporting richer risk classifications.
* Adding organization-level policies.
* Adding audit and compliance workflows.
* Extending the model to other consequential WebMCP capabilities.
* Integrating AgentFence with production agent gateways and enterprise authorization systems.

## License

This project is open source under the license included in this repository.

