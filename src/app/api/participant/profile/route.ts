import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { getAuthenticatedParticipant } from "@/lib/human-experiment/participantAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    // Require a same-origin request.
    const origin = request.headers.get("origin");
    if (!origin || origin !== new URL(request.url).origin) {
      return NextResponse.json(
        { error: "Invalid request origin." },
        { status: 403 }
      );
    }

    // Derive identity from the validated HttpOnly pass cookie.
    const participant = await getAuthenticatedParticipant();

    if (!participant) {
      return NextResponse.json(
        { error: "Participant authentication required. Scan your pass again." },
        { status: 401 }
      );
    }

    let body: {
      sessionId?: unknown;
      roomCode?: unknown;
      fullName?: unknown;
      congregation?: unknown;
      age?: unknown;
    };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const sessionId =
      typeof body.sessionId === "string" ? body.sessionId.trim() : "";

    const roomCode =
      typeof body.roomCode === "string"
        ? body.roomCode.trim().toUpperCase()
        : "";

    const fullName =
      typeof body.fullName === "string" ? body.fullName.trim() : "";

    const congregation =
      typeof body.congregation === "string"
        ? body.congregation.trim()
        : "";

    const age = Number(body.age);

    if (
      !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(sessionId) ||
      !/^[A-Z0-9]{4,10}$/.test(roomCode) ||
      !fullName ||
      fullName.length > 120 ||
      !congregation ||
      congregation.length > 120 ||
      !Number.isInteger(age) ||
      age < 1 ||
      age > 120
    ) {
      return NextResponse.json(
        { error: "Please provide valid participant information." },
        { status: 400 }
      );
    }

    // Confirm that this exact room code belongs to this session.
    const { data: session, error: sessionError } = await supabaseAdmin
      .from("experiment_sessions")
      .select("id, room_code, current_experiment")
      .eq("id", sessionId)
      .eq("room_code", roomCode)
      .maybeSingle();

    if (sessionError) {
      console.error("Participant session verification failed:", sessionError);

      return NextResponse.json(
        { error: "Could not verify the session." },
        { status: 500 }
      );
    }

    if (!session) {
      return NextResponse.json(
        { error: "This room session could not be found." },
        { status: 404 }
      );
    }

    // The participant key comes only from the validated pass.
    const { error: saveError } = await supabaseAdmin
      .from("experiment_participants")
      .upsert(
        {
          session_id: session.id,
          participant_key: participant.participantKey,
          full_name: fullName,
          display_name: fullName,
          congregation,
          age,
          connected: true,
          status: "READY",
          current_experiment: session.current_experiment,
        },
        {
          onConflict: "session_id,participant_key",
        }
      );

    if (saveError) {
      console.error("Participant profile save failed:", saveError);

      return NextResponse.json(
        { error: "Could not save participant information." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        participantKey: participant.participantKey,
      },
      {
        headers: { "Cache-Control": "no-store" },
      }
    );
  } catch (error) {
    console.error("Participant profile API error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}