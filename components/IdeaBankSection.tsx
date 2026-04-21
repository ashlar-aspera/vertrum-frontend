type IdeaItem = {
  id: string | null;
  label: string;
  text: string;
  type: string | null;
  angle: string | null;
};

type IdeaBankSectionProps = {
  ideas: Array<IdeaItem | string>;
  title?: string;
};

function normalizeIdea(idea: IdeaItem | string, index: number): IdeaItem {
  if (typeof idea === "string") {
    const value = idea.trim();

    return {
      id: `idea-${index + 1}`,
      label: value || "Untitled idea",
      text: value,
      type: null,
      angle: null,
    };
  }

  const label =
    typeof idea.label === "string" && idea.label.trim()
      ? idea.label.trim()
      : typeof idea.text === "string" && idea.text.trim()
        ? idea.text.trim()
        : "Untitled idea";

  const text =
    typeof idea.text === "string" && idea.text.trim()
      ? idea.text.trim()
      : typeof idea.label === "string" && idea.label.trim()
        ? idea.label.trim()
        : "";

  return {
    id: idea.id ?? `idea-${index + 1}`,
    label,
    text,
    type:
      typeof idea.type === "string" && idea.type.trim()
        ? idea.type.trim()
        : null,
    angle:
      typeof idea.angle === "string" && idea.angle.trim()
        ? idea.angle.trim()
        : null,
  };
}

export default function IdeaBankSection({
  ideas,
  title = "Idea Bank",
}: IdeaBankSectionProps) {
  const normalizedIdeas = Array.isArray(ideas)
    ? ideas
        .map(normalizeIdea)
        .filter((idea) => (idea.label || idea.text).trim().length > 0)
    : [];

  if (!normalizedIdeas.length) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
        {title}
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {normalizedIdeas.map((idea, index) => {
          const primaryText = idea.label || idea.text;
          const showSecondaryText =
            idea.label.trim() &&
            idea.text.trim() &&
            idea.label.trim() !== idea.text.trim();

          const showTypeTag =
            typeof idea.type === "string" &&
            idea.type.trim().length > 0 &&
            idea.type.trim().toLowerCase() !== "idea";

          const showAngleTag =
            typeof idea.angle === "string" && idea.angle.trim().length > 0;

          return (
            <article
              key={idea.id ?? `idea-${index}`}
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="text-base font-medium leading-6 text-slate-900">
                {primaryText}
              </div>

              {showSecondaryText ? (
                <div className="mt-2 text-sm leading-6 text-slate-600">
                  {idea.text}
                </div>
              ) : null}

              {(showTypeTag || showAngleTag) ? (
                <div className="mt-3 flex flex-wrap gap-2">
                  {showTypeTag ? (
                    <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                      {idea.type}
                    </span>
                  ) : null}

                  {showAngleTag ? (
                    <span className="inline-flex rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium text-slate-700">
                      {idea.angle}
                    </span>
                  ) : null}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}