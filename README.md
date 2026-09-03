# AgentFence

**The security boundary between AI agents and the web.**

AgentFence is a WebMCP-powered security workspace that exposes structured
repository tools to WebMCP-aware agents while applying a policy decision to
every tool call. Read-only investigation can proceed automatically;
consequential remediation requires human approval.

## MVP flow

1. Agent discovers the WebMCP tools.
2. Agent reads the demo repository.
3. Agent scans for a deliberately seeded vulnerability.
4. Agent inspects the finding and proposes a patch.
5. Agent reads untrusted repository text containing an instruction-injection attempt.
6. Agent proposes and simulates the patch.
7. `apply_fix` is intercepted by AgentFence policy.
7. Human approves or denies the exact patch.
8. Verification runs.
9. A deterministic security receipt is produced.

## Stack

- Next.js
- JavaScript
- Tailwind CSS
- Native WebMCP imperative API
- No external API key required for the MVP

## Run

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

For local WebMCP testing, use a WebMCP-enabled Chrome build and enable the
WebMCP testing flag if required by your Chrome version.

## Important

The local "Run Agent Demo" button is a deterministic development simulator.
The hackathon-facing capability is the native WebMCP registration in
`components/WebMCPProvider.js`.

The security scenario is intentionally simulated: the repository is an
in-app lab, not a real Git repository and does not mutate external systems.

## Hackathon checklist

- [x] Native `document.modelContext.registerTool(...)`
- [x] Public-source license
- [x] Structured tool schemas
- [x] Consequential action with human approval
- [x] Verification + receipt
- [ ] Deploy a public HTTPS URL
- [ ] Record <3 minute demo
- [ ] Add dated commits showing work completed during the challenge


## WebMCP registration lifecycle

The WebMCP registry is mounted once per page-provider lifecycle. The tool
callbacks read current application state through a ref, so React state changes
do not re-register the same tool names. Registration is owned by one
`AbortController`; cleanup aborts that controller to remove the tools.

This is important because WebMCP tool names are unique within the page's
registry. Re-registering the same names on every React state update causes
`InvalidStateError: Duplicate tool name`.


## Adversarial demo

Use **Simulate Attack** to model the critical boundary:

1. The agent reads `src/notes.txt`.
2. The repository contains text attempting to influence the agent.
3. The simulated agent attempts `apply_fix`.
4. AgentFence independently classifies `apply_fix` as HIGH risk.
5. The tool remains pending until the human approves or denies it.
6. Approval applies only the displayed patch.
7. Verification can then produce the security receipt.

This is deliberately framed as an attack simulation, not a claim that WebMCP
itself prevents prompt injection.

## WebMCP agent layer

The app now includes a transparent browser-side WebMCP test harness. It discovers the actual registered tools with `document.modelContext.getTools()` and executes the remediation sequence with `document.modelContext.executeTool()`. This is not an LLM simulator: each call traverses the same WebMCP registration/execution boundary exposed to a WebMCP-aware external agent.

The harness intentionally stops when `apply_fix` reaches AgentFence's consequential boundary. The human then approves or denies the action in the control plane. Approval is deliberately not exposed as an agent tool.
