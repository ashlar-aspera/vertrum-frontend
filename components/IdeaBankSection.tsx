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

function cleanString(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0
    ? value.trim()
    : null;
}

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
    cleanString(idea.label) ?? cleanString(idea.text) ?? "Untitled idea";

  const text = cleanString(idea.text) ?? cleanString(idea.label) ?? "";

  return {
    id: idea.id ?? `idea-${index + 1}`,
    label,
    text,
    type: cleanString(idea.type),
    angle: cleanString(idea.angle),
  };
}

function hasValue(value?: string | null) {
  return cleanString(value) !== null;
}

function formatTag(value: string) {
  return value.replace(/_/g, " ");
}

export default function IdeaBankSection({
  ideas,
  title = "Idea Bank",
}: IdeaBankSectionProps) {
  const normalizedIdeas = Array.isArray(ideas)
    ? ideas
        .map(normalizeIdea)
        .filter((idea) => hasValue(idea.label) || hasValue(idea.text))
    : [];

  if (!normalizedIdeas.length) return null;

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
            {title}
          </div>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Additional content angles generated from the same search context.
          </p>
        </div>

        <div className="text-xs text-slate-400">
          {normalizedIdeas.length} saved-ready ideas
        </div>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {normalizedIdeas.map((idea, index) => {
          const primaryText = idea.label || idea.text;

          const showSecondaryText =
            hasValue(idea.label) &&
            hasValue(idea.text) &&
            idea.label.trim() !== idea.text.trim();

          const tags = [idea.type, idea.angle]
            .filter((value): value is string => hasValue(value))
            .filter((value) => value.trim().toLowerCase() !== "idea");

          return (
            <article
              key={idea.id ?? `idea-${index}`}
              className="group rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:border-slate-300 hover:bg-white hover:shadow-sm"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <div className="break-words text-base font-semibold leading-6 text-slate-950">
                    {primaryText}
                  </div>

                  {showSecondaryText ? (
                    <div className="mt-2 break-words text-sm leading-6 text-slate-600">
                      {idea.text}
                    </div>
                  ) : null}
                </div>
              </div>

              {tags.length ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {tags.map((tag, tagIndex) => (
                    <span
                      key={`${tag}-${tagIndex}`}
                      className="inline-flex max-w-full rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium capitalize text-slate-700"
                    >
                      <span className="truncate">{formatTag(tag)}</span>
                    </span>
                  ))}
                </div>
              ) : null}
            </article>
          );
        })}
      </div>
    </section>
  );
}