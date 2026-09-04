"use client";

import { useEffect, useState } from "react";

import {
  DEFAULT_SESSION,
  type HumanExperimentSession,
} from "@/lib/human-experiment/session";

import {
  getExperimentSession,
  subscribeToExperimentSession,
} from "@/lib/human-experiment/supabaseSession";

export function useHumanExperimentSession() {
  const [session, setSession] =
    useState<HumanExperimentSession>(DEFAULT_SESSION);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    async function loadLiveSession() {
      const roomCode = window.localStorage.getItem(
        "arise-human-experiment-room"
      );

      if (!roomCode) {
        return;
      }

      const liveSession = await getExperimentSession(roomCode);

      if (!liveSession || cancelled) {
        return;
      }

      const convertSession = (
        current: typeof liveSession
      ): HumanExperimentSession => ({
        experiment: current.current_experiment,
        stage: current.current_stage,
        timerStartedAt: current.timer_started_at
          ? new Date(current.timer_started_at).getTime()
          : null,
        timerDuration: current.timer_duration,
        reveal: current.reveal,
        status: current.status,
        sessionId: current.id,
        roomCode: current.room_code,
      });

      setSession(convertSession(liveSession));

      cleanup = subscribeToExperimentSession(
        liveSession.id,
        (updatedSession) => {
          if (cancelled) return;

          setSession(convertSession(updatedSession));
        }
      );
    }

    void loadLiveSession();

    return () => {
      cancelled = true;
      cleanup?.();
    };
  }, []);

  return session;
}