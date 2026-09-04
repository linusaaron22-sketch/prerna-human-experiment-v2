"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  ChevronRight,
  Circle,
  Clock3,
  Eye,
  ExternalLink,
  Lock,
  Pause,
  Play,
  Radio,
  RotateCcw,
  Users,
  X,
} from "lucide-react";

import {
  createExperimentSession,
  getExperimentSession,
  updateExperimentSession,
  subscribeToExperimentSession,
  type ExperimentSession,
  type ExperimentStage,
} from "@/lib/human-experiment/supabaseSession";

import {
  DEFAULT_SESSION,
  getSession,
  subscribeToSession,
  setSession,
  type HumanExperimentSession,
} from "@/lib/human-experiment/session";

type Experiment = {
  id: number;
  title: string;
  type: "INDIVIDUAL" | "GROUP";
  stages: string[];
};

type ParticipantStatus =
  | "LOCKED"
  | "READY"
  | "ACTIVE"
  | "ANSWERED"
  | "WAITING"
  | "COMPLETED"
  | "MISSED"
  | "CURRENT";

type Participant = {
  id: number;
  name: string;
  participantKey: string;
  group?: string;
  status: ParticipantStatus;
  connected: boolean;
  currentExperiment: number;
  answer: unknown;
  submittedAt: string | null;
  lastSeenAt: string | null;
  isRepresentative: boolean;

  fullName?: string;
  congregation?: string;
  age?: number;
};

const EXPERIMENTS: Experiment[] = [
  {
    id: 1,
    title: "PERCEPTION",
    type: "INDIVIDUAL",
    stages: [
      "INTRO",
      "START",
      "QUESTION",
      "WAIT",
      "REVEAL",
      "DISCUSSION",
      "COMPLETE",
    ],
  },
  {
    id: 2,
    title: "COMMITMENT",
    type: "INDIVIDUAL",
    stages: [
      "INTRO",
      "START",
      "QUESTION_1",
      "WAIT_1",
      "QUESTION_2",
      "WAIT_2",
      "REVEAL",
      "DISCUSSION",
      "COMPLETE",
    ],
  },
  {
    id: 3,
    title: "SOCIAL INFLUENCE",
    type: "GROUP",
    stages: [
      "INTRO",
      "START",
      "QUESTION_1",
      "WAIT_1",
      "REVEAL_1",
      "QUESTION_2",
      "WAIT_2",
      "REVEAL_2",
      "DISCUSSION",
      "COMPLETE",
    ],
  },
  {
    id: 4,
    title: "MEMORY",
    type: "INDIVIDUAL",
    stages: [
      "INTRO",
      "START",
      "QUESTION",
      "WAIT",
      "REVEAL",
      "DISCUSSION",
      "COMPLETE",
    ],
  },
  {
    id: 5,
    title: "ATTENTION",
    type: "INDIVIDUAL",
    stages: [
      "INTRO",
      "START",
      "QUESTION",
      "WAIT",
      "REVEAL",
      "DISCUSSION",
      "COMPLETE",
    ],
  },
  {
    id: 6,
    title: "REFLECTION",
    type: "INDIVIDUAL",
    stages: [
      "INTRO",
      "START",
      "QUESTION",
      "WAIT",
      "REVEAL",
      "DISCUSSION",
      "COMPLETE",
    ],
  },
];

const INITIAL_PARTICIPANTS: Participant[] = [];

const GROUPS = [
  {
    name: "Women of the Bible",
    submitted: 7,
    total: 9,
  },
  {
    name: "Old Testament Leaders",
    submitted: 6,
    total: 8,
  },
  {
    name: "New Testament Important Members",
    submitted: 8,
    total: 8,
  },
  {
    name: "The 12 Disciples",
    submitted: 5,
    total: 10,
  },
];

function generateRoomCode() {
  return Math.floor(
    100000 + Math.random() * 900000
  ).toString();
}

async function getExperimentSessionById(
  id: string
): Promise<ExperimentSession | null> {
  const { supabase } = await import("@/lib/supabase");

  if (!supabase) return null;

  const { data, error } = await supabase
    .from("experiment_sessions")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(
      "Failed to restore experiment session:",
      error
    );
    return null;
  }

  return data as ExperimentSession;
}

function toLocalSession(
  supabaseSession: ExperimentSession
): HumanExperimentSession {
  return {
    experiment: supabaseSession.current_experiment,
    stage: supabaseSession.current_stage,
    timerStartedAt: supabaseSession.timer_started_at
      ? new Date(supabaseSession.timer_started_at).getTime()
      : null,
    timerDuration: supabaseSession.timer_duration,
    reveal: supabaseSession.reveal,
    status: supabaseSession.status,
    sessionId: supabaseSession.id,
    roomCode: supabaseSession.room_code,
  };
}

function mapParticipant(row: any): Participant {
  return {
    id: row.id,
    name: row.full_name || row.display_name || "Anonymous",
    participantKey: row.participant_key,
    group: row.group_name || undefined,
    status: (row.status || "READY") as ParticipantStatus,
    connected: Boolean(row.connected),
    currentExperiment: row.current_experiment ?? 1,
    answer: row.answer,
    submittedAt: row.submitted_at,
    lastSeenAt: row.last_seen_at,
    isRepresentative: Boolean(row.is_representative),

    fullName: row.full_name || row.display_name || "",
    congregation: row.congregation || "",
    age: row.age ?? undefined,
  };
}

function formatTime(milliseconds: number) {
  const totalSeconds = Math.ceil(milliseconds / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(
    2,
    "0"
  )}`;
}

function StatusBadge({ status }: { status: ParticipantStatus }) {
  const styles: Record<ParticipantStatus, string> = {
    LOCKED: "bg-[#19352c]/8 text-[#19352c]/55",
    READY: "bg-[#19352c]/10 text-[#19352c]",
    ACTIVE: "bg-[#c7542b]/12 text-[#c7542b]",
    ANSWERED: "bg-[#19352c] text-[#f8f1e6]",
    WAITING: "border border-[#19352c]/15 text-[#19352c]/65",
    COMPLETED: "bg-[#19352c]/15 text-[#19352c]",
    MISSED: "bg-[#c7542b]/8 text-[#c7542b]/70",
    CURRENT: "bg-[#c7542b] text-[#f8f1e6]",
  };

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-1 font-mono text-[8px] font-bold tracking-[0.14em] ${styles[status]}`}
    >
      {status}
    </span>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#19352c]/45">
      {children}
    </p>
  );
}

export default function HumanExperimentAdmin() {
const [session, setSessionState] =
  useState<HumanExperimentSession>(DEFAULT_SESSION);
const [supabaseSession, setSupabaseSession] =
  useState<ExperimentSession | null>(null);
const selectedExperiment = session.experiment - 1;
const experiment = EXPERIMENTS[selectedExperiment]; 
const [selectedParticipant, setSelectedParticipant] =
  useState<Participant | null>(null);
const stageIndex = experiment.stages.findIndex(
  (item) => item === session.stage
);
  const [participants, setParticipants] = useState(INITIAL_PARTICIPANTS);
  useEffect(() => {
  if (!supabaseSession?.id) {
    setParticipants([]);
    return;
  }

  let cancelled = false;
  let channel: ReturnType<NonNullable<typeof import("@/lib/supabase").supabase>["channel"]> | null = null;

  async function loadParticipants() {
    const { supabase } = await import("@/lib/supabase");

    if (!supabase) return;

    const { data, error } = await supabase
      .from("experiment_participants")
      .select("*")
      .eq("session_id", supabaseSession!.id)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("Failed to load experiment participants:", error);
      return;
    }

    if (!cancelled) {
      setParticipants((data || []).map(mapParticipant));
    }

    channel = supabase
      .channel(
        `experiment-participants-${supabaseSession!.id}-${Math.random()
          .toString(36)
          .slice(2)}`
      )
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "experiment_participants",
          filter: `session_id=eq.${supabaseSession!.id}`,
        },
        async () => {
          const { data: refreshed, error: refreshError } = await supabase
            .from("experiment_participants")
            .select("*")
            .eq("session_id", supabaseSession!.id)
            .order("created_at", { ascending: true });

          if (refreshError) {
            console.error(
              "Failed to refresh experiment participants:",
              refreshError
            );
            return;
          }

          if (!cancelled) {
            setParticipants((refreshed || []).map(mapParticipant));
          }
        }
      )
      .subscribe();
  }

  loadParticipants();

  return () => {
    cancelled = true;

    if (channel) {
      void import("@/lib/supabase").then(({ supabase }) => {
        if (supabase) {
          void supabase.removeChannel(channel!);
        }
      });
    }
  };
}, [supabaseSession?.id]);

  const [timer, setTimer] = useState(5 * 60 * 1000);
  const [timerRunning, setTimerRunning] = useState(false);
  const [sessionStarted, setSessionStarted] = useState(true);
 const [roomCode, setRoomCode] = useState<string | null>(null);
const [sessionLoading, setSessionLoading] = useState(true);
useEffect(() => {
  let cleanup: (() => void) | undefined;

  async function initialiseSession() {
    setSessionLoading(true);
const { supabase } = await import("@/lib/supabase");

if (!supabase) {
  console.error("Supabase is not configured.");
  setSessionLoading(false);
  return;
}

const {
  data: { user },
} = await supabase.auth.getUser();

if (!user) {
  window.location.href = "/admin/login";
  return;
}
    const savedSessionId = window.localStorage.getItem(
      "arise-experiment-session-id"
    );

    if (savedSessionId) {
      const existing = await getExperimentSessionById(
        savedSessionId
      );
if (existing) {
  setSupabaseSession(existing);
  setRoomCode(existing.room_code);
  cleanup = subscribeToExperimentSession(
          existing.id,
          (updated) => {
            setSupabaseSession(updated);

            setSessionState(toLocalSession(updated));
          }
        );

        setSessionLoading(false);
        return;
      }
    }

    const generatedRoomCode = generateRoomCode();

    const created = await createExperimentSession(
      generatedRoomCode
    );

    if (!created) {
      console.error("Could not create experiment session.");
      setSessionLoading(false);
      return;
    }

    window.localStorage.setItem(
      "arise-experiment-session-id",
      created.id
    );

   setSupabaseSession(created);
   setRoomCode(created.room_code);
setSessionState(toLocalSession(created));
    cleanup = subscribeToExperimentSession(
      created.id,
      (updated) => {
        setSupabaseSession(updated);
        setSessionState(toLocalSession(updated));
      }
    );

    setSessionLoading(false);
  }

  initialiseSession();

  return () => {
    cleanup?.();
  };
}, []);
  const [showProjector, setShowProjector] = useState(false);
  const [revealGroups, setRevealGroups] = useState(false);
  const stage = experiment.stages[stageIndex];

  const answeredCount = participants.filter(
    (participant) => participant.status === "ANSWERED"
  ).length;

  const waitingCount = participants.filter(
    (participant) => participant.status === "WAITING"
  ).length;

  const completedCount = participants.filter(
    (participant) => participant.status === "COMPLETED"
  ).length;

  const missedCount = participants.filter(
    (participant) => participant.status === "MISSED"
  ).length;

  useEffect(() => {
    if (!timerRunning) return;

    const interval = window.setInterval(() => {
      setTimer((current) => {
        if (current <= 100) {
          window.clearInterval(interval);
          setTimerRunning(false);
          return 0;
        }

        return current - 100;
      });
    }, 100);

    return () => window.clearInterval(interval);
  }, [timerRunning]);

  const progress = useMemo(() => {
    if (experiment.stages.length <= 1) return 0;

    return Math.round(
      (stageIndex / (experiment.stages.length - 1)) * 100
    );
  }, [experiment.stages.length, stageIndex]);

 async function selectExperiment(index: number) {
  if (!supabaseSession) return;

  const updated = await updateExperimentSession(
    supabaseSession.id,
    {
      current_experiment: index + 1,
      current_stage: "INTRO",
      timer_started_at: null,
      timer_duration: 300,
      reveal: false,
    }
  );

  if (updated) {
    setSupabaseSession(updated);
    setSessionState(toLocalSession(updated));
  }

  setTimerRunning(false);
  setTimer(5 * 60 * 1000);
  setRevealGroups(false);
}
 async function toggleLockCurrent() {
  if (!supabaseSession) return;

  const isLocked = supabaseSession.status === "PAUSED";

  const updated = await updateExperimentSession(
    supabaseSession.id,
    {
      status: isLocked ? "RUNNING" : "PAUSED",
    }
  );

  if (updated) {
    setSupabaseSession(updated);
    setSessionState(toLocalSession(updated));
  }

  setTimerRunning(false);
}
    async function nextStage() {
    if (!supabaseSession) return;

    if (stageIndex >= experiment.stages.length - 1) {
      return;
    }

    const nextStage = experiment.stages[
      stageIndex + 1
    ] as ExperimentStage;

    const updated = await updateExperimentSession(
      supabaseSession.id,
      {
        current_stage: nextStage,
        timer_started_at: null,
        reveal: String(nextStage).startsWith("REVEAL"),
      }
    );

    if (updated) {
      setSupabaseSession(updated);
      setSessionState(toLocalSession(updated));
    }

    setTimerRunning(false);
  }

  async function previousStage() {
    if (!supabaseSession) return;

    if (stageIndex <= 0) return;

    const previousStage = experiment.stages[
      stageIndex - 1
    ] as ExperimentStage;

    const updated = await updateExperimentSession(
      supabaseSession.id,
      {
        current_stage: previousStage,
        timer_started_at: null,
        reveal: false,
      }
    );

    if (updated) {
      setSupabaseSession(updated);
      setSessionState(toLocalSession(updated));
    }

    setTimerRunning(false);
  }
  async function markAllWaiting() {
  if (!supabaseSession) return;

  const updated = await updateExperimentSession(
    supabaseSession.id,
    {
      status: "PAUSED",
      timer_started_at: null,
    }
  );

  if (updated) {
    setSupabaseSession(updated);
    setSessionState(toLocalSession(updated));
  }

  setParticipants((current) =>
    current.map((participant) => ({
      ...participant,
      status:
        participant.status === "ANSWERED"
          ? "ANSWERED"
          : participant.status === "CURRENT"
          ? "CURRENT"
          : "WAITING",
    }))
  );
 setTimerRunning(false);
}
async function completeExperiment() {
  if (!supabaseSession) return;

  const updated = await updateExperimentSession(
    supabaseSession.id,
    {
      status: "COMPLETED",
      current_stage: "COMPLETE",
      timer_started_at: null,
      reveal: false,
    }
  );

  if (updated) {
    setSupabaseSession(updated);
    setSessionState(toLocalSession(updated));
  }

  setTimerRunning(false);
}
return (
    <main className="min-h-screen w-full max-w-[100vw] overflow-x-hidden bg-[#f8f1e6] text-[#19352c]">
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="sticky top-0 z-50 border-b border-[#19352c]/10 bg-[#f8f1e6]/95 backdrop-blur">
        <div className="mx-auto flex max-w-[1600px] items-center justify-between px-5 py-4 lg:px-8">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 items-center justify-center border border-[#19352c]/15 bg-[#19352c]">
              <span className="font-serif text-lg text-[#f8f1e6]">A</span>
            </div>

            <div>
              <p className="font-mono text-[8px] font-bold uppercase tracking-[0.2em] text-[#19352c]/45">
                ARISE × HUMAN EXPERIMENT
              </p>

              <h1 className="mt-0.5 font-serif text-xl leading-none sm:text-2xl">
                Control Room
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden items-center gap-2 sm:flex">
              <span className="h-2 w-2 animate-pulse rounded-full bg-[#c7542b]" />
              <span className="font-mono text-[9px] font-bold uppercase tracking-[0.16em]">
                LIVE
              </span>
            </div>

            <div className="border border-[#19352c]/15 px-3 py-2">
              <p className="font-mono text-[7px] font-bold uppercase tracking-[0.18em] text-[#19352c]/40">
                ROOM
              </p>
              <p className="mt-0.5 font-mono text-sm font-bold tracking-[0.15em]">
                {roomCode}
              </p>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1600px] min-w-0 lg:grid-cols-[250px_1fr]">
        {/* =====================================================
            EXPERIMENT RAIL
        ====================================================== */}

        <aside className="border-b border-[#19352c]/10 lg:min-h-[calc(100vh-73px)] lg:border-b-0 lg:border-r">
          <div className="p-5 lg:sticky lg:top-[73px] lg:p-6">
            <SectionLabel>Experiments</SectionLabel>

            <div className="mt-5 space-y-1">
              {EXPERIMENTS.map((item, index) => {
                const active = index === selectedExperiment;

                return (
                  <button
                    key={item.id}
                    onClick={() => selectExperiment(index)}
                    className={`group flex w-full items-center gap-3 border px-3 py-3 text-left transition ${
                      active
                        ? "border-[#19352c] bg-[#19352c] text-[#f8f1e6]"
                        : "border-transparent hover:border-[#19352c]/10 hover:bg-[#eee5d5]"
                    }`}
                  >
                    <span
                      className={`font-mono text-[10px] font-bold ${
                        active
                          ? "text-[#c7542b]"
                          : "text-[#19352c]/35"
                      }`}
                    >
                      {String(item.id).padStart(2, "0")}
                    </span>

                    <div className="min-w-0 flex-1">
                      <p className="truncate font-mono text-[10px] font-bold tracking-[0.12em]">
                        {item.title}
                      </p>
                      <p
                        className={`mt-1 font-mono text-[7px] uppercase tracking-[0.12em] ${
                          active
                            ? "text-[#f8f1e6]/45"
                            : "text-[#19352c]/35"
                        }`}
                      >
                        {item.type}
                      </p>
                    </div>

                    {active && (
                      <ChevronRight className="h-4 w-4 text-[#c7542b]" />
                    )}
                  </button>
                );
              })}
            </div>

            <div className="mt-8 border-t border-[#19352c]/10 pt-6">
              <SectionLabel>Session</SectionLabel>

              <div className="mt-4 border border-[#19352c]/10 bg-[#eee5d5] p-4">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-[#19352c]/45">
                    Status
                  </span>

                  <span className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-[#c7542b]">
                    {sessionStarted ? "RUNNING" : "PAUSED"}
                  </span>
                </div>

                <div className="mt-4 h-1 bg-[#19352c]/10">
                  <div
                    className="h-full bg-[#c7542b] transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-2 font-mono text-[8px] text-[#19352c]/45">
                  Experiment {selectedExperiment + 1} of 6
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* =====================================================
            MAIN CONTROL ROOM
        ====================================================== */}

        <section className="min-w-0 max-w-full overflow-hidden">
          <div className="p-5 lg:p-8">
            {/* TOP INFO */}

            <div className="flex flex-col justify-between gap-5 border-b border-[#19352c]/10 pb-7 md:flex-row md:items-end">
              <div>
                <SectionLabel>
                  Experiment {String(experiment.id).padStart(2, "0")}
                </SectionLabel>

                <h2 className="mt-2 font-serif text-4xl leading-none tracking-tight sm:text-5xl lg:text-6xl">
                  {experiment.title}
                </h2>

                <p className="mt-3 font-mono text-[9px] font-bold uppercase tracking-[0.16em] text-[#19352c]/45">
                  {experiment.type} · FACILITATOR CONTROLLED
                </p>
              </div>

              <button
                onClick={() => setShowProjector((current) => !current)}
                className="flex items-center justify-center gap-2 border border-[#19352c] px-4 py-3 font-mono text-[9px] font-bold uppercase tracking-[0.15em] transition hover:bg-[#19352c] hover:text-[#f8f1e6]"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                {showProjector ? "Projector Open" : "Launch Projector"}
              </button>
            </div>

            {/* =================================================
                LIVE CONTROL
            ================================================== */}

            <div className="mt-7 grid gap-6 xl:grid-cols-[1.35fr_0.65fr]">
              <div className="min-w-0 max-w-full overflow-hidden border border-[#19352c]/10 bg-[#eee5d5]">
                <div className="flex items-center justify-between border-b border-[#19352c]/10 px-5 py-4">
                  <div>
                    <SectionLabel>Live Control</SectionLabel>
                    <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.14em] text-[#19352c]/40">
                      Current room state
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 animate-pulse rounded-full bg-[#c7542b]" />
                    <span className="font-mono text-[8px] font-bold uppercase tracking-[0.15em]">
                      {stage}
                    </span>
                  </div>
                </div>

                <div className="p-5 sm:p-7">
                  <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
                    <div>
                      <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-[#c7542b]">
                        Current Stage
                      </p>

                      <h3 className="mt-2 font-serif text-4xl sm:text-5xl">
                        {stage}
                      </h3>
                    </div>

                    <div className="text-left md:text-right">
                      <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#19352c]/40">
                        Stage
                      </p>
                      <p className="mt-1 font-mono text-lg font-bold">
                        {stageIndex + 1}
                        <span className="text-[#19352c]/25">
                          {" "}
                          / {experiment.stages.length}
                        </span>
                      </p>
                    </div>
                  </div>

                  {/* Stage timeline */}

                  <div className="mt-8 w-full overflow-x-auto lg:overflow-x-hidden">
  <div className="flex min-w-[650px] items-center lg:min-w-0">
                      {experiment.stages.map((item, index) => {
                        const active = index === stageIndex;
                        const complete = index < stageIndex;

                        return (
                          <div
                            key={item}
                            className="flex flex-1 items-center"
                          >
                            <button
                              onClick={async () => {
  if (!supabaseSession) return;

  const nextStage = experiment.stages[index] as ExperimentStage;

  const updated = await updateExperimentSession(
    supabaseSession.id,
    {
      current_stage: nextStage,
      timer_started_at: null,
      reveal: String(nextStage).startsWith("REVEAL"),
    }
  );

  if (updated) {
    setSupabaseSession(updated);
    setSessionState(toLocalSession(updated)); 
  }

  setTimerRunning(false);
}}
                              className="group flex items-center gap-2"
                            >
                              <span
                                className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border font-mono text-[8px] font-bold transition ${
                                  active
                                    ? "border-[#c7542b] bg-[#c7542b] text-[#f8f1e6]"
                                    : complete
                                    ? "border-[#19352c] bg-[#19352c] text-[#f8f1e6]"
                                    : "border-[#19352c]/20 text-[#19352c]/40 group-hover:border-[#19352c]/50"
                                }`}
                              >
                                {complete ? (
                                  <Check className="h-3 w-3" />
                                ) : (
                                  index + 1
                                )}
                              </span>

                              <span
                                className={`whitespace-nowrap font-mono text-[7px] font-bold tracking-[0.12em] ${
                                  active
                                    ? "text-[#c7542b]"
                                    : "text-[#19352c]/40"
                                }`}
                              >
                                {item}
                              </span>
                            </button>

                            {index <
                              experiment.stages.length - 1 && (
                              <div className="mx-3 h-px flex-1 bg-[#19352c]/10" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Timer */}

                  <div className="mt-8 border-y border-[#19352c]/10 py-6">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
                      <div className="flex items-center gap-3">
                        <Clock3 className="h-5 w-5 text-[#c7542b]" />

                        <div>
                          <SectionLabel>Facilitator Timer</SectionLabel>
                          <p className="mt-1 font-mono text-[8px] text-[#19352c]/40">
                            Participants cannot control this timer.
                          </p>
                        </div>
                      </div>

                      <p className="font-mono text-4xl font-bold tracking-tight">
                        {formatTime(timer)}
                      </p>
                    </div>

                   <div className="mt-5 flex max-w-full flex-wrap gap-2">
                      <button
                      onClick={async () => {
  if (!supabaseSession) return;

  const updated = await updateExperimentSession(
    supabaseSession.id,
    {
      timer_started_at: new Date().toISOString(),
      timer_duration: Math.ceil(timer / 1000),
      status: "RUNNING",
    }
  );

  if (updated) {
    setSupabaseSession(updated);
    setSessionState(toLocalSession(updated));  }

  setTimerRunning(true);
}}
                        className="flex items-center gap-2 bg-[#19352c] px-4 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[#f8f1e6] transition hover:bg-[#19352c]/90"
                      >
                        <Play className="h-3 w-3" />
                        Start Timer
                      </button>

                      <button
                      onClick={async () => {
  if (!supabaseSession) return;

  const updated = await updateExperimentSession(
    supabaseSession.id,
    {
      timer_started_at: null,
      timer_duration: Math.ceil(timer / 1000),
      status: "PAUSED",
    }
  );

  if (updated) {
    setSupabaseSession(updated);
    setSessionState(toLocalSession(updated));
  }

  setTimerRunning(false);
}}
                        className="flex items-center gap-2 border border-[#19352c]/20 px-4 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.14em] transition hover:bg-[#f8f1e6]"
                      >
                        <Pause className="h-3 w-3" />
                        Pause
                      </button>

                      <button
                        onClick={() => {
                          setTimerRunning(false);
                          setTimer(5 * 60 * 1000);
                        }}
                        className="flex items-center gap-2 border border-[#19352c]/20 px-4 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.14em] transition hover:bg-[#f8f1e6]"
                      >
                        <RotateCcw className="h-3 w-3" />
                        Reset
                      </button>

                      <button
                        onClick={() => {
                          setTimerRunning(false);
                          setTimer(0);
                        }}
                        className="flex items-center gap-2 border border-[#c7542b]/25 px-4 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[#c7542b] transition hover:bg-[#c7542b]/5"
                      >
                        <X className="h-3 w-3" />
                        Close
                      </button>
                    </div>
                  </div>

                  {/* Main controls */}

                  <div className="mt-6 flex w-full max-w-full flex-wrap gap-2">
                    <button
                      onClick={previousStage}
                      disabled={stageIndex === 0}
                      className="border border-[#19352c]/15 px-4 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.14em] disabled:cursor-not-allowed disabled:opacity-30"
                    >
                      Previous
                    </button>

                   <button
                onClick={toggleLockCurrent}
                className="border border-[#19352c]/15 px-4 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.14em]"
                >
                 {supabaseSession?.status === "PAUSED"
               ? "Unlock Current"
               : "Lock Current"}  
                </button>
                    {String(stage).startsWith("REVEAL") && (
                      <button
                        onClick={() => setRevealGroups(true)}
                        className="bg-[#c7542b] px-4 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[#f8f1e6]"
                      >
                        Trigger Reveal
                      </button>
                    )}

                    {stage === "COMPLETE" && (
                      <button
                        onClick={completeExperiment}
                        className="bg-[#19352c] px-4 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[#f8f1e6]"
                      >
                        Complete Experiment
                      </button>
                    )}

                    <button
                      onClick={nextStage}
                      disabled={
                        stageIndex === experiment.stages.length - 1
                      }
                      className="flex items-center gap-2 bg-[#c7542b] px-5 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.14em] text-[#f8f1e6] disabled:cursor-not-allowed disabled:opacity-30 sm:ml-auto"
                    >
                      Next Stage
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* =================================================
                  NOW PANEL
              ================================================== */}

              <div className="flex flex-col border border-[#19352c]/10 bg-[#19352c] text-[#f8f1e6]">
                <div className="border-b border-[#f8f1e6]/10 px-5 py-4">
                  <SectionLabel>Now</SectionLabel>
                </div>

                <div className="flex flex-1 flex-col justify-between p-5 sm:p-7">
                  <div>
                    <div className="flex h-10 w-10 items-center justify-center bg-[#c7542b]">
                      <Radio className="h-5 w-5" />
                    </div>

                    <h3 className="mt-6 font-serif text-3xl leading-tight">
                      {stage === "INTRO" &&
                        "Explain the experiment."}

                      {stage === "START" &&
                        "Get everyone ready."}

                      {(stage === "QUESTION" || stage === "QUESTION_1") &&
                        "Participants are answering."}

                      {(stage === "WAIT" || stage === "WAIT_1") &&
                        "Wait for the room."}

                      {stage === "QUESTION_2" &&
                        "Participants are answering Decision 02."}

                      {stage === "WAIT_2" &&
                        "Wait for the second decision."}

                      {String(stage).startsWith("REVEAL") &&
                        "Reveal what actually happened."}

                      {stage === "DISCUSSION" &&
                        "Bring the room into discussion."}

                      {stage === "COMPLETE" &&
                        "Close the experiment."}
                    </h3>

                    <p className="mt-5 max-w-full break-words font-mono text-[9px] leading-relaxed tracking-[0.05em] text-[#f8f1e6]/50">
                      The facilitator is the teacher and storyteller.
                      The website controls the experience and reveals
                      the result.
                    </p>
                  </div>

                  <div className="mt-10 border-t border-[#f8f1e6]/10 pt-5">
                    <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] text-[#f8f1e6]/35">
                      Room instruction
                    </p>

                    <p className="mt-2 max-w-full break-words font-serif text-lg">
                      Keep phones down unless the experiment asks for
                      them.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* =================================================
                PARTICIPANT METRICS
            ================================================== */}

            <div className="mt-7">
              <div className="flex items-end justify-between border-b border-[#19352c]/10 pb-4">
                <div>
                  <SectionLabel>Room Activity</SectionLabel>
                  <h3 className="mt-1 font-serif text-2xl">
                    Participants
                  </h3>
                </div>

                <div className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  <span className="font-mono text-xs font-bold">
                    {participants.length}
                  </span>
                  <span className="font-mono text-[8px] uppercase tracking-[0.12em] text-[#19352c]/40">
                    connected
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 border-b border-[#19352c]/10 sm:grid-cols-4">
                <div className="border-r border-[#19352c]/10 px-4 py-5">
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-[#19352c]/40">
                    Answered
                  </p>
                  <p className="mt-2 font-serif text-3xl">
                    {answeredCount}
                  </p>
                </div>

                <div className="border-r border-[#19352c]/10 px-4 py-5">
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-[#19352c]/40">
                    Waiting
                  </p>
                  <p className="mt-2 font-serif text-3xl">
                    {waitingCount}
                  </p>
                </div>

                <div className="border-r border-[#19352c]/10 px-4 py-5">
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-[#19352c]/40">
                    Completed
                  </p>
                  <p className="mt-2 font-serif text-3xl">
                    {completedCount}
                  </p>
                </div>

                <div className="px-4 py-5">
                  <p className="font-mono text-[8px] font-bold uppercase tracking-[0.15em] text-[#19352c]/40">
                    Missed
                  </p>
                  <p className="mt-2 font-serif text-3xl text-[#c7542b]">
                    {missedCount}
                  </p>
                </div>
              </div>
            </div>

            {/* =================================================
                PARTICIPANT LIST
            ================================================== */}

            <div className="mt-7 border border-[#19352c]/10">
              <div className="flex items-center justify-between border-b border-[#19352c]/10 px-5 py-4">
                <div>
                  <SectionLabel>Live Participants</SectionLabel>
                  <p className="mt-1 font-mono text-[8px] text-[#19352c]/40">
                    Status updates will eventually come from realtime
                    session state.
                  </p>
                </div>

                <Eye className="h-4 w-4 text-[#19352c]/35" />
              </div>

              <div className="divide-y divide-[#19352c]/10">
                {participants.map((participant) => (
                  <div
                    key={participant.id}
                    className="flex items-center justify-between gap-4 px-5 py-4"
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[#19352c]/10 bg-[#eee5d5]">
                        <span className="font-mono text-[8px] font-bold">
                          {participant.name
                            .slice(0, 2)
                            .toUpperCase()}
                        </span>
                      </div>

                      <div className="min-w-0">
                        <p className="truncate font-mono text-[10px] font-bold tracking-[0.08em]">
                          {participant.name}
                        </p>

                        <p className="mt-0.5 font-mono text-[7px] uppercase tracking-[0.12em] text-[#19352c]/35">
                          Participant {String(participant.id).padStart(
                            2,
                            "0"
                          )}
                        </p>
                      </div>
                    </div>

                    <StatusBadge status={participant.status} />
                  </div>
                ))}
              </div>
            </div>

            {/* =================================================
                SOCIAL INFLUENCE GROUP CONTROL
            ================================================== */}

            {experiment.id === 3 && (
              <div className="mt-7 border border-[#19352c]/10">
                <div className="flex items-center justify-between border-b border-[#19352c]/10 px-5 py-4">
                  <div>
                    <SectionLabel>
                      Social Influence · Group Control
                    </SectionLabel>

                    <p className="mt-1 font-mono text-[8px] text-[#19352c]/40">
                      One representative submits for each group.
                    </p>
                  </div>

                  <Users className="h-4 w-4 text-[#c7542b]" />
                </div>

                <div className="grid sm:grid-cols-2">
                  {GROUPS.map((group, index) => {
                    const submitted = group.submitted === group.total;

                    return (
                      <div
                        key={group.name}
                        className="border-b border-[#19352c]/10 p-5 sm:nth-[2n]:border-l"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex gap-3">
                            <span className="font-mono text-[9px] font-bold text-[#c7542b]">
                              0{index + 1}
                            </span>

                            <div>
                              <p className="font-serif text-lg leading-tight">
                                {group.name}
                              </p>

                              <p className="mt-2 font-mono text-[8px] uppercase tracking-[0.12em] text-[#19352c]/40">
                                {group.submitted} / {group.total} submitted
                              </p>
                            </div>
                          </div>

                          {submitted ? (
                            <Check className="h-4 w-4 text-[#19352c]" />
                          ) : (
                            <Circle className="h-4 w-4 text-[#19352c]/20" />
                          )}
                        </div>

                        <div className="mt-5 h-1 bg-[#19352c]/8">
                          <div
                            className="h-full bg-[#c7542b]"
                            style={{
                              width: `${
                                (group.submitted / group.total) * 100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="border-t border-[#19352c]/10 bg-[#eee5d5] p-5">
                  <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                      <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em]">
                        Group reveal
                      </p>

                      <p className="mt-1 font-mono text-[8px] text-[#19352c]/45">
                        Choices remain hidden until you reveal them.
                      </p>
                    </div>

                    <button
                      onClick={() => setRevealGroups((current) => !current)}
                      className={`flex items-center justify-center gap-2 px-4 py-3 font-mono text-[8px] font-bold uppercase tracking-[0.14em] ${
                        revealGroups
                          ? "bg-[#19352c] text-[#f8f1e6]"
                          : "bg-[#c7542b] text-[#f8f1e6]"
                      }`}
                    >
                      <Eye className="h-3 w-3" />
                      {revealGroups
                        ? "Groups Revealed"
                        : "Reveal Group Choices"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* =================================================
                SECURITY / CONTROL FOOTER
            ================================================== */}

            <div className="mt-7 flex flex-col justify-between gap-4 border-t border-[#19352c]/10 py-6 sm:flex-row sm:items-center">
              <div className="flex items-center gap-2">
                <Lock className="h-3.5 w-3.5 text-[#19352c]/45" />
                <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#19352c]/40">
                  Facilitator-only control surface
                </p>
              </div>

              <p className="font-mono text-[8px] uppercase tracking-[0.14em] text-[#19352c]/30">
                ARISE · HUMAN EXPERIMENT · LIVE SESSION
              </p>
            </div>
          </div>
        </section>
      </div>

      {/* =====================================================
          PROJECTOR PREVIEW
      ====================================================== */}

      {showProjector && (
       <div className="fixed inset-0 z-[100] flex w-full max-w-[100vw] items-center justify-center overflow-y-auto overflow-x-hidden bg-[#19352c]/95 p-4 sm:p-5">
          <div className="relative w-full max-w-6xl overflow-hidden bg-[#f8f1e6] p-8 sm:p-12">
            <button
              onClick={() => setShowProjector(false)}
              className="absolute right-5 top-5 flex h-9 w-9 items-center justify-center border border-[#19352c]/15"
            >
              <X className="h-4 w-4" />
            </button>

            <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[#c7542b]">
              ARISE × HUMAN EXPERIMENT
            </p>

            <p className="mt-12 font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-[#19352c]/40">
              Experiment {String(experiment.id).padStart(2, "0")}
            </p>

            <h2 className="mt-4 max-w-4xl font-serif text-5xl leading-[0.9] sm:text-7xl lg:text-8xl">
              {stage}
            </h2>

            <div className="mt-10 h-px bg-[#19352c]/10" />

            <div className="mt-6 flex items-center justify-between">
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-[#19352c]/40">
                Room {roomCode}
              </p>

              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.15em]">
                LIVE
              </p>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}