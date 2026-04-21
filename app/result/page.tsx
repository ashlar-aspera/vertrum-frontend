import BackupPlayCard from "@/components/BackupPlayCard";
import DebugDrawer from "@/components/DebugDrawer";
import HeaderBar from "@/components/HeaderBar";
import IdeaBankSection from "@/components/IdeaBankSection";
import PrimaryPlayCard from "@/components/PrimaryPlayCard";
import ResultSearchBar from "@/components/ResultSearchBar";
import StateMessage from "@/components/StateMessage";
import StrengthCard from "@/components/StrengthCard";

type PageProps = {
  searchParams: Promise<{ state?: string; q?: string }>;
};

async function fetchDashboardData(query: string, state: string) {
  const url = `http://localhost:3001/api/dashboard?q=${encodeURIComponent(
    query
  )}&state=${state}`;

  const res = await fetch(url, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch dashboard data: ${res.status}`);
  }

  return res.json();
}

export default async function ResultPage({ searchParams }: PageProps) {
  const params = await searchParams;

  const state = params.state === "degraded" ? "degraded" : "strong";
  const query = params.q || "motivation";

  const data = await fetchDashboardData(query, state);
  const vm = data.viewModel;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <div className="mx-auto max-w-7xl">
        <ResultSearchBar defaultQuery={vm.query} />

        <HeaderBar
          query={vm.query}
          platform={vm.platform}
          outputTier={vm.outputTier}
          timestamp={vm.isDegraded ? "No validated result" : "Fresh analysis"}
        />

        {(vm.outputTier === "degraded" || vm.outputTier === "minimal") && (
          <div className="mb-6">
            <StateMessage mode={vm.mode} outputTier={vm.outputTier} />
          </div>
        )}

        <div className="mt-1 mb-4">
          <StrengthCard
            score={
              typeof vm.debug.primaryRankScore === "number"
                ? Math.min(vm.debug.primaryRankScore / 100, 1)
                : 0
            }
            chainType={vm.debug.primaryChainType || "full_chain"}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          <div>
            {vm.primary ? (
              <PrimaryPlayCard primaryPlay={vm.primary} />
            ) : (
              <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
                <div className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
                  Available Direction
                </div>
                <h2 className="mb-3 text-2xl font-semibold text-slate-950">
                  No validated primary play
                </h2>
                <p className="max-w-2xl text-slate-600">
                  The current candidate set did not produce a trusted primary
                  recommendation. Review supporting ideas below rather than
                  treating this result as a broken state.
                </p>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
              Backup Plays
            </div>

            {vm.backups.length ? (
              vm.backups.map((play: any, index: number) => (
                <BackupPlayCard key={index} play={play} />
              ))
            ) : (
              <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-600 shadow-sm">
                No backup plays available for this result.
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <IdeaBankSection ideas={vm.ideas} />
        </div>

        <div className="mt-6">
          <DebugDrawer debug={vm.debug} />
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <a
            href="/result?state=strong&q=motivation"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            View strong state
          </a>

          <a
            href="/result?state=degraded&q=motivation"
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100"
          >
            View degraded state
          </a>
        </div>
      </div>
    </main>
  );
}