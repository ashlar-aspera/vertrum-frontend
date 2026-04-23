import BackupPlayCard from "@/components/BackupPlayCard";
import DebugDrawer from "@/components/DebugDrawer";
import IdeaBankSection from "@/components/IdeaBankSection";
import PrimaryPlayCard from "@/components/PrimaryPlayCard";
import ReadyToUseAiPromptSection from "@/components/ReadyToUseAiPromptSection";
import ResultSearchBar from "@/components/ResultSearchBar";
import ResultStatusStrip from "@/components/ResultStatusStrip";
import StateMessage from "@/components/StateMessage";
import StrengthCard from "@/components/StrengthCard";
import UsageBanner from "@/components/UsageBanner";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RequestedOutput = "default" | "hooks" | "scripts" | "ideas";
type OutputTier = "strong" | "usable" | "minimal" | "degraded";

type LlmReadyContext = {
  creatorIntent?: string | null;
  contentGoal?: string | null;
  targetPlatform?: string | null;
  chainType?: string | null;
  fallbackUsed?: boolean | null;
  format?: {
    type?: string | null;
    durationSeconds?: string | null;
    aspectRatio?: string | null;
  } | null;
  hook?: {
    text?: string | null;
    delivery?: string | null;
  } | null;
  script?: {
    structure?: Array<{
      section?: string | null;
      instruction?: string | null;
    }>;
    fullText?: string | null;
  } | null;
  visualDirection?: {
    style?: string | null;
    pacing?: string | null;
    camera?: string | null;
    sceneNotes?: string[];
  } | null;
  tone?: {
    voice?: string | null;
    energy?: string | null;
    deliveryStyle?: string | null;
  } | null;
  contentComponents?: {
    openingHook?: string | null;
    supportingBeats?: string[];
    cta?: string | null;
  } | null;
  sourceLineage?: {
    sourceInsightId?: string | null;
    sourceHookId?: string | null;
    sourceScriptId?: string | null;
    sourcePostIds?: string[];
  } | null;
  patternSignals?: string[];
  constraints?: string[];
  successCriteria?: string[];
};

type DashboardResponse = {
  success: boolean;
  status: "ok" | "limit_reached" | "error";
  mode: RequestedOutput;
  query: string;
  platform: string;
  outputTier: OutputTier;
  timestamp?: string;
  summary: string;

  gating: {
    decision: "allow" | "warn" | "block";
    plan_type?: string;
    usage_type?: "full_query" | "light_search";
    warning_code?: string;
    limit_type?: string;
    message?: string;
    usage: {
      searches_remaining: number;
      searches_limit: number;
      full_content_searches_remaining: number;
      full_content_searches_limit: number;
    };
  } | null;

  trustStatus: {
    freshnessLabel: string;
    analyzedAgoLabel: string | null;
    platformLabel: string;
    chainLabel: string | null;
  };

  primaryPlay: {
    title: string;
    hook: string;
    body: string[];
    executionContext?: {
      formatType: string;
      deliveryStyle: string;
      pacing: string;
      visualStructure: string;
      tone: string;
    };
    patternInsight?: string;
    whyThisWorks?: string;
    llmReadyContext?: LlmReadyContext | null;
  } | null;

  backupPlays: Array<{
    title: string;
    angle: string;
    tag?: string;
  }>;

  ideaBank: Array<{
    id: string | null;
    label: string;
    text: string;
    type: string | null;
    angle: string | null;
  }>;

  hooks: Array<{
    id: string | null;
    text: string;
    archetype: string | null;
    createdAt: string | null;
  }>;

  scripts: Array<{
    id: string | null;
    title: string | null;
    hookText: string | null;
    scriptText: string | null;
    structure: Record<string, unknown> | null;
    createdAt: string | null;
  }>;

  debug: {
    candidateCount?: number | null;
    validCandidateCount?: number | null;
    rankedCandidateCount?: number | null;
    primaryRankScore?: number | null;
    primaryChainType?: string | null;
    flags?: Record<string, unknown> | null;
    rankingVisibility?: Record<string, unknown> | null;
    sourceInsightId?: string | null;
    sourceHookId?: string | null;
    sourceScriptId?: string | null;
  };
};

type HomePageProps = {
  searchParams: Promise<{ state?: string; q?: string; output?: string }>;
};

function normalizeRequestedOutput(value: unknown): RequestedOutput {
  const normalized = String(value ?? "default").trim().toLowerCase();

  if (
    normalized === "default" ||
    normalized === "hooks" ||
    normalized === "scripts" ||
    normalized === "ideas"
  ) {
    return normalized;
  }

  return "default";
}

async function getDashboardResponse(
  query: string,
  state: string,
  output: RequestedOutput
): Promise<DashboardResponse> {
  const params = new URLSearchParams({
    q: query,
    state,
    output,
    ts: Date.now().toString(),
  });

  const baseUrl =
  process.env.DASHBOARD_PAGE_BASE_URL || "http://localhost:3001";

const res = await fetch(
  `${baseUrl}/api/dashboard?${params.toString()}`,
  {
    cache: "no-store",
    next: { revalidate: 0 },
  }
);

  if (!res.ok) {
    throw new Error(`Failed to load dashboard response: ${res.status}`);
  }

  return res.json();
}

function HooksSection({
  hooks,
}: {
  hooks: DashboardResponse["hooks"];
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-5 text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
        Hooks
      </div>

      {hooks.length ? (
        <div className="space-y-4">
          {hooks.map((hook, index) => (
            <article
              key={hook.id ?? `hook-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-5"
            >
              <div className="text-lg font-medium leading-7 text-slate-950">
                {hook.text}
              </div>

              {(hook.archetype || hook.createdAt) && (
                <div className="mt-2 text-sm text-slate-500">
                  {[hook.archetype, hook.createdAt].filter(Boolean).join(" · ")}
                </div>
              )}
            </article>
          ))}
        </div>
      ) : (
        <div className="text-slate-600">
          No hooks were returned for this request.
        </div>
      )}
    </section>
  );
}

function ScriptsSection({
  scripts,
}: {
  scripts: DashboardResponse["scripts"];
}) {
  const script = scripts[0];

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-5 text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
        Script
      </div>

      {script ? (
        <div className="space-y-5">
          {script.title ? (
            <div>
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Title
              </div>
              <h2 className="text-2xl font-semibold text-slate-950">
                {script.title}
              </h2>
            </div>
          ) : null}

          {script.hookText ? (
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Hook
              </div>
              <div className="text-base leading-7 text-slate-900">
                {script.hookText}
              </div>
            </div>
          ) : null}

          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              Script
            </div>
            <div className="whitespace-pre-wrap text-base leading-7 text-slate-800">
              {script.scriptText || "No script text was returned."}
            </div>
          </div>
        </div>
      ) : (
        <div className="text-slate-600">
          No script was returned for this request.
        </div>
      )}
    </section>
  );
}

function BlockedState({
  mode,
  message,
}: {
  mode: RequestedOutput;
  message?: string;
}) {
  const modeLabel =
    mode === "default"
      ? "Complete Content Package"
      : mode === "hooks"
        ? "Hooks"
        : mode === "scripts"
          ? "Scripts"
          : "Ideas";

  return (
    <section className="rounded-3xl border border-amber-300 bg-white p-8 shadow-sm">
      <div className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-amber-700">
        Request blocked
      </div>

      <h2 className="mb-3 text-2xl font-semibold text-slate-950">
        {modeLabel} is not available right now
      </h2>

      <p className="max-w-3xl text-base leading-7 text-slate-600">
        {message ||
          "This request is currently blocked by your usage limit. Track remaining usage above and try again when capacity resets or becomes available."}
      </p>
    </section>
  );
}

function EmptyPrimaryState() {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
        Available Direction
      </div>

      <h2 className="mb-3 text-2xl font-semibold text-slate-950">
        No validated primary play
      </h2>

      <p className="max-w-2xl text-slate-600">
        The current candidate set did not produce a trusted primary
        recommendation. Review supporting ideas below rather than treating this
        result as a broken state.
      </p>
    </div>
  );
}

export default async function HomePage({ searchParams }: HomePageProps) {
  const params = await searchParams;
  const state = params.state === "degraded" ? "degraded" : "strong";
  const activeQuery = (params.q || "").trim() || "motivation";
  const output = normalizeRequestedOutput(params.output);

  const data = await getDashboardResponse(activeQuery, state, output);

  const isBlocked = data.gating?.decision === "block";
  const showStateMessage =
    !isBlocked &&
    (data.outputTier === "degraded" || data.outputTier === "minimal");

  const primaryRankScore =
    typeof data.debug?.primaryRankScore === "number"
      ? Math.min(data.debug.primaryRankScore / 100, 1)
      : 0;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-6">
          <div className="mb-6 text-center">
            <div className="mb-3 text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">
              Vertrum
            </div>

            <h1 className="mb-3 text-3xl font-semibold leading-tight text-slate-900 md:text-4xl">
              Know what to create next
            </h1>

            <p className="mx-auto max-w-2xl text-sm leading-6 text-slate-500 md:text-base">
              Search a topic, choose an output mode, and inspect the strongest
              returned direction in one flow.
            </p>
          </div>

          <div className="mx-auto max-w-5xl">
            <ResultSearchBar
              defaultQuery={activeQuery}
              defaultOutput={output}
              defaultState={state}
            />
          </div>
        </section>

        <div className="my-6 h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent" />

        <section>
          <ResultStatusStrip
            freshnessLabel={data.trustStatus?.freshnessLabel}
            analyzedAgoLabel={data.trustStatus?.analyzedAgoLabel}
            platformLabel={data.trustStatus?.platformLabel}
            chainLabel={data.trustStatus?.chainLabel}
          />

          <UsageBanner gating={data.gating} mode={output} />

          {showStateMessage ? (
            <div className="mb-6">
              <StateMessage outputTier={data.outputTier} mode={output} />
            </div>
          ) : null}

          {isBlocked ? (
            <BlockedState mode={output} message={data.gating?.message} />
          ) : null}

          {!isBlocked && output === "default" ? (
            <>
              <div className="mb-4 mt-1">
                <StrengthCard
                  score={primaryRankScore}
                  chainType={data.debug?.primaryChainType ?? "—"}
                />
              </div>

              <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
                <div>
                  {data.primaryPlay ? (
                    <PrimaryPlayCard primaryPlay={data.primaryPlay} />
                  ) : (
                    <EmptyPrimaryState />
                  )}
                </div>

                <div className="space-y-4">
                  <div className="text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
                    Alternate Directions
                  </div>

                  {data.backupPlays.length ? (
                    data.backupPlays.map((play, index) => (
                      <BackupPlayCard key={index} play={play} />
                    ))
                  ) : (
                    <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
                      No alternate directions available for this result.
                    </div>
                  )}
                </div>
              </div>

              {data.primaryPlay?.llmReadyContext ? (
                <div className="mt-6">
                  <ReadyToUseAiPromptSection
                    llmReadyContext={data.primaryPlay.llmReadyContext}
                  />
                </div>
              ) : null}

              <div className="mt-6">
                <IdeaBankSection ideas={data.ideaBank} />
              </div>
            </>
          ) : null}

          {!isBlocked && output === "hooks" ? (
            <div className="mt-4">
              <HooksSection hooks={data.hooks} />
            </div>
          ) : null}

          {!isBlocked && output === "scripts" ? (
            <div className="mt-4">
              <ScriptsSection scripts={data.scripts} />
            </div>
          ) : null}

          {!isBlocked && output === "ideas" ? (
            <div className="mt-4">
              <IdeaBankSection ideas={data.ideaBank} />
            </div>
          ) : null}

                          {!isBlocked ? (
            <div className="mt-6">
              <DebugDrawer
                debug={{
                  candidateCount: data.debug?.candidateCount ?? 0,
                  validCandidateCount: data.debug?.validCandidateCount ?? 0,
                  rankedCandidateCount: data.debug?.rankedCandidateCount ?? 0,
                  primaryRankScore: data.debug?.primaryRankScore ?? null,
                  primaryChainType: data.debug?.primaryChainType ?? null,
                  flags: data.debug?.flags ?? {},
                  rankingVisibility: data.debug?.rankingVisibility ?? {},
                  sourceInsightId: data.debug?.sourceInsightId ?? null,
                  sourceHookId: data.debug?.sourceHookId ?? null,
                  sourceScriptId: data.debug?.sourceScriptId ?? null,
                }}
              />
            </div>
          ) : null}

          {/* TEMP DEBUG: Raw API response rendering for cross-device audit */}
          {/* REMOVE AFTER CONSISTENCY ISSUE IS RESOLVED */}
          {!isBlocked ? (
            <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
              <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                Raw API Response
              </div>
              <pre className="overflow-x-auto whitespace-pre-wrap text-[10px] leading-4 text-slate-700">
                {JSON.stringify(data, null, 2)}
              </pre>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}