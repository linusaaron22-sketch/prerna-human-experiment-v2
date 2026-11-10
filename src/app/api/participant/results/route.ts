
import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAuthenticatedParticipant } from "@/lib/human-experiment/participantAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const UUID_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const noStore = { "Cache-Control": "no-store" };

function jsonError(message: string, status: number) {
  return NextResponse.json(
    { success: false, error: message },
    { status, headers: noStore }
  );
}

function validSameOriginRequest(request: NextRequest) {
  const origin = request.headers.get("origin");
  const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL;

  try {
    if (origin && allowedOrigin) {
      return new URL(origin).origin === new URL(allowedOrigin).origin;
    }

    const referer = request.headers.get("referer");

    if (referer && allowedOrigin) {
      return new URL(referer).origin === new URL(allowedOrigin).origin;
    }

    return false;
  } catch {
    return false;
  }
}

export async function GET(request: NextRequest) {
  try {
    if (!validSameOriginRequest(request)) {
      return jsonError("Invalid request origin.", 403);
    }

    const participant = await getAuthenticatedParticipant();

    if (!participant) {
      return jsonError("Participant authentication required.", 401);
    }

    const sessionId = request.nextUrl.searchParams.get("sessionId");
    const experience = request.nextUrl.searchParams.get("experience");
    const round = request.nextUrl.searchParams.get("round");

    if (
      !sessionId ||
      !UUID_REGEX.test(sessionId) ||
      experience !== "1" ||
      (round !== "1" && round !== "2")
    ) {
      return jsonError("Invalid session or results request.", 400);
    }

    const expectedStage = round === "1" ? "REVEAL_1" : "REVEAL_2";

    const { data: session, error: sessionError } = await supabaseAdmin
      .from("experiment_sessions")
      .select("id, current_experiment, current_stage")
      .eq("id", sessionId)
      .maybeSingle();

    if (sessionError) {
      console.error("Experience 01 results session lookup failed:", sessionError);
      return jsonError("Could not load room results.", 500);
    }

    if (!session) return jsonError("Session not found.", 404);

    if (
      session.current_experiment !== 1 ||
      session.current_stage !== expectedStage
    ) {
      return jsonError("Results are not currently available.", 403);
    }

    const { data: membership, error: membershipError } =
      await supabaseAdmin
        .from("experiment_participants")
        .select("id")
        .eq("session_id", sessionId)
        .eq("participant_key", participant.participantKey)
        .maybeSingle();

    if (membershipError) {
      console.error(
        "Experience 01 results membership check failed:",
        membershipError
      );
      return jsonError("Could not verify session membership.", 500);
    }

    if (!membership) {
      return jsonError(
        "Participant is not registered in this session.",
        403
      );
    }

    const { data: rows, error: resultsError } = await supabaseAdmin
      .from("experiment_participants")
      .select("answer")
      .eq("session_id", sessionId);

    if (resultsError) {
      console.error("Experience 01 aggregate query failed:", resultsError);
      return jsonError("Could not load room results.", 500);
    }

    const counts = { A: 0, B: 0, C: 0, D: 0 };
    const answerField = round === "1" ? "round1" : "round2";

    for (const row of rows ?? []) {
      const answer = row.answer;

      if (
        !answer ||
        typeof answer !== "object" ||
        Array.isArray(answer)
      ) {
        continue;
      }

      const answerData = answer as Record<string, unknown>;

      if (answerData.experiment !== 1) continue;

      const choice = answerData[answerField];

      if (
        typeof choice === "string" &&
        Object.prototype.hasOwnProperty.call(counts, choice)
      ) {
        counts[choice as keyof typeof counts] += 1;
      }
    }

    return NextResponse.json(
      {
        success: true,
        counts,
        total: Object.values(counts).reduce(
          (sum, count) => sum + count,
          0
        ),
      },
      { headers: noStore }
    );
  } catch (error) {
    console.error("Experience 01 results API error:", error);
    return jsonError("Internal server error.", 500);
  }
}
