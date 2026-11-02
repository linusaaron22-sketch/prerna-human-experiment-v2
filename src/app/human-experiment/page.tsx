"use client";

import { useEffect, useState } from "react";

import ExperimentHero from "@/components/human-experiment/ExperimentHero";

import PerceptionExperiment from "@/components/human-experiment/PerceptionExperiment";
import BibleReadingExperience from "@/components/human-experiment/BibleReadingExperience";
import CommitmentExperiment from "@/components/human-experiment/ChoiceExperiment";
import SocialInfluenceExperiment from "@/components/human-experiment/SocialInfluenceExperiment";
import MemoryExperiment from "@/components/human-experiment/MemoryExperiment";
import AttentionExperiment from "@/components/human-experiment/AttentionExperiment";
import ReflectionExperiment from "@/components/human-experiment/ReflectionExperiment";

import {
  DEFAULT_SESSION,
  type HumanExperimentSession,
} from "@/lib/human-experiment/session";

import {
  getExperimentSession,
  subscribeToExperimentSession,
} from "@/lib/human-experiment/supabaseSession";

import { supabase } from "@/lib/supabase";


export default function HumanExperimentPage() {
  const [session, setSession] =
    useState<HumanExperimentSession>(DEFAULT_SESSION);

  const [roomCode, setRoomCode] = useState("");
  const [joined, setJoined] = useState(false);
  const [joining, setJoining] = useState(false);
  const [joinError, setJoinError] = useState("");

  const [showHero, setShowHero] = useState(true);

  const [profileComplete, setProfileComplete] = useState(false);
  const [savingProfile, setSavingProfile] = useState(false);

  const [fullName, setFullName] = useState("");
  const [congregation, setCongregation] = useState("");
  const [age, setAge] = useState("");

  // ---------------------------------------------------------
  // READ PARTICIPANT + ROOM
  // ---------------------------------------------------------

useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  const participant = params.get("participant");
  const room = params.get("room");
  const step = params.get("step");

  // A QR scan should identify the participant only. Never reuse a
  // previously saved room code to skip the introduction or room entry.
  if (participant) {
    const normalizedParticipant = participant.toUpperCase();
    window.localStorage.setItem(
      "arise-human-experiment-participant",
      normalizedParticipant
    );
  }

  // Only the redirect performed after a successful manual room-code
  // entry may restore the joined/profile step.
  if (room && step === "profile") {
    setRoomCode(room);
    setJoined(true);
    setShowHero(false);
    window.localStorage.setItem("arise-human-experiment-room", room);
  } else {
    window.localStorage.removeItem("arise-human-experiment-room");
    setRoomCode("");
    setJoined(false);
    setShowHero(true);
  }
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

    const participant =
      new URLSearchParams(window.location.search).get(
        "participant"
      ) ||
      window.localStorage.getItem(
        "arise-human-experiment-participant"
      );

    if (!participant) {
      setJoinError(
        "Please scan your participant ID QR code first."
      );
      return;
    }

    setJoining(true);
    setJoinError("");

    const room = await getExperimentSession(code);

    if (!room) {
      setJoinError(
        "Room not found. Check the code and try again."
      );
      setJoining(false);
      return;
    }

    window.localStorage.setItem(
      "arise-human-experiment-participant",
      participant
    );

    window.localStorage.setItem(
      "arise-human-experiment-room",
      code
    );

    window.location.href =
      `/human-experiment?room=${encodeURIComponent(
        code
      )}&participant=${encodeURIComponent(
        participant.toUpperCase()
      )}&step=profile`;
  };

  // ---------------------------------------------------------
  // LIVE SESSION
  // ---------------------------------------------------------
useEffect(() => {
  if (!joined) return;

  const savedRoomCode = window.localStorage.getItem(
  "arise-human-experiment-room"
);

if (!savedRoomCode) return;

const roomCode: string = savedRoomCode;

  let cancelled = false;
  let cleanup: (() => void) | undefined;

  async function loadLiveSession() {
  const liveSession = await getExperimentSession(roomCode); 

    if (!liveSession || cancelled) return;

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

    cleanup = subscribeToExperimentSession(
      liveSession.id,
      (updated) => {
        setSession({
          experiment: updated.current_experiment,
          stage: updated.current_stage,
          timerStartedAt: updated.timer_started_at
            ? new Date(updated.timer_started_at).getTime()
            : null,
          timerDuration: updated.timer_duration,
          reveal: updated.reveal,
          status: updated.status,
          sessionId: updated.id,
          roomCode: updated.room_code,
        });
      }
    );
  }

  void loadLiveSession();

  return () => {
    cancelled = true;
    cleanup?.();
  };
}, [joined]);
  // ---------------------------------------------------------
  // SAVE PARTICIPANT PROFILE
  // ---------------------------------------------------------

 const saveProfile = async () => {
  if (!supabase) {
    setJoinError("Database connection unavailable.");
    return;
  }

  const participantKey =
    new URLSearchParams(window.location.search).get("participant") ||
    window.localStorage.getItem(
      "arise-human-experiment-participant"
    );

  if (!participantKey) {
    setJoinError(
      "Participant ID not found. Please scan your QR code again."
    );
    return;
  }

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

  if (!session.sessionId) {
    setJoinError("Session is not ready yet.");
    return;
  }

  setSavingProfile(true);
  setJoinError("");

  const { error } = await supabase
    .from("experiment_participants")
    .upsert(
      {
        session_id: session.sessionId,
        participant_key: participantKey,
        full_name: fullName.trim(),
        display_name: fullName.trim(),
        congregation: congregation.trim(),
        age: numericAge,
        connected: true,
        status: "READY",
        current_experiment: session.experiment,
      },
      {
        onConflict: "participant_key",
      }
    );

  if (error) {
    console.error(
      "FAILED TO SAVE PARTICIPANT PROFILE:",
      error
    );

    setJoinError(
      "Could not save your information. Please try again."
    );

    setSavingProfile(false);
    return;
  }

  console.log(
    "PARTICIPANT PROFILE SAVED:",
    participantKey
  );

  setProfileComplete(true);
  setSavingProfile(false);
};

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
    return <BibleReadingExperience />;

    case 2:
      return <CommitmentExperiment />;

    case 3:
      return <SocialInfluenceExperiment />;

    case 4:
      return <MemoryExperiment />;

    case 5:
      return <AttentionExperiment />;

    case 6:
      return <ReflectionExperiment />;

    default:
      return <ReflectionExperiment />;
  }
}