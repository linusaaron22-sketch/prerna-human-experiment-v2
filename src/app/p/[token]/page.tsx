
"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

type PassStatus = "checking" | "valid" | "invalid" | "error";

export default function ParticipantPassPage() {
  const params = useParams();
  const token =
    typeof params.token === "string" ? params.token : "";

  const [status, setStatus] = useState<PassStatus>("checking");

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }

    let cancelled = false;

    async function validatePass() {
      try {
        const response = await fetch("/api/participant-pass/validate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token }),
          cache: "no-store",
          credentials: "same-origin",
        });

        const result = await response.json();

        if (cancelled) return;

        if (!response.ok || !result.success || !result.participantKey) {
          setStatus(response.status === 401 ? "invalid" : "error");
          return;
        }

        // Temporary compatibility: existing UI components still read this ID.
        // The server must never trust this value for authorization.
        const participantKey = String(result.participantKey);

        window.localStorage.setItem(
          "arise-human-experiment-participant",
          participantKey
        );

        // The raw pass token is deliberately NOT stored in localStorage.

        window.location.replace(
          `/human-experiment?participant=${encodeURIComponent(participantKey)}`
        );
      } catch {
        if (!cancelled) setStatus("error");
      }
    }

    void validatePass();

    return () => {
      cancelled = true;
    };
  }, [token]);

  return (
    <main className="min-h-screen bg-[#f8f1e6] flex items-center justify-center px-6">
      <div className="max-w-md w-full text-center text-[#19352c]">
        {status === "checking" && (
          <>
            <div className="mx-auto mb-6 h-9 w-9 animate-spin rounded-full border-2 border-[#19352c]/20 border-t-[#19352c]" />
            <p className="text-xs font-semibold tracking-[0.2em] uppercase text-[#b65b36]">
              Prerna Human Experiment
            </p>
            <h1 className="mt-4 text-3xl">Verifying your pass</h1>
            <p className="mt-3 text-sm text-[#19352c]/65">
              Please wait while we verify your participant access.
            </p>
          </>
        )}

        {status === "invalid" && (
          <>
            <h1 className="text-3xl">Pass unavailable</h1>
            <p className="mt-4 text-sm text-[#19352c]/65">
              This participant pass is invalid or has been revoked.
              Please contact the event administrator.
            </p>
          </>
        )}

        {status === "error" && (
          <>
            <h1 className="text-3xl">Unable to verify your pass</h1>
            <p className="mt-4 text-sm text-[#19352c]/65">
              Something went wrong while checking your access.
              Please check your connection and try again.
            </p>
          </>
        )}
      </div>
    </main>
  );
}
