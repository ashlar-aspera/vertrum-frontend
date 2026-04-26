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
  llmReadyContext?: LlmReadyContext | null;
};

function hasValue(value?: string | null) {
  return typeof value === "string" && value.trim().length > 0;
}

function nonEmptyList(values?: Array<string | null | undefined>) {
  return Array.isArray(values)
    ? values.filter((value): value is string => hasValue(value))
    : [];
}

function buildPromptText(context: Partial<LlmReadyContext> = {}) {
  const lines: string[] = [];
  const platform = context.targetPlatform || "the target platform";

  lines.push(`Create a short-form piece of content for ${platform}.`);

  if (hasValue(context.creatorIntent)) {
    lines.push("", "Intent:", context.creatorIntent!.trim());
  }

  if (hasValue(context.contentGoal)) {
    lines.push("", "Content goal:", context.contentGoal!.trim());
  }

  if (
    context.format &&
    (hasValue(context.format.type) ||
      hasValue(context.format.durationSeconds) ||
      hasValue(context.format.aspectRatio))
  ) {
    lines.push("", "Format:");

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

  if (
    context.hook &&
    (hasValue(context.hook.text) || hasValue(context.hook.delivery))
  ) {
    lines.push("", "Hook:");

    if (hasValue(context.hook.text)) {
      lines.push(context.hook.text!.trim());
    }

    if (hasValue(context.hook.delivery)) {
      lines.push("", "Hook delivery:", context.hook.delivery!.trim());
    }
  }

  if (context.script) {
    const structure = Array.isArray(context.script.structure)
      ? context.script.structure.filter(
          (item) => hasValue(item.section) || hasValue(item.instruction)
        )
      : [];

    if (structure.length) {
      lines.push("", "Script structure:");

      structure.forEach((item) => {
        const section = hasValue(item.section)
          ? item.section!.trim()
          : "section";

        const instruction = hasValue(item.instruction)
          ? item.instruction!.trim()
          : "";

        lines.push(`- ${section}: ${instruction}`);
      });
    }

    if (hasValue(context.script.fullText)) {
      lines.push("", "Full script:", context.script.fullText!.trim());
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
      lines.push("", "Visual direction:");

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

  if (
    context.tone &&
    (hasValue(context.tone.voice) ||
      hasValue(context.tone.energy) ||
      hasValue(context.tone.deliveryStyle))
  ) {
    lines.push("", "Tone:");

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

  const patternSignals = nonEmptyList(context.patternSignals);
  if (patternSignals.length) {
    lines.push("", "Pattern signals:");
    patternSignals.forEach((signal) => lines.push(`- ${signal}`));
  }

  const constraints = nonEmptyList(context.constraints);
  if (constraints.length) {
    lines.push("", "Constraints:");
    constraints.forEach((constraint) => lines.push(`- ${constraint}`));
  }

  const successCriteria = nonEmptyList(context.successCriteria);
  if (successCriteria.length) {
    lines.push("", "Success criteria:");
    successCriteria.forEach((criterion) => lines.push(`- ${criterion}`));
  }

  return lines.join("\n").trim();
}

function FieldCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="min-w-0 rounded-2xl border border-slate-200 bg-slate-50 p-4">
      <div className="mb-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {title}
      </div>

      <div className="min-w-0 break-words">{children}</div>
    </div>
  );
}

function SmallMeta({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="min-w-0 space-y-1">
      <div className="text-xs text-slate-500">{label}</div>
      <div className="break-words text-sm font-medium text-slate-800">
        {hasValue(value) ? value : "—"}
      </div>
    </div>
  );
}

export default function ReadyToUseAiPromptSection({
  llmReadyContext,
}: Props) {
  const safeContext = llmReadyContext ?? {};

  const [copied, setCopied] = useState(false);

  const promptText = useMemo(
    () => buildPromptText(safeContext),
    [safeContext]
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

 const scriptStructure = Array.isArray(safeContext.script?.structure)
  ? safeContext.script.structure.filter(
      (item) => hasValue(item.section) || hasValue(item.instruction)
    )
  : [];

const sceneNotes = nonEmptyList(safeContext.visualDirection?.sceneNotes);
const constraints = nonEmptyList(safeContext.constraints);
const successCriteria = nonEmptyList(safeContext.successCriteria);
const patternSignals = nonEmptyList(safeContext.patternSignals);

  return (
    <section className="w-full min-w-0 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <div className="mb-5 min-w-0">
        <div className="flex min-w-0 flex-col gap-4">
          <div className="min-w-0">
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              AI-Ready Version
            </div>

            <h2 className="break-words text-xl font-semibold leading-tight text-slate-950 sm:text-2xl">
              Prompt-ready export
            </h2>

            <p className="mt-2 max-w-prose break-words text-sm leading-6 text-slate-600">
              Copy a structured prompt version of this result for AI video,
              image, or content generation tools.
            </p>
          </div>

          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div className="text-xs leading-5 text-slate-500">
              Powered by Vertrum Content Engine
            </div>

            <button
              type="button"
              onClick={handleCopy}
              className={[
                "inline-flex w-full items-center justify-center rounded-full border px-4 py-2 text-sm font-medium transition sm:w-auto",
                copied
                  ? "border-emerald-500 bg-emerald-500 text-white"
                  : "border-slate-300 bg-white text-slate-700 hover:bg-slate-50",
              ].join(" ")}
            >
              {copied ? "Copied" : "Copy Prompt"}
            </button>
          </div>
        </div>
      </div>

      <div className="grid min-w-0 gap-4">
        {hasValue(safeContext.creatorIntent) ? (
          <FieldCard title="Intent">
            <p className="text-sm leading-6 text-slate-800">
              {safeContext.creatorIntent}
            </p>
          </FieldCard>
        ) : null}

        {hasValue(safeContext.contentGoal) ? (
          <FieldCard title="Content Goal">
            <p className="text-sm leading-6 text-slate-800">
              {safeContext.contentGoal}
            </p>
          </FieldCard>
        ) : null}

        {safeContext.format &&
        (hasValue(safeContext.format.type) ||
          hasValue(safeContext.format.durationSeconds) ||
          hasValue(safeContext.format.aspectRatio)) ? (
          <FieldCard title="Format">
            <div className="grid gap-3 sm:grid-cols-3">
              <SmallMeta label="Type" value={safeContext.format.type} />
              <SmallMeta
                label="Duration"
                value={
                  safeContext.format.durationSeconds
                    ? `${safeContext.format.durationSeconds} seconds`
                    : null
                }
              />
              <SmallMeta
                label="Aspect Ratio"
                value={safeContext.format.aspectRatio}
              />
            </div>
          </FieldCard>
        ) : null}

        {safeContext.hook &&
        (hasValue(safeContext.hook.text) ||
          hasValue(safeContext.hook.delivery)) ? (
          <FieldCard title="Hook">
            <div className="space-y-3">
              {hasValue(safeContext.hook.text) ? (
                <p className="break-words text-base font-medium leading-7 text-slate-950">
                  {safeContext.hook.text}
                </p>
              ) : null}

              {hasValue(safeContext.hook.delivery) ? (
                <p className="break-words text-sm leading-6 text-slate-600">
                  <span className="font-medium text-slate-800">Delivery:</span>{" "}
                  {safeContext.hook.delivery}
                </p>
              ) : null}
            </div>
          </FieldCard>
        ) : null}

        {scriptStructure.length ? (
          <FieldCard title="Script Structure">
            <div className="space-y-3">
              {scriptStructure.map((item, index) => (
                <div
                  key={`${item.section ?? "section"}-${index}`}
                  className="min-w-0 rounded-xl border border-slate-200 bg-white p-3"
                >
                  <div className="mb-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">
                    {item.section || "Section"}
                  </div>

                  <div className="break-words text-sm leading-6 text-slate-700">
                    {item.instruction || "—"}
                  </div>
                </div>
              ))}
            </div>
          </FieldCard>
        ) : null}

        {hasValue(safeContext.script?.fullText) ? (
          <FieldCard title="Full Script">
            <div className="whitespace-pre-wrap break-words text-sm leading-6 text-slate-800">
              {safeContext.script?.fullText}
            </div>
          </FieldCard>
        ) : null}

        {safeContext.visualDirection &&
        (hasValue(safeContext.visualDirection.style) ||
          hasValue(safeContext.visualDirection.pacing) ||
          hasValue(safeContext.visualDirection.camera) ||
          sceneNotes.length) ? (
          <FieldCard title="Visual Direction">
            <div className="grid gap-3 sm:grid-cols-3">
              <SmallMeta
                label="Style"
                value={safeContext.visualDirection.style}
              />
              <SmallMeta
                label="Pacing"
                value={safeContext.visualDirection.pacing}
              />
              <SmallMeta
                label="Camera"
                value={safeContext.visualDirection.camera}
              />
            </div>

            {sceneNotes.length ? (
              <div className="mt-4">
                <div className="mb-2 text-sm font-medium text-slate-800">
                  Scene Notes
                </div>

                <ul className="space-y-2 text-sm leading-6 text-slate-700">
                  {sceneNotes.map((note, index) => (
                    <li key={`${note}-${index}`} className="break-words">
                      • {note}
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </FieldCard>
        ) : null}

        {safeContext.tone &&
        (hasValue(safeContext.tone.voice) ||
          hasValue(safeContext.tone.energy) ||
          hasValue(safeContext.tone.deliveryStyle)) ? (
          <FieldCard title="Tone">
            <div className="grid gap-3 sm:grid-cols-3">
              <SmallMeta label="Voice" value={safeContext.tone.voice} />
              <SmallMeta label="Energy" value={safeContext.tone.energy} />
              <SmallMeta
                label="Delivery Style"
                value={safeContext.tone.deliveryStyle}
              />
            </div>
          </FieldCard>
        ) : null}

        {patternSignals.length ? (
          <FieldCard title="Pattern Signals">
            <ul className="space-y-2 text-sm leading-6 text-slate-700">
              {patternSignals.map((signal, index) => (
                <li key={`${signal}-${index}`} className="break-words">
                  • {signal}
                </li>
              ))}
            </ul>
          </FieldCard>
        ) : null}

        {constraints.length ? (
          <FieldCard title="Constraints">
            <ul className="space-y-2 text-sm leading-6 text-slate-700">
              {constraints.map((constraint, index) => (
                <li key={`${constraint}-${index}`} className="break-words">
                  • {constraint}
                </li>
              ))}
            </ul>
          </FieldCard>
        ) : null}

        {successCriteria.length ? (
          <FieldCard title="Success Criteria">
            <ul className="space-y-2 text-sm leading-6 text-slate-700">
              {successCriteria.map((criterion, index) => (
                <li key={`${criterion}-${index}`} className="break-words">
                  • {criterion}
                </li>
              ))}
            </ul>
          </FieldCard>
        ) : null}
      </div>
    </section>
  );
}