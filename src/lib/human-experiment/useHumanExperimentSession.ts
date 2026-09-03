"use client";

import { useEffect, useState } from "react";
import {
  DEFAULT_SESSION,
  subscribeToSession,
  type HumanExperimentSession,
} from "@/lib/human-experiment/session";

export function useHumanExperimentSession() {
  const [session, setSession] =
    useState<HumanExperimentSession>(DEFAULT_SESSION);

  useEffect(() => {
    return subscribeToSession((nextSession) => {
      setSession(nextSession);
    });
  }, []);

  return session;
}