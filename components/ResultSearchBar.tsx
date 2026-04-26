"use client";

import { useEffect, useState, useTransition } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

type RequestedOutput = "default" | "hooks" | "scripts" | "ideas";

type ResultSearchBarProps = {
  defaultQuery?: string;
  defaultOutput?: RequestedOutput;
  defaultState?: string;
};

const MODE_TABS: Array<{ label: string; value: RequestedOutput }> = [
  { label: "Complete Content Package", value: "default" },
  { label: "Hooks", value: "hooks" },
  { label: "Scripts", value: "scripts" },
  { label: "Ideas", value: "ideas" },
];

export default function ResultSearchBar({
  defaultQuery = "",
  defaultOutput = "default",
  defaultState = "strong",
}: ResultSearchBarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [query, setQuery] = useState(defaultQuery);
  const [selectedMode, setSelectedMode] =
    useState<RequestedOutput>(defaultOutput);
  const [hasSubmitted, setHasSubmitted] = useState(false);
  const [isPending, startTransition] = useTransition();

  const isSearching = hasSubmitted || isPending;

  useEffect(() => {
    setQuery(defaultQuery);
    setHasSubmitted(false);
  }, [defaultQuery]);

  useEffect(() => {
    setSelectedMode(defaultOutput);
    setHasSubmitted(false);
  }, [defaultOutput]);

  function submitSearch() {
    if (isSearching) return;

    const trimmed = query.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }

    params.set("state", defaultState || "strong");
    params.set("output", selectedMode);
params.set("_request", Date.now().toString());

    setHasSubmitted(true);

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`);
    });
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submitSearch();
    }
  }

  return (
    <>
      <div className="relative z-50 px-2 pb-1 pt-2">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            {MODE_TABS.map((tab) => {
              const active = tab.value === selectedMode;

              return (
                <button
                  key={tab.value}
                  type="button"
                  onClick={() => {
                    if (!isSearching) setSelectedMode(tab.value);
                  }}
                  disabled={isSearching}
                  className={[
                    "rounded-full border px-4 py-2 text-sm font-medium transition disabled:cursor-not-allowed disabled:opacity-60",
                    active
                      ? "border-slate-900 bg-slate-900 text-white"
                      : "border-slate-200 bg-white text-slate-700 hover:bg-slate-100",
                  ].join(" ")}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          <div className="flex flex-col gap-3 md:flex-row md:items-center">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              disabled={isSearching}
              placeholder={`Search new idea... (e.g. ${defaultQuery || "motivation"})`}
              className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-lg font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400 disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500"
            />

            <button
              type="button"
              onClick={submitSearch}
              disabled={isSearching}
              className={[
                "inline-flex min-w-[112px] items-center justify-center rounded-full border px-5 py-3 text-sm font-medium transition",
                isSearching
                  ? "cursor-wait border-slate-900 bg-slate-900 text-white"
                  : "border-slate-900 bg-slate-900 text-white hover:bg-slate-800",
              ].join(" ")}
            >
              {isSearching ? "Searching..." : "Search"}
            </button>
          </div>

          {isSearching ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-600">
              Building your result. Analyzing patterns, preparing execution
              paths, and assembling your content direction.
            </div>
          ) : null}
        </div>
      </div>

      {isSearching ? (
        <div className="fixed inset-x-0 bottom-0 top-[330px] z-40 bg-slate-50/95 px-6 py-10 backdrop-blur-sm md:top-[360px]">
          <div className="mx-auto max-w-3xl rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <div className="mx-auto mb-5 h-10 w-10 animate-pulse rounded-full border border-slate-200 bg-slate-100" />

            <div className="mb-2 text-lg font-semibold text-slate-950">
              Building your Vertrum result
            </div>

            <p className="mx-auto max-w-xl text-sm leading-6 text-slate-600">
              Checking recent pattern data, preparing film-ready direction, and
              assembling the AI-ready version.
            </p>

            <div className="mt-6 grid gap-2 text-left text-sm text-slate-500 sm:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                1. Checking signals
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                2. Building outputs
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                3. Preparing result
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}