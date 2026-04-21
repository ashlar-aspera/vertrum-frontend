type DebugDrawerProps = {
  debug: {
    candidateCount: number;
    validCandidateCount: number;
    rankedCandidateCount: number;
    primaryRankScore: number | null;
    primaryChainType: string | null;
    flags: Record<string, unknown>;
    rankingVisibility: Record<string, unknown>;
    sourceInsightId: string | null;
    sourceHookId: string | null;
    sourceScriptId: string | null;
  };
};

export default function DebugDrawer({ debug }: DebugDrawerProps) {
  return (
    <details className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <summary className="cursor-pointer text-sm font-semibold uppercase tracking-wide text-slate-500">
        Internal Debug
      </summary>

      <div className="mt-4 grid gap-2 text-sm text-slate-700">
        <div>Candidate Count: {String(debug.candidateCount)}</div>
        <div>Valid Candidate Count: {String(debug.validCandidateCount)}</div>
        <div>Ranked Candidate Count: {String(debug.rankedCandidateCount)}</div>
        <div>Primary Rank Score: {String(debug.primaryRankScore)}</div>
        <div>Primary Chain Type: {String(debug.primaryChainType)}</div>
        <div>Source Insight ID: {String(debug.sourceInsightId)}</div>
        <div>Source Hook ID: {String(debug.sourceHookId)}</div>
        <div>Source Script ID: {String(debug.sourceScriptId)}</div>

        <div className="mt-2">
          <div className="mb-1 font-medium text-slate-900">Flags</div>
          <pre className="overflow-x-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
            {JSON.stringify(debug.flags, null, 2)}
          </pre>
        </div>

        <div className="mt-2">
          <div className="mb-1 font-medium text-slate-900">
            Ranking Visibility
          </div>
          <pre className="overflow-x-auto rounded-xl bg-slate-50 p-3 text-xs text-slate-700">
            {JSON.stringify(debug.rankingVisibility, null, 2)}
          </pre>
        </div>
      </div>
    </details>
  );
}