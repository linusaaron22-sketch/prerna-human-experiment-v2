"use client";

import {
  getExperimentSession,
  subscribeToExperimentSession,
  type ExperimentSession,
  type ExperimentStage,
} from "@/lib/human-experiment/supabaseSession";

export type HumanExperimentStage = ExperimentStage;

export type HumanExperimentSession = {
  experiment: number;
  stage: HumanExperimentStage;
  timerStartedAt: number | null;
  timerDuration: number;
  reveal: boolean;
  status: "LOBBY" | "RUNNING" | "PAUSED" | "COMPLETED" | "CLOSED";
  sessionId: string | null;
  roomCode: string | null;
};

export const DEFAULT_SESSION: HumanExperimentSession = {
  experiment: 1,
  stage: "INTRO",
  timerStartedAt: null,
  timerDuration: 300,
  reveal: false,
  status: "LOBBY",
  sessionId: null,
  roomCode: null,
};

function mapSupabaseSession(
  session: ExperimentSession
): HumanExperimentSession {
  return {
    experiment: session.current_experiment,
    stage: session.current_stage,
    timerStartedAt: session.timer_started_at
      ? new Date(session.timer_started_at).getTime()
      : null,
    timerDuration: session.timer_duration,
    reveal: session.reveal,
    status: session.status,
    sessionId: session.id,
    roomCode: session.room_code,
  };
}

/**
 * Gets the room code from the participant's URL.
 *
 * Example:
 * /human-experiment?room=455481
 */
export function getRoomCode(): string | null {
  if (typeof window === "undefined") return null;

  const params = new URLSearchParams(window.location.search);
  const roomFromUrl = params.get("room");

  if (roomFromUrl) {
    window.localStorage.setItem(
      "arise-human-experiment-room",
      roomFromUrl
    );

    return roomFromUrl;
  }

  return window.localStorage.getItem(
    "arise-human-experiment-room"
  );
}

/**
 * Kept synchronous so existing code does not break.
 * The actual Supabase session is loaded by the hook.
 */
export function getSession(): HumanExperimentSession {
  return DEFAULT_SESSION;
}

/**
 * Subscribe to the live Supabase room.
 */
export function subscribeToSession(
  callback: (session: HumanExperimentSession) => void
) {
  if (typeof window === "undefined") {
    return () => {};
  }

  let cleanup: (() => void) | null = null;
  let cancelled = false;

  const roomCode = getRoomCode();

if (!roomCode) {
  console.warn(
    "No Human Experiment room code found. Participant must join with ?room=ROOM_CODE"
  );

  return () => {};
}

const resolvedRoomCode = roomCode;

async function connect() {
  const supabaseSession =
    await getExperimentSession(resolvedRoomCode);

    if (cancelled || !supabaseSession) {
      return;
    }

    callback(mapSupabaseSession(supabaseSession));

    cleanup = subscribeToExperimentSession(
      supabaseSession.id,
      (updatedSession) => {
        if (cancelled) return;

        callback(mapSupabaseSession(updatedSession));
      }
    );
  }

  void connect();

  return () => {
    cancelled = true;

    if (cleanup) {
      cleanup();
    }
  };
}

/**
 * Kept for backwards compatibility.
 *
 * From now on, room state should be changed through
 * updateExperimentSession() rather than localStorage.
 */
export function setSession(session: HumanExperimentSession) {
  console.warn(
    "setSession() is deprecated. Use updateExperimentSession() with Supabase instead.",
    session
  );
}