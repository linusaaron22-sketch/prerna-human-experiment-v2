import { NextResponse } from "next/server";
import { getAuthenticatedParticipant } from "@/lib/human-experiment/participantAuth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const participant = await getAuthenticatedParticipant();

    if (!participant) {
      return NextResponse.json(
        { error: "Participant authentication required." },
        {
          status: 401,
          headers: { "Cache-Control": "no-store" },
        }
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
    console.error("Participant auth check failed:", error);

    return NextResponse.json(
      { error: "Could not verify participant access." },
      {
        status: 500,
        headers: { "Cache-Control": "no-store" },
      }
    );
  }
}