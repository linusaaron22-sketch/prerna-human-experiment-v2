  "use client";

  import { supabase } from "@/lib/supabase";

    export type ExperimentStage =
    | "INTRO"
    | "START"
    | "QUESTION"
    | "WAIT"
    | "QUESTION_1"
    | "WAIT_1"
    | "REVEAL_1"
    | "QUESTION_2"
    | "WAIT_2"
    | "REVEAL_2"
    | "REVEAL"
    | "JOURNEY"
    | "SCRIPTURE"
    | "REFLECTION"
    | "CARD"
    | "COLLECTIVE"
    | "PREVIOUS_COMMITMENTS"
    | "ONE_BODY"
    | "DISCUSSION"
    | "COMPLETE";

  export type ExperimentSession = {
    id: string;
    room_code: string;
    status: "LOBBY" | "RUNNING" | "PAUSED" | "COMPLETED" | "CLOSED";
    current_experiment: number;
    current_stage: ExperimentStage;
    timer_started_at: string | null;
    timer_duration: number;
    reveal: boolean;
  };

  export async function createExperimentSession(
    roomCode: string,
  ): Promise<ExperimentSession | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("experiment_sessions")
      .insert({
        room_code: roomCode,
        status: "LOBBY",
        current_experiment: 1,
        current_stage: "INTRO",
timer_duration: 300,
        reveal: false,
      })
      .select()
      .single();

  if (error) {
    console.error("FAILED TO CREATE SESSION");
    console.error("message:", error.message);
    console.error("code:", error.code);
    console.error("details:", error.details);
    console.error("hint:", error.hint);
    return null;
  }

    return data as ExperimentSession;
  }


  export async function getExperimentSession(
    roomCode: string,
  ): Promise<ExperimentSession | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("experiment_sessions")
      .select("*")
      .eq("room_code", roomCode)
      .single();

    if (error) {
      console.error("Failed to get experiment session:", error);
      return null;
    }

    return data as ExperimentSession;
  }

  export async function updateExperimentSession(
    sessionId: string,
    updates: Partial<
      Pick<
        ExperimentSession,
        | "status"
        | "current_experiment"
        | "current_stage"
        | "timer_started_at"
        | "timer_duration"
        | "reveal"
      >
    >,
  ): Promise<ExperimentSession | null> {
    if (!supabase) return null;

    const { data, error } = await supabase
      .from("experiment_sessions")
      .update(updates)
      .eq("id", sessionId)
      .select()
      .single();

    if (error) {
  console.error("Failed to update experiment session:", {
    message: error.message,
    details: error.details,
    hint: error.hint,
    code: error.code,
  });
  return null;
}
    return data as ExperimentSession;
  }


  export function subscribeToExperimentSession(
    sessionId: string,
    onUpdate: (session: ExperimentSession) => void,
  ) {
    if (!supabase) {
      return () => {};
    }

    const channel = supabase
    .channel(`experiment-session-${sessionId}-${Math.random().toString(36).slice(2)}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "experiment_sessions",
          filter: `id=eq.${sessionId}`,
        },
        (payload) => {
          if (payload.new) {
            onUpdate(payload.new as ExperimentSession);
          }
        },
      )
      .subscribe();

    return () => {
      if (supabase) {
        void supabase.removeChannel(channel);
      }
    };
  }