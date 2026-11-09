
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function GET() {
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

    const [
      { data: participants, error: participantsError },
      { data: activePasses, error: passesError },
    ] = await Promise.all([
      supabase
        .from("participants")
        .select(
          "participant_key, full_name, display_name, congregation, age"
        )
        .order("participant_key", { ascending: true }),

      supabase
        .from("participant_passes")
        .select("participant_key")
        .is("revoked_at", null),
    ]);

    if (participantsError || passesError) {
      console.error("Participant registry loading failed:", {
        participantsError,
        passesError,
      });

      return NextResponse.json(
        { error: "Could not load the participant registry." },
        { status: 500 }
      );
    }

    const activeKeys = new Set(
      (activePasses || []).map((pass) => pass.participant_key)
    );

    const passStatuses = (participants || []).map((participant) => ({
      participant_key: participant.participant_key,
      has_active_pass: activeKeys.has(participant.participant_key),
    }));

    return NextResponse.json({
      success: true,
      participants: participants || [],
      passStatuses,
    });
  } catch (error) {
    console.error("Participant registry API error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
