import LoadingState from "@/components/LoadingState";

export default function Loading() {
  return <LoadingState />;
}
export default function Loading() {
  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
        <div className="rounded-3xl border border-slate-200 bg-white px-10 py-12 text-center shadow-sm">
          <div className="mb-3 text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
            Vertrum
          </div>

          <h1 className="mb-3 text-2xl font-semibold text-slate-950">
            Generating your content strategy...
          </h1>

          <p className="max-w-md text-slate-600">
            Analyzing performance patterns, assembling plays, and preparing your
            result.
          </p>
        </div>
      </div>
    </main>
  );
}