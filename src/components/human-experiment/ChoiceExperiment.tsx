"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Film, IndianRupee } from "lucide-react";

import { useHumanExperimentSession } from "@/lib/human-experiment/useHumanExperimentSession";
import { supabase } from "@/lib/supabase";

type Stage =
  | "intro"
  | "decision-one"
  | "wait"
  | "reveal"
  | "complete";

type Answer = "STAY" | "LEAVE" | null;

export default function CommitmentExperiment() {
  const session = useHumanExperimentSession();

  const [stage, setStage] = useState<Stage>("intro");
  const [firstAnswer, setFirstAnswer] = useState<Answer>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  const participantKey =
    typeof window !== "undefined"
      ? window.localStorage.getItem(
          "arise-human-experiment-participant"
        ) || ""
      : "";

  const isLocked = session.status === "PAUSED";

  /*
   * ROOM STATE IS THE SOURCE OF TRUTH.
   *
   * Participants can answer.
   * Participants cannot control progression.
   */
  useEffect(() => {
    if (session.experiment !== 2) return;

    const stageMap: Record<string, Stage> = {
      INTRO: "intro",
      START: "decision-one",
      QUESTION: "decision-one",
      WAIT: "wait",
      REVEAL: "reveal",
      DISCUSSION: "reveal",
      COMPLETE: "complete",
    };

    const nextStage = stageMap[session.stage];

    if (nextStage) {
      setStage(nextStage);
    }
  }, [session.experiment, session.stage]);

  /*
   * SERVER-SYNCHRONIZED TIMER
   */
  useEffect(() => {
    if (session.experiment !== 2) return;
    if (session.stage !== "QUESTION") {
      setTimeLeft(0);
      return;
    }

    if (!session.timerStartedAt) {
      setTimeLeft(0);
      return;
    }

    const updateTimer = () => {
      const elapsed =
        Date.now() - session.timerStartedAt!;

      const remaining = Math.max(
        0,
        Math.ceil(
          (session.timerDuration - elapsed) / 1000
        )
      );

      setTimeLeft(remaining);
    };

    updateTimer();

    const interval = window.setInterval(
      updateTimer,
      250
    );

    return () => {
      window.clearInterval(interval);
    };
  }, [
    session.experiment,
    session.stage,
    session.timerStartedAt,
    session.timerDuration,
  ]);

  /*
   * Do not render Experiment 02 when another
   * experiment is active.
   */
  if (session.experiment !== 2) {
    return null;
  }

  const submitAnswer = async (
    value: "STAY" | "LEAVE"
  ) => {
    if (!supabase) return;
    if (!session.sessionId) return;
    if (!participantKey) return;

    const { error } = await supabase
      .from("experiment_participants")
      .update({
        answer: value,
        status: "ANSWERED",
        submitted_at: new Date().toISOString(),
        connected: true,
        current_experiment: 2,
      })
      .eq("session_id", session.sessionId)
      .eq("participant_key", participantKey);

    if (error) {
      console.error(
        "FAILED TO SUBMIT COMMITMENT ANSWER:",
        error
      );
      return;
    }

    console.log(
      "COMMITMENT ANSWER SUBMITTED:",
      participantKey,
      value
    );
  };

  const chooseAnswer = (
    value: "STAY" | "LEAVE"
  ) => {
    if (isLocked) return;
    if (firstAnswer !== null) return;

    setFirstAnswer(value);

    void submitAnswer(value);

    /*
     * IMPORTANT:
     * Do NOT change the stage here.
     *
     * The facilitator controls the room.
     */
  };

  return (
    <main className="min-h-screen bg-[#f8f1e6] text-[#19352c]">
      {/* LIVE ROOM STATUS */}

      <div className="sticky top-0 z-50 border-b border-[#19352c]/10 bg-[#f8f1e6]/95 px-5 py-4 backdrop-blur">
        <div className="mx-auto max-w-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] opacity-60">
                ARISE × HUMAN EXPERIMENT
              </p>

              <p className="mt-1 text-xs font-semibold">
                EXPERIMENT 02 OF 06
              </p>
            </div>

            <div className="flex items-center gap-2">
              <span
                className={`h-2 w-2 rounded-full ${
                  isLocked
                    ? "bg-[#c7542b]"
                    : "bg-[#19352c]"
                }`}
              />

              <span className="font-mono text-[8px] font-bold uppercase tracking-[0.16em]">
                {isLocked ? "PAUSED" : "LIVE"}
              </span>
            </div>
          </div>

          <div className="mt-3 flex items-center justify-between border-t border-[#19352c]/10 pt-3">
            <div>
              <p className="font-mono text-[8px] uppercase tracking-[0.15em] opacity-50">
                COMMITMENT
              </p>

              <p className="mt-1 font-mono text-[8px] font-bold uppercase tracking-[0.15em]">
                CURRENT STAGE · {session.stage}
              </p>
            </div>

            <p className="font-mono text-[8px] uppercase tracking-[0.15em] opacity-50">
              ROOM CONTROLLED
            </p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-xl px-5 py-10">
        <AnimatePresence mode="wait">
          {/* INTRO */}

          {stage === "intro" && (
            <motion.section
              key="intro"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-8"
            >
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">
                  EXPERIMENT 02
                </p>

                <h1 className="mt-3 text-5xl font-black tracking-tight">
                  COMMITMENT
                </h1>
              </div>

              <div className="border-l-2 border-[#c7542b] pl-5">
                <p className="text-xl leading-relaxed">
                  Sometimes the hardest decision is not
                  about what we want.
                </p>

                <p className="mt-3 text-xl font-semibold leading-relaxed">
                  It is about what we have already invested.
                </p>
              </div>

              <div className="flex items-center gap-3 border border-[#19352c]/10 bg-white/40 p-5">
                <Film className="h-5 w-5" />

                <p className="text-sm leading-relaxed">
                  Wait for the facilitator to begin the
                  decision.
                </p>
              </div>
            </motion.section>
          )}

          {/* DECISION */}

          {stage === "decision-one" && (
            <motion.section
              key="decision-one"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="space-y-8"
            >
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">
                  YOUR DECISION
                </p>

                <h2 className="mt-3 text-3xl font-black">
                  You have already invested
                  <span className="whitespace-nowrap">
                    {" "}₹500
                  </span>.
                </h2>
              </div>

              <div className="flex items-center gap-4 border border-[#19352c]/10 bg-white/40 p-5">
                <IndianRupee className="h-6 w-6" />

                <div>
                  <p className="text-sm font-semibold">
                    The money is already gone.
                  </p>

                  <p className="mt-1 text-sm opacity-60">
                    You cannot get it back.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-lg leading-relaxed">
                  You discover the experience is not as
                  good as you expected.
                </p>

                <p className="font-semibold">
                  What do you do?
                </p>
              </div>

              {timeLeft > 0 && (
                <div className="text-center">
                  <p className="font-mono text-4xl font-black">
                    {timeLeft}
                  </p>

                  <p className="mt-1 font-mono text-[8px] uppercase tracking-[0.18em] opacity-50">
                    SECONDS REMAINING
                  </p>
                </div>
              )}

              <div className="grid gap-3">
                <button
                  disabled={
                    isLocked || firstAnswer !== null
                  }
                  onClick={() =>
                    chooseAnswer("STAY")
                  }
                  className="flex w-full items-center justify-between border border-[#19352c] px-5 py-5 text-left transition hover:bg-[#19352c] hover:text-[#f8f1e6] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span>
                    <span className="block text-lg font-bold">
                      STAY
                    </span>

                    <span className="mt-1 block text-xs opacity-60">
                      I already invested in it.
                    </span>
                  </span>

                  <ArrowRight className="h-5 w-5" />
                </button>

                <button
                  disabled={
                    isLocked || firstAnswer !== null
                  }
                  onClick={() =>
                    chooseAnswer("LEAVE")
                  }
                  className="flex w-full items-center justify-between border border-[#19352c] px-5 py-5 text-left transition hover:bg-[#19352c] hover:text-[#f8f1e6] disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <span>
                    <span className="block text-lg font-bold">
                      LEAVE
                    </span>

                    <span className="mt-1 block text-xs opacity-60">
                      The money is already gone.
                    </span>
                  </span>

                  <ArrowRight className="h-5 w-5" />
                </button>
              </div>

              {firstAnswer && (
                <div className="border border-[#19352c]/10 bg-white/40 p-4 text-center">
                  <p className="font-mono text-[9px] font-bold uppercase tracking-[0.16em]">
                    YOUR ANSWER: {firstAnswer}
                  </p>

                  <p className="mt-2 text-sm opacity-60">
                    Answer recorded. Wait for the
                    facilitator.
                  </p>
                </div>
              )}
            </motion.section>
          )}

          {/* WAIT */}

          {stage === "wait" && (
            <motion.section
              key="wait"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              className="flex min-h-[55vh] flex-col items-center justify-center text-center"
            >
              <div className="mb-8 h-3 w-3 animate-pulse rounded-full bg-[#19352c]" />

              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] opacity-50">
                YOUR ANSWER
              </p>

              <h2 className="mt-3 text-4xl font-black">
                RECORDED
              </h2>

              <p className="mt-6 max-w-sm text-base leading-relaxed opacity-70">
                The room is waiting for the facilitator.
                Do not continue yet.
              </p>

              {firstAnswer && (
                <div className="mt-8 border border-[#19352c]/10 bg-white/40 px-8 py-5">
                  <p className="font-mono text-[9px] uppercase tracking-[0.16em] opacity-50">
                    YOUR CHOICE
                  </p>

                  <p className="mt-2 text-2xl font-black">
                    {firstAnswer}
                  </p>
                </div>
              )}
            </motion.section>
          )}

          {/* REVEAL */}

          {stage === "reveal" && (
            <motion.section
              key="reveal"
              initial={{ opacity: 0, scale: 0.97 }}
              animate={{ opacity: 1, scale: 1 }}
              className="space-y-8"
            >
              <div>
                <p className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] opacity-50">
                  EXPERIMENT 02 · REVEAL
                </p>

                <h2 className="mt-3 text-5xl font-black">
                  THE COST
                </h2>
              </div>

              <div className="border border-[#19352c]/15 bg-white/50 p-7">
                <p className="text-2xl font-semibold leading-relaxed">
                  The money you already spent should not
                  decide what you do next.
                </p>
              </div>

              <div className="border-l-2 border-[#c7542b] pl-5">
                <p className="text-lg leading-relaxed">
                  What is gone is gone.
                </p>

                <p className="mt-3 text-lg font-semibold leading-relaxed">
                  Your next decision is still yours.
                </p>
              </div>

              <p className="text-center font-mono text-[9px] uppercase tracking-[0.18em] opacity-50">
                WAIT FOR THE FACILITATOR
              </p>
            </motion.section>
          )}

          {/* COMPLETE */}

          {stage === "complete" && (
            <motion.section
              key="complete"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex min-h-[55vh] flex-col items-center justify-center text-center"
            >
              <div className="mb-7 flex h-16 w-16 items-center justify-center border-2 border-[#19352c]">
                <span className="text-2xl">✓</span>
              </div>

              <p className="font-mono text-[9px] font-bold uppercase tracking-[0.2em] opacity-50">
                EXPERIMENT 02 OF 06
              </p>

              <h2 className="mt-3 text-4xl font-black">
                COMMITMENT
              </h2>

              <p className="mt-4 text-lg font-semibold">
                EXPERIMENT COMPLETE
              </p>

              <p className="mt-6 max-w-sm text-sm leading-relaxed opacity-60">
                The past is already spent.
                <br />
                Your next decision is still yours.
              </p>

              <div className="mt-10 w-full border border-[#19352c]/10 bg-white/40 p-5">
                <p className="font-mono text-[8px] font-bold uppercase tracking-[0.16em] opacity-50">
                  CURRENT ROOM STATE
                </p>

                <p className="mt-2 text-sm font-bold">
                  EXPERIMENT 02 · COMPLETE
                </p>

                <p className="mt-2 text-xs opacity-60">
                  Wait for Experiment 03.
                  It will appear automatically when
                  the facilitator advances the room.
                </p>
              </div>
            </motion.section>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}