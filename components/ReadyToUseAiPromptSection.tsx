"use client";

import { useMemo, useState } from "react";

type PromptStructureItem = {
  section?: string | null;
  instruction?: string | null;
};

type LlmReadyContext = {
  creatorIntent?: string | null;
  contentGoal?: string | null;
  targetPlatform?: string | null;
  chainType?: string | null;
  fallbackUsed?: boolean | null;
  format?: {
    type?: string | null;
    durationSeconds?: string | null;
    aspectRatio?: string | null;
  } | null;
  hook?: {
    text?: string | null;
    delivery?: string | null;
  } | null;
  script?: {
    structure?: PromptStructureItem[];
    fullText?: string | null;
  } | null;
  visualDirection?: {
    style?: string | null;
    pacing?: string | null;
    camera?: string | null;
    sceneNotes?: string[];
  } | null;
  tone?: {
    voice?: string | null;
    energy?: string | null;
    deliveryStyle?: string | null;
  } | null;
  contentComponents?: {
    openingHook?: string | null;
    supportingBeats?: string[];
    cta?: string | null;
  } | null;
  patternSignals?: string[];
  constraints?: string[];
  successCriteria?: string[];
};

type Props = {
  llmReadyContext: LlmReadyContext;
};

function hasValue(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

function nonEmptyList(values?: Array<string | null | undefined>) {
  return Array.isArray(values)
    ? values.filter((value): value is string => hasValue(value))
    : [];
}

function buildPromptText(context: LlmReadyContext) {
  const lines: string[] = [];

  const platform = context.targetPlatform || "the target platform";

  lines.push(`Create a short-form piece of content for ${platform}.`);

  if (hasValue(context.creatorIntent)) {
    lines.push("");
    lines.push("Intent:");
    lines.push(context.creatorIntent!.trim());
  }

  if (hasValue(context.contentGoal)) {
    lines.push("");
    lines.push("Content goal:");
    lines.push(context.contentGoal!.trim());
  }

  if (
    context.format &&
    (hasValue(context.format.type) ||
      hasValue(context.format.durationSeconds) ||
      hasValue(context.format.aspectRatio))
  ) {
    lines.push("");
    lines.push("Format:");
    if (hasValue(context.format.type)) {
      lines.push(`- Type: ${context.format.type}`);
    }
    if (hasValue(context.format.durationSeconds)) {
      lines.push(`- Duration: ${context.format.durationSeconds} seconds`);
    }
    if (hasValue(context.format.aspectRatio)) {
      lines.push(`- Aspect ratio: ${context.format.aspectRatio}`);
    }
  }

  if (context.hook && (hasValue(context.hook.text) || hasValue(context.hook.delivery))) {
    lines.push("");
    lines.push("Hook:");
    if (hasValue(context.hook.text)) {
      lines.push(context.hook.text!.trim());
    }
    if (hasValue(context.hook.delivery)) {
      lines.push("");
      lines.push("Hook delivery:");
      lines.push(context.hook.delivery!.trim());
    }
  }

  if (context.script) {
    const structure = Array.isArray(context.script.structure)
      ? context.script.structure.filter(
          (item) => hasValue(item.section) || hasValue(item.instruction)
        )
      : [];

    if (structure.length) {
      lines.push("");
      lines.push("Script structure:");
      structure.forEach((item) => {
        const section = hasValue(item.section) ? item.section!.trim() : "section";
        const instruction = hasValue(item.instruction)
          ? item.instruction!.trim()
          : "";
        lines.push(`- ${section}: ${instruction}`);
      });
    }

    if (hasValue(context.script.fullText)) {
      lines.push("");
      lines.push("Full script:");
      lines.push(context.script.fullText!.trim());
    }
  }

  if (context.visualDirection) {
    const notes = nonEmptyList(context.visualDirection.sceneNotes);

    if (
      hasValue(context.visualDirection.style) ||
      hasValue(context.visualDirection.pacing) ||
      hasValue(context.visualDirection.camera) ||
      notes.length
    ) {
      lines.push("");
      lines.push("Visual direction:");
      if (hasValue(context.visualDirection.style)) {
        lines.push(`- Style: ${context.visualDirection.style}`);
      }
      if (hasValue(context.visualDirection.pacing)) {
        lines.push(`- Pacing: ${context.visualDirection.pacing}`);
      }
      if (hasValue(context.visualDirection.camera)) {
        lines.push(`- Camera: ${context.visualDirection.camera}`);
      }
      if (notes.length) {
        lines.push("- Scene notes:");
        notes.forEach((note) => lines.push(`  - ${note}`));
      }
    }
  }

  if (context.tone) {
    if (
      hasValue(context.tone.voice) ||
      hasValue(context.tone.energy) ||
      hasValue(context.tone.deliveryStyle)
    ) {
      lines.push("");
      lines.push("Tone:");
      if (hasValue(context.tone.voice)) {
        lines.push(`- Voice: ${context.tone.voice}`);
      }
      if (hasValue(context.tone.energy)) {
        lines.push(`- Energy: ${context.tone.energy}`);
      }
      if (hasValue(context.tone.deliveryStyle)) {
        lines.push(`- Delivery style: ${context.tone.deliveryStyle}`);
      }
    }
  }

  const patternSignals = nonEmptyList(context.patternSignals);
  if (patternSignals.length) {
    lines.push("");
    lines.push("Pattern signals:");
    patternSignals.forEach((signal) => lines.push(`- ${signal}`));
  }

  const constraints = nonEmptyList(context.constraints);
  if (constraints.length) {
    lines.push("");
    lines.push("Constraints:");
    constraints.forEach((constraint) => lines.push(`- ${constraint}`));
  }

  const successCriteria = nonEmptyList(context.successCriteria);
  if (successCriteria.length) {
    lines.push("");
    lines.push("Success criteria:");
    successCriteria.forEach((criterion) => lines.push(`- ${criterion}`));
  }

  return lines.join("\n").trim();
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
      <div className="mb-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
        {title}
      </div>
      {children}
    </div>
  );
}

export default function ReadyToUseAiPromptSection({
  llmReadyContext,
}: Props) {
  const [copied, setCopied] = useState(false);

  const promptText = useMemo(
    () => buildPromptText(llmReadyContext),
    [llmReadyContext]
  );

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  }

  const scriptStructure = Array.isArray(llmReadyContext.script?.structure)
    ? llmReadyContext.script!.structure!.filter(
        (item) => hasValue(item.section) || hasValue(item.instruction)
      )
    : [];

  const sceneNotes = nonEmptyList(llmReadyContext.visualDirection?.sceneNotes);
  const constraints = nonEmptyList(llmReadyContext.constraints);
  const successCriteria = nonEmptyList(llmReadyContext.successCriteria);
  const patternSignals = nonEmptyList(llmReadyContext.patternSignals);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
      <div className="mb-6">
  <div className="flex items-start justify-between gap-6">
    <div className="min-w-0 flex-1">
      <div className="mb-2 text-sm font-medium uppercase tracking-[0.14em] text-slate-500">
        Ready-to-Use AI Prompt
      </div>

      <h2 className="text-2xl font-semibold text-slate-950">
        Prompt-ready export for AI creators
      </h2>

      <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600">
        This section turns the search result into a paste-ready prompt for use in other AI tools or generators.
      </p>
    </div>

    <div className="flex shrink-0 flex-col items-end">
      <button
        type="button"
        onClick={handleCopy}
        className={`inline-flex items-center rounded-full border px-4 py-2 text-sm font-medium transition ${
          copied
            ? "border-emerald-500 bg-emerald-500 text-white"
            : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
        }`}
      >
        {copied ? "Copied" : "Copy Prompt"}
      </button>

      <div className="mt-2 text-right text-xs text-slate-500 tracking-wide">
        Powered by Vertrum Content Engine
      </div>
    </div>
  </div>
</div>

      <div className="grid gap-5">
        {hasValue(llmReadyContext.creatorIntent) ? (
          <Section title="Intent">
            <p className="text-base leading-7 text-slate-800">
              {llmReadyContext.creatorIntent}
            </p>
          </Section>
        ) : null}

        {hasValue(llmReadyContext.contentGoal) ? (
          <Section title="Content Goal">
            <p className="text-base leading-7 text-slate-800">
              {llmReadyContext.contentGoal}
            </p>
          </Section>
        ) : null}

        {llmReadyContext.format &&
        (hasValue(llmReadyContext.format.type) ||
          hasValue(llmReadyContext.format.durationSeconds) ||
          hasValue(llmReadyContext.format.aspectRatio)) ? (
          <Section title="Format">
            <div className="grid gap-4 text-sm text-slate-700 md:grid-cols-3">
              <div className="space-y-1">
                <div className="text-slate-500">Type</div>
                <div>{llmReadyContext.format.type || "—"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-500">Duration</div>
                <div>
                  {llmReadyContext.format.durationSeconds
                    ? `${llmReadyContext.format.durationSeconds} seconds`
                    : "—"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-500">Aspect Ratio</div>
                <div>{llmReadyContext.format.aspectRatio || "—"}</div>
              </div>
            </div>
          </Section>
        ) : null}

        {llmReadyContext.hook &&
        (hasValue(llmReadyContext.hook.text) ||
          hasValue(llmReadyContext.hook.delivery)) ? (
          <Section title="Hook">
            <div className="space-y-3">
              {hasValue(llmReadyContext.hook.text) ? (
                <p className="text-lg font-medium leading-7 text-slate-950">
                  {llmReadyContext.hook.text}
                </p>
              ) : null}

              {hasValue(llmReadyContext.hook.delivery) ? (
                <div className="text-sm leading-6 text-slate-600">
                  <span className="font-medium text-slate-800">Delivery:</span>{" "}
                  {llmReadyContext.hook.delivery}
                </div>
              ) : null}
            </div>
          </Section>
        ) : null}

        {scriptStructure.length ? (
          <Section title="Script Structure">
            <div className="space-y-3">
              {scriptStructure.map((item, index) => (
                <div
                  key={`${item.section ?? "section"}-${index}`}
                  className="rounded-xl border border-slate-200 bg-white p-4"
                >
                  <div className="mb-1 text-sm font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {item.section || "Section"}
                  </div>
                  <div className="text-sm leading-6 text-slate-700">
                    {item.instruction || "—"}
                  </div>
                </div>
              ))}
            </div>
          </Section>
        ) : null}

        {hasValue(llmReadyContext.script?.fullText) ? (
          <Section title="Full Script">
            <div className="whitespace-pre-wrap text-base leading-7 text-slate-800">
              {llmReadyContext.script?.fullText}
            </div>
          </Section>
        ) : null}

        {llmReadyContext.visualDirection &&
        (hasValue(llmReadyContext.visualDirection.style) ||
          hasValue(llmReadyContext.visualDirection.pacing) ||
          hasValue(llmReadyContext.visualDirection.camera) ||
          sceneNotes.length) ? (
          <Section title="Visual Direction">
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-1 text-sm text-slate-700">
                <div className="text-slate-500">Style</div>
                <div>{llmReadyContext.visualDirection.style || "—"}</div>
              </div>

              <div className="space-y-1 text-sm text-slate-700">
                <div className="text-slate-500">Pacing</div>
                <div>{llmReadyContext.visualDirection.pacing || "—"}</div>
              </div>

              <div className="space-y-1 text-sm text-slate-700">
                <div className="text-slate-500">Camera</div>
                <div>{llmReadyContext.visualDirection.camera || "—"}</div>
              </div>
            </div>

            {sceneNotes.length ? (
              <div className="mt-4">
                <div className="mb-2 text-sm font-medium text-slate-800">
                  Scene Notes
                </div>
                <ul className="space-y-2 text-sm leading-6 text-slate-700">
                  {sceneNotes.map((note, index) => (
                    <li key={`${note}-${index}`}>• {note}</li>
                  ))}
                </ul>
              </div>
            ) : null}
          </Section>
        ) : null}

        {llmReadyContext.tone &&
        (hasValue(llmReadyContext.tone.voice) ||
          hasValue(llmReadyContext.tone.energy) ||
          hasValue(llmReadyContext.tone.deliveryStyle)) ? (
          <Section title="Tone">
            <div className="grid gap-4 text-sm text-slate-700 md:grid-cols-3">
              <div className="space-y-1">
                <div className="text-slate-500">Voice</div>
                <div>{llmReadyContext.tone.voice || "—"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-500">Energy</div>
                <div>{llmReadyContext.tone.energy || "—"}</div>
              </div>
              <div className="space-y-1">
                <div className="text-slate-500">Delivery Style</div>
                <div>{llmReadyContext.tone.deliveryStyle || "—"}</div>
              </div>
            </div>
          </Section>
        ) : null}

        {patternSignals.length ? (
          <Section title="Pattern Signals">
            <ul className="space-y-2 text-sm leading-6 text-slate-700">
              {patternSignals.map((signal, index) => (
                <li key={`${signal}-${index}`}>• {signal}</li>
              ))}
            </ul>
          </Section>
        ) : null}

        {constraints.length ? (
          <Section title="Constraints">
            <ul className="space-y-2 text-sm leading-6 text-slate-700">
              {constraints.map((constraint, index) => (
                <li key={`${constraint}-${index}`}>• {constraint}</li>
              ))}
            </ul>
          </Section>
        ) : null}

        {successCriteria.length ? (
          <Section title="Success Criteria">
            <ul className="space-y-2 text-sm leading-6 text-slate-700">
              {successCriteria.map((criterion, index) => (
                <li key={`${criterion}-${index}`}>• {criterion}</li>
              ))}
            </ul>
          </Section>
        ) : null}
      </div>
    </section>
  );
}