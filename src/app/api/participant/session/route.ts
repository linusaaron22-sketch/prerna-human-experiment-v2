import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAuthenticatedParticipant } from "@/lib/human-experiment/participantAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const participant = await getAuthenticatedParticipant();

    if (!participant) {
      return NextResponse.json(
        { error: "Participant authentication required." },
        { status: 401, headers: { "Cache-Control": "no-store" } }
      );
    }

    const roomCode = request.nextUrl.searchParams.get("roomCode")?.trim();

    if (!roomCode || !/^\d{6}$/.test(roomCode)) {
      return NextResponse.json(
        { error: "Invalid room code." },
        { status: 400, headers: { "Cache-Control": "no-store" } }
      );
    }

    const { data: session, error: sessionError } = await supabaseAdmin
      .from("experiment_sessions")
      .select(
        "id, room_code, status, current_experiment, current_stage, timer_started_at, timer_duration, reveal"
      )
      .eq("room_code", roomCode)
      .maybeSingle();

    if (sessionError) {
      console.error("Participant session lookup failed:", sessionError);

      return NextResponse.json(
        { error: "Could not load the session." },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: "Session not found." },
        { status: 404, headers: { "Cache-Control": "no-store" } }
      );
    }

    const { data: membership, error: membershipError } =
      await supabaseAdmin
        .from("experiment_participants")
        .select("id")
        .eq("session_id", session.id)
        .eq("participant_key", participant.participantKey)
        .maybeSingle();

    if (membershipError) {
      console.error("Participant membership lookup failed:", membershipError);

      return NextResponse.json(
        { error: "Could not verify session membership." },
        { status: 500, headers: { "Cache-Control": "no-store" } }
      );
    }

    // Before profile registration, return only the information
    // required to complete the registration process.
    if (!membership) {
      return NextResponse.json(
        {
          success: true,
          session: {
            id: session.id,
            room_code: session.room_code,
            status: "LOBBY",
            current_experiment: 1,
            current_stage: "INTRO",
            timer_started_at: null,
            timer_duration: 300,
            reveal: false,
          },
        },
        { headers: { "Cache-Control": "no-store" } }
      );
    }

    // Registered participants receive live session state only
    // after their membership has been verified.
    return NextResponse.json(
      {
        success: true,
        session,
      },
      { headers: { "Cache-Control": "no-store" } }
    );
  } catch (error) {
    console.error("Participant session API error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500, headers: { "Cache-Control": "no-store" } }
    );
  }
}