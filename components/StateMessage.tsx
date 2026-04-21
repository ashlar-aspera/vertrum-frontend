type OutputTier = "strong" | "usable" | "minimal" | "degraded";
type RequestedOutput = "default" | "hooks" | "scripts" | "ideas";

type StateMessageProps = {
  outputTier: OutputTier;
  mode: RequestedOutput;
};

function getMessage(outputTier: OutputTier, mode: RequestedOutput) {
  const isDefault = mode === "default";

  if (outputTier === "degraded") {
    return {
      title: "No Strong Direction Found",
      body: isDefault
        ? "We couldn’t identify a reliable content direction from the available data. Try refining your topic or exploring a different angle."
        : "This result is based on limited signal. Try refining your query if you want a stronger result.",
    };
  }

  if (outputTier === "minimal") {
    if (mode === "hooks") {
      return {
        title: "Focused Hook Result",
        body: "This mode returns hook-focused output rather than a full assembled content package.",
      };
    }

    if (mode === "scripts") {
      return {
        title: "Focused Script Result",
        body: "This mode returns script-focused output rather than a full assembled content package.",
      };
    }

    if (mode === "ideas") {
      return {
        title: "Focused Idea Result",
        body: "This mode returns idea-focused output rather than a full assembled content package.",
      };
    }

    return {
      title: "Limited Result",
      body: "This result is based on weaker signal. Use it as a starting point, not a finalized content strategy.",
    };
  }

  return null;
}

export default function StateMessage({
  outputTier,
  mode,
}: StateMessageProps) {
  if (outputTier !== "degraded" && outputTier !== "minimal") return null;

  const message = getMessage(outputTier, mode);
  if (!message) return null;

  return (
    <div className="rounded-2xl border border-amber-200 bg-amber-50 p-5 text-amber-900 shadow-sm">
      <div className="mb-1 text-sm font-semibold uppercase tracking-wide">
        {message.title}
      </div>

      <p className="text-sm leading-6">{message.body}</p>
    </div>
  );
}