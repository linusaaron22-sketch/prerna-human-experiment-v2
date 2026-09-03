"use client";

import { useEffect } from "react";
import { useParams, useRouter } from "next/navigation";

export default function ParticipantPage() {
  const params = useParams();
  const router = useRouter();

  const participant =
    typeof params.participant === "string"
      ? params.participant.toUpperCase()
      : "";

  useEffect(() => {
    if (!participant) return;

    window.localStorage.setItem(
      "arise-human-experiment-participant",
      participant
    );

    router.replace(
      `/human-experiment?participant=${encodeURIComponent(participant)}`
    );
  }, [participant, router]);

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        background: "#0b0f0d",
        color: "#f5f1e8",
        fontFamily: "Arial, sans-serif",
        padding: "24px",
        textAlign: "center",
      }}
    >
      <div>
        <div
          style={{
            width: 48,
            height: 48,
            border: "3px solid rgba(245,241,232,0.2)",
            borderTopColor: "#f5f1e8",
            borderRadius: "50%",
            margin: "0 auto 20px",
            animation: "spin 0.8s linear infinite",
          }}
        />

        <h1 style={{ margin: 0, fontSize: 24 }}>
          Welcome to ARISE
        </h1>

        <p style={{ opacity: 0.7, marginTop: 10 }}>
          Participant {participant || "—"}
        </p>

        <style jsx>{`
          @keyframes spin {
            to {
              transform: rotate(360deg);
            }
          }
        `}</style>
      </div>
    </main>
  );
}