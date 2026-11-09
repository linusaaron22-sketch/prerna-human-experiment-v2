
"use client";

import { useEffect, useState } from "react";

import {
  DEFAULT_SESSION,
  type HumanExperimentSession,
} from "@/lib/human-experiment/session";

export function useHumanExperimentSession() {
  const [session, setSession] =
    useState<HumanExperimentSession>(DEFAULT_SESSION);

  useEffect(() => {
    const roomCode = window.localStorage.getItem(
      "arise-human-experiment-room"
    );

    if (!roomCode) return;

    let cancelled = false;
    let loading = false;

    async function loadLiveSession() {
      if (cancelled || loading) return;

      loading = true;

      try {
        const response = await fetch(
          `/api/participant/session?roomCode=${encodeURIComponent(roomCode!)}`,
          {
            method: "GET",
            credentials: "same-origin",
            cache: "no-store",
          }
        );

        if (!response.ok || cancelled) return;

        const result = await response.json();

        if (cancelled || !result.success || !result.session) return;

        const liveSession = result.session;

        setSession({
          experiment: liveSession.current_experiment,
          stage: liveSession.current_stage,
          timerStartedAt: liveSession.timer_started_at
            ? new Date(liveSession.timer_started_at).getTime()
            : null,
          timerDuration: liveSession.timer_duration,
          reveal: liveSession.reveal,
          status: liveSession.status,
          sessionId: liveSession.id,
          roomCode: liveSession.room_code,
        });
      } catch (error) {
        console.error("PARTICIPANT SESSION POLLING FAILED:", error);
      } finally {
        loading = false;
      }
    }

    void loadLiveSession();

    const intervalId = window.setInterval(() => {
      void loadLiveSession();
    }, 2000);

    return () => {
      cancelled = true;
      window.clearInterval(intervalId);
    };
  }, []);

  return session;
}
