# AgentFence implementation plan

## Phase 1 — MVP foundation
- [x] Next.js app shell
- [x] Demo repository and seeded vulnerability
- [x] WebMCP tool definitions
- [x] Native `document.modelContext.registerTool`
- [x] Policy engine
- [x] Human approval gate
- [x] Deterministic verification receipt
- [x] Local agent simulator

## Phase 2 — Hackathon polish
- [ ] Real streamed agent activity UI
- [x] Explicit prompt-injection attack simulation
- [ ] Tool-call request drawer showing exact input/output
- [ ] Diff viewer for proposed patch
- [ ] Policy editor: rules by tool/risk
- [ ] Receipt export/share view
- [ ] Better empty/error/loading states
- [ ] Mobile layout

## Phase 3 — Submission hardening
- [ ] Deploy to public HTTPS URL
- [ ] Verify in WebMCP-enabled Chrome / ChatGPT environment
- [ ] Add public repository URL
- [ ] Add demo YouTube URL
- [ ] Capture dated commits during challenge period
- [ ] Freeze submission before deadline

## WebMCP agent layer (v4)

- Added a transparent WebMCP Agent Console using `document.modelContext.getTools()` for native discovery.
- Added genuine `document.modelContext.executeTool()` execution for the remediation path.
- The harness exercises the registered tools in sequence and stops at `apply_fix` when AgentFence returns `PENDING_HUMAN_APPROVAL`.
- Human approval remains outside the WebMCP tool surface; after approval, verification can be executed through WebMCP.
- Added a denied-action security receipt and fixed demo reset state races.
