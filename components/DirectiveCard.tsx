type DirectiveCardProps = {
  directive: {
    title: string;
    coreDecision: string;
    whatToCreate: string;
    recommendedLength?: string | null;
    openingMove?: string | null;
    hook: string;
    script: string;

    executionContext?: {
      formatType: string;
      deliveryStyle: string;
      pacing: string;
      visualStructure: string;
      tone: string;
    };

    executionSteps?: string[];

    creativeConstraints?: {
      avoid: string[];
      mustInclude: string[];
      styleNotes: string[];
    };

    contentComponents?: {
      cta: string | null;
      hashtags: string[];
      openingHook: string | null;
      supportingBeats: string[];
      patternType: string | null;
    };

    whyThisWorks?: string | null;
    decisionRationale?: string | null;
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

function InfoPill({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-slate-500">
        {label}
      </div>
      <div className="text-sm font-medium text-slate-900">{value}</div>
    </div>
  );
}

function BulletList({ items }: { items?: string[] }) {
  const filtered = (items ?? []).filter(Boolean);
  if (!filtered.length) return null;

  return (
    <ul className="space-y-2 text-sm leading-6 text-slate-700">
      {filtered.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-2">
          <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-slate-400" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export default function DirectiveCard({ directive }: DirectiveCardProps) {
  const context = directive.aiReadyOutput?.context ?? {};

  const prompt =
    typeof context.video_generation_prompt === "string"
      ? context.video_generation_prompt
      : typeof context.execution_prompt === "string"
        ? context.execution_prompt
        : "";

  const execution = directive.executionContext;
  const constraints = directive.creativeConstraints;
  const components = directive.contentComponents;

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

        {directive.recommendedLength ? (
          <span className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium text-slate-700">
            {directive.recommendedLength}
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

      {directive.whyThisWorks || directive.decisionRationale ? (
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {directive.whyThisWorks ? (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-emerald-700">
                Why This Works
              </div>
              <p className="text-sm leading-7 text-slate-800">
                {directive.whyThisWorks}
              </p>
            </div>
          ) : null}

          {directive.decisionRationale ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
                Selection Rationale
              </div>
              <p className="text-sm leading-7 text-slate-700">
                {directive.decisionRationale}
              </p>
            </div>
          ) : null}
        </div>
      ) : null}

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

      {execution ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-4 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Execution Context
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <InfoPill label="Format" value={execution.formatType} />
            <InfoPill label="Delivery" value={execution.deliveryStyle} />
            <InfoPill label="Pacing" value={execution.pacing} />
            <InfoPill label="Tone" value={execution.tone} />
            <div className="sm:col-span-2">
              <InfoPill
                label="Visual Structure"
                value={execution.visualStructure}
              />
            </div>
          </div>
        </div>
      ) : null}

      {directive.executionSteps?.length ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-white p-5">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Execution Steps
          </div>
          <BulletList items={directive.executionSteps} />
        </div>
      ) : null}

      {constraints ? (
        <div className="mt-5 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Must Include
            </div>
            <BulletList items={constraints.mustInclude} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Avoid
            </div>
            <BulletList items={constraints.avoid} />
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Style Notes
            </div>
            <BulletList items={constraints.styleNotes} />
          </div>
        </div>
      ) : null}

      {components?.supportingBeats?.length || components?.hashtags?.length ? (
        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-5">
          <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
            Content Components
          </div>

          {components.patternType ? (
            <p className="mb-4 text-sm leading-6 text-slate-700">
              <span className="font-semibold text-slate-900">Pattern:</span>{" "}
              {components.patternType}
            </p>
          ) : null}

          {components.supportingBeats?.length ? (
            <div className="mb-4">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Supporting Beats
              </div>
              <BulletList items={components.supportingBeats} />
            </div>
          ) : null}

          {components.hashtags?.length ? (
            <div className="flex flex-wrap gap-2">
              {components.hashtags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700"
                >
                  {tag}
                </span>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}

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