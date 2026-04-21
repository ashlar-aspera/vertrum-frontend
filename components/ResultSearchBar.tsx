"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    setQuery(defaultQuery);
  }, [defaultQuery]);

  useEffect(() => {
    setSelectedMode(defaultOutput);
  }, [defaultOutput]);

  function submitSearch() {
    const trimmed = query.trim();
    const params = new URLSearchParams(searchParams.toString());

    if (trimmed) {
      params.set("q", trimmed);
    } else {
      params.delete("q");
    }

    params.set("state", defaultState || "strong");
    params.set("output", selectedMode);

    router.push(`${pathname}?${params.toString()}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter") {
      submitSearch();
    }
  }

  return (
    <div className="px-2 pb-1 pt-2">
      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
          {MODE_TABS.map((tab) => {
            const active = tab.value === selectedMode;

            return (
              <button
                key={tab.value}
                type="button"
                onClick={() => setSelectedMode(tab.value)}
                className={[
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
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
            placeholder={`Search new idea... (e.g. ${defaultQuery || "motivation"})`}
            className="w-full rounded-full border border-slate-200 bg-white px-5 py-3 text-lg font-medium text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-slate-400"
          />

          <button
            type="button"
            onClick={submitSearch}
            className="rounded-full border border-slate-900 bg-slate-900 px-5 py-3 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            Search
          </button>
        </div>
      </div>
    </div>
  );
}