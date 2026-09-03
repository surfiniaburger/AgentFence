# Security model

AgentFence is a demonstration of defense-in-depth around agent-accessible
web capabilities.

Repository contents are treated as untrusted data. Text returned from a
repository should not be interpreted as policy instructions.

The key security boundary in this MVP is:

**agent tool request -> policy evaluation -> human approval (when required)
-> state mutation -> verification -> receipt**

WebMCP exposes capabilities to an agent; AgentFence does not claim that
WebMCP itself prevents prompt injection or malicious repository content.
