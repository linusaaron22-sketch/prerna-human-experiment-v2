"use client";

import { useEffect, useState } from "react";

import ExperimentHero from "@/components/human-experiment/ExperimentHero";

import PerceptionExperiment from "@/components/human-experiment/PerceptionExperiment";
import BibleReadingExperience from "@/components/human-experiment/BibleReadingExperience";
import CommitmentExperiment from "@/components/human-experiment/ChoiceExperiment";
import WorkingOnSundaysExperiment from "@/components/human-experiment/WorkingOnSundaysExperiment";
import PersonalPrayerExperience from "@/components/human-experiment/PersonalPrayerExperience";
import LivingChurchReflection from "@/components/human-experiment/LivingChurchReflection";


import {
  DEFAULT_SESSION,
  type HumanExperimentSession,
} from "@/lib/human-experiment/session";


export default function HumanExperimentPage() {
  const [session, setSession] =
    useState<HumanExperimentSession>(DEFAULT_SESSION);

  const [roomCode, setRoomCode] = useState("");
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  const [showHero, setShowHero] = useState(true);
const [accessStatus, setAccessStatus] = useState<
  "checking" | "valid" | "invalid" | "none"
>("checking");

const verifyPassAgain = async (): Promise<boolean> => {
  try {
    const response = await fetch("/api/participant/auth", {
      method: "GET",
      credentials: "same-origin",
      cache: "no-store",
    });


      const result = await response.json();

      if (
        !response.ok ||
        !result.success ||
        !result.participantKey
      ) {
        window.localStorage.removeItem(
          "arise-human-experiment-participant"
        );
        window.localStorage.removeItem(
          "prerna-participant-pass-token"
        );
        window.localStorage.removeItem(
          "arise-human-experiment-room"
        );

        setAccessStatus("invalid");
        setJoined(false);
        return false;
      }

      return true;
    } catch {
      setJoinError("Could not verify your pass. Please try again.");
      return false;
    }
  };

  const [profileComplete, setProfileComplete] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [fullName, setFullName] = useState("");
  const [congregation, setCongregation] = useState("");
  const [age, setAge] = useState("");

  // ---------------------------------------------------------
  // READ PARTICIPANT + ROOM
  // ---------------------------------------------------------
useEffect(() => {
  let cancelled = false;

  async function verifyParticipantAccess() {
    try {
      const response = await fetch("/api/participant/auth", {
        method: "GET",
        credentials: "same-origin",
        cache: "no-store",
      });

      const result = await response.json();

      if (cancelled) return;

      if (!response.ok || !result.success || !result.participantKey) {
        window.localStorage.removeItem(
          "arise-human-experiment-participant"
        );
        window.localStorage.removeItem(
          "arise-human-experiment-room"
        );

        setAccessStatus("invalid");
        return;
      }

      const participantKey = String(result.participantKey);

      // Temporary UI compatibility only.
      // This ID must never be trusted by server APIs for authorization.
      window.localStorage.setItem(
        "arise-human-experiment-participant",
        participantKey
      );

      setAccessStatus("valid");

      const params = new URLSearchParams(window.location.search);
      const room = params.get("room");
      const step = params.get("step");

      if (room && step === "profile") {
        setRoomCode(room);
        setJoined(true);
        setShowHero(false);

        window.localStorage.setItem(
          "arise-human-experiment-room",
          room
        );
      } else {
        window.localStorage.removeItem(
          "arise-human-experiment-room"
        );

        setRoomCode("");
        setJoined(false);
        setShowHero(true);
      }
    } catch {
      if (!cancelled) {
        setAccessStatus("invalid");
      }
    }
  }

  void verifyParticipantAccess();

  return () => {
    cancelled = true;
  };
}, []);

  // ---------------------------------------------------------
  // JOIN ROOM
  // ---------------------------------------------------------

 const joinRoom = async () => {
  const code = roomCode.trim();

  if (!/^\d{6}$/.test(code)) {
    setJoinError("Enter the 6-digit room code.");
    return;
  }

  setJoining(true);
  setJoinError("");

  try {
    const hasValidPass = await verifyPassAgain();

    if (!hasValidPass) {
      return;
    }

    const response = await fetch("/api/participant/room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify({ roomCode: code }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      setJoinError(result.error || "Could not join this room.");
      return;
    }

    window.localStorage.setItem(
      "arise-human-experiment-room",
      code
    );

    window.location.href =
      `/human-experiment?room=${encodeURIComponent(code)}&step=profile`;
  } catch (error) {
    console.error("ROOM JOIN FAILED:", error);
    setJoinError("Connection error. Please try again.");
  } finally {
    setJoining(false);
  }
};


  // ---------------------------------------------------------
  // LIVE SESSION
  // ---------------------------------------------------------
useEffect(() => {
  if (!joined) return;

  const savedRoomCode =
  window.localStorage.getItem("arise-human-experiment-room") ?? "";

if (!savedRoomCode) return;

  let cancelled = false;
  let loading = false;

  async function loadLiveSession() {
    if (loading || cancelled) return

    loading = true;

    try {
      const response = await fetch(
        `/api/participant/session?roomCode=${encodeURIComponent(savedRoomCode)}`,
        {
          method: "GET",
          credentials: "same-origin",
          cache: "no-store",
        }
      );

      if (cancelled) return;

      if (response.status === 401) {
        setAccessStatus("invalid");
        setJoined(false);
        return;
      }

      if (!response.ok) return;

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
      console.error("PARTICIPANT SESSION REFRESH FAILED:", error);
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
}, [joined]);


  // ---------------------------------------------------------
  // SAVE PARTICIPANT PROFILE
  // ---------------------------------------------------------

 const saveProfile = async () => {
  if (!fullName.trim()) {
    setJoinError("Please enter your name.");
    return;
  }

  if (!congregation.trim()) {
    setJoinError("Please enter your congregation.");
    return;
  }

  const numericAge = Number(age);

  if (
    !age ||
    !Number.isInteger(numericAge) ||
    numericAge < 1 ||
    numericAge > 120
  ) {
    setJoinError("Please enter a valid age.");
    return;
  }

  if (!session.sessionId || !session.roomCode) {
    setJoinError("Session is not ready yet.");
    return;
  }

  setSavingProfile(true);
  setJoinError("");

  try {
    const response = await fetch("/api/participant/profile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "same-origin",
      cache: "no-store",
      body: JSON.stringify({
        sessionId: session.sessionId,
        roomCode: session.roomCode,
        fullName: fullName.trim(),
        congregation: congregation.trim(),
        age: numericAge,
      }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      if (response.status === 401) {
        setJoinError("Your pass has expired or been revoked. Please scan it again.");
      } else {
        setJoinError(result.error || "Could not save your information.");
      }
      return;
    }

    setProfileComplete(true);
  } catch (error) {
    console.error("PARTICIPANT PROFILE REQUEST FAILED:", error);
    setJoinError("Connection error. Please try again.");
  } finally {
    setSavingProfile(false);
  }
};

  // ---------------------------------------------------------
  // PARTICIPANT ACCESS CHECK
  // ---------------------------------------------------------

  if (accessStatus === "checking") {
    return (
      <main className="min-h-screen bg-[#f8f1e6] flex items-center justify-center px-6">
        <div className="text-center text-[#19352c]">
          <div className="mx-auto mb-5 h-9 w-9 animate-spin rounded-full border-2 border-[#19352c]/20 border-t-[#19352c]" />
          <h1 className="font-serif text-2xl">
            Verifying your pass
          </h1>
          <p className="mt-3 text-sm text-[#19352c]/60">
            Please wait while we verify your participant access.
          </p>
        </div>
      </main>
    );
  }

  if (accessStatus === "invalid") {
    return (
      <main className="min-h-screen bg-[#f8f1e6] flex items-center justify-center px-6">
        <div className="max-w-md text-center text-[#19352c]">
          <h1 className="font-serif text-3xl">
            Pass unavailable
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#19352c]/65">
            Your participant pass is invalid or has been revoked.
            Please contact the event administrator for assistance.
          </p>
        </div>
      </main>
    );
  }

  // ---------------------------------------------------------
  // HERO
  // ---------------------------------------------------------

  if (showHero) {
    return (
      <ExperimentHero
        onEnter={() => {
          setShowHero(false);
        }}
      />
    );
  }

  // ---------------------------------------------------------
  // ROOM CODE
  // ---------------------------------------------------------

  if (!joined) {
    return (
      <main className="min-h-screen bg-[#f8f1e6] text-[#19352c] flex items-center justify-center px-6">
        <div className="w-full max-w-md">

          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c7542b]">
            ARISE / 2026
          </p>

          <h1 className="mt-4 font-serif text-5xl leading-tight">
            Human Experiment
          </h1>

          <p className="mt-4 text-[#19352c]/60">
            Enter the room code shown by your facilitator.
          </p>

          <div className="mt-10 border border-[#19352c]/15 bg-[#eee5d5] p-8">

            <label className="font-mono text-[10px] uppercase tracking-[0.2em]">
              Room Code
            </label>

            <input
              value={roomCode}
              onChange={(e) => {
                setRoomCode(
                  e.target.value
                    .replace(/\D/g, "")
                    .slice(0, 6)
                );

                setJoinError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  void joinRoom();
                }
              }}
              inputMode="numeric"
              maxLength={6}
              placeholder="000000"
              className="mt-3 w-full border border-[#19352c]/20 bg-transparent px-4 py-4 font-mono text-3xl tracking-[0.25em] outline-none"
            />

            {joinError && (
              <p className="mt-3 font-mono text-xs text-[#c7542b]">
                {joinError}
              </p>
            )}

            <button
              onClick={() => void joinRoom()}
              disabled={joining}
              className="mt-6 w-full bg-[#19352c] px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white transition-opacity disabled:opacity-50"
            >
              {joining ? "Joining..." : "Join Room"}
            </button>

          </div>

          <p className="mt-6 text-center font-mono text-[9px] uppercase tracking-[0.2em] text-[#19352c]/40">
            Scan your ID QR code before joining
          </p>

        </div>
      </main>
    );
  }

  // ---------------------------------------------------------
  // PARTICIPANT PROFILE
  // ---------------------------------------------------------

  if (!profileComplete) {
    return (
      <main className="min-h-screen bg-[#f8f1e6] text-[#19352c] flex items-center justify-center px-6 py-12">

        <div className="w-full max-w-lg">

          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#c7542b]">
            ARISE / 2026
          </p>

          <h1 className="mt-4 font-serif text-5xl leading-tight">
            Before We Begin
          </h1>

          <p className="mt-4 text-[#19352c]/60">
            Tell us a little about yourself.
          </p>

          <div className="mt-10 space-y-6 border border-[#19352c]/15 bg-[#eee5d5] p-8">

            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em]">
                Name
              </label>

              <input
                value={fullName}
                onChange={(e) => {
                  setFullName(e.target.value);
                  setJoinError("");
                }}
                placeholder="Your full name"
                className="mt-3 w-full border border-[#19352c]/20 bg-transparent px-4 py-4 text-lg outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em]">
                Congregation
              </label>

              <input
                value={congregation}
                onChange={(e) => {
                  setCongregation(e.target.value);
                  setJoinError("");
                }}
                placeholder="Your congregation"
                className="mt-3 w-full border border-[#19352c]/20 bg-transparent px-4 py-4 text-lg outline-none"
              />
            </div>

            <div>
              <label className="font-mono text-[10px] uppercase tracking-[0.2em]">
                Age
              </label>

              <input
                value={age}
                onChange={(e) => {
                  setAge(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 3)
                  );

                  setJoinError("");
                }}
                inputMode="numeric"
                placeholder="Your age"
                className="mt-3 w-full border border-[#19352c]/20 bg-transparent px-4 py-4 text-lg outline-none"
              />
            </div>

            {joinError && (
              <p className="font-mono text-xs text-[#c7542b]">
                {joinError}
              </p>
            )}

            <button
              onClick={() => void saveProfile()}
              disabled={savingProfile}
              className="w-full bg-[#19352c] px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white transition-opacity disabled:opacity-50"
            >
              {savingProfile
                ? "Saving..."
                : "Enter Experiment"}
            </button>

          </div>

        </div>

      </main>
    );
  }

  // ---------------------------------------------------------
  // LIVE EXPERIMENT
  // ---------------------------------------------------------

  switch (session.experiment) {
    case 1:
  return <BibleReadingExperience session={session} />;

    case 2:
      return <CommitmentExperiment session={session} />;

    case 3:
  return <WorkingOnSundaysExperiment session={session} />;

    case 4:
      return <PersonalPrayerExperience session={session} />;

    case 5:
      return <LivingChurchReflection session={session} />;

    default:
      return <LivingChurchReflection session={session} />;
  }
}