import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { hashParticipantPassToken } from "@/lib/human-experiment/participantPass";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const COOKIE_NAME = "prerna_participant";

export async function POST(request: NextRequest) {
  try {
    let body: { token?: unknown };

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        { error: "Invalid request body." },
        { status: 400 }
      );
    }

    const token = typeof body.token === "string" ? body.token : "";

    if (!/^[A-Za-z0-9_-]{43}$/.test(token)) {
      return NextResponse.json(
        { error: "Invalid or expired participant pass." },
        { status: 401 }
      );
    }

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

    if (!supabaseUrl || !supabaseKey) {
      throw new Error("Supabase environment variables are missing.");
    }

    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
        detectSessionInUrl: false,
      },
    });

    const tokenHash = hashParticipantPassToken(token);

    const { data, error } = await supabase.rpc(
      "validate_participant_pass",
      { p_token_hash: tokenHash }
    );

    if (error) {
      console.error("Participant pass validation failed:", error);

      return NextResponse.json(
        { error: "Could not validate participant pass." },
        { status: 500 }
      );
    }

    if (!data) {
      return NextResponse.json(
        { error: "Invalid or expired participant pass." },
        { status: 401 }
      );
    }

    const response = NextResponse.json({
      success: true,
      participantKey: data,
    });

    response.cookies.set({
      name: COOKIE_NAME,
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    response.headers.set("Cache-Control", "no-store");

    return response;
  } catch (error) {
    console.error("Participant pass API error:", error);

    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
