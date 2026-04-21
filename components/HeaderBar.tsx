type RequestedOutput = "default" | "hooks" | "scripts" | "ideas";

type HeaderBarProps = {
  query: string;
  platform: string;
  outputTier: string;
  timestamp?: string;
  mode?: RequestedOutput;
  isBlocked?: boolean;
};

function formatTierLabel(tier: string) {
  const value = String(tier || "").toLowerCase();

  if (value === "strong") return "Strong";
  if (value === "usable") return "Usable";
  if (value === "minimal") return "Minimal";
  if (value === "degraded") return "Degraded";

  return tier;
}

function formatPlatformLabel(platform: string) {
  const value = String(platform || "").trim().toLowerCase();

  if (value === "tiktok") return "TikTok";
  if (value === "instagram") return "Instagram";
  if (value === "youtube") return "YouTube";
  if (!value) return "Unknown";

  return platform;
}

function formatModeLabel(mode: RequestedOutput = "default") {
  if (mode === "hooks") return "Hooks";
  if (mode === "scripts") return "Scripts";
  if (mode === "ideas") return "Ideas";
  return "Complete Content Package";
}

export default function HeaderBar({
  query,
  platform,
  outputTier,
  timestamp,
  mode = "default",
  isBlocked = false,
}: HeaderBarProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-sm">
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-2 text-sm text-slate-600">
          <span className="text-slate-500">Search Result:</span>
          <span className="font-medium text-slate-900">{query}</span>

          <span className="text-slate-400">|</span>

          <span className="text-slate-500">Mode:</span>
          <span className="font-medium text-slate-900">
            {formatModeLabel(mode)}
          </span>

          <span className="text-slate-400">|</span>

          <span className="text-slate-500">Platform:</span>
          <span className="font-medium text-slate-900">
            {formatPlatformLabel(platform)}
          </span>

          {timestamp ? (
            <>
              <span className="text-slate-400">|</span>
              <span className="text-slate-500">Timestamp:</span>
              <span className="font-medium text-slate-900">{timestamp}</span>
            </>
          ) : null}
        </div>

        <div className="shrink-0">
          <span
            className={[
              "inline-flex rounded-full border px-3 py-1 text-sm font-medium",
              isBlocked
                ? "border-amber-200 bg-amber-50 text-amber-800"
                : "border-slate-200 bg-slate-50 text-slate-700",
            ].join(" ")}
          >
            {isBlocked ? "Blocked" : formatTierLabel(outputTier)}
          </span>
        </div>
      </div>
    </div>
  );
}