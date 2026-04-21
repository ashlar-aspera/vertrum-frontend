type ResultStatusStripProps = {
  freshnessLabel?: string | null;
  analyzedAgoLabel?: string | null;
  platformLabel?: string | null;
  chainLabel?: string | null;
};

function Item({ value }: { value: string }) {
  return (
    <div className="inline-flex items-center rounded-full border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 shadow-sm">
      {value}
    </div>
  );
}

export default function ResultStatusStrip({
  freshnessLabel,
  analyzedAgoLabel,
  chainLabel,
}: ResultStatusStripProps) {
  const items = [freshnessLabel, analyzedAgoLabel, chainLabel].filter(
    (value): value is string => Boolean(value && value.trim())
  );

  if (!items.length) return null;

  return (
    <div className="mb-6 flex flex-wrap items-center justify-center gap-2">
      {items.map((item, index) => (
        <Item key={`${item}-${index}`} value={item} />
      ))}
    </div>
  );
}