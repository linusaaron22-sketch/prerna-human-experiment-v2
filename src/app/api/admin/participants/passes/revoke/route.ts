
import { NextRequest, NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  try {
    const supabase = await createSupabaseServerClient();

    // Verify the logged-in user.
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

    // Verify administrator permissions.
    const { data: isAdmin, error: adminError } =
      await supabase.rpc("is_prerna_admin");

    if (adminError || !isAdmin) {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 }
      );
    }

    // Validate the participant ID.
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

    // Revoke every currently active pass for this participant.
    const { data: revokedPasses, error: revokeError } = await supabase
      .from("participant_passes")
      .update({
        revoked_at: new Date().toISOString(),
        revoked_by: user.id,
      })
      .eq("participant_key", participantKey)
      .is("revoked_at", null)
      .select("id");

    if (revokeError) {
      console.error("Participant pass revocation failed:", revokeError);

      return NextResponse.json(
        { error: "Could not revoke the participant pass." },
        { status: 500 }
      );
    }

    if (!revokedPasses || revokedPasses.length === 0) {
      return NextResponse.json(
        { error: "No active pass exists for this participant." },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      participantKey,
      revokedCount: revokedPasses.length,
    });
  } catch (error) {
    console.error("Pass revocation API error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
