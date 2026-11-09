  import { NextRequest, NextResponse } from "next/server";
  import { supabaseAdmin } from "@/lib/supabase/admin";
  import { getAuthenticatedParticipant } from "@/lib/human-experiment/participantAuth";

  export const runtime = "nodejs";
  export const dynamic = "force-dynamic";

  export async function POST(request: NextRequest) {
    try {
      const origin = request.headers.get("origin");
const allowedOrigin = process.env.NEXT_PUBLIC_SITE_URL;

if (!origin || !allowedOrigin || origin !== allowedOrigin) {
  return NextResponse.json(
    { error: "Invalid request origin." },
    { status: 403 }
  );
}

      const participant = await getAuthenticatedParticipant();

      if (!participant) {
        return NextResponse.json(
          { error: "Participant authentication required." },
          { status: 401 }
        );
      }

      let body: { roomCode?: unknown };

      try {
        body = await request.json();
      } catch {
        return NextResponse.json(
          { error: "Invalid request body." },
          { status: 400 }
        );
      }

      const roomCode =
        typeof body.roomCode === "string"
          ? body.roomCode.trim()
          : "";

      if (!/^\d{6}$/.test(roomCode)) {
        return NextResponse.json(
          { error: "Enter a valid 6-digit room code." },
          { status: 400 }
        );
      }

      const { data: room, error } = await supabaseAdmin
        .from("experiment_sessions")
        .select("id, room_code")
        .eq("room_code", roomCode)
        .maybeSingle();

      if (error) {
        console.error("Participant room lookup failed:", error);

        return NextResponse.json(
          { error: "Could not check the room. Please try again." },
          { status: 500 }
        );
      }

      if (!room) {
        return NextResponse.json(
          { error: "Room not found. Check the code and try again." },
          { status: 404 }
        );
      }

      return NextResponse.json(
        { success: true },
        { headers: { "Cache-Control": "no-store" } }
      );
    } catch (error) {
      console.error("Participant room API error:", error);

      return NextResponse.json(
        { error: "Internal server error." },
        { status: 500 }
      );
    }
  }