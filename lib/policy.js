const READ_ONLY = new Set([
  "get_repository",
  "get_commit_diff",
  "scan_repository",
  "inspect_finding",
  "run_verification",
]);

export function evaluateTool(name) {
  if (READ_ONLY.has(name)) {
    return {
      decision: "allow",
      risk: "LOW",
      reason: "Read-only operation.",
    };
  }

  if (name === "propose_fix" || name === "simulate_fix") {
    return {
      decision: "allow",
      risk: "MEDIUM",
      reason: "Non-mutating remediation planning operation.",
    };
  }

  if (name === "apply_fix") {
    return {
      decision: "approval_required",
      risk: "HIGH",
      reason: "This operation mutates repository state.",
    };
  }

  return {
    decision: "deny",
    risk: "HIGH",
    reason: "Unknown tool is denied by default.",
  };
}
