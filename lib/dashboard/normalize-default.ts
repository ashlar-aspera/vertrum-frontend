import {
  AnyRecord,
  DashboardDirective,
  DashboardNormalizedResponse,
  DashboardSupportingOptions,
  DashboardSystemStatus,
  LlmReadyContext,
  OutputTier,
  PlanType,
  RequestedOutput,
  asArray,
  asBooleanOrNull,
  asNullableString,
  asNumber,
  asNumberOrNull,
  asObject,
  asString,
  buildTrustStatus,
  normalizeGating,
  resolveBestTimestamp,
  splitScriptToBody,
} from "@/lib/dashboard/utils";

function normalizeExecutionContext(value: unknown) {
  const raw = asObject(value);

  if (!Object.keys(raw).length) return undefined;

  return {
    formatType: asString(raw.format_type, "—"),
    deliveryStyle: asString(raw.delivery_style, "—"),
    pacing: asString(raw.pacing, "—"),
    visualStructure: asString(raw.visual_structure, "—"),
    tone: asString(raw.tone, "—"),
  };
}

function normalizeLlmReadyContext(value: unknown): LlmReadyContext | null {
  const raw = asObject(value);
  if (!Object.keys(raw).length) return null;

  const formatRaw = asObject(raw.format);
  const hookRaw = asObject(raw.hook);
  const scriptRaw = asObject(raw.script);
  const visualDirectionRaw = asObject(raw.visual_direction);
  const toneRaw = asObject(raw.tone);
  const contentComponentsRaw = asObject(raw.content_components);
  const sourceLineageRaw = asObject(raw.source_lineage);

  return {
    creatorIntent: asNullableString(raw.creator_intent),
    contentGoal: asNullableString(raw.content_goal),
    targetPlatform:
      asNullableString(raw.target_platform) ?? asNullableString(raw.platform),
    chainType: asNullableString(raw.chain_type),
    fallbackUsed: asBooleanOrNull(raw.fallback_used),

    format:
      Object.keys(formatRaw).length || raw.format_type
        ? {
            type:
              asNullableString(formatRaw.type) ??
              asNullableString(raw.format_type),
            durationSeconds: asNullableString(formatRaw.duration_seconds),
            aspectRatio: asNullableString(formatRaw.aspect_ratio),
          }
        : null,

    hook:
      Object.keys(hookRaw).length || raw.hook_text
        ? {
            text:
              asNullableString(hookRaw.text) ?? asNullableString(raw.hook_text),
            delivery: asNullableString(hookRaw.delivery),
          }
        : null,

    script:
      Object.keys(scriptRaw).length || raw.script_text
        ? {
            structure: asArray<AnyRecord>(scriptRaw.structure).map((item) => ({
              section: asNullableString(item.section),
              instruction: asNullableString(item.instruction),
            })),
            fullText:
              asNullableString(scriptRaw.full_text) ??
              asNullableString(raw.script_text),
          }
        : null,

    visualDirection:
      Object.keys(visualDirectionRaw).length ||
      raw.format_type ||
      raw.pacing ||
      raw.delivery_style
        ? {
            style:
              asNullableString(visualDirectionRaw.style) ??
              asNullableString(raw.format_type),
            pacing:
              asNullableString(visualDirectionRaw.pacing) ??
              asNullableString(raw.pacing),
            camera: asNullableString(visualDirectionRaw.camera),
            sceneNotes: asArray<string>(visualDirectionRaw.scene_notes),
          }
        : null,

    tone:
      Object.keys(toneRaw).length || raw.tone || raw.delivery_style || raw.pacing
        ? {
            voice:
              asNullableString(toneRaw.voice) ?? asNullableString(raw.tone),
            energy:
              asNullableString(toneRaw.energy) ?? asNullableString(raw.pacing),
            deliveryStyle:
              asNullableString(toneRaw.delivery_style) ??
              asNullableString(raw.delivery_style),
          }
        : null,

    contentComponents:
      Object.keys(contentComponentsRaw).length
        ? {
            openingHook: asNullableString(contentComponentsRaw.opening_hook),
            supportingBeats: asArray<string>(
              contentComponentsRaw.supporting_beats
            ),
            cta: asNullableString(contentComponentsRaw.cta),
          }
        : null,

    sourceLineage:
      Object.keys(sourceLineageRaw).length
        ? {
            sourceInsightId: asNullableString(
              sourceLineageRaw.source_insight_id
            ),
            sourceHookId: asNullableString(sourceLineageRaw.source_hook_id),
            sourceScriptId: asNullableString(sourceLineageRaw.source_script_id),
            sourcePostIds: asArray<string>(sourceLineageRaw.source_post_ids),
          }
        : null,

    patternSignals: asArray<string>(raw.pattern_signals),
    constraints: asArray<string>(raw.constraints),
    successCriteria: asArray<string>(raw.success_criteria),
  };
}

function normalizeDirective(value: unknown): DashboardDirective | null {
  const raw = asObject(value);
  if (!Object.keys(raw).length) return null;

  const queryContextRaw = asObject(raw.query_context);
  const executionContextRaw = asObject(raw.execution_context);
  const creativeConstraintsRaw = asObject(raw.creative_constraints);
  const aiReadyOutputRaw = asObject(raw.ai_ready_output);
  const contentComponentsRaw = asObject(raw.content_components);
  const selectionMetadataRaw = asObject(raw.selection_metadata);
  const sourceLineageRaw = asObject(raw.source_lineage);
  const aiReadyContext = asObject(aiReadyOutputRaw.context);

  return {
    version: asString(raw.version, "directive_contract_v2"),
    directiveId: asString(raw.directive_id, ""),
    requestFingerprint: asString(raw.request_fingerprint, ""),
    generatedAt: asNullableString(raw.generated_at),

    directiveType: asString(raw.directive_type, "unknown"),
    platform: asString(raw.platform, "tiktok"),

    queryContext: {
      queryTerm: asNullableString(queryContextRaw.query_term),
      rawQuery: asNullableString(queryContextRaw.raw_query),
      requestedOutput: asNullableString(queryContextRaw.requested_output),
      audienceOrNiche: asNullableString(queryContextRaw.audience_or_niche),
    },

    title: asString(raw.title, "Recommended Content Direction"),
    coreDecision: asString(raw.core_decision, ""),
    whatToCreate: asString(raw.what_to_create, ""),

    recommendedLength: asNullableString(raw.recommended_length),
    openingMove: asNullableString(raw.opening_move),

    hook: asString(raw.hook, ""),
    script: asString(raw.script, ""),

    executionContext: normalizeExecutionContext(executionContextRaw),

    executionSteps: asArray<string>(raw.execution_steps),

    creativeConstraints: {
      avoid: asArray<string>(creativeConstraintsRaw.avoid),
      mustInclude: asArray<string>(creativeConstraintsRaw.must_include),
      styleNotes: asArray<string>(creativeConstraintsRaw.style_notes),
    },

    aiReadyOutput: {
      displayLabel: asString(
        aiReadyOutputRaw.display_label,
        "Ready-to-Use AI Prompt"
      ),
      context: Object.keys(aiReadyContext).length ? aiReadyContext : null,
    },

    contentComponents: {
      cta: asNullableString(contentComponentsRaw.cta),
      hashtags: asArray<string>(contentComponentsRaw.hashtags),
      openingHook: asNullableString(contentComponentsRaw.opening_hook),
      supportingBeats: asArray<string>(contentComponentsRaw.supporting_beats),
      patternType: asNullableString(contentComponentsRaw.pattern_type),
    },

    whyThisWorks: asNullableString(raw.why_this_works),
    decisionRationale: asNullableString(raw.decision_rationale),

    confidenceLabel: asNullableString(raw.confidence_label),
    readiness: asNullableString(raw.readiness),

    selectionMetadata: {
      rank: asNumberOrNull(selectionMetadataRaw.rank),
      rankScore: asNumberOrNull(selectionMetadataRaw.rank_score),
      candidateCount: asNumber(selectionMetadataRaw.candidate_count),
      validCandidateCount: asNumber(selectionMetadataRaw.valid_candidate_count),
      selectionReason: asNullableString(selectionMetadataRaw.selection_reason),
      selectionFactors: asArray<string>(selectionMetadataRaw.selection_factors),
    },

    sourceLineage: {
      sourceInsightId: asNullableString(sourceLineageRaw.source_insight_id),
      sourceHookId: asNullableString(sourceLineageRaw.source_hook_id),
      sourceScriptId: asNullableString(sourceLineageRaw.source_script_id),
      sourcePostIds: asArray<string>(sourceLineageRaw.source_post_ids),
    },
  };
}

function normalizeSupportingOptions(
  value: unknown,
  finalOutput: AnyRecord
): DashboardSupportingOptions {
  const raw = asObject(value);

  const alternateDirections = asArray<AnyRecord>(
    raw.alternate_directions
  ).map((direction) => {
    const selectionReasonObject = asObject(direction.selection_reason);
    const selectionReasonArray = asArray<string>(direction.selection_reason);

    return {
      title: asString(direction.title, "Alternate Direction"),
      hook: asString(direction.hook, ""),
      angle: asString(direction.angle, ""),
      sourceInsightId: asNullableString(direction.source_insight_id),
      sourceHookId: asNullableString(direction.source_hook_id),
      sourceScriptId: asNullableString(direction.source_script_id),
      patternFamily: asNullableString(direction.pattern_family),
      patternInsight: asNullableString(direction.pattern_insight),
      selectionReason: Object.keys(selectionReasonObject).length
        ? selectionReasonObject
        : selectionReasonArray.length
          ? selectionReasonArray
          : null,
    };
  });

  const ideasFromV2 = asArray<AnyRecord>(raw.idea_bank);
  const ideasFromLegacy = asArray<AnyRecord>(finalOutput.idea_bank);
  const ideas = ideasFromV2.length ? ideasFromV2 : ideasFromLegacy;

  return {
    alternateDirections,
    ideaBank: ideas.map((idea, index) => ({
      id: asNullableString(idea.idea_id ?? idea.id) ?? `idea-${index + 1}`,
      label: asString(idea.label || idea.text, "Untitled idea"),
      text: asString(idea.text, ""),
      type: asNullableString(idea.idea_type ?? idea.type),
      angle: asNullableString(idea.angle),
    })),
  };
}

function normalizeSystemStatus(value: unknown): DashboardSystemStatus | null {
  const raw = asObject(value);
  if (!Object.keys(raw).length) return null;

  const trustStatusRaw = asObject(raw.trust_status);
  const countsRaw = asObject(raw.counts);

  return {
    outputTier: asString(raw.output_tier, "usable") as OutputTier,
    trustStatus: {
      freshness: asNullableString(trustStatusRaw.freshness),
      analyzedAt: asNullableString(trustStatusRaw.analyzed_at),
      createdAt: asNullableString(trustStatusRaw.created_at),
      platform: asString(trustStatusRaw.platform, "tiktok"),
      chainType: asNullableString(trustStatusRaw.chain_type),
    },
    warnings: asArray<string>(raw.warnings),
    flags: asObject(raw.flags),
    counts: {
      candidateCount: asNumber(countsRaw.candidate_count),
      validCandidateCount: asNumber(countsRaw.valid_candidate_count),
      rankedCandidateCount: asNumber(countsRaw.ranked_candidate_count),
      backupPlayCount: asNumber(countsRaw.backup_play_count),
      ideaBankCount: asNumber(countsRaw.idea_bank_count),
    },
  };
}

export function normalizeDefaultResponse(
  root: AnyRecord,
  queryFallback: string,
  mode: RequestedOutput,
  fallbackPlanType: PlanType
): DashboardNormalizedResponse {
  const finalOutput = asObject(root.final_output);
  const meta = asObject(finalOutput.meta);
  const primary = finalOutput.primary_play
    ? asObject(finalOutput.primary_play)
    : null;

  const outputTier = (asString(meta.output_tier, "degraded") ||
    "degraded") as OutputTier;

  const summary =
    asString(meta.summary) ||
    asString(finalOutput.meta_summary) ||
    "No validated primary content direction is available.";

  const timestamp = resolveBestTimestamp(root);
  const primaryChainType =
    asNullableString(root.primary_chain_type) ??
    asNullableString(meta.primary_chain_type);

  const platform = asString(finalOutput.platform || root.platform, "tiktok");

  const primaryHookText =
    asString(asObject(primary?.hook).text) || asString(primary?.hook_text);

  const primaryScriptText =
    asString(asObject(primary?.script).text) || asString(primary?.script_text);

  return {
    success: true,
    status: "ok",
    mode,
    query: asString(finalOutput.query_term || root.query_term, queryFallback),
    platform,
    outputTier,
    timestamp,
    gating: normalizeGating(root, mode, fallbackPlanType),
    trustStatus: buildTrustStatus({
      outputTier,
      platform,
      timestamp,
      chainType: primaryChainType,
    }),

    directive: normalizeDirective(finalOutput.directive),
    supportingOptions: normalizeSupportingOptions(
      finalOutput.supporting_options,
      finalOutput
    ),
    systemStatus: normalizeSystemStatus(finalOutput.system_status),

    primaryPlay: primary
      ? {
          title: asString(primary.title, "Untitled"),
          hook: primaryHookText,
          body: splitScriptToBody(primaryScriptText),
          executionContext: normalizeExecutionContext(primary.execution_context),
          patternInsight: asString(primary.pattern_insight) || undefined,
          whyThisWorks: asString(primary.why_this_play) || undefined,
          llmReadyContext: normalizeLlmReadyContext(primary.llm_ready_context),
        }
      : null,

    backupPlays: asArray<AnyRecord>(finalOutput.backup_plays).map((play) => ({
      title: asString(play.title, "Untitled"),
      angle:
        asString(play.pattern_insight) ||
        asString(play.why_this_play) ||
        asString(play.hook_text) ||
        "No angle available",
      tag:
        asNullableString(asObject(play.selection_basis).selected_chain_type) ??
        asNullableString(play.play_type) ??
        undefined,
    })),

    ideaBank: asArray<AnyRecord>(finalOutput.idea_bank).map((idea, index) => ({
      id: asNullableString(idea.idea_id ?? idea.id) ?? `idea-${index + 1}`,
      label: asString(idea.label || idea.text, "Untitled idea"),
      text: asString(idea.text, ""),
      type: asNullableString(idea.idea_type ?? idea.type),
      angle: asNullableString(idea.angle),
    })),

    hooks: [],
    scripts: [],
    summary,

    debug: {
      candidateCount: asNumber(root.candidate_count ?? meta.candidate_count),
      validCandidateCount: asNumber(
        root.valid_candidate_count ?? meta.valid_candidate_count
      ),
      rankedCandidateCount: asNumber(
        root.ranked_candidate_count ?? meta.ranked_candidate_count
      ),
      primaryRankScore: asNumberOrNull(
        root.primary_rank_score ?? meta.primary_rank_score
      ),
      primaryChainType,
      flags: asObject(root.flags),
      rankingVisibility: asObject(root.ranking_visibility),
      sourceInsightId: asNullableString(root.source_insight_id),
      sourceHookId: asNullableString(root.source_hook_id),
      sourceScriptId: asNullableString(root.source_script_id),
    },
  };
}