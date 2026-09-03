"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ParticipantRedirectPage() {
  const params = useParams();
  const router = useRouter();

  const participant =
    typeof params.participant === "string"
      ? params.participant.toUpperCase()
      : "";

  useEffect(() => {
    if (!participant) return;

    // Remember the participant permanently on this device.
    window.localStorage.setItem(
      "arise-human-experiment-participant",
      participant
    );

    // Send them to the actual Human Experiment experience.
    router.replace(
      `/human-experiment?participant=${encodeURIComponent(participant)}`
    );
  }, [participant, router]);

  return (
    <main className="min-h-screen bg-[#f8f1e6] flex items-center justify-center">
      <div className="text-center text-[#19352c]">
        <div className="mx-auto mb-4 h-8 w-8 animate-spin rounded-full border-2 border-[#19352c]/20 border-t-[#19352c]" />

        <p className="text-sm font-medium tracking-[0.18em] uppercase">
          Preparing your experiment
        </p>
      </div>
    </main>
  );
}