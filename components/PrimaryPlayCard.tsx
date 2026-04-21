type ExecutionContext = {
  formatType: string;
  deliveryStyle: string;
  pacing: string;
  visualStructure: string;
  tone: string;
} | null;

type PrimaryPlay = {
  title: string;
  hook: string;
  body: string[];
  executionContext?: ExecutionContext;
  patternInsight?: string;
  whyThisWorks?: string;
};

type Props = {
  primaryPlay: PrimaryPlay;
};

function hasValue(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

export default function PrimaryPlayCard({ primaryPlay }: Props) {
  const scriptLines = Array.isArray(primaryPlay.body)
    ? primaryPlay.body.filter((line) => line.trim().length > 0)
    : [];

  return (
    <section className="rounded-3xl bg-[#020617] p-8 text-white shadow-lg">
      <div className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
        Primary Play
      </div>

      <h2 className="mb-6 text-3xl font-semibold leading-tight text-white">
        {primaryPlay.title}
      </h2>

      {hasValue(primaryPlay.hook) ? (
        <div className="mb-6 rounded-2xl border border-slate-700/50 bg-slate-900/50 p-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Hook
          </div>
          <p className="text-xl font-medium leading-relaxed text-slate-100">
            {primaryPlay.hook}
          </p>
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5">
        <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Example Script
        </div>

        {scriptLines.length ? (
          <div className="space-y-3 text-base leading-7 text-slate-200">
            {scriptLines.map((line, index) => (
              <p key={index}>{line}</p>
            ))}
          </div>
        ) : (
          <p className="text-slate-300">No script content was returned.</p>
        )}
      </div>

      {primaryPlay.executionContext ? (
        <div className="mt-6 rounded-2xl border border-slate-700/50 bg-slate-900/40 p-5">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
            Execution Context
          </div>

          <div className="grid gap-4 text-sm text-slate-300 md:grid-cols-2">
            <div className="space-y-1">
              <div className="text-slate-400">Format</div>
              <div>{primaryPlay.executionContext.formatType}</div>
            </div>

            <div className="space-y-1">
              <div className="text-slate-400">Style</div>
              <div>{primaryPlay.executionContext.deliveryStyle}</div>
            </div>

            <div className="space-y-1">
              <div className="text-slate-400">Pacing</div>
              <div>{primaryPlay.executionContext.pacing}</div>
            </div>

            <div className="space-y-1">
              <div className="text-slate-400">Visual Structure</div>
              <div>{primaryPlay.executionContext.visualStructure}</div>
            </div>

            <div className="space-y-1 md:col-span-2">
              <div className="text-slate-400">Tone</div>
              <div>{primaryPlay.executionContext.tone}</div>
            </div>
          </div>
        </div>
      ) : null}

      {hasValue(primaryPlay.patternInsight) ? (
        <div className="mt-6 rounded-2xl border border-indigo-400/20 bg-indigo-400/5 p-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-300">
            Pattern Insight
          </div>
          <p className="text-base leading-7 text-slate-200">
            {primaryPlay.patternInsight}
          </p>
        </div>
      ) : null}

      {hasValue(primaryPlay.whyThisWorks) ? (
        <div className="mt-6 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-300">
            Why This Play
          </div>
          <p className="text-base leading-7 text-slate-200">
            {primaryPlay.whyThisWorks}
          </p>
        </div>
      ) : null}
    </section>
  );
}