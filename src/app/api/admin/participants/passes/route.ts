
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  generateParticipantPassToken,
  hashParticipantPassToken,
} from "@/lib/human-experiment/participantPass";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: "Authentication required." },
        { status: 401 }
      );
    }

    const { data: isAdmin, error: adminError } =
      await supabase.rpc("is_prerna_admin");

    if (adminError || !isAdmin) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 }
      );
    }

    let body: { participantKey?: unknown };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const participantKey =
      typeof body.participantKey === "string"
        ? body.participantKey.trim().toUpperCase()
        : "";

    if (!/^HE-\d{3,}$/.test(participantKey)) {
      return NextResponse.json(
        { error: "Invalid participant ID." },
        { status: 400 }
      );
    }

    const token = generateParticipantPassToken();
    const tokenHash = hashParticipantPassToken(token);

    const { data: passId, error: issueError } =
      await supabase.rpc("admin_issue_participant_pass", {
        p_participant_key: participantKey,
        p_token_hash: tokenHash,
      });

    if (issueError || !passId) {
      console.error("Participant pass generation failed:", issueError);

      return NextResponse.json(
        { error: "Could not generate participant pass." },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      participantKey,
      passId,
      token,
    });
  } catch (error) {
    console.error("Participant pass API error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
