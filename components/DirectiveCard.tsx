type DirectiveCardProps = {
  directive: {
    title: string;
    coreDecision: string;
    whatToCreate: string;
    hook: string;
    script: string;
    confidenceLabel: string | null;
    readiness: string | null;
    aiReadyOutput?: {
      displayLabel: string;
      context: Record<string, unknown> | null;
    };
  };
};

function formatLabel(value?: string | null) {
  if (!value) return "—";

  return value
    .replaceAll("_", " ")
    .replaceAll("-", " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

export default function DirectiveCard({ directive }: DirectiveCardProps) {
  const context = directive.aiReadyOutput?.context ?? {};

const prompt =
  typeof context.video_generation_prompt === "string"
    ? context.video_generation_prompt
    : typeof context.execution_prompt === "string"
      ? context.execution_prompt
      : "";

  return (
    <section className="rounded-3xl border border-slate-900 bg-white p-6 shadow-sm sm:p-8">
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <span className="rounded-full bg-slate-950 px-3 py-1 text-xs font-semibold uppercase tracking-[0.16em] text-white">
          Vertrum Directive
        </span>

        {directive.readiness ? (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
            {formatLabel(directive.readiness)}
          </span>
        ) : null}

        {directive.confidenceLabel ? (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
            {formatLabel(directive.confidenceLabel)} Confidence
          </span>
        ) : null}
      </div>

      <h2 className="text-3xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 sm:text-4xl">
        {directive.title}
      </h2>

      <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
        {directive.coreDecision}
      </p>

      <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          What to Create
        </div>
        <p className="text-base leading-7 text-slate-900">
          {directive.whatToCreate}
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Hook
        </div>
        <p className="text-xl font-semibold leading-8 text-slate-950">
          {directive.hook}
        </p>
      </div>

      <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
          Script
        </div>
        <p className="whitespace-pre-wrap text-base leading-8 text-slate-700">
          {directive.script}
        </p>
      </div>

      {prompt ? (
        <div className="mt-5 rounded-2xl border border-indigo-200 bg-indigo-50 p-5">
          <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-indigo-700">
            AI Generation Prompt
          </div>
          <p className="whitespace-pre-wrap text-sm leading-7 text-slate-800">
            {prompt}
          </p>
        </div>
      ) : null}
    </section>
  );
}