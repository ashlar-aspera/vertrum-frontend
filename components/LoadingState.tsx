export default function LoadingState() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-5 h-10 w-10 animate-pulse rounded-full border border-slate-200 bg-slate-100" />

        <div className="mb-2 text-lg font-semibold text-slate-950">
          Building your Vertrum result
        </div>

        <div className="text-sm leading-6 text-slate-600">
          Checking recent pattern data, assembling execution paths, and preparing your content direction.
        </div>

        <div className="mt-6 space-y-2 text-left text-sm text-slate-500">
          <div>• Connecting to Vertrum Analysis Engine</div>
          <div>• Reviewing available content signals</div>
          <div>• Preparing film-ready and AI-ready outputs</div>
        </div>
      </div>
    </div>
  );
}