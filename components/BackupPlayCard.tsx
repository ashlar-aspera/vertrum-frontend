type BackupPlay = {
  title: string;
  angle: string;
  tag?: string;
};

type BackupPlayCardProps = {
  play: BackupPlay;
};

function formatTag(tag?: string) {
  if (!tag) return null;

  return tag.replace(/_/g, " ");
}

export default function BackupPlayCard({ play }: BackupPlayCardProps) {
  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-start justify-between gap-3">
        <div>
          <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
            Alternate Direction
          </div>
          <h3 className="text-xl font-semibold leading-tight text-slate-950">
            {play.title}
          </h3>
        </div>

        {play.tag ? (
          <span className="inline-flex rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-medium capitalize text-slate-700">
            {formatTag(play.tag)}
          </span>
        ) : null}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
          Angle
        </div>
        <p className="text-sm leading-6 text-slate-700">
          {play.angle || "No alternate angle was returned for this direction."}
        </p>
      </div>
    </article>
  );
}