import "server-only";

import { cookies } from "next/headers";
import { createClient } from "@supabase/supabase-js";
import { hashParticipantPassToken } from "@/lib/human-experiment/participantPass";

const COOKIE_NAME = "prerna_participant";

export type AuthenticatedParticipant = {
  participantKey: string;
};

export async function getAuthenticatedParticipant(): Promise<AuthenticatedParticipant | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;

  if (!token || !/^[A-Za-z0-9_-]{43}$/.test(token)) {
    return null;
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

  const { data, error } = await supabase.rpc(
    "validate_participant_pass",
    {
      p_token_hash: hashParticipantPassToken(token),
    }
  );

  if (error) {
    console.error("Participant authentication failed:", error);
    return null;
  }

  if (typeof data !== "string" || !/^HE-\d{3,}$/.test(data)) {
    return null;
  }

  return { participantKey: data };
}