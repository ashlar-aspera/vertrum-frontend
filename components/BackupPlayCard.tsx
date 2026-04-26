type BackupPlay = {
  title: string;
  angle: string;
  tag?: string;
};

type BackupPlayCardProps = {
  play: BackupPlay;
};

function hasValue(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

function formatTag(tag?: string) {
  if (!hasValue(tag)) return null;

  return tag!.replace(/_/g, " ");
}

export default function BackupPlayCard({ play }: BackupPlayCardProps) {
  const tag = formatTag(play.tag);

  return (
    <article className="group rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-slate-300 hover:shadow-md">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Alternate Strategy
          </div>

          <h3 className="break-words text-lg font-semibold leading-tight text-slate-950">
            {play.title || "Untitled alternate strategy"}
          </h3>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
          Why this direction
        </div>

        <p className="break-words text-sm leading-6 text-slate-700">
          {play.angle || "No alternate angle was returned for this direction."}
        </p>
      </div>

      {tag ? (
        <div className="mt-4">
          <span className="inline-flex max-w-full rounded-full border border-slate-200 bg-white px-3 py-1 text-xs font-medium capitalize text-slate-700">
            <span className="truncate">{tag}</span>
          </span>
        </div>
      ) : null}
    </article>
  );
}