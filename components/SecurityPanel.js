"use client";

import { useAgentFence } from "./AgentFenceProvider";

export default function SecurityPanel() {
  const { pendingApproval, approvePending, denyPending, repo, patch } = useAgentFence();

  return (
    <section className="rounded-2xl border border-slate-700 bg-slate-950/70 p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-slate-500">Policy engine</p>
      <h2 className="mt-1 text-lg font-semibold">AgentFence control plane</h2>

      <div className="mt-4 grid grid-cols-3 gap-2">
        <Metric label="READ" value="7" />
        <Metric label="WRITE" value="1" />
        <Metric label="STATE" value={repo.status === "fixed" ? "FIXED" : "RISK"} />
      </div>

      <div className="mt-4 rounded-xl border border-red-500/20 bg-red-500/5 p-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-red-300">Attack simulation</span>
          <span className="text-[10px] font-bold text-red-300">UNTRUSTED CONTENT</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          <span className="font-mono text-slate-300">src/notes.txt</span> contains
          text attempting to persuade the agent to bypass confirmation. The
          policy engine ignores repository instructions and evaluates the actual tool call.
        </p>
      </div>

      <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 p-3">
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">Current policy</span>
          <span className="text-[10px] font-bold text-emerald-300">DEFAULT DENY</span>
        </div>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Read-only investigation is automatic. Consequential mutations require
          explicit human approval.
        </p>
      </div>

      {pendingApproval ? (
        <div className="mt-4 rounded-2xl border border-amber-400/30 bg-amber-400/5 p-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-[0.15em] text-amber-300">Approval required</span>
            <span className="rounded-full bg-red-500/10 px-2 py-1 text-[10px] font-bold text-red-300">{pendingApproval.risk} RISK</span>
          </div>

          <h3 className="mt-3 font-mono text-sm">{pendingApproval.tool}</h3>
          <p className="mt-2 text-xs text-slate-400">{pendingApproval.reason}</p>

          <div className="mt-3 rounded-xl border border-slate-800 bg-slate-950 p-3 text-xs">
            <div><span className="text-slate-500">Finding:</span> {pendingApproval.findingId}</div>
            <div><span className="text-slate-500">Patch:</span> {pendingApproval.patchId}</div>
          </div>

          <pre className="scrollbar mt-3 max-h-44 overflow-auto rounded-xl border border-slate-800 bg-black/30 p-3 text-[10px] leading-5 text-slate-400">
            {patch.diff}
          </pre>

          <div className="mt-3 flex gap-2">
            <button onClick={denyPending} className="flex-1 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-2 text-xs font-bold text-red-200">
              Deny
            </button>
            <button onClick={approvePending} className="flex-1 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-3 py-2 text-xs font-bold text-emerald-200">
              Approve
            </button>
          </div>
        </div>
      ) : (
        <div className="mt-4 rounded-xl border border-dashed border-slate-800 p-4 text-center text-xs text-slate-500">
          No pending consequential action.
        </div>
      )}
    </section>
  );
}

function Metric({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
      <div className="text-[10px] font-bold text-slate-500">{label}</div>
      <div className="mt-1 text-lg font-semibold">{value}</div>
    </div>
  );
}
