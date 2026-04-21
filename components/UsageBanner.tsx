type RequestedOutput = "default" | "hooks" | "scripts" | "ideas";

type UsageBannerProps = {
  gating: {
    decision: "allow" | "warn" | "block";
    plan_type?: string;
    usage_type?: "full_query" | "light_search";
    warning_code?: string;
    limit_type?: string;
    message?: string;
    usage?: {
      searches_remaining?: number;
      searches_limit?: number;
      full_content_searches_remaining?: number;
      full_content_searches_limit?: number;
    };
  } | null;
  mode: RequestedOutput;
};

function formatCount(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
}

export default function UsageBanner({
  gating,
  mode,
}: UsageBannerProps) {
  if (!gating) return null;

  const usage = gating.usage ?? {};

  const searchesRemaining = formatCount(usage.searches_remaining);
  const searchesLimit = formatCount(usage.searches_limit);
  const fullRemaining = formatCount(usage.full_content_searches_remaining);
  const fullLimit = formatCount(usage.full_content_searches_limit);

  const isDefaultMode = mode === "default";

  if (gating.decision === "block") {
    return (
      <div className="mb-6 rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-900">
        <div className="mb-1 text-sm font-semibold uppercase tracking-[0.14em]">
          Usage limit reached
        </div>

        <p className="text-sm leading-6">
          {gating.message ??
            (isDefaultMode
              ? "You have used all available Complete Content Package requests for this period."
              : "You have used all available requests for this period.")}
        </p>

        <div className="mt-3 text-sm">
          Searches remaining: {searchesRemaining} / {searchesLimit}
          {" · "}
          Complete packages remaining: {fullRemaining} / {fullLimit}
        </div>
      </div>
    );
  }

  if (gating.decision === "warn") {
    return (
      <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-amber-900">
        <div className="text-sm font-semibold">
          You are getting close to your usage limit.
        </div>

        <div className="mt-1 text-sm leading-6">
          {isDefaultMode
            ? "Complete Content Package requests are limited. Use this mode when you want the full assembled output."
            : "You still have access, but lighter requests are running low for this period."}
        </div>

        <div className="mt-3 text-sm">
          Searches remaining: {searchesRemaining} / {searchesLimit}
          {" · "}
          Complete packages remaining: {fullRemaining} / {fullLimit}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm">
      <div className="text-sm font-medium">Track your remaining usage.</div>

      <div className="mt-3 text-sm text-slate-700">
        Searches remaining: {searchesRemaining} / {searchesLimit}
        {" · "}
        Complete packages remaining: {fullRemaining} / {fullLimit}
      </div>
    </div>
  );
}