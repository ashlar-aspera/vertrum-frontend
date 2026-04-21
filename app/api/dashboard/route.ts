import { NextRequest, NextResponse } from "next/server";
import {
  degradedResponse,
  hookOnlyResponse,
  motivationResponse,
  productivityResponse,
  realEstateResponse,
  usableResponse,
} from "@/lib/mock-data";
import {
  PlanType,
  normalizePlanType,
  normalizeRequestedOutput,
} from "@/lib/dashboard/utils";
import {
  buildErrorResponse,
  normalizeMockResponseByMode,
  normalizeUpstreamResponse,
} from "@/lib/dashboard/normalize";

function getMockResponse(query: string, state: string) {
  if (state === "degraded") return degradedResponse;

  const normalized = query.trim().toLowerCase();

  if (
    normalized.includes("real estate") ||
    normalized.includes("realtor") ||
    normalized.includes("home buying")
  ) {
    return realEstateResponse;
  }

  if (
    normalized.includes("productivity") ||
    normalized.includes("focus") ||
    normalized.includes("to-do") ||
    normalized.includes("todo")
  ) {
    return productivityResponse;
  }

  if (
    normalized.includes("lead") ||
    normalized.includes("lead gen") ||
    normalized.includes("prospecting")
  ) {
    return usableResponse;
  }

  if (
    normalized.includes("hook only") ||
    normalized.includes("scroll stop") ||
    normalized.includes("hook test")
  ) {
    return hookOnlyResponse;
  }

  return motivationResponse;
}

function getUserIdForRequest(request: NextRequest): string | null {
  const explicitUserId = request.headers.get("x-user-id")?.trim();
  if (explicitUserId) return explicitUserId;

  const queryUserId =
    new URL(request.url).searchParams.get("user_id")?.trim() || null;
  if (queryUserId) return queryUserId;

  const envFallbackUserId = process.env.DEV_DASHBOARD_USER_ID?.trim();
  if (envFallbackUserId) return envFallbackUserId;

  return null;
}

function getPlanTypeForRequest(request: NextRequest): PlanType {
  const explicitPlan = request.headers.get("x-plan-type")?.trim();
  if (explicitPlan) return normalizePlanType(explicitPlan);

  const queryPlan =
    new URL(request.url).searchParams.get("plan_type")?.trim() || null;
  if (queryPlan) return normalizePlanType(queryPlan);

  const envPlan = process.env.DEV_DASHBOARD_PLAN_TYPE?.trim();
  if (envPlan) return normalizePlanType(envPlan);

  return "free";
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const state =
    searchParams.get("state") === "degraded" ? "degraded" : "strong";
  const query = (searchParams.get("q") || "").trim() || "motivation";
  const mode = normalizeRequestedOutput(searchParams.get("output"));
  const ts = searchParams.get("ts");

  const liveUrl = process.env.DASHBOARD_SOURCE_URL;
  const userId = getUserIdForRequest(request);
  const fallbackPlanType = getPlanTypeForRequest(request);

  if (liveUrl && !userId) {
    return NextResponse.json(
      buildErrorResponse(
        mode,
        query,
        {
          route_error: true,
          missing_user_id_for_live_request: true,
        },
        fallbackPlanType
      ),
      { status: 200 }
    );
  }

  try {
    if (liveUrl) {
      const upstream = new URL(liveUrl);

      upstream.searchParams.set("q", query);
      upstream.searchParams.set("state", state);
      upstream.searchParams.set("output", mode);
      upstream.searchParams.set("requested_output", mode);

      if (userId) {
        upstream.searchParams.set("user_id", userId);
      }

      if (ts) {
        upstream.searchParams.set("ts", ts);
      }

      const upstreamRes = await fetch(upstream.toString(), {
        method: "GET",
        cache: "no-store",
        headers: {
          Accept: "application/json",
        },
      });

      if (!upstreamRes.ok) {
        throw new Error(`Upstream returned ${upstreamRes.status}`);
      }

      const upstreamJson = await upstreamRes.json();
      const normalized = normalizeUpstreamResponse(
        upstreamJson,
        query,
        mode,
        fallbackPlanType
      );

      return NextResponse.json(normalized);
    }

    const selectedMock = getMockResponse(query, state);
    const normalized = normalizeMockResponseByMode(
      selectedMock,
      query,
      mode,
      fallbackPlanType
    );

    return NextResponse.json(normalized);
  } catch (error) {
    console.error("dashboard route error:", error);

    return NextResponse.json(
      buildErrorResponse(mode, query, { route_error: true }, fallbackPlanType),
      { status: 200 }
    );
  }
}