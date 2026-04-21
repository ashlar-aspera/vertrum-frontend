export type AnyRecord = Record<string, any>;

export type RequestedOutput = "default" | "hooks" | "scripts" | "ideas";
export type GatingDecision = "allow" | "warn" | "block";
export type OutputTier = "strong" | "usable" | "minimal" | "degraded";
export type PlanType = "free" | "pro" | "creator";

export function normalizeGating(
  root: AnyRecord,
  mode: RequestedOutput,
  fallbackPlanType: PlanType = "free"
): DashboardNormalizedResponse["gating"] {
  const gating = asObject(root.gating);

  if (!Object.keys(gating).length) {
    return defaultGatingForMode(mode, fallbackPlanType);
  }

  const planType = normalizePlanType(gating.plan_type ?? fallbackPlanType);
  const usageDefaults = getPlanUsageDefaults(planType);
  const usage = asObject(gating.usage);

return {
  decision:
    gating.decision === "warn" || gating.decision === "block"
      ? gating.decision
      : "allow",
  plan_type: planType,
  usage_type:
    gating.usage_type === "full_query" || gating.usage_type === "light_search"
      ? gating.usage_type
      : mode === "default"
        ? "full_query"
        : "light_search",
  warning_code: gating.warning_code ?? undefined,
  limit_type: gating.limit_type ?? undefined,
  message: gating.message ?? undefined,
  usage: {
    searches_remaining: asNumber(
      usage.searches_remaining,
      usageDefaults.searches_remaining
    ),
    searches_limit: asNumber(
      usage.searches_limit,
      usageDefaults.searches_limit
    ),
    full_content_searches_remaining: asNumber(
      usage.full_content_searches_remaining,
      usageDefaults.full_content_searches_remaining
    ),
    full_content_searches_limit: asNumber(
      usage.full_content_searches_limit,
      usageDefaults.full_content_searches_limit
    ),
  },
};
}

export type DashboardNormalizedResponse = {
  success: boolean;
  status: "ok" | "limit_reached" | "error";
  mode: RequestedOutput;
  query: string;
  platform: string;
  outputTier: OutputTier;
  timestamp?: string;

  gating: {
    decision: GatingDecision;
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

  summary: string;

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

export type LlmReadyContext = {
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

export function asObject(value: unknown): AnyRecord {
  return value && typeof value === "object" && !Array.isArray(value)
    ? (value as AnyRecord)
    : {};
}

export function asArray<T = any>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function asString(value: unknown, fallback = ""): string {
  return typeof value === "string" ? value : fallback;
}

export function asNullableString(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

export function asNumber(value: unknown, fallback = 0): number {
  return typeof value === "number" && Number.isFinite(value) ? value : fallback;
}

export function asNumberOrNull(value: unknown): number | null {
  return typeof value === "number" && Number.isFinite(value) ? value : null;
}

export function asBooleanOrNull(value: unknown): boolean | null {
  return typeof value === "boolean" ? value : null;
}

export function normalizeRequestedOutput(value: unknown): RequestedOutput {
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

export function normalizePlanType(value: unknown): PlanType {
  const normalized = String(value ?? "free").trim().toLowerCase();

  if (normalized === "pro") return "pro";
  if (normalized === "creator") return "creator";
  return "free";
}

export function getPlanUsageDefaults(planType: PlanType) {
  if (planType === "creator") {
    return {
      searches_remaining: 300,
      searches_limit: 300,
      full_content_searches_remaining: 120,
      full_content_searches_limit: 120,
    };
  }

  if (planType === "pro") {
    return {
      searches_remaining: 120,
      searches_limit: 120,
      full_content_searches_remaining: 40,
      full_content_searches_limit: 40,
    };
  }

  return {
    searches_remaining: 25,
    searches_limit: 25,
    full_content_searches_remaining: 8,
    full_content_searches_limit: 8,
  };
}

export function splitScriptToBody(scriptText?: string | null): string[] {
  if (!scriptText) return [];

  return scriptText
    .split(/(?<=[.!?])\s+/)
    .map((part) => part.trim())
    .filter(Boolean);
}

export function defaultGatingForMode(
  mode: RequestedOutput,
  planType: PlanType = "free"
) {
  return {
    decision: "allow" as GatingDecision,
    plan_type: planType,
    usage_type:
      mode === "default"
        ? ("full_query" as const)
        : ("light_search" as const),
    usage: getPlanUsageDefaults(planType),
  };
}

export function formatPlatformLabel(platform: string) {
  const value = String(platform || "").trim().toLowerCase();

  if (value === "tiktok") return "TikTok";
  if (value === "instagram") return "Instagram";
  if (value === "youtube") return "YouTube";
  if (!value) return "Unknown Platform";

  return platform;
}

export function formatChainLabel(chainType?: string | null): string | null {
  if (!chainType) return null;

  return chainType
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

export function formatAnalyzedAgoLabel(timestamp?: string | null): string | null {
  if (!timestamp) return null;

  const parsed = new Date(timestamp);
  if (Number.isNaN(parsed.getTime())) return null;

  const diffMs = Date.now() - parsed.getTime();
  if (diffMs < 0) return "Analyzed just now";

  const minutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(diffMs / (1000 * 60 * 60));
  const days = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (minutes < 1) return "Analyzed just now";
  if (minutes < 60) return `Analyzed ${minutes}m ago`;
  if (hours < 24) return `Analyzed ${hours}h ago`;
  return `Analyzed ${days}d ago`;
}

export function resolveBestTimestamp(root: AnyRecord): string | undefined {
  return (
    asNullableString(root.analyzed_at) ??
    asNullableString(root.created_at) ??
    asNullableString(root.requested_at) ??
    undefined
  );
}

export function buildTrustStatus(params: {
  outputTier: OutputTier;
  platform: string;
  timestamp?: string;
  chainType?: string | null;
}): DashboardNormalizedResponse["trustStatus"] {
  return {
    freshnessLabel:
      params.outputTier === "degraded" ? "Limited Signal" : "Result Data Fresh",
    analyzedAgoLabel: formatAnalyzedAgoLabel(params.timestamp),
    platformLabel: formatPlatformLabel(params.platform),
    chainLabel: formatChainLabel(params.chainType),
  };
}

export function emptyDebug(): DashboardNormalizedResponse["debug"] {
  return {
    candidateCount: 0,
    validCandidateCount: 0,
    rankedCandidateCount: 0,
    primaryRankScore: null,
    primaryChainType: null,
    flags: {},
    rankingVisibility: {},
    sourceInsightId: null,
    sourceHookId: null,
    sourceScriptId: null,
  };
}