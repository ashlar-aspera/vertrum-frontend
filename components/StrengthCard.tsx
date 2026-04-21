type StrengthCardProps = {
  score: number;
  chainType?: string | null;
};

function formatScore(score: number) {
  if (score <= 1) return Math.round(score * 100);
  return Math.round(score);
}

function getConfidenceLabel(score: number) {
  const percent = formatScore(score);

  if (percent >= 75) return "High Confidence";
  if (percent >= 55) return "Moderate";
  if (percent > 0) return "Low Signal";
  return "Unavailable";
}

function formatChainType(value?: string | null) {
  if (!value || value === "—") return "—";
  return value.replace(/_/g, " ");
}

export default function StrengthCard({
  score,
  chainType,
}: StrengthCardProps) {
  const percent = formatScore(score);

  return (
    <div className="px-2 py-2">
      <div className="grid gap-3 rounded-xl bg-slate-100 px-4 py-3 md:grid-cols-3">
        <div>
          <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
            Strength
          </div>
          <div className="text-2xl font-semibold text-slate-950">
            {percent}%
          </div>
        </div>

        <div>
          <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
            Confidence
          </div>
          <div className="text-base font-medium text-slate-800">
            {getConfidenceLabel(score)}
          </div>
        </div>

        <div>
          <div className="mb-1 text-[10px] font-medium uppercase tracking-[0.2em] text-slate-400">
            Chain Type
          </div>
          <div className="text-base font-medium capitalize text-slate-800">
            {formatChainType(chainType)}
          </div>
        </div>
      </div>
    </div>
  );
}