import { normalizeDefaultResponse } from "@/lib/dashboard/normalize-default";
import {
  AnyRecord,
  DashboardNormalizedResponse,
  PlanType,
  RequestedOutput,
  asArray,
  asNullableString,
  asObject,
  asString,
  buildTrustStatus,
  defaultGatingForMode,
  emptyDebug,
  normalizeGating,
  normalizeRequestedOutput,
  resolveBestTimestamp,
} from "@/lib/dashboard/utils";

export function unwrapDashboardPayload(raw: unknown): AnyRecord {
  let payload = raw;

  if (Array.isArray(payload)) {
    payload = payload[0] ?? {};
  }

  if (
    payload &&
    typeof payload === "object" &&
    "data" in (payload as AnyRecord)
  ) {
    const data = (payload as AnyRecord).data;

    if (typeof data === "string") {
      try {
        payload = JSON.parse(data);
      } catch {
        payload = {};
      }
    } else if (data && typeof data === "object") {
      payload = data;
    }
  }

  return asObject(payload);
}

export function buildBlockedResponse(params: {
  query: string;
  mode: RequestedOutput;
  platform?: string;
  gating: DashboardNormalizedResponse["gating"];
}): DashboardNormalizedResponse {
  return {
    success: false,
    status: "limit_reached",
    mode: params.mode,
    query: params.query,
    platform: params.platform ?? "tiktok",
    outputTier: "minimal",
    timestamp: undefined,
    gating: params.gating,
    trustStatus: buildTrustStatus({
      outputTier: "minimal",
      platform: params.platform ?? "tiktok",
      timestamp: undefined,
      chainType: null,
    }),
    primaryPlay: null,
    backupPlays: [],
    ideaBank: [],
    hooks: [],
    scripts: [],
    summary:
      params.gating?.message ??
      "This request is blocked because the current usage limit has been reached.",
    debug: emptyDebug(),
  };
}

export function buildErrorResponse(
  mode: RequestedOutput,
  query: string,
  flags: Record<string, unknown> = {},
  planType: PlanType = "free"
): DashboardNormalizedResponse {
  return {
    success: false,
    status: "error",
    mode,
    query,
    platform: "tiktok",
    outputTier: "degraded",
    timestamp: undefined,
    gating: defaultGatingForMode(mode, planType),
    trustStatus: buildTrustStatus({
      outputTier: "degraded",
      platform: "tiktok",
      timestamp: undefined,
      chainType: null,
    }),
    primaryPlay: null,
    backupPlays: [],
    ideaBank: [],
    hooks: [],
    scripts: [],
    summary:
      "The dashboard request failed before a valid response could be normalized.",
    debug: {
      ...emptyDebug(),
      flags,
    },
  };
}

function normalizeHooksResponse(
  root: AnyRecord,
  queryFallback: string,
  fallbackPlanType: PlanType
): DashboardNormalizedResponse {
  const hooks = asArray<AnyRecord>(root.hooks);
  const finalOutput = asObject(root.final_output);

  const query = asString(root.query_term || finalOutput.query_term, queryFallback);
  const platform = asString(root.platform || finalOutput.platform, "tiktok");
  const summary =
    asString(root.summary) ||
    asString(finalOutput.meta_summary) ||
    `Hook fulfillment complete. Returned ${hooks.length} hook${
      hooks.length === 1 ? "" : "s"
    }.`;
  const timestamp = resolveBestTimestamp(root);

  return {
    success: true,
    status: "ok",
    mode: "hooks",
    query,
    platform,
    outputTier: "minimal",
    timestamp,
    gating: normalizeGating(root, "hooks", fallbackPlanType),
    trustStatus: buildTrustStatus({
      outputTier: "minimal",
      platform,
      timestamp,
      chainType: null,
    }),
    primaryPlay: null,
    backupPlays: [],
    ideaBank: [],
    hooks: hooks.map((hook) => ({
      id: asNullableString(hook.id),
      text: asString(hook.hook_text || hook.output_text),
      archetype:
        asNullableString(hook.hook_archetype) ??
        asNullableString(asObject(hook.structured_output).hook_archetype),
      createdAt: asNullableString(hook.created_at),
    })),
    scripts: [],
    summary,
    debug: {
      ...emptyDebug(),
      sourceInsightId: asNullableString(root.source_insight_id),
    },
  };
}

function normalizeScriptsResponse(
  root: AnyRecord,
  queryFallback: string,
  fallbackPlanType: PlanType
): DashboardNormalizedResponse {
  const script = asObject(root.script);
  const finalOutput = asObject(root.final_output);

  const query = asString(root.query_term || finalOutput.query_term, queryFallback);
  const platform = asString(root.platform || finalOutput.platform, "tiktok");
  const summary =
    asString(root.summary) ||
    asString(finalOutput.meta_summary) ||
    "Script fulfillment complete.";
  const timestamp = resolveBestTimestamp(root);

  return {
    success: true,
    status: "ok",
    mode: "scripts",
    query,
    platform,
    outputTier: "minimal",
    timestamp,
    gating: normalizeGating(root, "scripts", fallbackPlanType),
    trustStatus: buildTrustStatus({
      outputTier: "minimal",
      platform,
      timestamp,
      chainType: null,
    }),
    primaryPlay: null,
    backupPlays: [],
    ideaBank: [],
    hooks: [],
    scripts: [
      {
        id: asNullableString(script.id),
        title: asNullableString(script.title),
        hookText: asNullableString(script.hook_text),
        scriptText: asNullableString(script.script_text),
        structure: Object.keys(script).length && script.structure ? asObject(script.structure) : null,
        createdAt: asNullableString(script.created_at),
      },
    ],
    summary,
    debug: {
      ...emptyDebug(),
      sourceInsightId: asNullableString(root.source_insight_id),
      sourceHookId: asNullableString(root.source_hook_id),
      sourceScriptId:
        asNullableString(root.source_script_id) ?? asNullableString(script.id),
    },
  };
}

function normalizeIdeasResponse(
  root: AnyRecord,
  queryFallback: string,
  fallbackPlanType: PlanType
): DashboardNormalizedResponse {
  const finalOutput = asObject(root.final_output);

  const ideas = asArray<AnyRecord>(finalOutput.idea_bank);
  const query = asString(root.query_term || finalOutput.query_term, queryFallback);
  const platform = asString(root.platform || finalOutput.platform, "tiktok");
  const summary =
    asString(root.summary) ||
    asString(finalOutput.meta_summary) ||
    `Idea fulfillment complete. Returned ${ideas.length} idea${
      ideas.length === 1 ? "" : "s"
    }.`;
  const timestamp = resolveBestTimestamp(root);

  return {
    success: true,
    status: "ok",
    mode: "ideas",
    query,
    platform,
    outputTier: "minimal",
    timestamp,
    gating: normalizeGating(root, "ideas", fallbackPlanType),
    trustStatus: buildTrustStatus({
      outputTier: "minimal",
      platform,
      timestamp,
      chainType: null,
    }),
    primaryPlay: null,
    backupPlays: [],
    ideaBank: ideas.map((idea, index) => ({
      id: asNullableString(idea.id ?? idea.idea_id) ?? `idea-${index + 1}`,
      label: asString(idea.label || idea.text, "Untitled idea"),
      text: asString(idea.text, ""),
      type: asNullableString(idea.type ?? idea.idea_type),
      angle: asNullableString(idea.angle),
    })),
    hooks: [],
    scripts: [],
    summary,
    debug: {
      ...emptyDebug(),
      sourceInsightId: asNullableString(root.source_insight_id),
    },
  };
}

function normalizeMockToDefaultResponse(
  mock: any,
  query: string,
  planType: PlanType
): DashboardNormalizedResponse {
  return {
    success: true,
    status: "ok",
    mode: "default",
    query,
    platform: mock?.platform ?? "tiktok",
    outputTier: mock?.outputTier ?? "degraded",
    timestamp: mock?.timestamp,
    gating: defaultGatingForMode("default", planType),
    trustStatus: buildTrustStatus({
      outputTier: mock?.outputTier ?? "degraded",
      platform: mock?.platform ?? "tiktok",
      timestamp: mock?.timestamp,
      chainType:
        mock?.debug?.primaryChainType ?? mock?.debug?.chainType ?? null,
    }),
    primaryPlay: mock?.primaryPlay
      ? {
          title: mock.primaryPlay.title ?? "Untitled",
          hook: mock.primaryPlay.hook ?? "",
          body: Array.isArray(mock.primaryPlay.body) ? mock.primaryPlay.body : [],
          executionContext: mock.primaryPlay.executionContext
            ? {
                formatType: mock.primaryPlay.executionContext.formatType ?? "—",
                deliveryStyle:
                  mock.primaryPlay.executionContext.deliveryStyle ?? "—",
                pacing: mock.primaryPlay.executionContext.pacing ?? "—",
                visualStructure:
                  mock.primaryPlay.executionContext.visualStructure ?? "—",
                tone: mock.primaryPlay.executionContext.tone ?? "—",
              }
            : undefined,
          patternInsight: mock.primaryPlay.patternInsight ?? undefined,
          whyThisWorks: mock.primaryPlay.whyThisWorks ?? undefined,
          llmReadyContext: null,
        }
      : null,
    backupPlays: Array.isArray(mock?.backupPlays)
      ? mock.backupPlays.map((play: any) => ({
          title: play?.title ?? "Untitled",
          angle: play?.angle ?? "No angle available",
          tag: play?.tag ?? undefined,
        }))
      : [],
    ideaBank: Array.isArray(mock?.ideaBank)
      ? mock.ideaBank.map((text: string, index: number) => ({
          id: `mock-${index + 1}`,
          label: text,
          text,
          type: null,
          angle: null,
        }))
      : [],
    hooks: [],
    scripts: [],
    summary: mock?.metaSummary ?? "Mock result returned.",
    debug: {
      candidateCount: mock?.debug?.candidateCount ?? 0,
      validCandidateCount: mock?.debug?.validCandidateCount ?? 0,
      rankedCandidateCount: mock?.debug?.rankedCandidateCount ?? 0,
      primaryRankScore: mock?.debug?.primaryRankScore ?? null,
      primaryChainType:
        mock?.debug?.primaryChainType ?? mock?.debug?.chainType ?? null,
      flags: mock?.debug?.flags ?? {},
      rankingVisibility: mock?.debug?.rankingVisibility ?? {},
      sourceInsightId: mock?.debug?.sourceInsightId ?? null,
      sourceHookId: mock?.debug?.sourceHookId ?? null,
      sourceScriptId: mock?.debug?.sourceScriptId ?? null,
    },
  };
}

function normalizeMockToHooksResponse(
  mock: any,
  query: string,
  planType: PlanType
): DashboardNormalizedResponse {
  const hookText =
    mock?.primaryPlay?.hook ||
    mock?.backupPlays?.[0]?.title ||
    "No hook returned.";

  return {
    success: true,
    status: "ok",
    mode: "hooks",
    query,
    platform: mock?.platform ?? "tiktok",
    outputTier: "minimal",
    timestamp: mock?.timestamp,
    gating: defaultGatingForMode("hooks", planType),
    trustStatus: buildTrustStatus({
      outputTier: "minimal",
      platform: mock?.platform ?? "tiktok",
      timestamp: mock?.timestamp,
      chainType: null,
    }),
    primaryPlay: null,
    backupPlays: [],
    ideaBank: [],
    hooks: [
      {
        id: "mock-hook-1",
        text: hookText,
        archetype: null,
        createdAt: null,
      },
    ],
    scripts: [],
    summary: "Hook fulfillment complete.",
    debug: emptyDebug(),
  };
}

function normalizeMockToScriptsResponse(
  mock: any,
  query: string,
  planType: PlanType
): DashboardNormalizedResponse {
  const body = Array.isArray(mock?.primaryPlay?.body)
    ? mock.primaryPlay.body
    : [];

  return {
    success: true,
    status: "ok",
    mode: "scripts",
    query,
    platform: mock?.platform ?? "tiktok",
    outputTier: "minimal",
    timestamp: mock?.timestamp,
    gating: defaultGatingForMode("scripts", planType),
    trustStatus: buildTrustStatus({
      outputTier: "minimal",
      platform: mock?.platform ?? "tiktok",
      timestamp: mock?.timestamp,
      chainType: null,
    }),
    primaryPlay: null,
    backupPlays: [],
    ideaBank: [],
    hooks: [],
    scripts: [
      {
        id: "mock-script-1",
        title: mock?.primaryPlay?.title ?? "Mock Script",
        hookText: mock?.primaryPlay?.hook ?? null,
        scriptText: body.join("\n\n") || null,
        structure: null,
        createdAt: null,
      },
    ],
    summary: "Script fulfillment complete.",
    debug: emptyDebug(),
  };
}

function normalizeMockToIdeasResponse(
  mock: any,
  query: string,
  planType: PlanType
): DashboardNormalizedResponse {
  const ideas = Array.isArray(mock?.ideaBank) ? mock.ideaBank : [];

  return {
    success: true,
    status: "ok",
    mode: "ideas",
    query,
    platform: mock?.platform ?? "tiktok",
    outputTier: "minimal",
    timestamp: mock?.timestamp,
    gating: defaultGatingForMode("ideas", planType),
    trustStatus: buildTrustStatus({
      outputTier: "minimal",
      platform: mock?.platform ?? "tiktok",
      timestamp: mock?.timestamp,
      chainType: null,
    }),
    primaryPlay: null,
    backupPlays: [],
    ideaBank: ideas.map((text: string, index: number) => ({
      id: `mock-idea-${index + 1}`,
      label: text,
      text,
      type: null,
      angle: null,
    })),
    hooks: [],
    scripts: [],
    summary: "Idea fulfillment complete.",
    debug: emptyDebug(),
  };
}

export function normalizeMockResponseByMode(
  mock: any,
  query: string,
  mode: RequestedOutput,
  planType: PlanType
): DashboardNormalizedResponse {
  if (mode === "hooks") {
    return normalizeMockToHooksResponse(mock, query, planType);
  }

  if (mode === "scripts") {
    return normalizeMockToScriptsResponse(mock, query, planType);
  }

  if (mode === "ideas") {
    return normalizeMockToIdeasResponse(mock, query, planType);
  }

  return normalizeMockToDefaultResponse(mock, query, planType);
}

export function normalizeUpstreamResponse(
  raw: unknown,
  queryFallback: string,
  requestedOutput: RequestedOutput,
  fallbackPlanType: PlanType
): DashboardNormalizedResponse {
  const root = unwrapDashboardPayload(raw);
  const gating = normalizeGating(root, requestedOutput, fallbackPlanType);

  if (gating?.decision === "block") {
    return buildBlockedResponse({
      query: asString(root.query_term, queryFallback),
      mode: requestedOutput,
      platform: asString(root.platform, "tiktok"),
      gating,
    });
  }

  const fulfillmentMode = normalizeRequestedOutput(
    root.fulfillment_mode || root.requested_output || requestedOutput
  );

  if (fulfillmentMode === "default") {
    return normalizeDefaultResponse(
      root,
      queryFallback,
      "default",
      fallbackPlanType
    );
  }

  if (fulfillmentMode === "hooks") {
    return normalizeHooksResponse(root, queryFallback, fallbackPlanType);
  }

  if (fulfillmentMode === "scripts") {
    return normalizeScriptsResponse(root, queryFallback, fallbackPlanType);
  }

  if (fulfillmentMode === "ideas") {
    return normalizeIdeasResponse(root, queryFallback, fallbackPlanType);
  }

  return {
    success: true,
    status: "ok",
    mode: requestedOutput,
    query: queryFallback,
    platform: "tiktok",
    outputTier: "degraded",
    timestamp: undefined,
    gating,
    trustStatus: buildTrustStatus({
      outputTier: "degraded",
      platform: "tiktok",
      timestamp: undefined,
      chainType: null,
    }),
    primaryPlay: null,
    backupPlays: [],
    ideaBank: [],
    hooks: [],
    scripts: [],
    summary: "No validated primary content direction is available.",
    debug: {
      ...emptyDebug(),
      flags: { no_valid_candidates: true },
    },
  };
}